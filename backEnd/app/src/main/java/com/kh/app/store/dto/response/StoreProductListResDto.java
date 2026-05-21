package com.kh.app.store.dto.response;

import com.kh.app.store.entity.StoreProductCategory;
import com.kh.app.store.entity.StoreProductEntity;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class StoreProductListResDto {

    private Long productId;
    private String thumbnailUrl;
    private String productName;
    private String productTargetPetType;
    private StoreProductCategory productCategory;
    private String tagName;
    private Long productPrice;
    private String productSaleYn;
    private Long productViewCount;
    private LocalDateTime createdAt;

    // JPQL 조회용 생성자
    public StoreProductListResDto(
            Long productId,
            String productName,
            StoreProductCategory productCategory,
            String productTargetPetType,
            Long productPrice,
            String productSaleYn,
            Long productViewCount,
            String tagName
    ) {
        this.productId = productId;
        this.thumbnailUrl = null;
        this.productName = productName;
        this.productCategory = productCategory;
        this.productTargetPetType = productTargetPetType;
        this.productPrice = productPrice;
        this.productSaleYn = productSaleYn;
        this.productViewCount = productViewCount;
        this.tagName = tagName;
        this.createdAt = null;
    }

    // Entity 직접 변환용
    public static StoreProductListResDto from(StoreProductEntity entity) {
        StoreProductListResDto dto = new StoreProductListResDto(
                entity.getProductId(),
                entity.getProductName(),
                entity.getProductCategory(),
                entity.getProductTargetPetType(),
                entity.getProductPrice(),
                entity.getProductSaleYn(),
                entity.getProductViewCount(),
                entity.getProductTag().getTagName()
        );

        dto.thumbnailUrl = null;
        dto.createdAt = entity.getCreatedAt();

        return dto;
    }
}