package com.kh.app.karte.dto.request;

import com.kh.app.karte.entity.ScoreCategory;
import com.kh.app.pet.entity.PetType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ScoreAvgReqDto {
    private Long breedId;
    private PetType petType;
}
