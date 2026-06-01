package com.kh.app.board.dto.response;

import com.kh.app.board.entity.BoardFileEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardFileResDto {

    private Long fileId;        // 파일 고유 번호
    private String originName;  // 사용자가 올린 원래 파일명
    private String fileUrl;     // 프론트엔드가 접근할 S3 풀 URL

    public static BoardFileResDto from(BoardFileEntity fileEntity, String fileUrl) {
        return BoardFileResDto.builder()
                .fileId(fileEntity.getId())
                .originName(fileEntity.getImageOriginName())
                .fileUrl(fileUrl)
                .build();
    }
}