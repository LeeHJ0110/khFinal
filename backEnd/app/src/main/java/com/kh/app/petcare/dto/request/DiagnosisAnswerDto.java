package com.kh.app.petcare.dto.request;

import com.kh.app.petcare.entity.QuestionCategory;
import lombok.Getter;
import lombok.Setter;
//상세답변에 저장~
@Getter
@Setter
public class DiagnosisAnswerDto {
    //질문 번호
    private Long questionId;
    //질문 카테고리
    private QuestionCategory questionCategory;

    //질문내용
    private String questionContent;
    //사용자가 입력한 값
    private String answerValue;
}
