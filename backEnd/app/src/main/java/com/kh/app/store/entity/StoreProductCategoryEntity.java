package com.kh.app.store.entity;

import com.kh.app.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "PRODUCT_CATEGORY")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class StoreProductCategoryEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CATEGORY_ID")
    private Long categoryId;

    @Column(name = "CATEGORY_NAME", nullable = false, length = 100)
    private String categoryName;

    @Column(name = "CATEGORY_SORT_ORDER", nullable = false)
    @Builder.Default
    private Integer categorySortOrder = 0;

    @Column(name = "CATEGORY_USE_YN", nullable = false, length = 1)
    @Builder.Default
    private String categoryUseYn = "Y";

    public void update(String categoryName, Integer categorySortOrder, String categoryUseYn) {
        this.categoryName = categoryName;
        this.categorySortOrder = categorySortOrder;
        this.categoryUseYn = categoryUseYn;
    }
}