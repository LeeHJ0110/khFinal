package com.kh.app.store.dto.request;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.store.entity.StoreOrderItemEntity;
import com.kh.app.store.entity.StoreReviewEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StoreReviewWriteReqDto {

    // 어떤 주문상품에 대한 리뷰인지
    private Long orderItemId;

    // 한줄 제목
    private String reviewTitle;

    // 상품 후기
    private String reviewContent;

    // 별점 1 ~ 5
    private Long reviewRating;

    public StoreReviewEntity toEntity(
            StoreOrderItemEntity orderItem,
            MemberEntity member
    ) {
        return StoreReviewEntity.builder()
                .orderItem(orderItem)
                .product(orderItem.getProduct())
                .member(member)
                .reviewTitle(reviewTitle)
                .reviewContent(reviewContent)
                .reviewRating(reviewRating)
                .build();
    }
}