package com.kh.app.admin.dto.response;

import com.kh.app.member.entity.MemberEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AdminMemberDetailResDto {

    private Long memberId;

    private String username;
    private String nickname;
    private String email;
    private String phone;

    private String address;
    private String addressDetail;
    private String profileImageUrl;

    private String marketingAgreeYn;
    private String status;
    private String role;

    private LocalDateTime createdAt;

    public static AdminMemberDetailResDto from(MemberEntity member, String profileImageUrl) {
        return AdminMemberDetailResDto.builder()
                .memberId(member.getId())
                .username(member.getUsername())
                .nickname(member.getNickname())
                .email(member.getEmail())
                .phone(member.getPhone())
                .address(member.getAddress())
                .addressDetail(member.getAddressDetail())
                .profileImageUrl(profileImageUrl)
                .marketingAgreeYn(member.getMemberMarketingAgreeYn().name())
                .status(member.getStatus().name())
                .role(member.getRole().name())
                .createdAt(member.getCreatedAt())
                .build();
    }
}