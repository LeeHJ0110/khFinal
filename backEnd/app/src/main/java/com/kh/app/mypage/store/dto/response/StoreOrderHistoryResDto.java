package com.kh.app.mypage.store.dto.response;

import com.kh.app.store.entity.StoreOrderEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Getter
@Builder
public class StoreOrderHistoryResDto {

    private Long orderId;

    private String orderDate;

    private String orderStatus;

    private Long deliveryFee;

    private Long usedPoint;

    private Long finalAmount;

    private String receiverName;

    private String receiverPhone;

    private String zipCode;

    private String address;

    private String addressDetail;

    private String deliveryRequest;

    private Integer itemCount;

    private String firstProductName;

    private String firstProductImageUrl;

    private List<StoreOrderHistoryItemResDto> items;

    public static StoreOrderHistoryResDto from(
            StoreOrderEntity order,
            List<StoreOrderHistoryItemResDto> items
    ) {
        StoreOrderHistoryItemResDto firstItem =
                items.isEmpty() ? null : items.get(0);

        return StoreOrderHistoryResDto.builder()
                .orderId(order.getOrderId())
                .orderDate(
                        order.getCreatedAt() != null
                                ? order.getCreatedAt().format(
                                DateTimeFormatter.ofPattern("yyyy.MM.dd")
                        )
                                : null
                )
                .orderStatus(order.getOrderStatus().name())
                .deliveryFee(order.getOrderDeliveryFee())
                .usedPoint(order.getOrderUsedPoint())
                .finalAmount(order.getOrderFinalAmount())
                .receiverName(order.getOrderReceiverName())
                .receiverPhone(formatPhone(order.getOrderReceiverPhone()))
                .zipCode(order.getOrderZipCode())
                .address(order.getOrderAddress())
                .addressDetail(order.getOrderAddressDetail())
                .deliveryRequest(order.getOrderDeliveryRequest())
                .itemCount(items.size())
                .firstProductName(
                        firstItem != null
                                ? firstItem.getProductName()
                                : null
                )
                .firstProductImageUrl(
                        firstItem != null
                                ? firstItem.getImageUrl()
                                : null
                )
                .items(items)
                .build();
    }

    private static String formatPhone(String phone) {
        if (phone == null) {
            return null;
        }

        String onlyNumber = phone.replaceAll("[^0-9]", "");

        if (onlyNumber.length() == 11) {
            return onlyNumber.replaceFirst(
                    "(\\d{3})(\\d{4})(\\d{4})",
                    "$1-$2-$3"
            );
        }

        return phone;
    }


}