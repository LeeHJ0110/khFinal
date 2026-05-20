package com.kh.app.store.controller;

import com.kh.app.store.service.StoreProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


//상품 목록 조회
//상품 상세 조회
//상품 등록 (기본정보/ 이미지/ 급여기준/ 영양성분)
//상품 수정
//상품 판매중지 / 판매재개
//상품 이미지 등록
//최근 본 상품 등록/조회
//관심상품


@Tag(name = "스토어상품", description = "스토어상품 관련 API")
@RestController
@RequestMapping("/api/store/product")
@RequiredArgsConstructor
@Slf4j
public class StoreProductController {

    private final StoreProductService storeProductService;

    @Operation(summary = "상품 등록", description = "관리자가 상품을 등록하는 기능")
    @PostMapping
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "게시글 작성 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증 정보 없음")
    })
    public void m01(){

    }

}
