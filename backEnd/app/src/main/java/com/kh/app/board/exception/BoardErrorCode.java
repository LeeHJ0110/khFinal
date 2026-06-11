package com.kh.app.board.exception;

import com.kh.app.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum BoardErrorCode implements ErrorCode {

    MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "B001", "존재하지 않는 회원입니다."),
    BOARD_NOT_FOUND(HttpStatus.NOT_FOUND, "B002","존재하지 않는 게시글입니다.");

    private final HttpStatus status;
    private final String code;
    private final String msg;
}
