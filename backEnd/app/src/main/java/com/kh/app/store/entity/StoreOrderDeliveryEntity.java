package com.kh.app.store.entity;

import com.kh.app.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ORDER_DELIVERY")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class StoreOrderDeliveryEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DELIVERY_ID")
    private Long deliveryId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ORDER_ID", nullable = false, unique = true)
    private StoreOrderEntity order;

    @Column(name = "DELIVERY_ADDRESS_ID")
    private Long deliveryAddressId;

    @Column(name = "DELIVERY_RECEIVER_NAME", nullable = false, length = 100)
    private String deliveryReceiverName;

    @Column(name = "DELIVERY_RECEIVER_PHONE", nullable = false, length = 20)
    private String deliveryReceiverPhone;

    @Column(name = "DELIVERY_ZIP_CODE", nullable = false, length = 20)
    private String deliveryZipCode;

    @Column(name = "DELIVERY_ADDRESS", nullable = false, length = 500)
    private String deliveryAddress;

    @Column(name = "DELIVERY_ADDRESS_DETAIL", length = 500)
    private String deliveryAddressDetail;

    @Column(name = "DELIVERY_REQUEST_MEMO", length = 500)
    private String deliveryRequestMemo;

    @Enumerated(EnumType.STRING)
    @Column(name = "DELIVERY_STATUS", nullable = false, length = 30)
    @Builder.Default
    private StoreDeliveryStatus deliveryStatus = StoreDeliveryStatus.READY;

    @Column(name = "DELIVERY_COMPANY_NAME", length = 100)
    private String deliveryCompanyName;

    @Column(name = "DELIVERY_TRACKING_NUMBER", length = 100)
    private String deliveryTrackingNumber;

    public boolean canCancelOrder() {
        return this.deliveryStatus == StoreDeliveryStatus.READY;
    }

    public void ready() {
        this.deliveryStatus = StoreDeliveryStatus.READY;
    }

    public void startShipping(String deliveryCompanyName, String deliveryTrackingNumber) {
        this.deliveryCompanyName = deliveryCompanyName;
        this.deliveryTrackingNumber = deliveryTrackingNumber;
        this.deliveryStatus = StoreDeliveryStatus.SHIPPING;
    }

    public void delivered() {
        this.deliveryStatus = StoreDeliveryStatus.DELIVERED;
    }
}