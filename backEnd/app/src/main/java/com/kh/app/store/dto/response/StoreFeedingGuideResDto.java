package com.kh.app.store.dto.response;

import com.kh.app.store.entity.StoreProductFeedingGuideEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StoreFeedingGuideResDto {

    private Long feedingGuideId;

    private Long feedingMinWeight;

    private Long feedingMaxWeight;

    private Long feedingDailyAmount;

    private String feedingUnit;

    private String feedingNote;

    public static StoreFeedingGuideResDto from(StoreProductFeedingGuideEntity entity) {
        return StoreFeedingGuideResDto.builder()
                .feedingGuideId(entity.getFeedingGuideId())
                .feedingMinWeight(entity.getFeedingMinWeight())
                .feedingMaxWeight(entity.getFeedingMaxWeight())
                .feedingDailyAmount(entity.getFeedingDailyAmount())
                .feedingUnit(entity.getFeedingUnit())
                .feedingNote(entity.getFeedingNote())
                .build();
    }
}