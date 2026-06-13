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

    /*
     * 카카오페이 결제수단 등록까지 완료되어
     * 실제 심사 대기 또는 가입 완료 상태인지 여부
     *
     * WAITING + SID 있음  -> true
     * APPROVED           -> true
     * WAITING + SID 없음  -> false
     * 신청 내역 없음       -> false
     */
    private boolean insuranceInProgress;

    /*
     * 신청 데이터는 생성됐지만
     * 카카오페이 결제수단 등록이 아직 완료되지 않은 상태인지 여부
     *
     * WAITING + SID 없음 -> true
     */
    private boolean paymentRegistrationRequired;

    /*
     * 카카오페이 결제수단 등록 완료 여부
     *
     * SID 있음 -> true
     */
    private boolean paymentMethodRegistered;

    // 보험 신청 번호
    // 신청 내역이 없으면 null
    private Long applicationId;

    // WAITING: 심사 대기
    // APPROVED: 가입 완료
    // 신청 내역이 없으면 null
    private PetInsuranceApproveStatus approveStatus;

    // =========================================================
    // 실제 신청한 보험 상품 정보
    // 신청 내역이 없으면 null
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

        boolean paymentMethodRegistered =
                hasApplication
                        && application.getKakaoPaySid() != null
                        && !application.getKakaoPaySid().isBlank();

        boolean paymentRegistrationRequired =
                hasApplication
                        && application.getApproveStatus()
                        == PetInsuranceApproveStatus.WAITING
                        && !paymentMethodRegistered;

        boolean insuranceInProgress =
                hasApplication
                        && (
                        application.getApproveStatus()
                                == PetInsuranceApproveStatus.APPROVED
                                || paymentMethodRegistered
                );

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
                        insuranceInProgress
                )
                .paymentRegistrationRequired(
                        paymentRegistrationRequired
                )
                .paymentMethodRegistered(
                        paymentMethodRegistered
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