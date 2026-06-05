package com.kh.app.store.repository;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.store.entity.StoreCartItemEntity;
import com.kh.app.store.entity.StoreProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StoreCartItemRepository extends JpaRepository<StoreCartItemEntity, Long> {

    Optional<StoreCartItemEntity> findByMemberAndProduct(
            MemberEntity member,
            StoreProductEntity product
    );

    List<StoreCartItemEntity> findByMemberOrderByCartItemIdDesc(MemberEntity member);
}