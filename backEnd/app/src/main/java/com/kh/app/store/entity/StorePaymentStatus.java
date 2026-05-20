package com.kh.app.store.entity;

// 결제 상태
// 1. READY: 결제대기
// 2. PAID: 결제완료
// 3. CANCELED: 결제취소
// 4. FAILED: 결제실패
public enum StorePaymentStatus {
    READY, PAID, CANCELED, FAILED
}