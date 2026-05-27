package com.kh.app.member.entity;

import com.kh.app.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "MEMBER")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class MemberEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 일반 로그인용 아이디
    @Column(length = 100, unique = true)
    private String username;

    // 소셜 로그인은 비밀번호 없을 수 있음
    @Column(length = 255)
    private String password;

    @Column(length = 100, nullable = false, unique = true)
    private String nickname;

    @Column(length = 255, nullable = false)
    private String address;

    @Column(length = 255, nullable = false)
    private String addressDetail;

    // 전화번호는 문자열 추천
    @Column(length = 20, nullable = false, unique = true)
    private String phone;

    @Column(length = 255, nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(length = 1)
    private MemberMarketingAgreeYn memberMarketingAgreeYn =MemberMarketingAgreeYn.N;

    // 카카오 로그인용
    @Column(length = 255, unique = true)
    private String socialId;

    @Enumerated(EnumType.STRING)
    @Column(length = 1, nullable = false)
    @Builder.Default
    private MemberStatus status = MemberStatus.A;

    @Builder.Default
    private Long levelExp = 0L;

    @Builder.Default
    private Long point = 0L;

    @Builder.Default
    private Long diaryStreak = 0L;

    @Enumerated(EnumType.STRING)
    @Column(length = 1, nullable = false)
    @Builder.Default
    private MemberRole role = MemberRole.U;

    @Column(length = 500)
    private String profileImageUrl;

    public void updatePassword(String encodedPassword) {
        this.password = encodedPassword;
    }

    public void updateNickname(String nickname) {
        this.nickname = nickname;
    }

    public void updateProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }
    public void updateMyInfo(
            String nickname,
            String email,
            String phone,
            String address,
            String addressDetail
    ) {
        this.nickname = nickname;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.addressDetail = addressDetail;
    }

}