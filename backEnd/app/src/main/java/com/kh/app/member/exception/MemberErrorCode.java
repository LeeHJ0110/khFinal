package com.kh.app.member.exception;

import com.kh.app.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum MemberErrorCode implements ErrorCode {

    LOGIN_REQUIRED(HttpStatus.UNAUTHORIZED, "M001","로그인이 필요합니다."),
    MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "M002","로그인 회원을 찾을 수 없습니다."),

    DUPLICATE_USERNAME(HttpStatus.BAD_REQUEST , "M003","이미 사용 중인 아이디입니다.") ,
    DUPLICATE_NICKNAME(HttpStatus.BAD_REQUEST , "M004","이미 사용 중인 닉네임입니다.") ;

    private final HttpStatus status;
    private final String code;
    private final String msg;


}