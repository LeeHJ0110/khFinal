package com.kh.app.store.entity;

import com.kh.app.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Entity
@Table(name = "REVIEW_IMAGE")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class StoreReviewImageEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "REVIEW_IMAGE_ID")
    private Long reviewImageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "REVIEW_ID", nullable = false)
    private StoreReviewEntity review;

    @Column(name = "IMAGE_SORT_ORDER")
    private Integer imageSortOrder;

    @Column(name = "IMAGE_ORIGIN_NAME", nullable = false, length = 4000)
    private String imageOriginName;

    @Column(name = "IMAGE_CHANGED_NAME", nullable = false, length = 4000)
    private String imageChangedName;

    public static StoreReviewImageEntity from(
            StoreReviewEntity review,
            MultipartFile file,
            String changedName,
            Integer imageSortOrder
    ) {
        return StoreReviewImageEntity.builder()
                .review(review)
                .imageSortOrder(imageSortOrder)
                .imageOriginName(file.getOriginalFilename())
                .imageChangedName(changedName)
                .build();
    }
}