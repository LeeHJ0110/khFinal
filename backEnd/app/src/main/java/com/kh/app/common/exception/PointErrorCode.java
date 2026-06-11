package com.kh.app.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum PointErrorCode implements ErrorCode {

    LOGIN_REQUIRED(HttpStatus.UNAUTHORIZED, "P000", "로그인이 필요합니다."),
    MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "P004", "로그인 회원을 찾을 수 없습니다."),

    INVALID_EARN_POINT(HttpStatus.BAD_REQUEST, "P001", "적립 포인트는 0보다 커야 합니다."),
    INVALID_USE_POINT(HttpStatus.BAD_REQUEST, "P002", "사용 포인트는 0보다 커야 합니다."),
    NOT_ENOUGH_POINT(HttpStatus.BAD_REQUEST, "P003", "보유 포인트가 부족합니다."),

    ALREADY_DAILY_ATTENDANCE(HttpStatus.BAD_REQUEST, "P011", "오늘은 이미 출석체크 포인트를 받았습니다."),
    ALREADY_WEEKLY_TRAINING_DIARY(HttpStatus.BAD_REQUEST, "P012", "이번 주는 이미 훈련일기 포인트를 받았습니다."),
    ALREADY_WEEKLY_COMMUNITY_POST(HttpStatus.BAD_REQUEST, "P013", "이번 주는 이미 게시글 작성 포인트를 받았습니다."),
    ALREADY_EVENT_JOIN(HttpStatus.BAD_REQUEST, "P014", "이미 이벤트 포인트를 받았습니다.");

    private final HttpStatus status;
    private final String code;
    private final String msg;
}