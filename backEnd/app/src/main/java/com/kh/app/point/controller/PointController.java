package com.kh.app.point.controller;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.point.dto.response.PointHistoryResDto;
import com.kh.app.point.service.PointService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@Tag(name = "포인트", description = "포인트 관련 API")
@RestController
@RequestMapping("/api/point")
@RequiredArgsConstructor
@Slf4j
public class PointController {

    private final PointService pointService;
    private final MemberRepository memberRepository;

    /**
     * 내 포인트 내역 조회
     */
    @GetMapping("/history")
    public Page<PointHistoryResDto> getMyPointHistory(Pageable pageable) {
        MemberEntity member = getLoginMember();

        return pointService.getMyPointHistory(member, pageable);
    }

    /**
     * 내 현재 포인트 조회
     */
    @GetMapping("/me")
    public Long getMyPoint() {
        MemberEntity member = getLoginMember();

        return member.getPoint();
    }

    private MemberEntity getLoginMember() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return memberRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("로그인 회원을 찾을 수 없습니다."));
    }
}