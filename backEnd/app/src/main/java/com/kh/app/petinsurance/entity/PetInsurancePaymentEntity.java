package com.kh.app.petinsurance.entity;

import com.kh.app.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "PET_INSURANCE_PAYMENT")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class PetInsurancePaymentEntity extends BaseEntity {

    //결제 내역 번호
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PAYMENT_ID")
    private Long paymentId;


    // 보험가입 신청 번호 참조
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "APPLICATION_ID", nullable = false)
    private PetInsuranceApplicationEntity application;

    //거래 식별값
    @Column(name = "KAKAO_PAY_TID", length = 200)
    private String kakaoPayTid;

    // 결제 상태
    @Enumerated(EnumType.STRING)
    @Column(name = "PAYMENT_STATUS", nullable = false, length = 30)
    private PetInsurancePaymentStatus paymentStatus;


    // 결제 금액
    @Column(name = "PAYMENT_AMOUNT", nullable = false)
    private Long paymentAmount;


    //결제처리일시
}
