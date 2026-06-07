package com.kh.app.petinsurance.dto.response;

import com.kh.app.petinsurance.entity.PetInsurancePaymentStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PetInsurancePaymentHistoryResDto {

    // 결제 이력 번호
    private Long paymentId;

    // 보험 신청 번호
    private Long applicationId;

    // 반려동물 이름
    private String petName;

    // 보험 상품 이름
    private String productName;

    // 실제 결제 금액
    private Long paymentAmount;

    // SUCCESS, FAIL, CANCEL
    private PetInsurancePaymentStatus paymentStatus;

    // 결제 일시
    private LocalDateTime paidAt;
}