package com.ecommerce.service;

import com.ecommerce.entity.DiscountConfig;
import com.ecommerce.entity.User;
import com.ecommerce.repository.DiscountConfigRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DiscountServiceTest {

    @Mock
    private DiscountConfigRepository discountConfigRepository;

    @InjectMocks
    private DiscountService discountService;

    private User frequentCustomer;
    private User regularCustomer;
    private DiscountConfig activeConfig;

    @BeforeEach
    void setUp() {
        frequentCustomer = new User("frequent", "frequent@test.com", "pass", "Frequent", "Customer");
        frequentCustomer.setIsFrequentCustomer(true);

        regularCustomer = new User("regular", "regular@test.com", "pass", "Regular", "Customer");
        regularCustomer.setIsFrequentCustomer(false);

        activeConfig = new DiscountConfig();
        activeConfig.setTimeDiscountPercentage(BigDecimal.valueOf(10));
        activeConfig.setRandomDiscountPercentage(BigDecimal.valueOf(50));
        activeConfig.setStartDate(LocalDateTime.now().minusDays(1));
        activeConfig.setEndDate(LocalDateTime.now().plusDays(1));
        activeConfig.setIsActive(true);
    }

    @Test
    void calculateDiscount_ShouldApplyFrequentCustomerDiscount_WhenFrequentCustomer() {
        when(discountConfigRepository.findActiveDiscountConfig()).thenReturn(Optional.empty());

        BigDecimal result = discountService.calculateDiscount(
            BigDecimal.valueOf(1000), false, frequentCustomer);

        assertEquals(new BigDecimal("50.00"), result); // 5% of 1000
    }

    @Test
    void calculateDiscount_ShouldNotApplyFrequentDiscount_WhenRegularCustomer() {
        when(discountConfigRepository.findActiveDiscountConfig()).thenReturn(Optional.empty());

        BigDecimal result = discountService.calculateDiscount(
            BigDecimal.valueOf(1000), false, regularCustomer);

        assertEquals(BigDecimal.ZERO, result);
    }

    @Test
    void calculateDiscount_ShouldApplyTimeDiscount_WhenActiveConfig() {
        when(discountConfigRepository.findActiveDiscountConfig()).thenReturn(Optional.of(activeConfig));

        BigDecimal result = discountService.calculateDiscount(
            BigDecimal.valueOf(1000), false, regularCustomer);

        assertEquals(new BigDecimal("100.0"), result); // 10% of 1000
    }

    @Test
    void calculateDiscount_ShouldApplyRandomDiscount_WhenRandomOrder() {
        when(discountConfigRepository.findActiveDiscountConfig()).thenReturn(Optional.of(activeConfig));

        BigDecimal result = discountService.calculateDiscount(
            BigDecimal.valueOf(1000), true, regularCustomer);

        assertEquals(new BigDecimal("500.0"), result); // 50% of 1000
    }

    @Test
    void calculateDiscount_ShouldCombineDiscounts_WhenFrequentCustomerAndRandomOrder() {
        when(discountConfigRepository.findActiveDiscountConfig()).thenReturn(Optional.of(activeConfig));

        BigDecimal result = discountService.calculateDiscount(
            BigDecimal.valueOf(1000), true, frequentCustomer);

        assertEquals(new BigDecimal("550.00"), result); // 55% of 1000 (5% + 50%)
    }

    @Test
    void calculateDiscount_ShouldCombineDiscounts_WhenFrequentCustomerAndTimeDiscount() {
        when(discountConfigRepository.findActiveDiscountConfig()).thenReturn(Optional.of(activeConfig));

        BigDecimal result = discountService.calculateDiscount(
            BigDecimal.valueOf(1000), false, frequentCustomer);

        assertEquals(new BigDecimal("150.00"), result); // 15% of 1000 (5% + 10%)
    }

    @Test
    void calculateDiscount_ShouldNotApplyTimeOrRandom_WhenConfigInactive() {
        activeConfig.setIsActive(false);
        when(discountConfigRepository.findActiveDiscountConfig()).thenReturn(Optional.of(activeConfig));

        BigDecimal result = discountService.calculateDiscount(
            BigDecimal.valueOf(1000), true, frequentCustomer);

        assertEquals(new BigDecimal("50.00"), result); // Only 5% frequent customer discount
    }
}