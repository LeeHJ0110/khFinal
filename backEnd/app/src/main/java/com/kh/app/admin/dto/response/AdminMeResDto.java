package com.kh.app.admin.dto.response;

import com.kh.app.member.entity.MemberEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminMeResDto {

    private Long memberId;
    private String username;
    private String nickname;
    private String role;
    private String profileImageUrl;

    public static AdminMeResDto from(MemberEntity member, String profileImageUrl) {
        return AdminMeResDto.builder()
                .memberId(member.getId())
                .username(member.getUsername())
                .nickname(member.getNickname())
                .role(member.getRole().name())
                .profileImageUrl(profileImageUrl)
                .build();
    }
}