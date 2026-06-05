package com.kh.app.store.repository;

import com.kh.app.store.entity.StorePaymentEntity;
import com.kh.app.store.entity.StoreOrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StorePaymentRepository extends JpaRepository<StorePaymentEntity, Long> {

    Optional<StorePaymentEntity> findByOrder(StoreOrderEntity order);
}