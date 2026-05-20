package com.kh.app.petcare.entity;

import com.kh.app.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "SELF_DIAGNOSIS_ANSWER")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class SelfDiagnosisAnswerEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long answerId;

    // 질문번호 자가진단 참조
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "QUESTION_ID", nullable = false)
    private SelfDiagnosisQuestionEntity question;

    // 진단신청번호 진단신청 참조
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DIAGNOSIS_REQ_ID", nullable = false)
    private DiagnosisReqEntity diagnosisReq;

    // 답변값
    @Column(name = "ANSWER_VALUE", length = 1000)
    private String answerValue;
}
