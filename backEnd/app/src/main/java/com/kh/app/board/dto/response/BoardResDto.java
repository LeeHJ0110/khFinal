package com.kh.app.board.dto.response;

import com.kh.app.board.entity.BoardEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BoardResDto {

    private Long boardId;
    private String boardCategory;
    private String boardSubCategory;
    private String title;
    private String content;
    private String writerNickname;
    private Long writerLevel;
    private Long hits;
    private Long stars;
    private LocalDateTime createdAt;

    public static BoardResDto from(BoardEntity entity) {
        return BoardResDto.builder()
                .boardId(entity.getId())
                .boardCategory(entity.getCategory() != null ? entity.getCategory().toString() : null)
                .boardSubCategory(entity.getSubCategory() != null ? entity.getSubCategory().toString() : null)
                .title(entity.getTitle())
                .content(entity.getContent())
                .writerNickname(entity.getWriter().getNickname())
                .writerLevel(entity.getWriter().getLevelExp())
                .hits(entity.getHits())
                .stars(entity.getStars())
                .createdAt(entity.getCreatedAt())
                .build();
    }


}