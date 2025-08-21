package com.ecommerce.service;

import com.ecommerce.entity.DiscountConfig;
import com.ecommerce.entity.User;
import com.ecommerce.repository.DiscountConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class DiscountService {
    @Autowired
    private DiscountConfigRepository discountConfigRepository;

    public BigDecimal calculateDiscount(BigDecimal totalAmount, boolean isRandomOrder, User user) {
        BigDecimal discountPercentage = BigDecimal.ZERO;
        
        // Frequent customer discount (5%) - always applies
        if (user.getIsFrequentCustomer()) {
            discountPercentage = discountPercentage.add(BigDecimal.valueOf(5.0));
        }
        
        // Time-based and random discounts only apply if config is active
        DiscountConfig config = discountConfigRepository.findActiveDiscountConfig().orElse(null);
        if (config != null && config.isWithinDiscountPeriod(LocalDateTime.now())) {
            // Random order discount (50%) - exclusive with time discount
            if (isRandomOrder) {
                discountPercentage = discountPercentage.add(config.getRandomDiscountPercentage());
            } else {
                // Time-based discount (10%) - only if not random
                discountPercentage = discountPercentage.add(config.getTimeDiscountPercentage());
            }
        }

        return totalAmount.multiply(discountPercentage.divide(BigDecimal.valueOf(100)));
    }

    public DiscountConfig getActiveDiscountConfig() {
        return discountConfigRepository.findActiveDiscountConfig().orElse(null);
    }

    public DiscountConfig updateDiscountConfig(DiscountConfig config) {
        return discountConfigRepository.save(config);
    }
}