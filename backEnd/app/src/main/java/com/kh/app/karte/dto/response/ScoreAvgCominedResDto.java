package com.kh.app.karte.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ScoreAvgCominedResDto {
    private List<ScoreResDto> breedAvgList;   // 선택한 품종(Breed)의 카테고리별 평균
    private List<ScoreResDto> petTypeAvgList; // 선택한 동물 종류(PetType)의 카테고리별 평균
}
