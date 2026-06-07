package com.kh.app.board.dto.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class BoardSearchCondition {

    private String title;
    private String content;
    private String boardCategory;
    private String boardSubCategory;
    private Long boardStars;
    private Long boardHits;
    private String sort;
}
