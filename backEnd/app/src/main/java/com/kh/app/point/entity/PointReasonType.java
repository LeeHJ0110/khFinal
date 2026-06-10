package com.kh.app.point.entity;

public enum PointReasonType {

    // 적립
    DAILY_ATTENDANCE,          // 일일 출석체크
    WEEKLY_TRAINING_DIARY,     // 주간 훈련일기 작성
    WEEKLY_COMMUNITY_POST,     // 주간 커뮤니티 게시글 작성
    REVIEW_WRITE,              // 리뷰 작성
    EVENT_JOIN,                // 이벤트 참여

    // 사용
    HEALTHCARE_USE,            // 건강관리 서비스 이용
    ORDER_USE,                 // 주문 시 포인트 사용

    // 복구
    ORDER_CANCEL_REFUND,       // 주문 취소 포인트 환불

}