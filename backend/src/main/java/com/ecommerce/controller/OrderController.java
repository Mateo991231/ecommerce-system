package com.ecommerce.controller;

import com.ecommerce.dto.OrderRequest;
import com.ecommerce.entity.Order;
import com.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @Autowired
    private com.ecommerce.service.UserService userService;

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestParam Long userId, @Valid @RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.createOrder(userId, request));
    }



    @PostMapping("/apply-random-discount")
    public ResponseEntity<List<Order>> applyRandomDiscount(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        return ResponseEntity.ok(orderService.applyRandomDiscount(start, end));
    }

    @PostMapping("/apply-time-discount")
    public ResponseEntity<List<Order>> applyTimeDiscount(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        return ResponseEntity.ok(orderService.applyTimeDiscount(start, end));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<Order>> getUserOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getUserOrders(userId, PageRequest.of(0, 10)));
    }

    @GetMapping
    public ResponseEntity<Page<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders(PageRequest.of(0, 20)));
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status,
            @RequestParam Long userId) {
        try {
            Order.OrderStatus orderStatus = Order.OrderStatus.valueOf(status.toUpperCase());
            return ResponseEntity.ok(orderService.updateOrderStatus(orderId, orderStatus, userId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/frequent-customers")
    public ResponseEntity<java.util.List<Object[]>> getFrequentCustomers() {
        return ResponseEntity.ok(orderService.getTopCustomers());
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long orderId, @RequestParam Long userId) {
        orderService.deleteOrder(orderId, userId);
        return ResponseEntity.ok().build();
    }
}