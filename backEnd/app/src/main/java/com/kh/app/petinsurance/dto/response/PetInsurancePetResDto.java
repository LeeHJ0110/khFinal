package com.kh.app.petinsurance.dto.response;

import com.kh.app.pet.entity.PetEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PetInsurancePetResDto {

    // 반려 동물 번호
    private Long petId;

    //반려동물 이름
    private  String petName;

    //생년월일
    private String birthDate;

    //보험 가입상태 여부
    private boolean insuranceInProgress;


    public static PetInsurancePetResDto from(
            PetEntity pet,
            boolean insuranceInProgress

    ){
        return PetInsurancePetResDto.builder()
                .petId(pet.getId())
                .petName(pet.getName())
                .birthDate(pet.getBirthDate())
                .insuranceInProgress(insuranceInProgress)
                .build();
    }

}
