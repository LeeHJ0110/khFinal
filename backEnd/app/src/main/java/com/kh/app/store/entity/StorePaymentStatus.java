package com.kh.app.store.entity;

//결재상태 (확정짓기)
//1. 준비중, 2.결재완료, 3.취소, 4.실패
public enum StorePaymentStatus {
    READY, PAID, CANCELED, FAILED
}