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

    @Enumerated(EnumType.STRING)
    @Column(name = "PRODUCT_CATEGORY", nullable = false, length = 30)
    private StoreProductCategory productCategory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TAG_ID", nullable = false)
    private StoreProductTagEntity productTag;

    @Column(name = "PRODUCT_NAME", nullable = false, length = 100)
    private String productName;

    // D: 강아지, C: 고양이
    @Column(name = "PRODUCT_TARGET_PET_TYPE", nullable = false, length = 1)
    private String productTargetPetType;

    @Column(name = "PRODUCT_PRICE", nullable = false)
    private Long productPrice;

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
            StoreProductCategory productCategory,
            StoreProductTagEntity productTag,
            String productName,
            String productTargetPetType,
            Long productPrice
    ) {
        this.productCategory = productCategory;
        this.productTag = productTag;
        this.productName = productName;
        this.productTargetPetType = productTargetPetType;
        this.productPrice = productPrice;
    }


    //판매 중지
    public void stopSelling() {
        if ("N".equals(this.productSaleYn)) {
            throw new IllegalStateException("이미 판매중지된 상품입니다.");
        }

        this.productSaleYn = "N";
    }

    //판매 재개
    public void resumeSelling() {
        if ("Y".equals(this.productSaleYn)) {
            throw new IllegalStateException("이미 판매중인 상품입니다.");
        }

        this.productSaleYn = "Y";
    }

    public boolean isOnSale() {
        return "Y".equals(this.productSaleYn);
    }
}