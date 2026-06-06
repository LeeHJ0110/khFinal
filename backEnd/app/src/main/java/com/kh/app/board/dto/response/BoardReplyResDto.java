package com.kh.app.board.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardReplyResDto {
    private Long id;
    private String writerNickname;
    private Long writerLevel;
    private String content;
    private String createdAt;
    private String profileImageUrl;
    private Boolean isAuthor; // 게시글 원작자 여부
    private List<BoardReplyResDto> replies;
}
