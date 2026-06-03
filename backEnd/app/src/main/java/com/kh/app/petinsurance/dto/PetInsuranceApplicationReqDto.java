package com.kh.app.petinsurance.dto;

import lombok.Getter;
import lombok.Setter;
//가입신청 dto
@Getter
@Setter
public class PetInsuranceApplicationReqDto {

    // 가입할 반려동물
    private Long petId;

    // 선택한 보험 상품
    private Long productId;
}
