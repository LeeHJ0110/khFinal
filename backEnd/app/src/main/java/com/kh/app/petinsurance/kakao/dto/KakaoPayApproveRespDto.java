package com.kh.app.petinsurance.kakao.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class KakaoPayApproveRespDto {

    // 카카오페이 결제 승인 번호
    private String aid;

    // 카카오페이 거래 식별번호
    private String tid;

    // 정기결제 식별번호
    private String sid;

    // 가맹점 코드
    private String cid;

    // 가맹점 주문번호
    private String partner_order_id;

    // 가맹점 회원 식별값
    private String partner_user_id;

    // 결제 수단
    private String payment_method_type;

    // 상품명
    private String item_name;

    // 결제 승인 시각
    private String approved_at;
}
