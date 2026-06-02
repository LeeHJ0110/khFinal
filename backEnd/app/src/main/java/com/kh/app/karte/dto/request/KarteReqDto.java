package com.kh.app.karte.dto.request;

import com.kh.app.karte.entity.KarteEntity;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.petcare.entity.DiagnosisReqEntity;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class KarteReqDto {
    private Long diaReqId;
    private String summary;
    private String opinion;

    private List<ScoreReqDto> scores;

    public KarteEntity toEntity(MemberEntity writer, DiagnosisReqEntity diagEntity){
        return KarteEntity.builder()
                .member(writer)
                .diaReq(diagEntity)
                .summary(summary)
                .opinion(opinion)
                .build();
    }
}
