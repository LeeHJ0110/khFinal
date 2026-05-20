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

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PRODUCT_ID", nullable = false, unique = true)
    private StoreProductEntity product;

    @Column(name = "FEEDING_MIN_WEIGHT")
    private Double feedingMinWeight;

    @Column(name = "FEEDING_MAX_WEIGHT")
    private Double feedingMaxWeight;

    @Column(name = "FEEDING_DAILY_AMOUNT")
    private Double feedingDailyAmount;

    @Column(name = "FEEDING_UNIT", length = 10)
    private String feedingUnit;

    @Column(name = "FEEDING_NOTE", length = 500)
    private String feedingNote;

    public void update(
            Double feedingMinWeight,
            Double feedingMaxWeight,
            Double feedingDailyAmount,
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