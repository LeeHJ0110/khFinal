package com.kh.app.store.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StoreDirectPayReadyReqDto {

    private Long productId;

    private Integer qty;

    private Long deliveryAddressId;

    private String deliveryRequest;

    private Long usedPoint;
}