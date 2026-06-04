package com.kh.app.store.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class StoreCartListResDto {

    // 장바구니 상품 목록
    private List<StoreCartItemResDto> cartItemList;

    // 총 상품금액
    private Long totalProductAmount;

    // 배송비
    private Long orderDeliveryFee;

    // 최종 주문금액
    private Long finalOrderAmount;

    // 장바구니 상품 종류 개수
    private Integer cartItemCount;
}