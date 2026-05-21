package com.kh.app.petcare.entity;

import com.kh.app.pet.entity.PetType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "SELF_DIAGNOSIS_QUESTION")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class SelfDiagnosisQuestionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "QUESTION_ID")
    private Long questionId;

    // 대상 동물 (강아지 / 고양이)
    @Enumerated(EnumType.STRING)
    @Column(name = "PET_TYPE", nullable = false, length = 1)
    private PetType petType;

    // 질문 카테고리
    @Enumerated(EnumType.STRING)
    @Column(name = "QUESTION_CATEGORY", nullable = false, length = 50)
    private QuestionCategory questionCategory;

    // 질문 내용
    @Column(name = "QUESTION_CONTENT", nullable = false, length = 500)
    private String questionContent;

    // 질문 타입
    @Enumerated(EnumType.STRING)
    @Column(name = "QUESTION_TYPE", nullable = false, length = 20)
    private QuestionType questionType;

}
