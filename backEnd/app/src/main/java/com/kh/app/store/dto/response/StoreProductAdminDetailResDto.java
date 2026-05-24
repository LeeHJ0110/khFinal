package com.kh.app.store.dto.response;

import com.kh.app.store.entity.StoreProductCategory;
import com.kh.app.store.entity.StoreProductEntity;
import com.kh.app.store.entity.StoreProductFeedingGuideEntity;
import com.kh.app.store.entity.StoreProductImageEntity;
import com.kh.app.store.entity.StoreProductNutritionEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class StoreProductAdminDetailResDto {

    private Long productId;

    // 기본 정보
    private String productName;
    private StoreProductCategory productCategory;
    private Long tagId;
    private String tagName;
    private String productTargetPetType;
    private Long productPrice;
    private String productSaleYn;
    private Long productViewCount;

    // 이미지
    private String mainImageUrl;
    private List<String> subImageUrls;

    // 급여 기준
    private List<StoreFeedingGuideResDto> feedingGuideList;

    // 영양성분
    private StoreNutritionResDto nutrition;

    // 등록/수정일
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;

    public static StoreProductAdminDetailResDto from(
            StoreProductEntity product,
            StoreProductNutritionEntity nutrition,
            List<StoreProductFeedingGuideEntity> feedingGuideList,
            List<StoreProductImageEntity> imageList
    ) {
        return StoreProductAdminDetailResDto.builder()
                .productId(product.getProductId())
                .productName(product.getProductName())
                .productCategory(product.getProductCategory())
                .tagId(product.getProductTag().getTagId())
                .tagName(product.getProductTag().getTagName())
                .productTargetPetType(product.getProductTargetPetType())
                .productPrice(product.getProductPrice())
                .productSaleYn(product.getProductSaleYn())
                .productViewCount(product.getProductViewCount())

                .mainImageUrl(getMainImageUrl(imageList))
                .subImageUrls(getSubImageUrls(imageList))

                .feedingGuideList(
                        feedingGuideList == null
                                ? List.of()
                                : feedingGuideList.stream()
                                .map(StoreFeedingGuideResDto::from)
                                .toList()
                )
                .nutrition(
                        nutrition == null
                                ? null
                                : StoreNutritionResDto.from(nutrition)
                )

                .createdAt(product.getCreatedAt())
                .modifiedAt(product.getUpdatedAt())
                .build();
    }

    private static String getMainImageUrl(List<StoreProductImageEntity> imageList) {
        if (imageList == null || imageList.isEmpty()) {
            return null;
        }

        return imageList.stream()
                .filter(image -> "Y".equals(image.getImageRepresentYn()))
                .findFirst()
                .map(StoreProductImageEntity::getImageChangedName)
                .orElse(null);
    }

    private static List<String> getSubImageUrls(List<StoreProductImageEntity> imageList) {
        if (imageList == null || imageList.isEmpty()) {
            return List.of();
        }

        return imageList.stream()
                .filter(image -> "N".equals(image.getImageRepresentYn()))
                .map(StoreProductImageEntity::getImageChangedName)
                .toList();
    }
}