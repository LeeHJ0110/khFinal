package com.kh.app.store.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//리뷰 작성
//상품별 리뷰 목록 조회
//리뷰 수정
//리뷰 삭제

@Tag(name = "스토어리뷰", description = "스토어리뷰 관련 API")
@RestController
@RequestMapping("/api/store/review")
@RequiredArgsConstructor
@Slf4j
public class StoreReviewController {
}
