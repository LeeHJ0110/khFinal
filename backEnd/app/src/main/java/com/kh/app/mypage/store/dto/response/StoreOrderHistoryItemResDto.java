package com.kh.app.mypage.store.dto.response;

import com.kh.app.store.entity.StoreOrderItemEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StoreOrderHistoryItemResDto {

    private Long orderItemId;

    private Long productId;

    private String productName;

    private String imageUrl;

    private Long price;

    private Integer qty;

    private Long totalPrice;

    private Boolean reviewed;

    private Long reviewId;

    public static StoreOrderHistoryItemResDto from(
            StoreOrderItemEntity item,
            String imageUrl,
            Boolean reviewed,
            Long reviewId
    ) {
        return StoreOrderHistoryItemResDto.builder()
                .orderItemId(item.getOrderItemId())
                .productId(item.getProduct().getProductId())
                .productName(item.getOrderItemProductName())
                .imageUrl(imageUrl)
                .price(item.getOrderItemProductPrice())
                .qty(item.getOrderItemQty())
                .totalPrice(item.getOrderItemTotalPrice())
                .reviewed(reviewed)
                .reviewId(reviewId)
                .build();
    }
}