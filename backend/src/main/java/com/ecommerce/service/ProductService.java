package com.ecommerce.service;

import com.ecommerce.dto.ProductRequest;
import com.ecommerce.entity.Product;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AuditService auditService;

    public Product createProduct(ProductRequest request) {
        Product product = new Product(request.getName(), request.getDescription(),
                request.getPrice(), request.getCategory(), request.getStock());
        
        Product savedProduct = productRepository.save(product);
        auditService.logAction("Product", savedProduct.getId(), "CREATE", null, null, savedProduct.toString());
        return savedProduct;
    }

    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findByIsActiveTrue(pageable);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public Product updateProduct(Long id, ProductRequest request) {
        Product product = getProductById(id);
        String oldValues = product.toString();
        
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setStock(request.getStock());
        
        Product updatedProduct = productRepository.save(product);
        auditService.logAction("Product", id, "UPDATE", null, oldValues, updatedProduct.toString());
        return updatedProduct;
    }

    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        product.setIsActive(false);
        productRepository.save(product);
        auditService.logAction("Product", id, "DELETE", null, product.toString(), null);
    }

    public Page<Product> searchProducts(String name, String category, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        return productRepository.searchProducts(name, category, minPrice, maxPrice, pageable);
    }

    public List<Object[]> getTopSellingProducts() {
        return productRepository.findTopSellingProducts(PageRequest.of(0, 5));
    }

    public List<Product> getActiveProducts() {
        return productRepository.findByIsActiveTrue();
    }

    public void updateStock(Long productId, Integer quantity) {
        Product product = getProductById(productId);
        if (product.getStock() < quantity) {
            throw new RuntimeException("No hay stock suficiente para el producto: " + product.getName() + ". Stock disponible: " + product.getStock());
        }
        product.setStock(product.getStock() - quantity);
        productRepository.save(product);
    }
}