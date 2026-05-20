package com.kh.app.member.exception;

import com.kh.app.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum MemberErrorCode implements ErrorCode {

    DUPLICATE_USERNAME(HttpStatus.BAD_REQUEST , "이미 사용 중인 아이디입니다.") ,
    DUPLICATE_NICKNAME(HttpStatus.BAD_REQUEST , "이미 사용 중인 닉네임입니다.") ;

    private final HttpStatus status;
    private final String msg;


}