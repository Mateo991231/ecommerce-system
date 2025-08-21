package com.ecommerce.repository;

import com.ecommerce.entity.DiscountConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DiscountConfigRepository extends JpaRepository<DiscountConfig, Long> {
    @Query("SELECT dc FROM DiscountConfig dc WHERE dc.isActive = true ORDER BY dc.id DESC")
    Optional<DiscountConfig> findActiveDiscountConfig();
}