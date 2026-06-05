package com.kh.app.store.repository;

import com.kh.app.store.entity.StoreOrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoreOrderRepository extends JpaRepository<StoreOrderEntity, Long> {
}
