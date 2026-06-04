package com.kh.app.board.dto.request;

import com.kh.app.board.entity.BoardCategory;
import com.kh.app.board.entity.BoardSubCategory;
import com.kh.app.board.entity.BoardEntity;
import com.kh.app.member.entity.MemberEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BoardWriteReqDto {

    private String title;
    private String content;
    private Long boardStars;
    private String boardCategory;
    private String boardSubCategory;

    public BoardEntity toEntity (MemberEntity memberEntity){
        // 1. String 값인 boardCategory를 BoardCategory Enum으로 파싱합니다.
        BoardCategory categoryEnum = (boardCategory != null)
                ? BoardCategory.valueOf(boardCategory)
                : BoardCategory.FREE;

        // 2. String 값인 boardSubCategory를 BoardSubCategory Enum으로 파싱합니다.
        BoardSubCategory subCategoryEnum = (boardSubCategory != null)
                ? BoardSubCategory.valueOf(boardSubCategory)
                : null;

        return BoardEntity.builder()
                .category(categoryEnum)
                .subCategory(subCategoryEnum)
                .title(title)
                .content(content)
                .stars(boardStars)
                .writer(memberEntity)
                .build();
    }
}