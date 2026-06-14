package com.kh.app.store.repository;

import com.kh.app.common.entity.DelYn;
import com.kh.app.store.entity.StoreProductEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StoreProductRepository extends JpaRepository<StoreProductEntity, Long>, StoreProductRepositoryCustom {

    // 상품판매상태가 "Y"인 상품만 상품번호 내림차순으로 조회
    List<StoreProductEntity> findByProductSaleYnOrderByProductIdDesc(String productSaleYn);

    // 전체 베스트 상품 조회
    // 판매중인 상품 중 리뷰 많은 순, 리뷰수가 같으면 상품ID 최신순
    @Query("""
        SELECT p
        FROM StoreProductEntity p
        LEFT JOIN StoreReviewEntity r
            ON r.product = p
           AND r.delYn = :delYn
        WHERE p.productSaleYn = :productSaleYn
        GROUP BY p
        ORDER BY COUNT(r.reviewId) DESC, p.productId DESC
    """)
    List<StoreProductEntity> findBestProductsByReviewCount(
            @Param("productSaleYn") String productSaleYn,
            @Param("delYn") DelYn delYn,
            Pageable pageable
    );

    // 대상동물별 베스트 상품 조회
    // 판매중 + 대상동물 조건 + 리뷰 많은 순, 리뷰수가 같으면 상품ID 최신순
    @Query("""
        SELECT p
        FROM StoreProductEntity p
        LEFT JOIN StoreReviewEntity r
            ON r.product = p
           AND r.delYn = :delYn
        WHERE p.productSaleYn = :productSaleYn
          AND p.productTargetPetType = :productTargetPetType
        GROUP BY p
        ORDER BY COUNT(r.reviewId) DESC, p.productId DESC
    """)
    List<StoreProductEntity> findBestProductsByReviewCountAndTargetPetType(
            @Param("productSaleYn") String productSaleYn,
            @Param("productTargetPetType") String productTargetPetType,
            @Param("delYn") DelYn delYn,
            Pageable pageable
    );
}