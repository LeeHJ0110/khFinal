package com.kh.app.petcare.entity;

import com.kh.app.common.entity.BaseEntity;
import com.kh.app.common.entity.DelYn;
import com.kh.app.pet.entity.PetEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "DIAGNOSIS_REQ")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class DiagnosisReqEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long diagnosisReqId;

    //신청상태
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "DIAGNOSIS_REQ_STATUS", nullable = false, length = 1)
    private DelYn diagnosisReqStatus = DelYn.Y;


    //펫 번호(참조)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PET_ID", nullable = false)
    private PetEntity petEntity;
}
