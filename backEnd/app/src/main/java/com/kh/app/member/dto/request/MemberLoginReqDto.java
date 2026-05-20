package com.kh.app.member.dto.request;

import com.kh.app.member.entity.MemberEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberLoginReqDto {

    private String username;
    private String password;

}