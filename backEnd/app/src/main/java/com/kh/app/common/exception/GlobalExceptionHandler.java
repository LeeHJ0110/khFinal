package com.kh.app.common.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ErrorResponseDto> handleCustomException(CustomException e) {
        ErrorResponseDto response = ErrorResponseDto.builder()
                .message(e.getErrorCode().getMsg())
                .build();

        return ResponseEntity.status(e.getErrorCode().getStatus())
                .body(response);
    }
}