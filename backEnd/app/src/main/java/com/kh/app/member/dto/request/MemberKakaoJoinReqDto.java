package com.kh.app.member.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
public class MemberKakaoJoinReqDto {

    private String username;
    private String socialId;

    private String nickname;

    @Email(message = "이메일 형식이 올바르지 않습니다.")
    private String email;

    @Pattern(
            regexp = "^010\\d{8}$",
            message = "전화번호 형식이 올바르지 않습니다."
    )
    private String phone;

    @NotBlank(message = "주소를 입력해주세요.")
    private String address;

    @NotBlank(message = "상세주소를 입력해주세요.")
    private String addressDetail;

    private String memberMarketingAgreeYn;
    private String zipCode;
}
