package com.kh.app.store.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class StoreKakaoPayAmountDto {

    private Integer total;

    @JsonProperty("tax_free")
    private Integer taxFree;

    private Integer vat;
    private Integer point;
    private Integer discount;

    @JsonProperty("green_deposit")
    private Integer greenDeposit;
}