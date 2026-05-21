package com.kh.app.petcare.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PetCareReqDto {

    //전체요청 받음
    //어떤 반려 동물인지
    private Long petId;

    //사용자가 작성한 답변
    private List<DiagnosisAnswerDto> answerList;
}
