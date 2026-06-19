package com.kh.app.petcare.exception;

import com.kh.app.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum PetCareErrorCode implements ErrorCode {

    PET_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "SY001",
            "반려동물을 찾을 수 없습니다."
    ),

    DIAGNOSIS_ALREADY_IN_PROGRESS(
            HttpStatus.BAD_REQUEST,
            "SY002",
            "이미 진행 중인 건강 진단 신청이 있습니다."
    ),

    POINT_NOT_ENOUGH(
            HttpStatus.BAD_REQUEST,
            "SY003",
            "포인트가 부족합니다."
    );

    private final HttpStatus status;
    private final String code;
    private final String msg;
}