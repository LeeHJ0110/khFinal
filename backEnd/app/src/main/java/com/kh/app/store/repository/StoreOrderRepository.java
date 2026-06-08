package com.kh.app.store.repository;

import com.kh.app.store.entity.StoreOrderEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoreOrderRepository extends JpaRepository<StoreOrderEntity, Long> {
    Page<StoreOrderEntity> findByMember_IdOrderByCreatedAtDesc(
            Long memberId,
            Pageable pageable
    );
}
