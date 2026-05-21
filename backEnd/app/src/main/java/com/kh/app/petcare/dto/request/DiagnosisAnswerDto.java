package com.kh.app.petcare.dto.request;

import lombok.Getter;
import lombok.Setter;
//상세답변에 저장~
@Getter
@Setter
public class DiagnosisAnswerDto {
    //질문 번호
    private Long questionId;
    //사용자가 입력한 값
    private String answerValue;
}
