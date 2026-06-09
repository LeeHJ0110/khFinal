package com.kh.app.store.dto.response;

import com.kh.app.store.entity.StoreReviewEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Getter
@Builder
public class StoreReviewListResDto {

    private Long reviewId;

    private Long memberId;
    private String memberNickname;
    private String memberProfileImageUrl;

    private String reviewTitle;
    private String reviewContent;
    private Long reviewRating;

    private String createdAt;

    private List<String> imageUrlList;

    public static StoreReviewListResDto from(
            StoreReviewEntity review,
            String memberProfileImageUrl,
            List<String> imageUrlList
    ) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");

        return StoreReviewListResDto.builder()
                .reviewId(review.getReviewId())
                .memberId(review.getMember().getId())
                .memberNickname(review.getMember().getNickname())
                .memberProfileImageUrl(memberProfileImageUrl)
                .reviewTitle(review.getReviewTitle())
                .reviewContent(review.getReviewContent())
                .reviewRating(review.getReviewRating())
                .createdAt(
                        review.getCreatedAt() != null
                                ? review.getCreatedAt().format(formatter)
                                : ""
                )
                .imageUrlList(imageUrlList)
                .build();
    }
}