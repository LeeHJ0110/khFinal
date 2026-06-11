package com.kh.app.common.exception;

import org.springframework.http.HttpStatus;

public interface ErrorCode {

    HttpStatus getStatus();
    String getCode();
    String getMsg();

}