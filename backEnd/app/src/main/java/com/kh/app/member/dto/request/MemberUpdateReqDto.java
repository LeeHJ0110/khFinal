package com.kh.app.member.dto.request;

import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberUpdateReqDto {

    private String nickname;
    private String email;
    @Pattern(
            regexp = "^010\\d{8}$",
            message = "전화번호 형식이 올바르지 않습니다."
    )
    private String phone;
    private String address;
    private String addressDetail;
}