package com.kh.app.board.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class BoardListResDto {
    private Long id;
    private String title;
    private String category;
    private String subCategory;
    private String writerNickname;
    private Long hits;
    private LocalDateTime createdAt;
    private String thumbnailUrl; // 💡 화면 목록에 썸네일로 띄워줄 S3 이미지 주소
}