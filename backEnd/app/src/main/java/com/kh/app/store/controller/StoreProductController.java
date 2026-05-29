package com.kh.app.store.controller;

import com.kh.app.store.dto.request.StoreInsertReqDto;
import com.kh.app.store.dto.request.StoreUpdateReqDto;
import com.kh.app.store.dto.response.StoreProductAdminDetailResDto;
import com.kh.app.store.dto.response.StoreProductAdminListResDto;
import com.kh.app.store.dto.response.StoreProductDetailResDto;
import com.kh.app.store.dto.response.StoreProductListResDto;
import com.kh.app.store.entity.StoreProductCategory;
import com.kh.app.store.service.StoreProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

//<clear>
//관리자 : 상품 등록 (기본정보/ 이미지/ 급여기준/ 영양성분)
//관리자 : 상품 목록 조회
//관리자 : 상품 수정
//관리자 : 상품 상세 조회 (for 수정)
//관리자 : 상품 판매중지
//관리자 : 상품 판매재개
//사용자 : 상품 상세 조회
//사용자 : 상품 목록 조회
//사용자 : 베스트 상품 4개 목록 조회 (공통홈/ 강아지 홈/ 고양이 홈)


//<Not Yet>

//최근 본 상품 등록/조회
//관심상품 등록
//관심상품 목록 조회
//관심상품 삭제

//<etc>
// 현재 관리자와 사용자 권한 등 디테일이 안들어가있음 (api손보고 권한 추가해야함)
// 이미지 추가 등 s3관련 부분 손봐야함


@Tag(name = "스토어상품", description = "스토어상품 관련 API")
@RestController
@RequestMapping("/api/store/product")
@RequiredArgsConstructor
@Slf4j
public class StoreProductController {

    private final StoreProductService storeProductService;

    //1. 관리자 : 상품등록
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

            ) throws IOException {
        storeProductService.insert(reqDto, mainImage, subImages);

        return ResponseEntity.status(HttpStatus.CREATED)
                .build();

    }

    // 2. 관리자 : 상품 목록 조회
    @Operation(summary = "관리자 상품 목록조회", description = "관리자가 전체 상품목록을 조회하는 기능")
    @GetMapping("/admin")
    public ResponseEntity<Page<StoreProductAdminListResDto>> getAdminProductList(
            @RequestParam(name = "page", defaultValue = "0") int page
    ) {
        Page<StoreProductAdminListResDto> result = storeProductService.getAdminProductList(page);

        return ResponseEntity.ok(result);

    }

    // 3. 사용자 : 상품 목록 조회(조건 검색 / 페이징X)
    @Operation(
            summary = "사용자 상품 목록조회",
            description = "사용자가 판매중인 상품 목록을 각 필터 조건으로 조회하는 기능"
    )
    @GetMapping
    public ResponseEntity<List<StoreProductListResDto>> getProductList(
            @RequestParam(name = "targetPetType", required = false) String targetPetType,
            @RequestParam(name = "category", required = false) StoreProductCategory category,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "tagId", required = false) Long tagId,
            @RequestParam(name = "tagName", required = false) String tagName,
            @RequestParam(name = "sort", defaultValue = "latest") String sort
    ) {
        List<StoreProductListResDto> result =
                storeProductService.getProductList(
                        targetPetType,
                        category,
                        keyword,
                        tagId,
                        tagName,
                        sort
                );

        return ResponseEntity.ok(result);
    }


    // 4. 관리자 : 상품 상세 조회
    @Operation(summary = "관리자 상품 상세조회", description = "관리자가 상품 수정 화면에 필요한 기존 상품 정보를 조회하는 기능")
    @GetMapping("/admin/{productId}")
    public ResponseEntity<StoreProductAdminDetailResDto> getAdminProductDetail(
            @PathVariable Long productId
    ) {
        StoreProductAdminDetailResDto result = storeProductService.getAdminProductDetail(productId);

        return ResponseEntity.ok(result);
    }

    // 5. 사용자 : 상품 상세 조회
    @Operation(summary = "사용자 상품 상세조회", description = "사용자가 특정 상품의 상세 정보를 조회하는 기능")
    @GetMapping("/{productId}")
    public ResponseEntity<StoreProductDetailResDto> getProductDetail(
            @PathVariable Long productId
    ) {
        StoreProductDetailResDto result = storeProductService.getProductDetail(productId);
        return ResponseEntity.ok(result);
    }

    // 6. 관리자 : 상품 정보 수정
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

    // 7. 관리자 : 상품 판매중지
    @Operation(summary = "관리자 상품 판매중지", description = "관리자가 특정 상품의 판매상태를 판매중지로 변경하는 기능")
    @PatchMapping("/admin/{productId}/stop")
    public ResponseEntity<Void> stopSelling(
            @PathVariable Long productId
    ) {
        storeProductService.stopSelling(productId);

        return ResponseEntity.ok().build();
    }

    // 8. 관리자 : 상품 판매재개
    @Operation(summary = "관리자 상품 판매재개", description = "관리자가 특정 상품의 판매상태를 판매중으로 변경하는 기능")
    @PatchMapping("/admin/{productId}/resume")
    public ResponseEntity<Void> resumeSelling(
            @PathVariable Long productId
    ) {
        storeProductService.resumeSelling(productId);

        return ResponseEntity.ok().build();
    }

    //9. 사용자 : 베스트 상품 4개 목록 조회 (공통홈/ 강아지 홈/ 고양이 홈)
    //파라미터 null은 공통 , D는 강아지, C는 고양이
    @Operation(summary = "사용자 베스트 상품 조회", description = "판매중인 상품 중 조회수 상위 4개 상품을 조회하는 기능")
    @GetMapping("/best")
    public ResponseEntity<List<StoreProductListResDto>> getBestProductList(
            @RequestParam(name = "targetPetType", required = false) String targetPetType
    ) {
        List<StoreProductListResDto> result = storeProductService.getBestProductList(targetPetType);

        return ResponseEntity.ok(result);
    }



}
