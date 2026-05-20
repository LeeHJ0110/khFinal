package com.kh.app.member.entity;


import com.kh.app.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "DELIVERY_ADDRESS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryAddressEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DELIVERY_ADDRESS_ID")
    private Long deliveryAddressId;

    // 회원
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEMBER_ID")
    private MemberEntity member;

    // 배송지명
    @Column(name = "DELIVERY_ADDRESS_NAME", length = 30, nullable = false)
    private String deliveryAddressName;

    // 받는 사람 이름
    @Column(name = "DELIVERY_ADDRESS_RECEIVER_NAME", length = 30, nullable = false)
    private String deliveryAddressReceiverName;

    // 받는 사람 전화번호
    @Column(name = "DELIVERY_ADDRESS_RECEIVER_PHONE", length = 11, nullable = false)
    private String deliveryAddressReceiverPhone;

    // 우편번호
    @Column(name = "DELIVERY_ADDRESS_ZIP_CODE", length = 20, nullable = false)
    private String deliveryAddressZipCode;

    // 주소
    @Column(name = "DELIVERY_ADDRESS", length = 100, nullable = false)
    private String deliveryAddress;

    // 상세주소
    @Column(name = "DELIVERY_ADDRESS_DETAIL", length = 100)
    private String deliveryAddressDetail;

    // 기본배송지 여부
    @Enumerated(EnumType.STRING)
    @Column(name = "DELIVERY_ADDRESS_DEFAULT_YN", length = 1)
    private DeliveryAddressDefaultYn deliveryAddressDefaultYn;
}