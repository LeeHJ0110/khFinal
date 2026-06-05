package com.kh.app.petinsurance.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PetInsuranceCalculateResDto {

    // 선택한 보험 상품 번호
    private Long productId;

    // 선택한 보험 상품 이름
    private String productName;

    // 입력한 생년월일
    private String birthDate;

    // 현재 날짜 기준 만 나이
    private int age;

    // 상품 테이블에 저장된 기본 월 보험료
    private Long baseMonthlyPrice;

    // 나이에 따라 추가된 금액
    private Long additionalPrice;

    // 최종 예상 월 보험료
    private Long monthlyPrice;
}