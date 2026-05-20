package com.kh.app.store.entity;

// 결제 상태
// READY: 결제대기
// PAID: 결제완료
// CANCELED: 결제취소
// FAILED: 결제실패
public enum StorePaymentStatus {
    READY, PAID, CANCELED, FAILED
}