package com.kh.app.admin.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AdminCommunityBlindResDto {

    private Long id;
    private String title;
    private String content;
    private String writerNickname;
    private LocalDateTime createdAt;
}