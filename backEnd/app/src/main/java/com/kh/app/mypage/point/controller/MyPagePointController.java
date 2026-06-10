package com.kh.app.mypage.point.controller;

import com.kh.app.mypage.point.dto.response.PointHistoryListResDto;
import com.kh.app.mypage.point.dto.response.PointSummaryResDto;
import com.kh.app.mypage.point.service.MyPagePointService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mypage/point")
@RequiredArgsConstructor
public class MyPagePointController {

    private final MyPagePointService myPagePointService;

    @GetMapping("/summary")
    public ResponseEntity<PointSummaryResDto> getPointSummary(
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                myPagePointService.getPointSummary(
                        authentication.getName()
                )
        );
    }

    @GetMapping("/history")
    public ResponseEntity<Page<PointHistoryListResDto>> getPointHistory(
            Authentication authentication,
            @PageableDefault(
                    size = 10,
                    sort = "createdAt",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable
    ) {
        return ResponseEntity.ok(
                myPagePointService.getPointHistory(
                        authentication.getName(),
                        pageable
                )
        );
    }
}