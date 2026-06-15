package com.kh.app.admin.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AdminReplyReportResDto {

    private Long reportId;
    private String reporterNickname;
    private String reason;
    private LocalDateTime createdAt;
}