package com.kh.app.store.repository;

import com.kh.app.store.entity.StoreOrderItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StoreOrderItemRepository extends JpaRepository<StoreOrderItemEntity, Long> {
    List<StoreOrderItemEntity> findByOrder_OrderId(
            Long orderId
    );
}