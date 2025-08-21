package com.ecommerce.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "discount_config")
public class DiscountConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "start_date")
    private LocalDateTime startDate;

    @NotNull
    @Column(name = "end_date")
    private LocalDateTime endDate;

    @NotNull
    @DecimalMin(value = "0.0")
    @DecimalMax(value = "100.0")
    @Column(name = "time_discount_percentage")
    private BigDecimal timeDiscountPercentage = BigDecimal.valueOf(10);

    @NotNull
    @DecimalMin(value = "0.0")
    @DecimalMax(value = "100.0")
    @Column(name = "random_discount_percentage")
    private BigDecimal randomDiscountPercentage = BigDecimal.valueOf(50);

    @NotNull
    @DecimalMin(value = "0.0")
    @DecimalMax(value = "100.0")
    @Column(name = "frequent_customer_discount_percentage")
    private BigDecimal frequentCustomerDiscountPercentage = BigDecimal.valueOf(5);

    @Column(name = "is_active")
    private Boolean isActive = true;

    public DiscountConfig() {}

    public DiscountConfig(LocalDateTime startDate, LocalDateTime endDate) {
        this.startDate = startDate;
        this.endDate = endDate;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public BigDecimal getTimeDiscountPercentage() { return timeDiscountPercentage; }
    public void setTimeDiscountPercentage(BigDecimal timeDiscountPercentage) { this.timeDiscountPercentage = timeDiscountPercentage; }

    public BigDecimal getRandomDiscountPercentage() { return randomDiscountPercentage; }
    public void setRandomDiscountPercentage(BigDecimal randomDiscountPercentage) { this.randomDiscountPercentage = randomDiscountPercentage; }

    public BigDecimal getFrequentCustomerDiscountPercentage() { return frequentCustomerDiscountPercentage; }
    public void setFrequentCustomerDiscountPercentage(BigDecimal frequentCustomerDiscountPercentage) { this.frequentCustomerDiscountPercentage = frequentCustomerDiscountPercentage; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public boolean isWithinDiscountPeriod(LocalDateTime dateTime) {
        return isActive && dateTime.isAfter(startDate) && dateTime.isBefore(endDate);
    }
}