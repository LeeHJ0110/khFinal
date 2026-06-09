package com.kh.app.store.dto.response;

import com.kh.app.store.entity.StoreProductCategory;
import com.kh.app.store.entity.StoreWishEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StoreWishListResDto {

    // 관심상품 ID
    private Long wishlistId;

    // 상품 정보
    private Long productId;
    private String productName;
    private Long productPrice;
    private String mainImageUrl;

    // 상품 상태
    private String productSaleYn;

    // 필터용
    private StoreProductCategory productCategory;

    public static StoreWishListResDto from(
            StoreWishEntity wishItem,
            String mainImageUrl
    ) {
        return StoreWishListResDto.builder()
                .wishlistId(wishItem.getWishlistId())
                .productId(wishItem.getProduct().getProductId())
                .productName(wishItem.getProduct().getProductName())
                .productPrice(wishItem.getProduct().getProductPrice())
                .mainImageUrl(mainImageUrl)
                .productSaleYn(wishItem.getProduct().getProductSaleYn())
                .productCategory(wishItem.getProduct().getProductCategory())
                .build();
    }
}


