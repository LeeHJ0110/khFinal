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


//<완료>
//1. 사용자 : 리뷰 작성
//2. 사용자 : 상품별 리뷰 목록 조회
//3. 사용자 : 본인 리뷰내역 모아보기
//4. 사용자 : 리뷰 수정 (본인 리뷰내역 페이지에서)
//5. 리뷰 삭제 (본인도 할줄알고(본인 리뷰내역 페이지), 관리자도(상품상세보기-리뷰목록 에서) 할 줄 아는 물리적 삭제)

@Tag(name = "스토어리뷰", description = "스토어리뷰 관련 API")
@RestController
@RequestMapping("/api/store/review")
@RequiredArgsConstructor
@Slf4j
public class StoreReviewController {

    private final StoreReviewService storeReviewService;

    //1. 사용자 : 리뷰 작성
    @Operation(summary = "리뷰 작성", description = "제목, 내용, 별점 + 토큰 으로 리뷰 작성 ( + 파일)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "리뷰 작성 성공 ~~~"),
            @ApiResponse(responseCode = "401", description = "인증 정보 없음 ㅠㅠ")
    })
    @PostMapping("/insert")
    public ResponseEntity<Object> write(
            @RequestPart(name = "data") StoreReviewWriteReqDto reqDto,
            @RequestPart(name = "fileList", required = false) List<MultipartFile> fileList,
            @AuthenticationPrincipal String username
    )throws IOException {
        storeReviewService.write(reqDto, fileList, username);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }

    //2. 상품별 리뷰 목록 조회
    @Operation(summary = "상품의 리뷰보기", description = "사용자가 상품상세보기 들어갔을때 이 상품의 리뷰들만 모아보는")
    @GetMapping("/product/{productId}")
    public ResponseEntity<StoreProductReviewResDto> getProductReviewList(
            @PathVariable Long productId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "sort", defaultValue = "latest") String sort
    ) {
        StoreProductReviewResDto result = storeReviewService.getProductReviewList(productId, page, sort);
        return ResponseEntity.ok(result);
    }

    //3. 사용자 : 본인 리뷰내역 모아보기
    @Operation(summary = "본인 리뷰내역 조회", description = "로그인한 사용자가 작성한 리뷰 목록을 페이징 조회합니다.")
    @GetMapping("/my")
    public ResponseEntity<Page<StoreMyReviewListResDto>> getMyReviewList(
            @AuthenticationPrincipal String username,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "sort", defaultValue = "latest") String sort
    ) {
        Page<StoreMyReviewListResDto> result = storeReviewService.getMyReviewList(
                username,
                page,
                sort
        );

        return ResponseEntity.ok(result);
    }

    //4. 사용자 : 리뷰 수정 (본인 리뷰내역 페이지에서)
    @Operation(summary = "리뷰 수정", description = "로그인한 사용자가 본인이 작성한 리뷰를 수정합니다.")
    @PutMapping("/edit/{reviewId}")
    public ResponseEntity<Object> update(
            @PathVariable(name = "reviewId") Long reviewId,
            @RequestPart(name = "data") StoreReviewUpdateReqDto reqDto,
            @RequestPart(name = "fileList", required = false) List<MultipartFile> fileList,
            @AuthenticationPrincipal String username
    ) throws IOException {
        storeReviewService.update(reviewId, reqDto, fileList, username);
        return ResponseEntity.ok().build();
    }


    //5. 리뷰 삭제
    @Operation(summary = "리뷰 삭제", description = "본인은 본인 리뷰를 삭제할 수 있고, ADMIN/STORE 권한은 모든 리뷰를 삭제 가능")
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Object> delete(
            @PathVariable(name = "reviewId") Long reviewId,
            @AuthenticationPrincipal String username
    ) {
        storeReviewService.delete(reviewId, username);
        return ResponseEntity.ok().build();
    }


}
