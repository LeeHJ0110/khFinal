package com.kh.app.mypage.store.dto.response;

import com.kh.app.store.entity.StoreOrderItemEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StoreOrderHistoryItemResDto {

    private Long productId;

    private String productName;

    private String imageUrl;

    private Long price;

    private Integer qty;

    private Long totalPrice;

    public static StoreOrderHistoryItemResDto from(
            StoreOrderItemEntity item,
            String imageUrl
    ) {
        return StoreOrderHistoryItemResDto.builder()
                .productId(item.getProduct().getProductId())
                .productName(item.getOrderItemProductName())
                .imageUrl(imageUrl)
                .price(item.getOrderItemProductPrice())
                .qty(item.getOrderItemQty())
                .totalPrice(item.getOrderItemTotalPrice())
                .build();
    }


}