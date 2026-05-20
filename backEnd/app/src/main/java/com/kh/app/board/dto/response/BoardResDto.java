package com.kh.app.board.dto.response;

import com.kh.app.board.entity.BoardEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class BoardResDto {

    private Long boardId;
    private String boardCategory;
    private String boardSubCategory;
    private String title;
    private String writerNickname;
    private Long hits;
    private Long stars;
    private LocalDateTime createdAt;

    public static BoardResDto from(BoardEntity entity) {
        return BoardResDto.builder()
                .boardId(entity.getBoardId())
                .boardCategory(entity.getBoardCategory())
                .boardSubCategory(entity.getBoardSubCategory())
                .title(entity.getBoardTitle())
                .writerNickname(entity.getWriter().getNickname())
                .hits(entity.getBoardHits())
                .stars(entity.getBoardStars())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}