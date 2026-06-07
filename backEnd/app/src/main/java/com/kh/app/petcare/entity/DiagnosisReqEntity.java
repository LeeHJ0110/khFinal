package com.kh.app.petcare.entity;

import com.kh.app.common.entity.BaseEntity;
import com.kh.app.common.entity.DelYn;
import com.kh.app.pet.entity.PetEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.Collection;
import java.util.List;

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

    //상세조회에서 신청 1건에 연결된 답변들을 전부 가져오려고 추가
    @OneToMany(
            mappedBy = "diagnosisReq",
            fetch = FetchType.LAZY
    )
    private List<SelfDiagnosisAnswerEntity> answerList;

    // 진행 중 상태 해제
    public void closeDiagnosis() {
        this.diagnosisReqStatus = DelYn.N;
    }


}
