package com.kh.app.store.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class StorePetFeedingRecommendResDto {

    // 반려동물 번호
    private Long petId;

    // 반려동물 이름
    private String petName;

    // 반려동물 타입
    // 예: D, C 또는 DOG, CAT
    private String petType;

    // 품종명
    private String breedName;

    // 몸무게
    private BigDecimal petWeight;

    // 반려동물 이미지 URL
    // 지금은 펫 이미지 로직이 없으므로 null로 내려줌!, 나중에 이 필드에 값만 넣으면 됨
    private String petImageUrl;

    // 이 반려동물 몸무게에 매칭된 급여기준
    private StoreFeedingGuideResDto matchedFeedingGuide;

    // 화면 표시용 문구
    // 예: 1일 80g
    private String dailyAmountText;
}