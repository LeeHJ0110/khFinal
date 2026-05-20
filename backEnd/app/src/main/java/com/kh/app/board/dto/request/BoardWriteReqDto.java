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
    private Double boardStars;
    private String boardCategory;
    private String boardSubCategory;

    public BoardEntity toEntity (MemberEntity memberEntity){
        return BoardEntity.builder()
                .boardCategory(boardCategory != null ? boardCategory : "FREE")
                .boardSubCategory(boardSubCategory != null ? boardSubCategory : null)
                .boardTitle(title)
                .boardContent(content)
                .boardStars(boardStars)
                .writer(memberEntity)
                .build();
    }
}
