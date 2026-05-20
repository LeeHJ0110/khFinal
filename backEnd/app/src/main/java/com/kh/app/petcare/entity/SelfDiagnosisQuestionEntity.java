package com.kh.app.petcare.entity;

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
    private Long questionId;

    @Column(name = "QUESTION_CATEGORY", nullable = false, length = 100)
    private String questionCategory;

    @Column(name = "QUESTION_CONTENT", nullable = false, length = 500)
    private String questionContent;

    @Column(name = "QUESTION_TYPE", nullable = false, length = 20)
    private String questionType;

}
