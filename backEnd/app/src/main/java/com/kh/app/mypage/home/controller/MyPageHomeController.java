package com.kh.app.mypage.home.controller;

import com.kh.app.mypage.home.dto.response.MyPageHomeSummaryResDto;
import com.kh.app.mypage.home.service.MyPageHomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mypage/home")
@RequiredArgsConstructor
public class MyPageHomeController {

    private final MyPageHomeService myPageHomeService;

    @GetMapping("/summary")
    public MyPageHomeSummaryResDto getSummary(
            Authentication authentication
    ) {
        return myPageHomeService.getSummary(
                authentication.getName()
        );
    }
}