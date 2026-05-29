package com.kh.app.store.repository;

import com.kh.app.store.entity.StoreProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StoreProductRepository extends JpaRepository<StoreProductEntity, Long>, StoreProductRepositoryCustom {

    // 상품판매상태가 "Y"인 상품만 상품번호 내림차순으로 조회
    List<StoreProductEntity> findByProductSaleYnOrderByProductIdDesc(String productSaleYn);

    // 전체 베스트 상품 4개 조회
    // 판매중인 상품 중 조회수 높은 순, 조회수가 같으면 상품ID 최신순
    List<StoreProductEntity> findTop4ByProductSaleYnOrderByProductViewCountDescProductIdDesc(
            String productSaleYn
    );

    // 대상동물별 베스트 상품 4개 조회
    // 판매중 + 대상동물 조건으로 조회수 높은 순, 조회수가 같으면 상품ID 최신순
    List<StoreProductEntity> findTop4ByProductSaleYnAndProductTargetPetTypeOrderByProductViewCountDescProductIdDesc(
            String productSaleYn,
            String productTargetPetType
    );
}