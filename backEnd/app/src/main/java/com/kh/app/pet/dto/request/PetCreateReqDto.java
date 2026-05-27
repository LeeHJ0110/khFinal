package com.kh.app.pet.dto.request;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.pet.entity.*;
import lombok.*;

import java.math.BigDecimal;


@Getter
@NoArgsConstructor
public class PetCreateReqDto {
    private String name;
    private String birthDate;
    private PetGender gender;
    private BigDecimal weight;
    private PetNeuteredYn neuteredYn;
    private String breedName;
    private PetRepresentYn representYn;

    public PetEntity toEntity(MemberEntity member, BreedEntity breed) {
        return PetEntity.builder()
                .name(name)
                .birthDate(birthDate)
                .gender(gender)
                .weight(weight)
                .neuteredYn(neuteredYn)
                .representYn(representYn)
                .member(member)
                .breed(breed)
                .build();
    }
}
