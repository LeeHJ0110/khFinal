package com.kh.app.member.dto.request;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.entity.MemberMarketingAgreeYn;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberJoinReqDto {

    @NotBlank
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,12}$",
            message = "아이디는 영문+숫자 조합 6~12자리여야 합니다."
    )
    private String username;
    private String password;
    private String nickname;
    private String socialId;
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    private String email;
    @Pattern(
            regexp = "^010\\d{8}$",
            message = "전화번호 형식이 올바르지 않습니다."
    )
    private String phone;
    private String address;
    private String addressDetail;
    private String zipCode;
    private MemberMarketingAgreeYn memberMarketingAgreeYn;


    public MemberEntity toEntity(String encodedPassword) {
        return MemberEntity.builder()
                .username(username)
                .password(encodedPassword)
                .nickname(nickname)
                .socialId(socialId)
                .email(email)
                .phone(phone)
                .address(address)
                .addressDetail(addressDetail)
                .memberMarketingAgreeYn(memberMarketingAgreeYn)
                .build();
    }

}