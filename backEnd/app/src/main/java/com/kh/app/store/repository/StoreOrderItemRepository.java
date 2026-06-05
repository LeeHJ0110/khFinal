package com.kh.app.store.repository;

import com.kh.app.store.entity.StoreOrderItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoreOrderItemRepository extends JpaRepository<StoreOrderItemEntity, Long> {
}