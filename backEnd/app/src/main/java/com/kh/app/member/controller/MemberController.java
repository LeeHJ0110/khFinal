package com.kh.app.member.controller;

import com.kh.app.member.dto.request.MemberJoinReqDto;
import com.kh.app.member.dto.request.MemberKakaoJoinReqDto;
import com.kh.app.member.dto.request.MemberKakaoLoginReqDto;
import com.kh.app.member.dto.request.MemberUpdateReqDto;
import com.kh.app.member.dto.response.MemberKakaoLoginRespDto;
import com.kh.app.member.dto.response.MemberMyPageResDto;
import com.kh.app.member.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;

@Tag(name = "회원", description = "회원 관련 API")
@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @Operation(summary = "회원가입", description = "아이디, 비밀번호, 닉네임으로 회원가입")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "회원가입 성공"),
            @ApiResponse(responseCode = "400", description = "아이디 또는 닉네임 중복")
    })
    @PostMapping("/join")
    public ResponseEntity<Void> join( @Valid @RequestBody MemberJoinReqDto dto) {
        memberService.join(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }

    @Operation(summary = "카카오 추가 회원가입", description = "카카오 로그인 후 추가 정보 입력 회원가입")
    @PostMapping("/kakao/join")
    public ResponseEntity<Void> kakaoJoin(@Valid @RequestBody MemberKakaoJoinReqDto dto) {
        memberService.kakaoJoin(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }

    @Operation(summary = "카카오 로그인", description = "카카오 인가코드로 로그인 또는 추가 회원가입 여부 확인")
    @PostMapping("/kakao/login")
    public ResponseEntity<MemberKakaoLoginRespDto> kakaoLogin(
            @RequestBody MemberKakaoLoginReqDto dto
    ) {
        MemberKakaoLoginRespDto respDto = memberService.kakaoLogin(dto);

        return ResponseEntity.ok(respDto);
    }

    @Operation(summary = "아이디 중복 확인")
    @GetMapping("/check-username")
    public boolean checkUsername(@RequestParam String username) {
        return memberService.checkUsername(username);
    }

    @Operation(summary = "닉네임 중복 확인")
    @GetMapping("/check-nickname")
    public boolean checkNickname(@RequestParam String nickname) {
        return memberService.checkNickname(nickname);
    }

    @GetMapping("/me")
    public ResponseEntity<MemberMyPageResDto> getMyInfo(
            Authentication authentication
    ) {
        String username = authentication.getName();

        MemberMyPageResDto result = memberService.getMyInfo(username);

        return ResponseEntity.ok(result);
    }

    @PutMapping("/me")
    public ResponseEntity<Void> updateMyInfo(
            @RequestBody MemberUpdateReqDto request,
            Authentication authentication
    ) {
        String loginKey = authentication.getName();

        memberService.updateMyInfo(loginKey, request);

        return ResponseEntity.ok().build();
    }
}