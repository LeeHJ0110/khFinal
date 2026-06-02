package com.kh.app.delivery.entity;

import com.kh.app.common.entity.BaseEntity;
import com.kh.app.member.entity.MemberEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "DELIVERY_ADDRESS")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class DeliveryAddressEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEMBER_ID", nullable = false)
    private MemberEntity member;

    // 배송지명
    @Column(name = "NAME", length = 30, nullable = false)
    private String name;

    // 수령인
    @Column(name = "RECEIVER_NAME", length = 30, nullable = false)
    private String receiverName;

    // 전화번호
    @Column(name = "PHONE", length = 11, nullable = false)
    private String phone;

    // 우편번호
    @Column(name = "ZIP_CODE", length = 20)
    private String zipCode;

    // 주소
    @Column(name = "ADDRESS", length = 100, nullable = false)
    private String address;

    // 상세주소
    @Column(name = "ADDRESS_DETAIL", length = 100)
    private String addressDetail;

    // 대표 배송지 여부
    @Enumerated(EnumType.STRING)
    @Column(name = "DEFAULT_YN", length = 1, nullable = false)
    @Builder.Default
    private DeliveryDefaultYn defaultYn = DeliveryDefaultYn.N;

    public void update(
            String name,
            String receiverName,
            String phone,
            String zipCode,
            String address,
            String addressDetail
    ) {
        this.name = name;
        this.receiverName = receiverName;
        this.phone = phone;
        this.zipCode = zipCode;
        this.address = address;
        this.addressDetail = addressDetail;
    }

    public void changeDefaultYn(
            DeliveryDefaultYn defaultYn
    ) {
        this.defaultYn = defaultYn;
    }

}