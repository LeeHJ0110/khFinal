package com.kh.app.store.repository;

import com.kh.app.common.entity.DelYn;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.store.entity.StoreOrderItemEntity;
import com.kh.app.store.entity.StoreReviewEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface StoreReviewRepository extends JpaRepository<StoreReviewEntity, Long> {

    boolean existsByOrderItem(StoreOrderItemEntity orderItem);

    Page<StoreReviewEntity> findByProduct_ProductIdAndDelYnOrderByCreatedAtDesc(
            Long productId,
            DelYn delYn,
            Pageable pageable
    );

    Page<StoreReviewEntity> findByProduct_ProductIdAndDelYnOrderByReviewRatingDescCreatedAtDesc(
            Long productId,
            DelYn delYn,
            Pageable pageable
    );

    Long countByProduct_ProductIdAndDelYn(Long productId, DelYn delYn);

    Long countByProduct_ProductIdAndReviewRatingAndDelYn(
            Long productId,
            Long reviewRating,
            DelYn delYn
    );

    @Query("""
            select coalesce(avg(r.reviewRating), 0)
            from StoreReviewEntity r
            where r.product.productId = :productId
            and r.delYn = :delYn
            """)
    Double getAverageRatingByProductIdAndDelYn(Long productId, DelYn delYn);

    // 본인 리뷰내역 - 최신순
    Page<StoreReviewEntity> findByMemberAndDelYnOrderByCreatedAtDesc(
            MemberEntity member,
            DelYn delYn,
            Pageable pageable
    );

    // 본인 리뷰내역 - 오래된순
    Page<StoreReviewEntity> findByMemberAndDelYnOrderByCreatedAtAsc(
            MemberEntity member,
            DelYn delYn,
            Pageable pageable
    );

    Optional<StoreReviewEntity> findByOrderItem_OrderItemId(Long orderItemId);
}