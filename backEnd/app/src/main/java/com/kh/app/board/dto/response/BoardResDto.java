package com.kh.app.board.dto.response;

import com.kh.app.board.entity.BoardEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class BoardResDto {

    private Long boardId;
    private String boardCategory;
    private String boardSubCategory;
    private String title;
    private String writerNickname; // 작성자 닉네임
    private Long hits;
    private Double stars;
    private LocalDateTime createdAt;
    
    public static BoardResDto from(BoardEntity entity) {
        return BoardResDto.builder()
                .boardId(entity.getBoardId())
                .boardCategory(entity.getBoardCategory())
                .boardSubCategory(entity.getBoardSubCategory())
                .title(entity.getBoardTitle())
                .writerNickname(entity.getMember().getNickname()) // 수정된 Member 객체에서 닉네임 꺼내오기
                .hits(entity.getBoardHits())
                .stars(entity.getBoardStars())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}