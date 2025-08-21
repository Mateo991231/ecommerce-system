package com.ecommerce.service;

import com.ecommerce.dto.OrderRequest;
import com.ecommerce.entity.Order;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductService productService;

    @Mock
    private DiscountService discountService;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private OrderService orderService;

    private User testUser;
    private Product testProduct;
    private OrderRequest testOrderRequest;

    @BeforeEach
    void setUp() {
        testUser = new User("testuser", "test@test.com", "password", "Test", "User");
        testUser.setId(1L);
        testUser.setIsFrequentCustomer(true);

        testProduct = new Product("iPhone 15", "Latest iPhone", 
                                 BigDecimal.valueOf(999.99), "Electronics", 50);
        testProduct.setId(1L);

        testOrderRequest = new OrderRequest();
        OrderRequest.OrderItemRequest itemRequest = new OrderRequest.OrderItemRequest();
        itemRequest.setProductId(1L);
        itemRequest.setQuantity(2);
        testOrderRequest.setItems(Arrays.asList(itemRequest));
    }

    @Test
    void createOrder_ShouldCreateOrder_WhenValidRequest() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(productService.getProductById(1L)).thenReturn(testProduct);

        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Order result = orderService.createOrder(1L, testOrderRequest);

        assertNotNull(result);
        assertEquals(1, result.getItems().size());
        verify(productService).updateStock(1L, 2);
        verify(orderRepository).save(any(Order.class));
    }

    @Test
    void createOrder_ShouldThrowException_WhenUserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
            () -> orderService.createOrder(1L, testOrderRequest));
        assertEquals("User not found", exception.getMessage());
    }

    @Test
    void applyRandomDiscount_ShouldApplyDiscount_WhenEligibleOrdersExist() {
        Order testOrder = new Order(1L, BigDecimal.valueOf(1000), LocalDateTime.now());
        testOrder.setId(1L);
        testOrder.setDiscountType("FREQUENT_5");
        testOrder.setIsVisible(true);

        when(orderRepository.findByOrderDateBetweenAndStatus(any(), any(), any()))
            .thenReturn(Arrays.asList(testOrder));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(discountService.calculateDiscount(any(), eq(true), any()))
            .thenReturn(BigDecimal.valueOf(550));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        List<Order> result = orderService.applyRandomDiscount(
            LocalDateTime.now().minusDays(1), LocalDateTime.now().plusDays(1));

        assertFalse(result.isEmpty());
        verify(orderRepository).save(any(Order.class));
    }

    @Test
    void applyTimeDiscount_ShouldApplyDiscount_WhenEligibleOrdersExist() {
        Order testOrder = new Order(1L, BigDecimal.valueOf(1000), LocalDateTime.now());
        testOrder.setId(1L);
        testOrder.setDiscountType("FREQUENT_5");
        testOrder.setIsVisible(true);

        when(orderRepository.findByOrderDateBetweenAndStatus(any(), any(), any()))
            .thenReturn(Arrays.asList(testOrder));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(discountService.calculateDiscount(any(), eq(false), any()))
            .thenReturn(BigDecimal.valueOf(150));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        List<Order> result = orderService.applyTimeDiscount(
            LocalDateTime.now().minusDays(1), LocalDateTime.now().plusDays(1));

        assertFalse(result.isEmpty());
        verify(orderRepository).save(any(Order.class));
    }
}