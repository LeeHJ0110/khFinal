package com.kh.app.store.dto.request;

import com.kh.app.store.entity.StoreProductEntity;
import com.kh.app.store.entity.StoreProductNutritionEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StoreNutritionInsertReqDto {

    private Long nutritionCalorie;

    private Long nutritionProtein;

    private Long nutritionFat;

    private Long nutritionFiber;

    private Long nutritionMoisture;

    private Long nutritionCalcium;

    private Long nutritionPhosphorus;

    public StoreProductNutritionEntity toEntity(StoreProductEntity productEntity) {
        return StoreProductNutritionEntity.builder()
                .product(productEntity)
                .nutritionCalorie(nutritionCalorie)
                .nutritionProtein(nutritionProtein)
                .nutritionFat(nutritionFat)
                .nutritionFiber(nutritionFiber)
                .nutritionMoisture(nutritionMoisture)
                .nutritionCalcium(nutritionCalcium)
                .nutritionPhosphorus(nutritionPhosphorus)
                .build();
    }
}