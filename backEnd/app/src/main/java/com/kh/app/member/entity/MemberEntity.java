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
    private Long memberId;

    @Column(length = 100  , unique = true)
    private String memberUsername;

    @Column(length = 100 )
    private String memberPassword;

    @Column(length = 100 , nullable = false , unique = true)
    private String memberNickname;

    @Column(length = 100 , nullable = false)
    private String memberAddress;

    @Column(length = 100 , nullable = false)
    private String memberAddressDetail;

    @Column(length = 100 , nullable = false, unique = true)
    private Long memberPhone;

    @Column(length = 100 , nullable = false)
    private String memberEmail;

    @Enumerated(EnumType.STRING)
    @Column(length = 1 , nullable = false)
    private MemberMarketingAgreeYn memberMarketingAgreeYn;

    @Column(length = 100 , unique = true)
    private String memberSocialId;

    @Enumerated(EnumType.STRING)
    @Column(length = 1 , nullable = false)
    @Builder.Default
    private MemberStatus memberStatus=MemberStatus.A;

    @Column(length = 100 )
    private Long memberLevelExp;

    @Column(length = 100 )
    private Long memberPoint;

    @Column(length = 100 )
    private Long memberDiaryStreak;


    @Enumerated(EnumType.STRING)
    @Column(length = 1 , nullable = false)
    @Builder.Default
    private MemberRole memberRole = MemberRole.U;

    @Column
    private String profileImageUrl;

    public void updatePassword(String encodedPassword){
        this.memberPassword = encodedPassword;
    }

    public void updateNickname(String nickname){
        this.memberNickname = nickname;
    }

    public void updateProfileImageUrl(String profileImageUrl){
        this.profileImageUrl = profileImageUrl;
    }

}