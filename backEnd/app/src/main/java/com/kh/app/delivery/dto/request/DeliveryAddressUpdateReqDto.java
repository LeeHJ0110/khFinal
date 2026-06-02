package com.kh.app.delivery.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeliveryAddressUpdateReqDto {

    private String name;

    private String receiverName;

    private String phone;

    private String zipCode;

    private String address;

    private String addressDetail;

}