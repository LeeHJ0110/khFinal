package com.kh.app.karte.exception;

import com.kh.app.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum KarteErrorCode implements ErrorCode {

    KARTE_NOTFOUND(HttpStatus.NOT_FOUND, "K001","진단결과가 없습니다.");

    private final HttpStatus status;
    private final String code;
    private final String msg;

}
