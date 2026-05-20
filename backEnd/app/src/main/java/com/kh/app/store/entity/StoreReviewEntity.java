package com.kh.app.store.entity;

import com.kh.app.common.entity.BaseEntity;
import com.kh.app.member.entity.MemberEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "PRODUCT_REVIEW")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class StoreReviewEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "REVIEW_ID")
    private Long reviewId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ORDER_ITEM_ID", nullable = false, unique = true)
    private StoreOrderItemEntity orderItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PRODUCT_ID", nullable = false)
    private StoreProductEntity product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEMBER_ID", nullable = false)
    private MemberEntity member;

    @Column(name = "REVIEW_TITLE", nullable = false, length = 200)
    private String reviewTitle;

    @Column(name = "REVIEW_CONTENT", nullable = false, length = 500)
    private String reviewContent;

    @Column(name = "REVIEW_RATING", nullable = false)
    private Integer reviewRating;

    public void update(String reviewTitle, String reviewContent, Integer reviewRating) {
        this.reviewTitle = reviewTitle;
        this.reviewContent = reviewContent;
        this.reviewRating = reviewRating;
    }
}