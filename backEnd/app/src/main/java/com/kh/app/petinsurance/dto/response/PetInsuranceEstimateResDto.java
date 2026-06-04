package com.kh.app.petinsurance.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class PetInsuranceEstimateResDto {
    // 반려동물 정보
    private Long petId;
    private String petName;
    private int petAge;

    // 가입 가능 여부
    private boolean available;
    private String message;

    // 가입 가능한 보험 상품
    private List<ProductInfo> products;

    @Getter
    @Builder
    public static class ProductInfo {

        private Long productId;
        private String productName;
        private Long productMonthly;
    }
}
