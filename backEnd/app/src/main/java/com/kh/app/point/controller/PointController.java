package com.kh.app.point.controller;

import com.kh.app.point.dto.response.PointHistoryResDto;
import com.kh.app.point.service.PointService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.kh.app.point.dto.response.PointAttendanceResDto;

@Tag(name = "포인트", description = "포인트 관련 API")
@RestController
@RequestMapping("/api/point")
@RequiredArgsConstructor
@Slf4j
public class PointController {

    private final PointService pointService;

    /**
     * 사용자 : 내 현재 포인트 조회
     */
    @Operation(summary = "내 현재 포인트 조회", description = "로그인한 사용자의 현재 보유 포인트를 조회하는 기능")
    @GetMapping("/me")
    public ResponseEntity<Long> getMyPoint(
            @AuthenticationPrincipal String username
    ) {
        Long result = pointService.getMyPoint(username);

        return ResponseEntity.ok(result);
    }

    /**
     * 사용자 : 내 포인트 내역 조회
     */
    @Operation(summary = "내 포인트 내역 조회", description = "로그인한 사용자의 포인트 적립/사용 내역을 조회하는 기능")
    @GetMapping("/history")
    public ResponseEntity<Page<PointHistoryResDto>> getMyPointHistory(
            @AuthenticationPrincipal String username,
            @RequestParam(name = "page", defaultValue = "0") int page
    ) {
        Page<PointHistoryResDto> result = pointService.getMyPointHistory(username, page);

        return ResponseEntity.ok(result);
    }

    /**
     * 사용자 : 일일 출석체크 포인트 적립
     */
    @Operation(summary = "일일 출석체크 포인트 적립", description = "로그인한 사용자가 하루 1회 출석체크 포인트를 받는 기능")
    @PostMapping("/attendance")
    public ResponseEntity<PointAttendanceResDto> earnDailyAttendancePoint(
            @AuthenticationPrincipal String username
    ) {
        PointAttendanceResDto result = pointService.earnDailyAttendancePoint(username);

        return ResponseEntity.ok(result);
    }

}