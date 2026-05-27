package com.kh.app.pet.dto.request;

import com.kh.app.pet.entity.PetGender;
import com.kh.app.pet.entity.PetRepresentYn;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class PetUpdateReqDto {

    private String petType;
    private String breedName;
    private String name;
    private PetGender gender;
    private String birthDate;
    private BigDecimal weight;
    private PetRepresentYn representYn;
}