package com.ecommerce.service;

import com.ecommerce.dto.OrderRequest;
import com.ecommerce.entity.*;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@Transactional
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private DiscountService discountService;

    @Autowired
    private AuditService auditService;

    public Order createOrder(Long userId, OrderRequest request) {
        return createOrder(userId, request, null);
    }

    public List<Order> applyRandomDiscount(LocalDateTime startDate, LocalDateTime endDate) {
        List<Order> ordersInRange = orderRepository.findByOrderDateBetweenAndStatus(
                startDate, endDate, Order.OrderStatus.PENDING);
        
        List<Order> eligibleOrders = ordersInRange.stream()
                .filter(order -> order.getIsVisible() && 
                    (order.getDiscountType() == null || 
                     (order.getDiscountType().equals("FREQUENT_5") && !order.getDiscountType().contains("RANDOM_50"))))
                .collect(java.util.stream.Collectors.toList());
        
        if (eligibleOrders.isEmpty()) {
            return new ArrayList<>();
        }
        
        // Select one random order
        Random random = new Random();
        Order selectedOrder = eligibleOrders.get(random.nextInt(eligibleOrders.size()));
        
        User orderUser = userRepository.findById(selectedOrder.getUserId()).orElse(null);
        BigDecimal originalTotal = selectedOrder.getTotalAmount().add(selectedOrder.getDiscountApplied());
        BigDecimal newDiscount = discountService.calculateDiscount(originalTotal, true, orderUser);
        
        selectedOrder.setTotalAmount(originalTotal.subtract(newDiscount));
        selectedOrder.setDiscountApplied(newDiscount);
        
        // Set combined discount type
        String discountType = "RANDOM_50";
        if (orderUser != null && orderUser.getIsFrequentCustomer()) {
            discountType = "FREQUENT_5,RANDOM_50";
        }
        selectedOrder.setDiscountType(discountType);
        
        List<Order> updatedOrders = new ArrayList<>();
        updatedOrders.add(orderRepository.save(selectedOrder));
        return updatedOrders;
    }

    public List<Order> applyTimeDiscount(LocalDateTime startDate, LocalDateTime endDate) {
        List<Order> ordersInRange = orderRepository.findByOrderDateBetweenAndStatus(
                startDate, endDate, Order.OrderStatus.PENDING);
        
        List<Order> updatedOrders = new ArrayList<>();
        for (Order order : ordersInRange) {
            if (order.getIsVisible() && (order.getDiscountType() == null || 
                (order.getDiscountType().equals("FREQUENT_5") && !order.getDiscountType().contains("TIME_10")))) {
                User orderUser = userRepository.findById(order.getUserId()).orElse(null);
                BigDecimal originalTotal = order.getTotalAmount().add(order.getDiscountApplied());
                BigDecimal newDiscount = discountService.calculateDiscount(originalTotal, false, orderUser);
                
                order.setTotalAmount(originalTotal.subtract(newDiscount));
                order.setDiscountApplied(newDiscount);
                
                // Set combined discount type
                String discountType = "TIME_10";
                if (orderUser != null && orderUser.getIsFrequentCustomer()) {
                    discountType = "FREQUENT_5,TIME_10";
                }
                order.setDiscountType(discountType);
                
                updatedOrders.add(orderRepository.save(order));
            }
        }
        return updatedOrders;
    }

    private Order createOrder(Long userId, OrderRequest request, String discountType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order(userId, BigDecimal.ZERO, LocalDateTime.now());
        order.setDiscountType(discountType);

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderRequest.OrderItemRequest itemRequest : request.getItems()) {
            Product product = productService.getProductById(itemRequest.getProductId());
            productService.updateStock(product.getId(), itemRequest.getQuantity());

            OrderItem orderItem = new OrderItem(order, product.getId(), product.getName(),
                    itemRequest.getQuantity(), product.getPrice());
            order.getItems().add(orderItem);

            totalAmount = totalAmount.add(orderItem.getSubtotal());
        }

        // Only apply frequent customer discount automatically
        BigDecimal discount = BigDecimal.ZERO;
        String finalDiscountType = null;
        
        if (user.getIsFrequentCustomer()) {
            discount = totalAmount.multiply(BigDecimal.valueOf(0.05)); // 5%
            finalDiscountType = "FREQUENT_5";
        }
        
        order.setDiscountType(finalDiscountType);
        order.setTotalAmount(totalAmount.subtract(discount));
        order.setDiscountApplied(discount);

        Order savedOrder = orderRepository.save(order);
        auditService.logAction("Order", savedOrder.getId(), "CREATE", userId, null, savedOrder.toString());

        return savedOrder;
    }

    public Page<Order> getUserOrders(Long userId, Pageable pageable) {
        return orderRepository.findByUserIdAndIsVisibleTrueOrderByCreatedAtDesc(userId, pageable);
    }

    public Order updateOrderStatus(Long orderId, Order.OrderStatus status, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        Order.OrderStatus oldStatus = order.getStatus();
        order.setStatus(status);
        
        Order updatedOrder = orderRepository.save(order);
        auditService.logAction("Order", orderId, "STATUS_UPDATE", userId, 
                "Status: " + oldStatus, "Status: " + status);
        
        return updatedOrder;
    }

    public Page<Order> getAllOrders(Pageable pageable) {
        return orderRepository.findByIsVisibleTrueOrderByCreatedAtDesc(pageable);
    }

    public void deleteOrder(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setIsVisible(false);
        orderRepository.save(order);
        
        auditService.logAction("Order", orderId, "HIDE", userId, 
                "Visible: true", "Visible: false");
    }

    public List<Object[]> getTopCustomers() {
        return orderRepository.findTopCustomersByOrderCount(PageRequest.of(0, 5));
    }
}