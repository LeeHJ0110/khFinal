package com.kh.app.member.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MemberRole {

    U("USER") , A("ADMIN") ,D("DOCTOR"),S("STORE") ,B("BOARD");

    private final String code;

}