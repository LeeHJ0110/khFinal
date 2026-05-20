package com.kh.app.store.entity;

// 주문 상태
// 주문 자체의 상태를 관리
// 배송 진행 상태는 StoreDeliveryStatus에서 별도로 관리
public enum StoreOrderStatus {
    ORDERED,   // 주문접수
    PAID,      // 결제완료
    CANCELED   // 주문취소
}