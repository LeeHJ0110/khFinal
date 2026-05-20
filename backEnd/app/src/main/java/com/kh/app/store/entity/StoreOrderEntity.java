package com.kh.app.store.entity;

import com.kh.app.common.entity.BaseEntity;
import com.kh.app.member.entity.MemberEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "STORE_ORDER")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class StoreOrderEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ORDER_ID")
    private Long orderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEMBER_ID", nullable = false)
    private MemberEntity member;

    @Enumerated(EnumType.STRING)
    @Column(name = "ORDER_STATUS", nullable = false, length = 30)
    @Builder.Default
    private StoreOrderStatus orderStatus = StoreOrderStatus.ORDERED;

    @Column(name = "ORDER_DELIVERY_FEE", nullable = false)
    @Builder.Default
    private Long orderDeliveryFee = 0L;

    @Column(name = "ORDER_USED_POINT", nullable = false)
    @Builder.Default
    private Long orderUsedPoint = 0L;

    @Column(name = "ORDER_FINAL_AMOUNT", nullable = false)
    private Long orderFinalAmount;

    public void paid() {
        this.orderStatus = StoreOrderStatus.PAID;
    }

    public void cancel() {
        this.orderStatus = StoreOrderStatus.CANCELED;
    }

    public boolean isCanceled() {
        return this.orderStatus == StoreOrderStatus.CANCELED;
    }

    public boolean isPaid() {
        return this.orderStatus == StoreOrderStatus.PAID;
    }
}