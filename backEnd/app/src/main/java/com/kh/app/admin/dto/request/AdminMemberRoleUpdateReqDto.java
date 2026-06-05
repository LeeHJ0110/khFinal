package com.kh.app.admin.dto.request;

import com.kh.app.member.entity.MemberRole;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminMemberRoleUpdateReqDto {

    private MemberRole role;

}