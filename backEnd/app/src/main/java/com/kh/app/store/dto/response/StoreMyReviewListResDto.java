package com.kh.app.store.dto.response;

import com.kh.app.store.entity.StoreReviewEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Getter
@Builder
public class StoreMyReviewListResDto {

    private Long reviewId;

    private Long productId;
    private String productName;
    private String productMainImageUrl;

    private String reviewTitle;
    private String reviewContent;
    private Long reviewRating;

    private String createdAt;

    private List<String> reviewImageUrlList;

    public static StoreMyReviewListResDto from(
            StoreReviewEntity review,
            String productMainImageUrl,
            List<String> reviewImageUrlList
    ) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");

        return StoreMyReviewListResDto.builder()
                .reviewId(review.getReviewId())

                .productId(review.getProduct().getProductId())
                .productName(review.getProduct().getProductName())
                .productMainImageUrl(productMainImageUrl)

                .reviewTitle(review.getReviewTitle())
                .reviewContent(review.getReviewContent())
                .reviewRating(review.getReviewRating())

                .createdAt(
                        review.getCreatedAt() != null
                                ? review.getCreatedAt().format(formatter)
                                : ""
                )

                .reviewImageUrlList(reviewImageUrlList)
                .build();
    }
}