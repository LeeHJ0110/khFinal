package com.kh.app.store.dto.response;

import com.kh.app.store.entity.StoreProductCategory;
import com.kh.app.store.entity.StoreProductEntity;
import com.kh.app.store.entity.StoreProductFeedingGuideEntity;
import com.kh.app.store.entity.StoreProductNutritionEntity;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class StoreProductDetailResDto {

    private Long productId;

    // 기본 정보
    private String productName;
    private StoreProductCategory productCategory;
    private String tagName;
    private String productTargetPetType;
    private Long productPrice;
    private String productSaleYn;

    // 이미지
    private String mainImageUrl;
    private List<String> subImageUrls;

    // 급여 기준
    private List<StoreFeedingGuideResDto> feedingGuideList;

    // 영양성분
    private StoreNutritionResDto nutrition;

    public static StoreProductDetailResDto from(
            StoreProductEntity product,
            StoreProductNutritionEntity nutrition,
            List<StoreProductFeedingGuideEntity> feedingGuideList,
            String mainImageUrl,
            List<String> subImageUrls
    ) {
        return StoreProductDetailResDto.builder()
                .productId(product.getProductId())
                .productName(product.getProductName())
                .productCategory(product.getProductCategory())
                .tagName(
                        product.getProductTag() == null
                                ? null
                                : product.getProductTag().getTagName()
                )
                .productTargetPetType(product.getProductTargetPetType())
                .productPrice(product.getProductPrice())
                .productSaleYn(product.getProductSaleYn())

                .mainImageUrl(mainImageUrl)
                .subImageUrls(subImageUrls == null ? List.of() : subImageUrls)

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
                .build();
    }
}