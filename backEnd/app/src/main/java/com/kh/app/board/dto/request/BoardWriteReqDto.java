package com.kh.app.board.dto.request;

import com.kh.app.board.entity.BoardEntity;
//import com.kh.app.member.entity.MemberEntity;
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
        return BoardEntity.builder()
                .category(boardCategory != null ? boardCategory : "FREE")
                .subCategory(boardSubCategory != null ? boardSubCategory : null)
                .title(title)
                .content(content)
                .stars(boardStars)
                .writer(memberEntity)
                .build();
    }
}
