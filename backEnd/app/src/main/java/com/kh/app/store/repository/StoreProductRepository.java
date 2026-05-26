package com.kh.app.store.repository;

import com.kh.app.store.entity.StoreProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StoreProductRepository extends JpaRepository<StoreProductEntity, Long>, StoreProductRepositoryCustom {
    //productSaleYn이 "Y"인 상품만 productId 내림차순으로 조회
    List<StoreProductEntity> findByProductSaleYnOrderByProductIdDesc(String productSaleYn);
}