package com.kh.app.store.repository;

import com.kh.app.store.entity.StoreProductFeedingGuideEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StoreProductFeedingGuideRepository extends JpaRepository<StoreProductFeedingGuideEntity, Long> {

    void deleteByProduct_ProductId(Long productId);

    List<StoreProductFeedingGuideEntity> findByProduct_ProductIdOrderByFeedingGuideIdAsc(Long productId);

}