package com.kh.app.store.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StoreReviewUpdateReqDto {

    private String reviewTitle;

    private String reviewContent;

    private Long reviewRating;

}