package com.kh.app.store.dto.request;

import com.kh.app.store.entity.StoreProductCategory;
import com.kh.app.store.entity.StoreProductEntity;
import com.kh.app.store.entity.StoreProductTagEntity;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class StoreInsertReqDto {

    private String productName;

    private StoreProductCategory productCategory;

    private Long tagId;

    private String productTargetPetType;

    private Long productPrice;

    private String productSummary;

    private String productDescription;

    private String productSaleYn;

    private List<StoreFeedingGuideInsertReqDto> feedingGuideList;

    private StoreNutritionInsertReqDto nutrition;

    public StoreProductEntity toEntity(StoreProductTagEntity tagEntity) {
        return StoreProductEntity.builder()
                .productName(productName)
                .productCategory(productCategory)
                .productTag(tagEntity)
                .productTargetPetType(productTargetPetType)
                .productPrice(productPrice)
                .productSummary(productSummary)
                .productDescription(productDescription)
                .productSaleYn(productSaleYn == null ? "Y" : productSaleYn)
                .build();
    }
}