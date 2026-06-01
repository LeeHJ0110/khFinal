package com.kh.app.mypage.community.controller;

import com.kh.app.mypage.community.dto.response.CommunityHistoryBoardResDto;
import com.kh.app.mypage.community.service.CommunityHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mypage/community")
@RequiredArgsConstructor
public class CommunityHistoryController {

    private final CommunityHistoryService communityHistoryService;

    @GetMapping("/free")
    public ResponseEntity<Page<CommunityHistoryBoardResDto>> getMyFreeBoards(
            Authentication authentication,
            @PageableDefault(
                    size = 5,
                    sort = "createdAt",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable
    ) {
        return ResponseEntity.ok(
                communityHistoryService.getMyFreeBoards(
                        authentication.getName(),
                        pageable
                )
        );
    }

    @GetMapping("/product-review")
    public ResponseEntity<Page<CommunityHistoryBoardResDto>> getMyProductReviews(
            Authentication authentication,
            @PageableDefault(
                    size = 5,
                    sort = "createdAt",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable
    ) {
        return ResponseEntity.ok(
                communityHistoryService.getMyProductReviews(
                        authentication.getName(),
                        pageable
                )
        );
    }

    @GetMapping("/facility-review")
    public ResponseEntity<Page<CommunityHistoryBoardResDto>> getMyFacilityReviews(
            Authentication authentication,
            @PageableDefault(
                    size = 5,
                    sort = "createdAt",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable
    ) {
        return ResponseEntity.ok(
                communityHistoryService.getMyFacilityReviews(
                        authentication.getName(),
                        pageable
                )
        );
    }
}