package com.kh.app.store.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StorePayReadyResDto {

    private Long orderId;
    private String partnerOrderId;
    private String nextRedirectPcUrl;
}