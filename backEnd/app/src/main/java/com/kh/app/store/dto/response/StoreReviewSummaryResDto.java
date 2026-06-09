package com.kh.app.store.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StoreReviewSummaryResDto {

    private Long reviewCount;

    private Double averageRating;

    private Long rating5Count;
    private Long rating5Percent;

    private Long rating4Count;
    private Long rating4Percent;

    private Long rating3Count;
    private Long rating3Percent;

    private Long rating2Count;
    private Long rating2Percent;

    private Long rating1Count;
    private Long rating1Percent;

}