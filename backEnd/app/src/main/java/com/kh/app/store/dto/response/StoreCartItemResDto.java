package com.kh.app.store.dto.response;

import com.kh.app.store.entity.StoreCartItemEntity;
import com.kh.app.store.entity.StoreProductCategory;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StoreCartItemResDto {

    // 장바구니 항목 ID
    private Long cartItemId;

    // 상품 정보
    private Long productId;
    private String productName;
    private Long productPrice;
    private String mainImageUrl;

    // 장바구니 수량
    private Integer cartItemQty;

    // 상품별 총 금액
    private Long cartItemTotalPrice;

    // 상품 상태
    private String productSaleYn;

    // 추천상품/필터용
    private String productTargetPetType;
    private StoreProductCategory productCategory;
    private String tagName;

    public static StoreCartItemResDto from(
            StoreCartItemEntity cartItem,
            String mainImageUrl
    ) {
        Long productPrice = cartItem.getProduct().getProductPrice();
        Integer qty = cartItem.getCartItemQty();

        return StoreCartItemResDto.builder()
                .cartItemId(cartItem.getCartItemId())
                .productId(cartItem.getProduct().getProductId())
                .productName(cartItem.getProduct().getProductName())
                .productPrice(productPrice)
                .mainImageUrl(mainImageUrl)
                .cartItemQty(qty)
                .cartItemTotalPrice(productPrice * qty)
                .productSaleYn(cartItem.getProduct().getProductSaleYn())
                .productTargetPetType(cartItem.getProduct().getProductTargetPetType())
                .productCategory(cartItem.getProduct().getProductCategory())
                .tagName(cartItem.getProduct().getProductTag().getTagName())
                .build();
    }
}