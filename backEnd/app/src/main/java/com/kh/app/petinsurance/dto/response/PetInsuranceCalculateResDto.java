package com.kh.app.petinsurance.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PetInsuranceCalculateResDto {

    private Long productId;
    private String productName;

    private String birthDate;
    private int age;

    private Long baseMonthlyPrice;
    private Long additionalPrice;
    private Long monthlyPrice;
}