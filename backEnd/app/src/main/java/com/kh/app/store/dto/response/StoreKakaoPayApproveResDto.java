package com.kh.app.store.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class StoreKakaoPayApproveResDto {

    private String aid;
    private String tid;
    private String cid;

    @JsonProperty("partner_order_id")
    private String partnerOrderId;

    @JsonProperty("partner_user_id")
    private String partnerUserId;

    @JsonProperty("payment_method_type")
    private String paymentMethodType;

    @JsonProperty("item_name")
    private String itemName;

    private Integer quantity;

    private StoreKakaoPayAmountDto amount;

    @JsonProperty("created_at")
    private String createdAt;

    @JsonProperty("approved_at")
    private String approvedAt;
}