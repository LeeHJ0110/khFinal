package com.kh.app.store.dto.response;

import com.kh.app.store.entity.StoreProductNutritionEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StoreNutritionResDto {

    private Long nutritionId;

    private Long nutritionCalorie;

    private Long nutritionProtein;

    private Long nutritionFat;

    private Long nutritionFiber;

    private Long nutritionMoisture;

    private Long nutritionCalcium;

    private Long nutritionPhosphorus;

    public static StoreNutritionResDto from(StoreProductNutritionEntity entity) {
        return StoreNutritionResDto.builder()
                .nutritionId(entity.getNutritionId())
                .nutritionCalorie(entity.getNutritionCalorie())
                .nutritionProtein(entity.getNutritionProtein())
                .nutritionFat(entity.getNutritionFat())
                .nutritionFiber(entity.getNutritionFiber())
                .nutritionMoisture(entity.getNutritionMoisture())
                .nutritionCalcium(entity.getNutritionCalcium())
                .nutritionPhosphorus(entity.getNutritionPhosphorus())
                .build();
    }
}