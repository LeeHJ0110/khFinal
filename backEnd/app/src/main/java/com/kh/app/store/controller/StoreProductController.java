package com.kh.app.store.controller;

import com.kh.app.store.dto.request.StoreInsertReqDto;
import com.kh.app.store.dto.request.StoreUpdateReqDto;
import com.kh.app.store.dto.response.StoreProductAdminDetailResDto;
import com.kh.app.store.dto.response.StoreProductAdminListResDto;
import com.kh.app.store.service.StoreProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.kh.app.store.dto.request.StoreUpdateReqDto;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

//clear
//관리자 : 상품 등록 (기본정보/ 이미지/ 급여기준/ 영양성분)
//관리자 : 상품 목록 조회


//Not Yet
//사용자 : 상품 목록 조회
//공통 : 상품 상세 조회
//관리자 : 상품 수정
//관리자 : 상품 판매중지 / 판매재개

//최근 본 상품 등록/조회
//관심상품 등록
//관심상품 목록 조회
//관심상품 삭제


@Tag(name = "스토어상품", description = "스토어상품 관련 API")
@RestController
@RequestMapping("/api/store/product")
@RequiredArgsConstructor
@Slf4j
public class StoreProductController {

    private final StoreProductService storeProductService;



    //1. 상품등록
    @Operation(summary = "상품 등록", description = "관리자가 상품을 등록하는 기능")
    @PostMapping("/admin/insert")
//    @ApiResponses({
//            @ApiResponse(responseCode = "201", description = "게시글 작성 성공"),
//            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
//            @ApiResponse(responseCode = "401", description = "인증 정보 없음")
    public ResponseEntity<Void> insert(
            @RequestPart(name = "data")StoreInsertReqDto reqDto,
            //대표이미지랑 서브이미지들
            @RequestPart(name = "mainImage", required = false) MultipartFile mainImage,
            @RequestPart(name = "subImages", required = false) List<MultipartFile> subImages
            //이건 관리자 기능이고, 관리자가 누가했는지 남기지 아니하므로 안받음.
            ) throws IOException {
        storeProductService.insert(reqDto, mainImage, subImages);

        return ResponseEntity.status(HttpStatus.CREATED)
                .build();

    }

    // 2. 관리자 상품 목록 조회
    @Operation(summary = "관리자 상품 목록조회", description = "관리자가 전체 상품목록을 조회하는 기능")
    @GetMapping("/admin")
    public ResponseEntity<Page<StoreProductAdminListResDto>> getAdminProductList(
            @RequestParam(name = "page", defaultValue = "0") int page
    ) {
        Page<StoreProductAdminListResDto> result = storeProductService.getAdminProductList(page);

        return ResponseEntity.ok(result);
    }

    // 3. 관리자 상품 상세 조회 (프론트 사용 X, 수정을 위해서)
    @Operation(summary = "관리자 상품 상세조회", description = "관리자가 상품 수정 화면에 필요한 기존 상품 정보를 조회하는 기능")
    @GetMapping("/admin/{productId}")
    public ResponseEntity<StoreProductAdminDetailResDto> getAdminProductDetail(
            @PathVariable Long productId
    ) {
        StoreProductAdminDetailResDto result = storeProductService.getAdminProductDetail(productId);

        return ResponseEntity.ok(result);
    }

    // 4. 관리자 상품 정보 수정
    @Operation(summary = "관리자 상품 정보 수정", description = "관리자가 특정 상품의 정보를 수정하는 기능")
    @PutMapping("/admin/{productId}")
    public ResponseEntity<Void> update(
            @PathVariable Long productId,
            @RequestPart(name = "data") StoreUpdateReqDto reqDto,
            @RequestPart(name = "mainImage", required = false) MultipartFile mainImage,
            @RequestPart(name = "subImages", required = false) List<MultipartFile> subImages
    ) throws IOException{
        storeProductService.update(productId, reqDto, mainImage, subImages);

        return ResponseEntity.ok().build();
    }

}
