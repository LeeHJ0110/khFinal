package com.kh.app.store.entity;

import com.kh.app.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ORDER_ITEM")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class StoreOrderItemEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ORDER_ITEM_ID")
    private Long orderItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ORDER_ID", nullable = false)
    private StoreOrderEntity order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PRODUCT_ID", nullable = false)
    private StoreProductEntity product;

    @Column(name = "ORDER_ITEM_PRODUCT_NAME", nullable = false, length = 100)
    private String orderItemProductName;

    @Column(name = "ORDER_ITEM_PRODUCT_PRICE", nullable = false)
    private Long orderItemProductPrice;

    @Column(name = "ORDER_ITEM_QTY", nullable = false)
    private Integer orderItemQty;

    @Column(name = "ORDER_ITEM_TOTAL_PRICE", nullable = false)
    private Long orderItemTotalPrice;

    public static StoreOrderItemEntity from(
            StoreOrderEntity order,
            StoreProductEntity product,
            Integer qty
    ) {
        return StoreOrderItemEntity.builder()
                .order(order)
                .product(product)
                .orderItemProductName(product.getProductName())
                .orderItemProductPrice(product.getProductPrice())
                .orderItemQty(qty)
                .orderItemTotalPrice(product.getProductPrice() * qty)
                .build();
    }
}