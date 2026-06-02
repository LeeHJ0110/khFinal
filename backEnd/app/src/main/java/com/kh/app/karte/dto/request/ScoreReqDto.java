package com.kh.app.karte.dto.request;

import com.kh.app.karte.entity.KarteEntity;
import com.kh.app.karte.entity.ScoreCategory;
import com.kh.app.karte.entity.ScoreEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ScoreReqDto {
    private ScoreCategory category;
    private Long score;

    public ScoreEntity toEntity(KarteEntity karte){
        return ScoreEntity.builder()
                .score(score)
                .category(category)
                .karte(karte)
                .build();
    }
}
