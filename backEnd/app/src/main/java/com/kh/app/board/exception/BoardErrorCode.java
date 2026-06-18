package com.kh.app.board.exception;

import com.kh.app.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum BoardErrorCode implements ErrorCode {

    MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "B001", "존재하지 않는 회원입니다."),
    BOARD_NOT_FOUND(HttpStatus.NOT_FOUND, "B002","존재하지 않는 게시글입니다."),
    FAQ_WRITE_DENIED(HttpStatus.FORBIDDEN, "B003", "관리자만이 FAQ 게시글을 작성할 수 있습니다"),
    FAQ_UPDATE_DENIED(HttpStatus.FORBIDDEN, "B004", "관리자만이 FAQ 게시글을 수정할 수 있습니다."),
    FAQ_DELETE_DENIED(HttpStatus.FORBIDDEN, "B005", "관리자만이 FAQ 게시글을 삭제할 수 있습니다."),
    BOARD_UPDATE_DENIED(HttpStatus.FORBIDDEN, "b006", "게시글을 업데이트 할 권한이 없습니다."),
    BOARD_DELETE_DENIED(HttpStatus.FORBIDDEN, "b007", "작성자 본인만 삭제할 수 있습니다."),
    BOARD_SELF_REPORT(HttpStatus.BAD_REQUEST, "B008", "본인 자신은 신고할 수 없습니다."),
    BOARD_ALREADY_REPORTED(HttpStatus.BAD_REQUEST, "B009", "이미 신고한 게시글입니다"),
    REPLY_DEPTH_LIMIT(HttpStatus.BAD_REQUEST, "B010", "대댓글에는 답들을 달 수 없습니다."),
    REPLY_UPDATE_DENIED(HttpStatus.FORBIDDEN , "B011", "수정할 권한이 없습니다."),
    REPLY_DELETE_DENIED(HttpStatus.FORBIDDEN , "B012", "삭제할 권한이 없습니다."),
    REPLY_SELF_REPORT(HttpStatus.BAD_REQUEST, "B013", "자신의 댓글은 신고할 수 없습니다."),
    REPLY_ALREADY_REPORTED(HttpStatus.BAD_REQUEST, "B014", "이미 신고한 댓글입니다.");




    private final HttpStatus status;
    private final String code;
    private final String msg;
}
