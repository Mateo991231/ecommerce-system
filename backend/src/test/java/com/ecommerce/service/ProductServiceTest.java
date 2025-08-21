package com.ecommerce.service;

import com.ecommerce.dto.ProductRequest;
import com.ecommerce.entity.Product;
import com.ecommerce.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private ProductService productService;

    private Product testProduct;
    private ProductRequest testRequest;

    @BeforeEach
    void setUp() {
        testProduct = new Product("iPhone 15", "Latest iPhone", 
                                 BigDecimal.valueOf(999.99), "Electronics", 50);
        testProduct.setId(1L);

        testRequest = new ProductRequest();
        testRequest.setName("iPhone 15");
        testRequest.setDescription("Latest iPhone");
        testRequest.setPrice(BigDecimal.valueOf(999.99));
        testRequest.setCategory("Electronics");
        testRequest.setStock(50);
    }

    @Test
    void createProduct_ShouldReturnProduct_WhenValidRequest() {
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        Product result = productService.createProduct(testRequest);

        assertNotNull(result);
        assertEquals("iPhone 15", result.getName());
        assertEquals(BigDecimal.valueOf(999.99), result.getPrice());
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void getProductById_ShouldReturnProduct_WhenExists() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        Product result = productService.getProductById(1L);

        assertNotNull(result);
        assertEquals("iPhone 15", result.getName());
    }

    @Test
    void getProductById_ShouldThrowException_WhenNotExists() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> productService.getProductById(1L));
        assertEquals("Product not found with id: 1", exception.getMessage());
    }

    @Test
    void updateStock_ShouldUpdateProduct_WhenSufficientStock() {
        testProduct.setStock(10);
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        productService.updateStock(1L, 5);

        assertEquals(5, testProduct.getStock());
        verify(productRepository).save(testProduct);
    }

    @Test
    void updateStock_ShouldThrowException_WhenInsufficientStock() {
        testProduct.setStock(3);
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> productService.updateStock(1L, 5));
        assertTrue(exception.getMessage().contains("No hay stock suficiente"));
    }
}