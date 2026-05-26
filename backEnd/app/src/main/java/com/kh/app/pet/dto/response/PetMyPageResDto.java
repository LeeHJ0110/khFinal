package com.kh.app.pet.dto.response;

import com.kh.app.pet.entity.PetEntity;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class PetMyPageResDto {

    // 펫 번호
    private Long petId;

    // 반려동물 이름
    private String name;

    // 품종명
    private String breedName;

    // 성별
    private String gender;

    // 생년월일
    private String birthDate;

    // 몸무게
    private BigDecimal weight;

    // 대표동물 여부
    private String representYn;

    public static PetMyPageResDto from(PetEntity pet) {

        return PetMyPageResDto.builder()
                .petId(pet.getId())
                .name(pet.getName())

                // 품종명
                .breedName(
                        pet.getBreedId() != null
                                ? pet.getBreedId().getName()
                                : null
                )

                // 성별 enum -> 문자열
                .gender(
                        pet.getGender() != null
                                ? pet.getGender().name()
                                : null
                )

                .birthDate(pet.getBirthDate())

                .weight(pet.getWeight())

                // 대표동물 여부 enum/string
                .representYn(
                        pet.getRepresentYn() != null
                                ? pet.getRepresentYn().name()
                                : null
                )

                .build();
    }
}