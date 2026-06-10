package com.kh.app.store.repository;

import com.kh.app.store.entity.StoreReviewEntity;
import com.kh.app.store.entity.StoreReviewImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StoreReviewImageRepository extends JpaRepository<StoreReviewImageEntity, Long> {

    List<StoreReviewImageEntity> findByReview(StoreReviewEntity review);

    List<StoreReviewImageEntity> findByReviewOrderByImageSortOrderAsc(StoreReviewEntity review);

    void deleteByReview(StoreReviewEntity review);

}