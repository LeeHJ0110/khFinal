package com.kh.app.store.dto.response;

import com.kh.app.store.entity.StoreProductCategory;
import com.kh.app.store.entity.StoreProductEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StoreProductListResDto {

    private Long productId;

    private String productName;

    private StoreProductCategory productCategory;

    private String tagName;

    private String productTargetPetType;

    private Long productPrice;

    private String mainImageUrl;

    // 관심상품 여부
    private Boolean wished;

    // 관심상품 ID
    private Long wishlistId;

    public static StoreProductListResDto from(
            StoreProductEntity product,
            String mainImageUrl,
            Boolean wished,
            Long wishlistId
    ) {
        return StoreProductListResDto.builder()
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
                .mainImageUrl(mainImageUrl)
                .wished(wished)
                .wishlistId(wishlistId)
                .build();
    }
}