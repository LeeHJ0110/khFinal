package com.kh.app.store.entity;

import com.kh.app.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "STORE_PRODUCT")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class StoreProductEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PRODUCT_ID")
    private Long productId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CATEGORY_ID", nullable = false)
    private StoreProductCategoryEntity category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TAG_ID", nullable = false)
    private StoreProductTagEntity tag;

    @Column(name = "PRODUCT_NAME", nullable = false, length = 100)
    private String productName;

    // D: 강아지, C: 고양이
    @Column(name = "PRODUCT_TARGET_PET_TYPE", nullable = false, length = 1)
    private String productTargetPetType;

    @Column(name = "PRODUCT_PRICE", nullable = false)
    private Long productPrice;

    @Column(name = "PRODUCT_POINT", nullable = false)
    @Builder.Default
    private Long productPoint = 0L;

    @Column(name = "PRODUCT_SUMMARY", length = 500)
    private String productSummary;

    @Column(name = "PRODUCT_DESCRIPTION", length = 2000)
    private String productDescription;

    // Y: 판매중, N: 판매중지
    @Column(name = "PRODUCT_SALE_YN", nullable = false, length = 1)
    @Builder.Default
    private String productSaleYn = "Y";

    @Column(name = "PRODUCT_VIEW_COUNT", nullable = false)
    @Builder.Default
    private Long productViewCount = 0L;

    public void increaseViewCount() {
        this.productViewCount++;
    }

    public void update(
            StoreProductCategoryEntity category,
            StoreProductTagEntity tag,
            String productName,
            String productTargetPetType,
            Long productPrice,
            Long productPoint,
            String productSummary,
            String productDescription,
            String productSaleYn
    ) {
        this.category = category;
        this.tag = tag;
        this.productName = productName;
        this.productTargetPetType = productTargetPetType;
        this.productPrice = productPrice;
        this.productPoint = productPoint;
        this.productSummary = productSummary;
        this.productDescription = productDescription;
        this.productSaleYn = productSaleYn;
    }

    public void stopSale() {
        this.productSaleYn = "N";
    }

    public void startSale() {
        this.productSaleYn = "Y";
    }

    public boolean isOnSale() {
        return "Y".equals(this.productSaleYn);
    }
}