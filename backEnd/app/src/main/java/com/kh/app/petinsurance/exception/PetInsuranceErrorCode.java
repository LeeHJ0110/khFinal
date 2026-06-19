package com.kh.app.petinsurance.exception;

import com.kh.app.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum PetInsuranceErrorCode implements ErrorCode {

    INSURANCE_ALREADY_IN_PROGRESS(
            HttpStatus.BAD_REQUEST,
            "SY100",
            "이미 진행 중인 보험 가입 신청이 있습니다."
    ),

    MEDICAL_CERTIFICATE_REQUIRED(
            HttpStatus.BAD_REQUEST,
            "SY101",
            "진료확인서를 첨부해 주세요."
    ),

    PAYMENT_READY_FAILED(
            HttpStatus.BAD_GATEWAY,
            "SY102",
            "정기 결제 수단 등록 준비에 실패했습니다."
    ),

    PAYMENT_APPROVE_FAILED(
            HttpStatus.BAD_GATEWAY,
            "SY103",
            "결제수단 등록 승인 처리에 실패했습니다."
    );

    private final HttpStatus status;
    private final String code;
    private final String msg;
}