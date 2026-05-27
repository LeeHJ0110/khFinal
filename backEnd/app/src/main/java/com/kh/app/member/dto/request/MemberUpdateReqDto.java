package com.kh.app.member.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberUpdateReqDto {

    private String nickname;
    private String email;
    private String phone;
    private String address;
    private String addressDetail;
}