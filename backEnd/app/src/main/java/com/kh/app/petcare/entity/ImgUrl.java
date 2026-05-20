package com.kh.app.petcare.entity;

import com.kh.app.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "IMG_URL")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ImgUrl extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IMG_URL_ID")
    private Long imgUrlId;

    // 카테고리 (눈, 피부, 치아 등)
    @Column(name = "IMG_CATEGORY", nullable = false, length = 100)
    private String imgCategory;

    // 진단신청 참조
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DIAGNOSIS_REQ_ID", nullable = false)
    private DiagnosisReqEntity diagnosisReq;

    // 원본 파일명
    @Column(name = "IMAGE_ORIGIN_NAME", nullable = false, length = 100)
    private String imageOriginName;

    // 변경 파일명(S3 저장명 등)
    @Column(name = "IMAGE_CHANGED_NAME", nullable = false, length = 1000)
    private String imageChangedName;
}
