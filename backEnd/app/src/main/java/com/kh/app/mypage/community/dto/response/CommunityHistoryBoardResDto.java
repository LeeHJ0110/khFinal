package com.kh.app.mypage.community.dto.response;

import com.kh.app.board.entity.BoardEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CommunityHistoryBoardResDto {

    private Long boardId;

    private String title;

    private String content;

    private String boardSubCategory;

    private Long writerLevel;

    private String writerNickname;

    private LocalDateTime createdAt;

    private Long hits;

    public static CommunityHistoryBoardResDto from(BoardEntity board) {

        return CommunityHistoryBoardResDto.builder()
                .boardId(board.getId())
                .title(board.getTitle())
                .content(board.getContent())
                .boardSubCategory(
                        board.getSubCategory() != null
                                ? board.getSubCategory().name()
                                : null
                )
                .writerLevel(
                        board.getWriter() != null
                                ? board.getWriter().getLevelExp()
                                : 1
                )
                .writerNickname(
                        board.getWriter() != null
                                ? board.getWriter().getNickname()
                                : "익명회원"
                )
                .createdAt(board.getCreatedAt())
                .hits(board.getHits())
                .build();
    }
}