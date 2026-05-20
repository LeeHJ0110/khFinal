package com.kh.app.member.dto.request;

import com.kh.app.member.entity.MemberEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberJoinReqDto {

    private String memberUsername;
    private String memberPassword;
    private String memberNickname;
    private String memberSocialId;
    private String memberEmail;
    private Long memberPhone;
    private String memberAddress;
    private String memberAddressDetail;


    public MemberEntity toEntity(String encodedPassword) {
        return MemberEntity.builder()
                .memberUsername(memberUsername)
                .memberPassword(memberPassword)
                .memberNickname(memberNickname)
                .memberSocialId(memberSocialId)
                .memberEmail(memberEmail)
                .memberPhone(memberPhone)
                .memberAddress(memberAddress)
                .memberAddressDetail(memberAddressDetail)
                .build();
    }

}