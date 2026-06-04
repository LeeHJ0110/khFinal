package com.kh.app.petinsurance.kakao.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class KakaoPaySubscriptionRespDto {

    private String aid;
    private String tid;
    private String cid;
    private String sid;

    private String partner_order_id;
    private String partner_user_id;

    private String payment_method_type;
    private String item_name;

    private Integer quantity;

    private Amount amount;

    private String created_at;
    private String approved_at;

    @Getter
    @NoArgsConstructor
    public static class Amount {

        private Long total;
        private Long tax_free;
        private Long vat;
        private Long point;
        private Long discount;
    }
}