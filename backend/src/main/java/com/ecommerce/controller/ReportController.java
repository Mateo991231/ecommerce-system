package com.ecommerce.controller;

import com.ecommerce.entity.Product;
import com.ecommerce.service.OrderService;
import com.ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*", maxAge = 3600)

public class ReportController {
    @Autowired
    private ProductService productService;

    @Autowired
    private OrderService orderService;

    @GetMapping("/products/active")
    public ResponseEntity<Page<Product>> getActiveProducts() {
        return ResponseEntity.ok(productService.getAllProducts(PageRequest.of(0, 100)));
    }

    @GetMapping("/products/top-selling")
    public ResponseEntity<List<Object[]>> getTopSellingProducts() {
        return ResponseEntity.ok(productService.getTopSellingProducts());
    }

    @GetMapping("/customers/frequent")
    public ResponseEntity<List<Object[]>> getFrequentCustomers() {
        return ResponseEntity.ok(orderService.getTopCustomers());
    }
}