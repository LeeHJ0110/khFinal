package com.kh.app.store.entity;

import com.kh.app.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "PRODUCT_FEEDING_GUIDE")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class StoreProductFeedingGuideEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FEEDING_GUIDE_ID")
    private Long feedingGuideId;

    //여러개의 (최대 3개) 급여기준이 한개의 상품에 배당
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PRODUCT_ID", nullable = false)
    private StoreProductEntity product;

    @Column(name = "FEEDING_MIN_WEIGHT")
    private Long feedingMinWeight;

    @Column(name = "FEEDING_MAX_WEIGHT")
    private Long feedingMaxWeight;

    @Column(name = "FEEDING_DAILY_AMOUNT")
    private Long feedingDailyAmount;

    @Column(name = "FEEDING_UNIT", length = 10)
    private String feedingUnit;

    @Column(name = "FEEDING_NOTE", length = 500)
    private String feedingNote;

    public void update(
            Long feedingMinWeight,
            Long feedingMaxWeight,
            Long feedingDailyAmount,
            String feedingUnit,
            String feedingNote
    ) {
        this.feedingMinWeight = feedingMinWeight;
        this.feedingMaxWeight = feedingMaxWeight;
        this.feedingDailyAmount = feedingDailyAmount;
        this.feedingUnit = feedingUnit;
        this.feedingNote = feedingNote;
    }
}