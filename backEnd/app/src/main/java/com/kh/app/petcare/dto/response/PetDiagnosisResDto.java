package com.kh.app.petcare.dto.response;

import com.kh.app.pet.entity.PetEntity;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class PetDiagnosisResDto {

    private Long petId;
    private String name;
    private String breedName;
    private String petType;
    private String gender;
    private String birthDate;
    private BigDecimal weight;
    private String representYn;

    // 브라우저에서 바로 접근 가능한 최종 이미지 URL
    private String imageUrl;

    // 현재 진행 중인 건강진단 신청 여부
    private boolean diagnosisInProgress;

    public static PetDiagnosisResDto from(
            PetEntity pet,
            boolean diagnosisInProgress,
            String imageUrl
    ) {
        return PetDiagnosisResDto.builder()
                .petId(pet.getId())
                .name(pet.getName())
                .breedName(
                        pet.getBreed() != null
                                ? pet.getBreed().getName()
                                : null
                )
                .petType(
                        pet.getBreed() != null
                                ? pet.getBreed().getPetType().name()
                                : null
                )
                .gender(
                        pet.getGender() != null
                                ? pet.getGender().name()
                                : null
                )
                .birthDate(pet.getBirthDate())
                .weight(pet.getWeight())
                .representYn(
                        pet.getRepresentYn() != null
                                ? pet.getRepresentYn().name()
                                : null
                )
                .imageUrl(imageUrl)
                .diagnosisInProgress(diagnosisInProgress)
                .build();
    }
}