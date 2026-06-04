package com.kh.app.petinsurance.entity;

import com.kh.app.common.entity.BaseEntity;
import com.kh.app.pet.entity.PetEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "PET_INSURANCE_APPLICATION")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class PetInsuranceApplicationEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "APPLICATION_ID")
    private Long applicationId;

    // 보험 가입 승인 상태
    @Enumerated(EnumType.STRING)
    @Column(name = "APPROVE_STATUS", nullable = false, length = 30)
    private PetInsuranceApproveStatus approveStatus;

    // 최초 결제 준비 단계에서 임시로 저장하는 거래 식별번호
    @Column(name = "KAKAO_PAY_TID", length = 200)
    private String kakaoPayTid;

    // 정기결제 식별번호
    @Column(name = "KAKAO_PAY_SID", length = 200)
    private String kakaoPaySid;

    // 진료확인서 원본 파일명
    @Column(name = "IMAGE_ORIGIN_NAME", length = 100)
    private String imageOriginName;

    // 진료확인서 S3 저장 경로
    @Column(name = "IMAGE_CHANGED_NAME", length = 1000)
    private String imageChangedName;

    // 보험 상품 참조
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PRODUCT_ID", nullable = false)
    private PetInsuranceProductEntity product;

    // 반려동물 참조
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PET_ID", nullable = false)
    private PetEntity pet;

    public void updateKakaoPayTid(String kakaoPayTid) {
        this.kakaoPayTid = kakaoPayTid;
    }

    public void updateKakaoPaySid(String kakaoPaySid) {
        this.kakaoPaySid = kakaoPaySid;
    }

    public void approve() {
        this.approveStatus = PetInsuranceApproveStatus.APPROVED;
    }

    public void reject() {
        this.approveStatus = PetInsuranceApproveStatus.REJECTED;
    }
}