package com.kh.app.petinsurance.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PetInsuranceCalculateReqDto {
//사용자가 선택한 보험상품
    private Long productId;

    //사용자가 입력한 반려동물 생년월일
    private String birthDate;


}
