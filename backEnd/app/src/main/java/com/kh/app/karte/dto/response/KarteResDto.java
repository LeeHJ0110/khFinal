package com.kh.app.karte.dto.response;

import com.kh.app.karte.entity.KarteEntity;
import com.kh.app.karte.entity.ScoreEntity;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.pet.entity.PetEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class KarteResDto {
    private PetEntity pet;
    private String writer;
    private LocalDateTime createdAt;
    private List<ScoreResDto> scores;
    private String summary;
    private String opinion;
    public static KarteResDto from(KarteEntity karte, PetEntity pet, List<ScoreResDto> scores){
        return KarteResDto.builder()
                .pet(pet)
                .writer(karte.getMember().getNickname())
                .scores(scores)
                .summary(karte.getSummary())
                .opinion(karte.getOpinion())
                .createdAt(karte.getCreatedAt())
                .build();
    }
}
