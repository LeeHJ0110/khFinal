package com.kh.app.store.entity;

import com.kh.app.common.entity.BaseEntity;
import com.kh.app.member.entity.MemberEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "STORE_PAYMENT")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class StorePaymentEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PAYMENT_ID")
    private Long paymentId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ORDER_ID", nullable = false, unique = true)
    private StoreOrderEntity order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEMBER_ID", nullable = false)
    private MemberEntity member;

    @Enumerated(EnumType.STRING)
    @Column(name = "PAYMENT_METHOD", nullable = false, length = 30)
    private StorePaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "PAYMENT_STATUS", nullable = false, length = 30)
    @Builder.Default
    private StorePaymentStatus paymentStatus = StorePaymentStatus.READY;

    @Column(name = "PAYMENT_AMOUNT", nullable = false)
    private Long paymentAmount;

    @Column(name = "PAYMENT_KAKAO_TID", length = 100)
    private String paymentKakaoTid;

    @Column(name = "PARTNER_ORDER_ID", length = 100)
    private String partnerOrderId;

    @Column(name = "PARTNER_USER_ID", length = 100)
    private String partnerUserId;

    @Column(name = "PAYMENT_APPROVED_AT")
    private LocalDateTime paymentApprovedAt;

    public void approve(String paymentKakaoTid, LocalDateTime paymentApprovedAt) {
        this.paymentKakaoTid = paymentKakaoTid;
        this.paymentApprovedAt = paymentApprovedAt;
        this.paymentStatus = StorePaymentStatus.PAID;
    }

    public void cancel() {
        this.paymentStatus = StorePaymentStatus.CANCELED;
    }

    public void fail() {
        this.paymentStatus = StorePaymentStatus.FAILED;
    }

    public void refund() {
        this.paymentStatus = StorePaymentStatus.REFUNDED;
    }
}