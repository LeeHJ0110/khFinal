package com.kh.app.petcare.entity;

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

    //승인여부
    @Column(name = "APPROVE_STATUS", length = 30)
    private String approveStatus;

    //진료확인서 원본
    @Column(name = "IMAGE_ORIGIN_NAME", length = 100)
    private String imageOriginName;

    //진료확인서 변경
    @Column(name = "IMAGE_CHANGED_NAME", length = 1000)
    private String imageChangedName;

    // 보험상품 참조
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PRODUCT_ID", nullable = false)
    private PetInsuranceProductEntity product;

    // 반려동물 참조
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PET_ID", nullable = false)
    private PetEntity pet;
}

