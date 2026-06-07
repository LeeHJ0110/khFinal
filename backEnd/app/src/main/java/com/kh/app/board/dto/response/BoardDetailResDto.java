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
@NoArgsConstructor
@AllArgsConstructor
public class BoardDetailResDto {

    private Long boardId;
    private String boardCategory;
    private String boardSubCategory;
    private String title;
    private String content;
    private String writerNickname;
    private String writerUsername;
    private String writerProfileImageUrl;
    private Long writerLevel;
    private Long hits;
    private Long stars;
    private LocalDateTime createdAt;
    private Long likeCount;
    private Boolean isLiked;


    private List<BoardFileResDto> fileList;
    private List<BoardReplyResDto> replies;

    public static BoardDetailResDto from(BoardEntity entity, List<BoardFileResDto> fileList, List<BoardReplyResDto> replies, String writerProfileImageUrl, Long likeCount, Boolean isLiked) {
        return BoardDetailResDto.builder()
                .boardId(entity.getId())
                .boardCategory(entity.getCategory() != null ? entity.getCategory().toString() : null)
                .boardSubCategory(entity.getSubCategory() != null ? entity.getSubCategory().toString() : null)
                .title(entity.getTitle())
                .content(entity.getContent())
                .writerNickname(entity.getWriter().getNickname())
                .writerUsername(entity.getWriter().getUsername())
                .writerProfileImageUrl(writerProfileImageUrl)
                .writerLevel(entity.getWriter().getLevelExp())
                .hits(entity.getHits())
                .stars(entity.getStars())
                .createdAt(entity.getCreatedAt())
                .fileList(fileList)
                .replies(replies)
                .likeCount(likeCount)
                .isLiked(isLiked)
                .build();
    }
}