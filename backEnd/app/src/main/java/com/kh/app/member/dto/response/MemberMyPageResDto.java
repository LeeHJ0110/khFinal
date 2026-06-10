package com.kh.app.member.dto.response;

import com.kh.app.member.entity.MemberEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.format.DateTimeFormatter;

@Getter
@Builder
public class MemberMyPageResDto {

    // 닉네임
    private String nickname;

    // 이메일
    private String email;

    // 전화번호
    private String phone;

    // 가입일
    private String createdAt;

    // 주소
    private String address;

    // 상세주소
    private String addressDetail;

    private String profileImageUrl;

    private String memberMarketingAgreeYn;

    public static MemberMyPageResDto from(
            MemberEntity member,
            String profileImageUrl
    ) {
        return MemberMyPageResDto.builder()
                .nickname(member.getNickname())
                .email(member.getEmail())
                .phone(formatPhone(member.getPhone()))
                .createdAt(
                        member.getCreatedAt() != null
                                ? member.getCreatedAt().format(
                                DateTimeFormatter.ofPattern("yyyy.MM.dd")
                        )
                                : null
                )
                .address(member.getAddress())
                .addressDetail(member.getAddressDetail())
                .profileImageUrl(profileImageUrl)
                .memberMarketingAgreeYn(
                        member.getMemberMarketingAgreeYn() != null
                                ? member.getMemberMarketingAgreeYn().name()
                                : "N"
                )
                .build();
    }

    private static String formatPhone(String phone) {

        if (phone == null) {
            return null;
        }

        String onlyNumber = phone.replaceAll("[^0-9]", "");

        // 01012341234
        if (onlyNumber.length() == 11) {

            return onlyNumber.replaceFirst(
                    "(\\d{3})(\\d{4})(\\d{4})",
                    "$1-$2-$3"
            );
        }

        // 0212345678
        if (onlyNumber.length() == 10) {

            return onlyNumber.replaceFirst(
                    "(\\d{3})(\\d{3})(\\d{4})",
                    "$1-$2-$3"
            );
        }

        return phone;
    }
}