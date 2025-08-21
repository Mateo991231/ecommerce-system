package com.ecommerce.repository;

import com.ecommerce.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByUserIdAndIsVisibleTrueOrderByCreatedAtDesc(Long userId, Pageable pageable);
    Page<Order> findByIsVisibleTrueOrderByCreatedAtDesc(Pageable pageable);
    List<Order> findByOrderDateBetweenAndStatusNot(LocalDateTime startDate, LocalDateTime endDate, Order.OrderStatus status);
    List<Order> findByOrderDateBetweenAndStatus(LocalDateTime startDate, LocalDateTime endDate, Order.OrderStatus status);
    
    @Query("SELECT CONCAT(u.firstName, ' ', u.lastName) as customerName, COUNT(o) as totalOrders " +
           "FROM Order o JOIN User u ON o.userId = u.id " +
           "WHERE o.status = 'APPROVED' " +
           "GROUP BY u.id, u.firstName, u.lastName " +
           "ORDER BY COUNT(o) DESC")
    List<Object[]> findTopCustomersByOrderCount(Pageable pageable);
}