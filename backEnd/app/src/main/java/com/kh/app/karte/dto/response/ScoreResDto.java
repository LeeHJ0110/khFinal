package com.kh.app.karte.dto.response;

import com.kh.app.karte.entity.KarteEntity;
import com.kh.app.karte.entity.ScoreCategory;
import com.kh.app.karte.entity.ScoreEntity;
import com.kh.app.pet.entity.PetEntity;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ScoreResDto {
    private ScoreCategory category;
    private Long score;
    public static ScoreResDto from(ScoreEntity entity){
        return ScoreResDto.builder()
                .category(entity.getCategory())
                .score(entity.getScore())
                .build();
    }
}
