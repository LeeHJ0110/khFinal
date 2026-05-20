package com.kh.app.store.entity;

import com.kh.app.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "PRODUCT_NUTRITION")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class StoreProductNutritionEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "NUTRITION_ID")
    private Long nutritionId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PRODUCT_ID", nullable = false, unique = true)
    private StoreProductEntity product;

    // 칼로리, 예: 365 kcal
    @Column(name = "NUTRITION_CALORIE")
    private Long nutritionCalorie;

    // 단백질, 예: 25%
    @Column(name = "NUTRITION_PROTEIN")
    private Long nutritionProtein;

    // 지방, 예: 14%
    @Column(name = "NUTRITION_FAT")
    private Long nutritionFat;

    // 식이섬유, 예: 4%
    @Column(name = "NUTRITION_FIBER")
    private Long nutritionFiber;

    // 수분, 예: 7%
    @Column(name = "NUTRITION_MOISTURE")
    private Long nutritionMoisture;

    // 칼슘, 예: 2%
    @Column(name = "NUTRITION_CALCIUM")
    private Long nutritionCalcium;

    // 인, 예: 1%
    @Column(name = "NUTRITION_PHOSPHORUS")
    private Long nutritionPhosphorus;

    public void update(
            Long nutritionCalorie,
            Long nutritionProtein,
            Long nutritionFat,
            Long nutritionFiber,
            Long nutritionMoisture,
            Long nutritionCalcium,
            Long nutritionPhosphorus
    ) {
        this.nutritionCalorie = nutritionCalorie;
        this.nutritionProtein = nutritionProtein;
        this.nutritionFat = nutritionFat;
        this.nutritionFiber = nutritionFiber;
        this.nutritionMoisture = nutritionMoisture;
        this.nutritionCalcium = nutritionCalcium;
        this.nutritionPhosphorus = nutritionPhosphorus;
    }
}