package com.kh.app.point.entity;

import com.kh.app.common.entity.BaseEntity;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.point.entity.PointHistoryType;
import com.kh.app.point.entity.PointReasonType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "POINT_HISTORY")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class PointHistoryEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "POINT_HISTORY_ID")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEMBER_ID", nullable = false)
    private MemberEntity member;

    @Enumerated(EnumType.STRING)
    @Column(name = "POINT_HISTORY_TYPE", length = 20, nullable = false)
    private PointHistoryType pointHistoryType;

    @Enumerated(EnumType.STRING)
    @Column(name = "POINT_REASON_TYPE", length = 50, nullable = false)
    private PointReasonType pointReasonType;

    /**
     * 포인트 변동량
     *
     * 적립: 양수
     * 사용: 음수
     *
     * 예)
     * 건강관리 이용: -2000
     * 주문 포인트 사용: -5000
     * 주문 취소 환불: +5000
     */
    @Column(name = "POINT_AMOUNT", nullable = false)
    private Long pointAmount;

    /**
     * 변동 후 회원의 포인트 잔액
     *
     * 나중에 사용자가 포인트 내역을 볼 때
     * "사용 후 잔액"을 보여주기 좋음
     */
    @Column(name = "POINT_BALANCE_AFTER", nullable = false)
    private Long pointBalanceAfter;

    /**
     * 주문과 연결된 포인트 내역일 경우 사용
     *
     * 지금 바로 OrderEntity를 연결하지 않아도 됨.
     * 순환참조나 패키지 의존성이 부담되면 Long orderId로 시작해도 충분함.
     */
    @Column(name = "RELATED_ORDER_ID")
    private Long relatedOrderId;

    /**
     * 화면 표시용 메모
     *
     * 예)
     * 건강관리 서비스 이용
     * 주문 결제 포인트 사용
     */
    @Column(name = "POINT_HISTORY_MEMO", length = 255)
    private String pointHistoryMemo;
}