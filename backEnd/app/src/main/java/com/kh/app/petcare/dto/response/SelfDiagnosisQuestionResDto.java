package com.kh.app.petcare.dto.response;

import com.kh.app.petcare.entity.SelfDiagnosisQuestionEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SelfDiagnosisQuestionResDto {

    private Long questionId;
    private String questionContent;
    private String questionCategory;
    private String questionType;

    public static SelfDiagnosisQuestionResDto from(
            SelfDiagnosisQuestionEntity entity
    ) {

        return SelfDiagnosisQuestionResDto.builder()
                .questionId(entity.getQuestionId())
                .questionContent(entity.getQuestionContent())
                .questionCategory(
                        entity.getQuestionCategory().name()
                )
                .questionType(
                        entity.getQuestionType().name()
                )
                .build();
    }
}