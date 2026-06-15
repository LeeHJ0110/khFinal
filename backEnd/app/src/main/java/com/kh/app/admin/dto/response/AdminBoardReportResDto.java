package com.kh.app.admin.dto.response;

import com.kh.app.board.entity.BoardReportEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AdminBoardReportResDto {
    private Long reportId;
    private String reporterNickname;

    private String reason;

    private LocalDateTime createdAt;
    private AdminBoardReportResDto toBoardReportDto(BoardReportEntity report) {
        return AdminBoardReportResDto.builder()
                .reportId(report.getId())
                .reporterNickname(report.getReporter().getNickname())
                .reason(report.getReason())
                .createdAt(report.getCreatedAt())
                .build();
    }
}