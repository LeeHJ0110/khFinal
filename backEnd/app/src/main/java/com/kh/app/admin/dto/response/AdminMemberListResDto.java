package com.kh.app.admin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class AdminMemberListResDto {

    private Long memberId;

    private String username;
    private String nickname;
    private String email;
    private String phone;

    private boolean hasDog;
    private boolean hasCat;

    private String marketingAgreeYn;
    private String status;
    private String role;

    private LocalDateTime createdAt;
}