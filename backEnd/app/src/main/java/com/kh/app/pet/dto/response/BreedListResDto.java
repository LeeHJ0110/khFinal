package com.kh.app.pet.dto.response;

import com.kh.app.pet.entity.BreedEntity;
import com.kh.app.pet.entity.PetType;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BreedListResDto {

    // 품종 번호
    private Long breedId;
    private PetType petType;
    // 품종명
    private String breedName;

    public static BreedListResDto from(BreedEntity breed) {

        return BreedListResDto.builder()
                .breedId(breed.getId())
                .petType(breed.getPetType())
                .breedName(breed.getName())
                .build();
    }
}