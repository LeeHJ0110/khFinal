package com.kh.app.admin.dto.response;

import com.kh.app.store.entity.StoreOrderItemEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminDeliveryItemResDto {

    private Long orderItemId;
    private String productName;
    private Long productPrice;
    private Integer quantity;
    private Long totalPrice;

    public static AdminDeliveryItemResDto from(StoreOrderItemEntity item) {
        return AdminDeliveryItemResDto.builder()
                .orderItemId(item.getOrderItemId())
                .productName(item.getOrderItemProductName())
                .productPrice(item.getOrderItemProductPrice())
                .quantity(item.getOrderItemQty())
                .totalPrice(item.getOrderItemTotalPrice())
                .build();
    }
}