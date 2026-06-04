package com.kh.app.store.entity;

import com.kh.app.common.entity.BaseEntity;
import com.kh.app.member.entity.MemberEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "CART_ITEM",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "UK_CART_ITEM_MEMBER_PRODUCT",
                        columnNames = {"MEMBER_ID", "PRODUCT_ID"}
                )
        }
)
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class StoreCartItemEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CART_ITEM_ID")
    private Long cartItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PRODUCT_ID", nullable = false)
    private StoreProductEntity product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEMBER_ID", nullable = false)
    private MemberEntity member;

    @Column(name = "CART_ITEM_QTY", nullable = false)
    @Builder.Default
    private Integer cartItemQty = 1;

    public void increaseQty(Integer qty) {
        if (qty == null || qty < 1) {
            throw new IllegalArgumentException("수량은 1개 이상이어야 합니다.");
        }

        this.cartItemQty += qty;
    }

    public void updateQty(Integer cartItemQty) {
        if (cartItemQty == null || cartItemQty < 1) {
            throw new IllegalArgumentException("수량은 1개 이상이어야 합니다.");
        }

        this.cartItemQty = cartItemQty;
    }
}