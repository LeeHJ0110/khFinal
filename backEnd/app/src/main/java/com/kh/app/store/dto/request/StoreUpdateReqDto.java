package com.kh.app.store.dto.request;

import com.kh.app.store.entity.StoreProductCategory;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class StoreUpdateReqDto {

    // 기본 정보
    private String productName;

    private StoreProductCategory productCategory;

    private Long tagId;

    private String productTargetPetType;

    private Long productPrice;

    // 급여 기준
    private List<StoreFeedingGuideInsertReqDto> feedingGuideList;

    // 영양 성분
    private StoreNutritionInsertReqDto nutrition;
}