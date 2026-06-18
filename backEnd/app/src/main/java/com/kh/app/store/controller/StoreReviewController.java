package com.kh.app.store.controller;

import com.kh.app.store.dto.request.StoreReviewUpdateReqDto;
import com.kh.app.store.dto.request.StoreReviewWriteReqDto;
import com.kh.app.store.dto.response.StoreMyReviewListResDto;
import com.kh.app.store.dto.response.StoreProductReviewResDto;
import com.kh.app.store.service.StoreReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Tag(name = "스토어리뷰", description = "스토어리뷰 관련 API")
@RestController
@RequestMapping("/api/store/review")
@RequiredArgsConstructor
@Slf4j
public class StoreReviewController {

    private final StoreReviewService storeReviewService;

// =====================================================
// 리뷰 작성
// =====================================================

    @Operation(summary = "리뷰 작성", description = "로그인한 사용자가 주문상품에 대한 리뷰를 작성하는 기능")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "리뷰 작성 성공"),
            @ApiResponse(responseCode = "401", description = "인증 정보 없음")
    })
    @PostMapping("/insert")
    public ResponseEntity<Void> write(
            @RequestPart(name = "data") StoreReviewWriteReqDto reqDto,
            @RequestPart(name = "fileList", required = false) List<MultipartFile> fileList,
            @AuthenticationPrincipal String username
    ) throws IOException {
        storeReviewService.write(reqDto, fileList, username);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

// =====================================================
// 상품별 리뷰 조회
// =====================================================

    @Operation(summary = "상품 리뷰 목록 조회", description = "상품 상세 화면에서 해당 상품의 리뷰 목록과 리뷰 요약 정보를 조회하는 기능")
    @GetMapping("/product/{productId}")
    public ResponseEntity<StoreProductReviewResDto> getProductReviewList(
            @PathVariable Long productId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "sort", defaultValue = "latest") String sort
    ) {
        StoreProductReviewResDto result =
                storeReviewService.getProductReviewList(productId, page, sort);

        return ResponseEntity.ok(result);
    }

// =====================================================
// 내 리뷰 조회
// =====================================================

    @Operation(summary = "내 리뷰 목록 조회", description = "로그인한 사용자가 본인이 작성한 리뷰 목록을 페이징 조회하는 기능")
    @GetMapping("/my")
    public ResponseEntity<Page<StoreMyReviewListResDto>> getMyReviewList(
            @AuthenticationPrincipal String username,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "sort", defaultValue = "latest") String sort
    ) {
        Page<StoreMyReviewListResDto> result =
                storeReviewService.getMyReviewList(username, page, sort);

        return ResponseEntity.ok(result);
    }

// =====================================================
// 리뷰 수정
// =====================================================

    @Operation(summary = "리뷰 수정", description = "로그인한 사용자가 본인이 작성한 리뷰를 수정하는 기능")
    @PutMapping("/edit/{reviewId}")
    public ResponseEntity<Void> update(
            @PathVariable Long reviewId,
            @RequestPart(name = "data") StoreReviewUpdateReqDto reqDto,
            @RequestPart(name = "fileList", required = false) List<MultipartFile> fileList,
            @AuthenticationPrincipal String username
    ) throws IOException {
        storeReviewService.update(reviewId, reqDto, fileList, username);

        return ResponseEntity.ok().build();
    }

// =====================================================
// 리뷰 삭제
// =====================================================

    @Operation(summary = "리뷰 삭제", description = "본인은 본인 리뷰를 삭제할 수 있고, ADMIN/STORE 권한은 모든 리뷰를 삭제할 수 있는 기능")
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal String username
    ) {
        storeReviewService.delete(reviewId, username);

        return ResponseEntity.ok().build();
    }

}
