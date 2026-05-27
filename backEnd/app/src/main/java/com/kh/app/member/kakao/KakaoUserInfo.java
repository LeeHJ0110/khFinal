package com.kh.app.member.kakao;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class KakaoUserInfo {

    private String socialId;

    private String email;

    private String nickname;

}