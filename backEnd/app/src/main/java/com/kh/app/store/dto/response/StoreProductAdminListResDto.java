package com.kh.app.store.dto.response;

import com.kh.app.store.entity.StoreProductCategory;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class StoreProductAdminListResDto {

    // 상품 번호
    private Long productId;

    // 목록 썸네일 이미지
    private String thumbnailUrl;

    // 상품명
    private String productName;

    // 대상동물 D: 강아지, C: 고양이
    private String productTargetPetType;

    // 카테고리
    private StoreProductCategory productCategory;

    // 태그명
    private String tagName;

    // 판매가
    private Long productPrice;

    // 판매상태 Y: 판매중, N: 판매중지
    private String productSaleYn;

    // 조회수
    private Long productViewCount;

    // 등록일
    private LocalDateTime createdAt;

    public StoreProductAdminListResDto(
            Long productId,
            String thumbnailUrl,
            String productName,
            StoreProductCategory productCategory,
            String productTargetPetType,
            Long productPrice,
            String productSaleYn,
            Long productViewCount,
            String tagName,
            LocalDateTime createdAt
    ) {
        this.productId = productId;
        this.thumbnailUrl = thumbnailUrl;
        this.productName = productName;
        this.productCategory = productCategory;
        this.productTargetPetType = productTargetPetType;
        this.productPrice = productPrice;
        this.productSaleYn = productSaleYn;
        this.productViewCount = productViewCount;
        this.tagName = tagName;
        this.createdAt = createdAt;
    }
}