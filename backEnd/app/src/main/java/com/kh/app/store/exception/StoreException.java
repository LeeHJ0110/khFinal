package com.kh.app.store.exception;

import lombok.Getter;

@Getter
public class StoreException extends RuntimeException {

    private final StoreErrorCode errorCode;

    public StoreException(StoreErrorCode errorCode) {
        super(errorCode.getMsg());
        this.errorCode = errorCode;
    }
}