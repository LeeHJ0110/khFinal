package com.kh.app.petcare.dto.response;

import com.kh.app.petcare.entity.ImgUrlEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ImgUrlResDto {

    // 이미지 번호
    private Long imgId;

    // 프론트에서 바로 사용할 수 있는 S3 이미지 URL
    private String imgUrl;

    // 사용자가 업로드한 원본 파일명
    private String imageOriginName;

    // S3에 저장된 경로
    private String imageChangedName;

    // 이미지 카테고리(EYE, SKIN, TEETH)
    private String category;

    public static ImgUrlResDto from(
            ImgUrlEntity entity,
            String imgUrl
    ) {

        return ImgUrlResDto.builder()
                .imgId(entity.getImgUrlId())
                .imgUrl(imgUrl)
                .imageOriginName(entity.getImageOriginName())
                .imageChangedName(entity.getImageChangedName())
                .category(entity.getImgCategory().name())
                .build();
    }
}