package com.kh.app.petcare.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class DiagnosisResDto {
    //조회 결과 화면에 보여줄 데이터
    //진단 신청 번호
    private Long diagnosisReqId;

    private String petName;
    //진행 상태
    private String status;

    private LocalDateTime createdAt;
}
