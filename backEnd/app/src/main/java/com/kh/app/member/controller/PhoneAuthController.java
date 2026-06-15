package com.kh.app.member.controller;

import com.kh.app.member.dto.request.PhoneAuthSendReqDto;
import com.kh.app.member.dto.request.PhoneAuthVerifyReqDto;
import com.kh.app.member.service.PhoneAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/member/phone")
@RequiredArgsConstructor
public class PhoneAuthController {

    private final PhoneAuthService phoneAuthService;

    @PostMapping("/send")
    public ResponseEntity<String> send(@RequestBody PhoneAuthSendReqDto reqDto) {
        try {
            phoneAuthService.sendCode(reqDto.getPhone());
            return ResponseEntity.ok("인증번호가 발송되었습니다.");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verify(@RequestBody PhoneAuthVerifyReqDto reqDto) {
        try {
            phoneAuthService.verifyCode(reqDto.getPhone(), reqDto.getCode());
            return ResponseEntity.ok("전화번호 인증이 완료되었습니다.");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}