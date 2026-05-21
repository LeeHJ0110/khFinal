package com.kh.app.store.repository;

import com.kh.app.store.entity.StoreProductTagEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoreProductTagRepository extends JpaRepository<StoreProductTagEntity, Long> {
}