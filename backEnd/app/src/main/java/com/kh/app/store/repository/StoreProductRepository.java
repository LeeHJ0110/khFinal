package com.kh.app.store.repository;

import com.kh.app.store.entity.StoreProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoreProductRepository extends JpaRepository<StoreProductEntity, Long>, StoreProductRepositoryCustom {
}