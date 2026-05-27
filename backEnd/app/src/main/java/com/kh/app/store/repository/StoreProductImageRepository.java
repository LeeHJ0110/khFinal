package com.kh.app.store.repository;

import com.kh.app.store.entity.StoreProductImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StoreProductImageRepository extends JpaRepository<StoreProductImageEntity, Long> {

    void deleteByProduct_ProductIdAndImageRepresentYn(Long productId, String imageRepresentYn);

    List<StoreProductImageEntity> findByProduct_ProductIdOrderBySortOrderAsc(Long productId);

    Optional<StoreProductImageEntity> findFirstByProduct_ProductIdAndImageRepresentYnOrderBySortOrderAsc(
            Long productId,
            String imageRepresentYn
    );
}