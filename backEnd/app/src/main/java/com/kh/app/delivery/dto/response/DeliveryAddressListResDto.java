package com.kh.app.delivery.dto.response;

import com.kh.app.delivery.entity.DeliveryAddressEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DeliveryAddressListResDto {

    private Long deliveryAddressId;

    private String name;

    private String receiverName;

    private String phone;

    private String zipCode;

    private String address;

    private String addressDetail;

    private String defaultYn;

    public static DeliveryAddressListResDto from(
            DeliveryAddressEntity deliveryAddress
    ) {

        return DeliveryAddressListResDto.builder()
                .deliveryAddressId(deliveryAddress.getId())
                .name(deliveryAddress.getName())
                .receiverName(deliveryAddress.getReceiverName())
                .phone(deliveryAddress.getPhone())
                .zipCode(deliveryAddress.getZipCode())
                .address(deliveryAddress.getAddress())
                .addressDetail(deliveryAddress.getAddressDetail())
                .defaultYn(
                        deliveryAddress.getDefaultYn().name()
                )
                .build();
    }
}