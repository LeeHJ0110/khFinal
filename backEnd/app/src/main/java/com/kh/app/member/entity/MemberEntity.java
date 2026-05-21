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

    @Column(length = 100  , unique = true)
    private String username;

    @Column(length = 100 )
    private String password;

    @Column(length = 100 , nullable = false , unique = true)
    private String nickname;


    @Column(length = 100 , nullable = false)
    private String address;

    @Column(length = 100 , nullable = false)
    private String addressDetail;

    @Column(length = 100 , nullable = false, unique = true)
    private Long phone;

    @Column(length = 100 , nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(length = 1 )
    private MemberMarketingAgreeYn memberMarketingAgreeYn;

    @Column(length = 100 , unique = true)
    private String socialId;

    @Enumerated(EnumType.STRING)
    @Column(length = 1 , nullable = false)
    @Builder.Default
    private MemberStatus status=MemberStatus.A;

    @Column(length = 100 )
    private Long levelExp;

    @Column(length = 100 )
    private Long point;

    @Column(length = 100 )
    private Long diaryStreak;


    @Enumerated(EnumType.STRING)
    @Column(length = 1 , nullable = false)
    @Builder.Default
    private MemberRole role = MemberRole.U;

    @Column
    private String profileImageUrl;

    public void updatePassword(String encodedPassword){
        this.password = encodedPassword;
    }

    public void updateNickname(String nickname){
        this.nickname = nickname;
    }

    public void updateProfileImageUrl(String profileImageUrl){
        this.profileImageUrl = profileImageUrl;
    }

}