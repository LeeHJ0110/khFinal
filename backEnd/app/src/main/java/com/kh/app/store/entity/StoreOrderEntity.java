package com.kh.app.store.entity;

import com.kh.app.common.entity.BaseEntity;
import com.kh.app.member.entity.MemberEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

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

    // 배송 상태
    @Enumerated(EnumType.STRING)
    @Column(name = "DELIVERY_STATUS", nullable = false, length = 30)
    @Builder.Default
    private StoreDeliveryStatus deliveryStatus = StoreDeliveryStatus.READY;

    @Column(name = "ORDER_DELIVERY_FEE", nullable = false)
    @Builder.Default
    private Long orderDeliveryFee = 0L;

    @Column(name = "ORDER_USED_POINT", nullable = false)
    @Builder.Default
    private Long orderUsedPoint = 0L;

    @Column(name = "ORDER_FINAL_AMOUNT", nullable = false)
    private Long orderFinalAmount;

    @Column(name = "DELIVERY_ADDRESS_ID")
    private Long deliveryAddressId;

    @Column(name = "ORDER_RECEIVER_NAME", length = 30)
    private String orderReceiverName;

    @Column(name = "ORDER_RECEIVER_PHONE", length = 20)
    private String orderReceiverPhone;

    @Column(name = "ORDER_ZIP_CODE", length = 20)
    private String orderZipCode;

    @Column(name = "ORDER_ADDRESS", length = 100)
    private String orderAddress;

    @Column(name = "ORDER_ADDRESS_DETAIL", length = 100)
    private String orderAddressDetail;

    @Column(name = "ORDER_DELIVERY_REQUEST", length = 200)
    private String orderDeliveryRequest;

    @Enumerated(EnumType.STRING)
    @Column(name = "ORDER_TYPE", nullable = false, length = 20)
    @ColumnDefault("'CART'")
    @Builder.Default
    private StoreOrderType orderType = StoreOrderType.CART;

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

    public boolean isDeliveryReady() {
        return this.deliveryStatus == StoreDeliveryStatus.READY;
    }

    public void shipping() {
        this.deliveryStatus = StoreDeliveryStatus.SHIPPING;
    }

    public void delivered() {
        this.deliveryStatus = StoreDeliveryStatus.DELIVERED;
    }

    public boolean isCartOrder() {
        return this.orderType == StoreOrderType.CART;
    }

    public boolean isDirectOrder() {
        return this.orderType == StoreOrderType.DIRECT;
    }


}