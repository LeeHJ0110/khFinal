package com.kh.app.member.dto.request;

import lombok.*;

@Getter
@Setter
public class MemberKakaoJoinReqDto {

    private String socialId;

    private String nickname;

    private String email;

    private String phone;

    private String address;

    private String addressDetail;

    private String memberMarketingAgreeYn;
    private String zipCode;
}
