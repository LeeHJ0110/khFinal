package com.kh.app.pet.dto.response;

import com.kh.app.pet.entity.BreedEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BreedListResDto {

    // 품종 번호
    private Long breedId;

    // 품종명
    private String breedName;

    public static BreedListResDto from(BreedEntity breed) {

        return BreedListResDto.builder()
                .breedId(breed.getId())
                .breedName(breed.getName())
                .build();
    }
}