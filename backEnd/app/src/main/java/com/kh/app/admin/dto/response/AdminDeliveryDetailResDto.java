package com.kh.app.admin.dto.response;

import com.kh.app.store.entity.StoreOrderDeliveryEntity;
import com.kh.app.store.entity.StoreOrderItemEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class AdminDeliveryDetailResDto {

    private Long deliveryId;
    private Long orderId;

    private String ordererNickname;

    private String receiverName;
    private String receiverPhone;
    private String zipCode;
    private String address;
    private String addressDetail;
    private String requestMemo;

    private String deliveryStatus;
    private String deliveryCompanyName;
    private String deliveryTrackingNumber;

    private Long deliveryFee;
    private Long usedPoint;
    private Long finalAmount;

    private LocalDateTime createdAt;

    private List<AdminDeliveryItemResDto> items;

    public static AdminDeliveryDetailResDto from(
            StoreOrderDeliveryEntity delivery,
            List<StoreOrderItemEntity> orderItems
    ) {
        return AdminDeliveryDetailResDto.builder()
                .deliveryId(delivery.getDeliveryId())
                .orderId(delivery.getOrder().getOrderId())
                .ordererNickname(delivery.getOrder().getMember().getNickname())
                .receiverName(delivery.getDeliveryReceiverName())
                .receiverPhone(delivery.getDeliveryReceiverPhone())
                .zipCode(delivery.getDeliveryZipCode())
                .address(delivery.getDeliveryAddress())
                .addressDetail(delivery.getDeliveryAddressDetail())
                .requestMemo(delivery.getDeliveryRequestMemo())
                .deliveryStatus(delivery.getDeliveryStatus().name())
                .deliveryCompanyName(delivery.getDeliveryCompanyName())
                .deliveryTrackingNumber(delivery.getDeliveryTrackingNumber())
                .deliveryFee(delivery.getOrder().getOrderDeliveryFee())
                .usedPoint(delivery.getOrder().getOrderUsedPoint())
                .finalAmount(delivery.getOrder().getOrderFinalAmount())
                .createdAt(delivery.getCreatedAt())
                .items(orderItems.stream()
                        .map(AdminDeliveryItemResDto::from)
                        .toList())
                .build();
    }
}