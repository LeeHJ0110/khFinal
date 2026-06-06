package com.kh.app.board.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BoardReplyWriteReqDto {
    private String content;
    private Long parentId;
}
