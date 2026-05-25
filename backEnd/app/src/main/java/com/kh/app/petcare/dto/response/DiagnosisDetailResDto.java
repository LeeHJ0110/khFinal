package com.kh.app.petcare.dto.response;

import com.kh.app.common.entity.DelYn;
import com.kh.app.petcare.dto.request.DiagnosisAnswerDto;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder

public class DiagnosisDetailResDto {

    // 진단 신청 번호
    private Long diagnosisReqId;

    // 펫 번호
    private Long petId;

    // 진행 상태
    private DelYn diagnosisReqStatus;

    // 신청일
    private LocalDateTime createdAt;

    // 답변 목록
    private List<DiagnosisAnswerDto> answerList;
}

