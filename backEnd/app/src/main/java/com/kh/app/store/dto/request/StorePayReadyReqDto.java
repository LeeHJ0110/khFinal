package com.kh.app.store.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
//배송지 ID와 요청사항을 받는
public class StorePayReadyReqDto {

    private Long deliveryAddressId;

    private String deliveryRequest;
}