package com.kh.app.petinsurance.dto.response;

import com.kh.app.pet.entity.PetEntity;
import com.kh.app.petinsurance.entity.PetInsuranceApplicationEntity;
import com.kh.app.petinsurance.entity.PetInsuranceApproveStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PetInsurancePetResDto {

    // =========================================================
    // 반려동물 기본 정보
    // =========================================================
    private Long petId;
    private String petName;

    // 저장된 생년월일
    // 프론트에서 만 나이 계산 및 보험료 표시 용도로 사용
    private String birthDate;

    // =========================================================
    // 현재 활성 상태의 보험 신청 또는 가입 정보
    // =========================================================

    // 진행 중이거나 가입 완료된 보험이 있는지 여부
    private boolean insuranceInProgress;

    // 보험 신청 번호
    // 보험 신청 내역이 없으면 null
    private Long applicationId;

    // WAITING: 신청 중
    // APPROVED: 가입 완료
    // 보험 신청 내역이 없으면 null
    private PetInsuranceApproveStatus approveStatus;

    // =========================================================
    // 실제 신청한 보험 상품 정보
    // 보험 신청 내역이 없으면 null
    // =========================================================
    private Long insuranceProductId;
    private String insuranceProductName;

    // 신청 당시 확정된 월 보험료
    // 상품 기본 가격 + 연령 가산금
    private Long insuranceProductMonthly;

    // =========================================================
    // Entity → DTO 변환
    // =========================================================
    public static PetInsurancePetResDto from(
            PetEntity pet,
            PetInsuranceApplicationEntity application
    ) {

        boolean hasApplication =
                application != null;

        return PetInsurancePetResDto.builder()
                .petId(
                        pet.getId()
                )
                .petName(
                        pet.getName()
                )
                .birthDate(
                        pet.getBirthDate()
                )
                .insuranceInProgress(
                        hasApplication
                )
                .applicationId(
                        hasApplication
                                ? application.getApplicationId()
                                : null
                )
                .approveStatus(
                        hasApplication
                                ? application.getApproveStatus()
                                : null
                )
                .insuranceProductId(
                        hasApplication
                                ? application.getProduct()
                                .getProductId()
                                : null
                )
                .insuranceProductName(
                        hasApplication
                                ? application.getProduct()
                                .getProductName()
                                : null
                )
                .insuranceProductMonthly(
                        hasApplication
                                ? application.getMonthlyPrice()
                                : null
                )
                .build();
    }
}