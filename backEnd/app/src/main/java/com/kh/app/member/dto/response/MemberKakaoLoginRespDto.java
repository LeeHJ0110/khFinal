package com.kh.app.member.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MemberKakaoLoginRespDto {




        // 기존 회원이면 LOGIN
        // 신규 회원이면 NEED_JOIN
        private String result;

        // 기존 회원 로그인 성공 시 JWT
        private String token;

        // 신규 회원일 때 임시 카카오 식별값
        private String socialId;

        private String email;

        private String nickname;


}
