package com.kh.app.store.entity;

// 배송 상태
// 관리자가 관리자 페이지에서 수동으로 변경
// 고객 주문취소는 READY 상태에서만 가능
public enum StoreDeliveryStatus {
    READY,      // 배송준비중
    SHIPPING,   // 배송중
    DELIVERED   // 배송완료
}