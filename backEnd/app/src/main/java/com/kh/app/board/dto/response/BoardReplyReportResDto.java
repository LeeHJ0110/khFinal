package com.kh.app.board.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BoardReplyReportResDto {
    private Long id;
    private Long replyId;
    private String replyContent;
    private String reporterNickname;
    private String writerNickname;
    private String reason;
    private String status;
    private String createdAt;
}
