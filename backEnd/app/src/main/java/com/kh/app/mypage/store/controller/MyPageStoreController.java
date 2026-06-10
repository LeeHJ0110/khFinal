package com.kh.app.mypage.store.controller;

import com.kh.app.mypage.store.dto.response.StoreOrderHistoryResDto;
import com.kh.app.mypage.store.service.MyPageStoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mypage/store")
@RequiredArgsConstructor
public class MyPageStoreController {

    private final MyPageStoreService myPageStoreService;

    @GetMapping("/orders")
    public ResponseEntity<Page<StoreOrderHistoryResDto>> getMyOrders(
            Authentication authentication,
            @PageableDefault(
                    size = 10,
                    sort = "createdAt",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable
    ) {
        return ResponseEntity.ok(
                myPageStoreService.getMyOrders(
                        authentication.getName(),
                        pageable
                )
        );
    }
}