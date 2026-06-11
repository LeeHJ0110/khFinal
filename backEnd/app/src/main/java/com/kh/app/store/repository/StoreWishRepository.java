package com.kh.app.store.repository;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.store.entity.StoreProductCategory;
import com.kh.app.store.entity.StoreWishEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StoreWishRepository extends JpaRepository<StoreWishEntity, Long> {

    boolean existsByMember_IdAndProduct_ProductId(Long memberId, Long productId);

    Optional<StoreWishEntity> findByMember_IdAndProduct_ProductId(
            Long memberId,
            Long productId
    );

    Page<StoreWishEntity> findByMemberOrderByWishlistIdDesc(
            MemberEntity member,
            Pageable pageable
    );

    Page<StoreWishEntity> findByMemberAndProduct_ProductCategoryOrderByWishlistIdDesc(
            MemberEntity member,
            StoreProductCategory category,
            Pageable pageable
    );

    Optional<StoreWishEntity> findByWishlistIdAndMember(Long wishlistId, MemberEntity member);

    long countByMember_Id(Long memberId);
}