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

    public static MemberMyPageResDto from(MemberEntity member) {

        return MemberMyPageResDto.builder()
                .nickname(member.getNickname())
                .email(member.getEmail())

                // 전화번호 포맷팅
                .phone(formatPhone(member.getPhone()))

                // 가입일 포맷팅
                .createdAt(
                        member.getCreatedAt() != null
                                ? member.getCreatedAt().format(
                                DateTimeFormatter.ofPattern("yyyy.MM.dd")
                        )
                                : null
                )

                .address(member.getAddress())
                .addressDetail(member.getAddressDetail())

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