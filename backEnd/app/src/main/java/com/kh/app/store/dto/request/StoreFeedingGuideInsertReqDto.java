package com.kh.app.store.dto.request;

import com.kh.app.store.entity.StoreProductEntity;
import com.kh.app.store.entity.StoreProductFeedingGuideEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StoreFeedingGuideInsertReqDto {

    private Long feedingMinWeight;

    private Long feedingMaxWeight;

    private Long feedingDailyAmount;

    private String feedingUnit;

    private String feedingNote;

    public StoreProductFeedingGuideEntity toEntity(StoreProductEntity productEntity) {
        return StoreProductFeedingGuideEntity.builder()
                .product(productEntity)
                .feedingMinWeight(feedingMinWeight)
                .feedingMaxWeight(feedingMaxWeight)
                .feedingDailyAmount(feedingDailyAmount)
                .feedingUnit(feedingUnit)
                .feedingNote(feedingNote)
                .build();
    }
}