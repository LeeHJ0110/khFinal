package com.kh.app.admin.dto.request;

import com.kh.app.member.entity.MemberStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminMemberStatusUpdateReqDto {

    private MemberStatus status;

}