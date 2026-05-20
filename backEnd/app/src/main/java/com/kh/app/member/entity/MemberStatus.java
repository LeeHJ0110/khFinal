package com.kh.app.member.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MemberStatus {

     A("ACTIVE") ,S("SUSPENDED") ;

    private final String code;
}
