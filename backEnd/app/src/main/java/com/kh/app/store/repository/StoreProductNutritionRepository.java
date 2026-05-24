package com.kh.app.store.repository;

import com.kh.app.store.entity.StoreProductNutritionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StoreProductNutritionRepository extends JpaRepository<StoreProductNutritionEntity, Long> {

    Optional<StoreProductNutritionEntity> findByProduct_ProductId(Long productId);


}