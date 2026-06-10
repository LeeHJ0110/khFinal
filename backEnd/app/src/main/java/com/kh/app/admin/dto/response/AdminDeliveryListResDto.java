package com.kh.app.admin.dto.response;

import com.kh.app.store.entity.StoreOrderDeliveryEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AdminDeliveryListResDto {

    private Long deliveryId;
    private Long orderId;

    private String ordererNickname;
    private String receiverName;
    private String receiverPhone;

    private String deliveryStatus;
    private Long finalAmount;

    private LocalDateTime createdAt;

    public static AdminDeliveryListResDto from(StoreOrderDeliveryEntity delivery) {
        return AdminDeliveryListResDto.builder()
                .deliveryId(delivery.getDeliveryId())
                .orderId(delivery.getOrder().getOrderId())
                .ordererNickname(delivery.getOrder().getMember().getNickname())
                .receiverName(delivery.getDeliveryReceiverName())
                .receiverPhone(delivery.getDeliveryReceiverPhone())
                .deliveryStatus(delivery.getDeliveryStatus().name())
                .finalAmount(delivery.getOrder().getOrderFinalAmount())
                .createdAt(delivery.getCreatedAt())
                .build();
    }
}