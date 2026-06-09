package com.kh.app.store.dto.response;

import lombok.Builder;
import lombok.Getter;
import org.springframework.data.domain.Page;

@Getter
@Builder
public class StoreProductReviewResDto {

    private StoreReviewSummaryResDto summary;

    private Page<StoreReviewListResDto> reviewPage;

}