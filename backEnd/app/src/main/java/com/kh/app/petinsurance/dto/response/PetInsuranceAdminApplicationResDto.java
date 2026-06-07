package com.kh.app.petinsurance.dto.response;

import com.kh.app.petinsurance.entity.PetInsuranceApproveStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
//관리자 목록 dto
@Getter
@Builder
public class PetInsuranceAdminApplicationResDto {

    // 보험 신청 번호
    private Long applicationId;

    // 신청자 닉네임
    private String memberNickname;

    // 반려동물 정보
    private Long petId;
    private String petName;

    // 가입 상품 정보
    private Long productId;
    private String productName;
    private Long productMonthly;

    // 진료확인서 파일 URL
    private String medicalCertificateUrl;

    // 신청 상태
    private PetInsuranceApproveStatus approveStatus;

    // 신청일
    private LocalDateTime createdAt;
}
