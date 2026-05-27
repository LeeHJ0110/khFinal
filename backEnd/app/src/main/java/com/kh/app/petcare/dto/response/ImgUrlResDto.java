package com.kh.app.petcare.dto.response;

import com.kh.app.petcare.entity.ImgUrlEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ImgUrlResDto {
    // 이미지 번호
    private Long imgId;
    // 이미지 경로(URL)
    private String imgUrl;

    private String imageOriginName;

    private String imageChangedName;


    // 이미지 카테고리(EYE, SKIN, TOOTH ...)
    private String category;

    public static ImgUrlResDto from(ImgUrlEntity entity) {

        return ImgUrlResDto.builder()
                .imgId(entity.getImgUrlId())
                .imageOriginName(entity.getImageOriginName())
                .imageChangedName(entity.getImageChangedName())
                .category(entity.getImgCategory().name())
                .build();
    }
}
