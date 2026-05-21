package com.kh.app.member.dto.request;

import com.kh.app.member.entity.MemberEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberJoinReqDto {

    private String username;
    private String password;
    private String nickname;
    private String socialId;
    private String email;
    private Long phone;
    private String address;
    private String addressDetail;


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
                .build();
    }

}