package com.kh.app.petinsurance.entity;

import com.kh.app.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "PET_INSURANCE_PRODUCT")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class PetInsuranceProductEntity extends BaseEntity {

    //상품번호
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PRODUCT_ID")
    private Long productId;

    //상품이름
    @Column(name = "PRODUCT_NAME", length = 100)
    private String productName;

    //월보험료
    @Column(name = "PRODUCT_MONTHLY")
    private Long productMonthly;

    //보장내용
    @Column(name = "PRODUCT_CONTENT", length = 2000)
    private String productContent;
}

