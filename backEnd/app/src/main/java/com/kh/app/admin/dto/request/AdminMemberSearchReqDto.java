package com.kh.app.admin.dto.request;

import com.kh.app.member.entity.MemberRole;
import com.kh.app.member.entity.MemberStatus;
import com.kh.app.pet.entity.PetType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminMemberSearchReqDto {

    private String keyword;

    private PetType petType;
    // D: 강아지, C: 고양이

    private String marketingAgreeYn;
    // Y

    private MemberStatus status;
    // 정지회원 조건

    private MemberRole role;
    // A, D, S, B, U

    private Boolean adminOnly;

    private String searchType;

}