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

    @Column(name = "NUTRITION_CALORIE")
    private Double nutritionCalorie;

    @Column(name = "NUTRITION_PROTEIN")
    private Double nutritionProtein;

    @Column(name = "NUTRITION_FAT")
    private Double nutritionFat;

    @Column(name = "NUTRITION_FIBER")
    private Double nutritionFiber;

    @Column(name = "NUTRITION_MOISTURE")
    private Double nutritionMoisture;

    @Column(name = "NUTRITION_CALCIUM")
    private Double nutritionCalcium;

    @Column(name = "NUTRITION_PHOSPHORUS")
    private Double nutritionPhosphorus;

    public void update(
            Double nutritionCalorie,
            Double nutritionProtein,
            Double nutritionFat,
            Double nutritionFiber,
            Double nutritionMoisture,
            Double nutritionCalcium,
            Double nutritionPhosphorus
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