package com.kh.app.store.repository;

import com.kh.app.store.entity.StoreDeliveryStatus;
import com.kh.app.store.entity.StoreOrderDeliveryEntity;
import com.kh.app.store.entity.StoreOrderEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StoreOrderDeliveryRepository extends JpaRepository<StoreOrderDeliveryEntity, Long> {

    Page<StoreOrderDeliveryEntity> findByDeliveryStatusOrderByCreatedAtDesc(
            StoreDeliveryStatus deliveryStatus,
            Pageable pageable
    );

    List<StoreOrderDeliveryEntity> findAllByDeliveryIdIn(List<Long> deliveryIds);

    Optional<StoreOrderDeliveryEntity> findByOrder(StoreOrderEntity order);
    Optional<StoreOrderDeliveryEntity> findByOrder_OrderId(Long orderId);
}