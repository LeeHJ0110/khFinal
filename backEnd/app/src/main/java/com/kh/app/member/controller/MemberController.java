package com.kh.app.member.controller;

import com.kh.app.member.dto.request.MemberJoinReqDto;
import com.kh.app.member.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "회원" , description = "회원 관련 API")
@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @Operation(summary = "회원가입" , description = "아이디,비밀번호,닉네임 으로 회원가입")
    @ApiResponses({
            @ApiResponse(responseCode = "201" , description = "회원가입 성공") ,
            @ApiResponse(responseCode = "400" , description = "아이디 또는 닉네임 중복")
    })
    @PostMapping("/join")
    public ResponseEntity<Object> join(@RequestBody MemberJoinReqDto dto){
        memberService.join(dto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }
}