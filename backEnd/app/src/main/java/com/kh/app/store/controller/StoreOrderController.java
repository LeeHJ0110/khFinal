package com.kh.app.store.controller;


import com.kh.app.store.dto.request.StoreCartInsertReqDto;
import com.kh.app.store.dto.request.StoreCartQtyUpdateReqDto;
import com.kh.app.store.dto.response.StoreCartListResDto;
import com.kh.app.store.service.StoreOrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


//<완성>
//사용자 : 장바구니 상품 등록


//<미완성>
//사용자 : 장바구니 상품 목록 조회
//사용자 : 장바구니 상품 삭제

//주문금액 :

//주문하기 (카카오 결제 API) + 배송정보 받아오기
//결제하기
//주문 취소


//관리자 배송상태 변경

@Tag(name = "스토어주문", description = "스토어주문 관련 API")
@RestController
@RequestMapping("/api/store/order")
@RequiredArgsConstructor
@Slf4j
public class StoreOrderController {

    private final StoreOrderService storeOrderService;

    // 1. 사용자 : 장바구니 등록
    @Operation(summary = "장바구니 상품 등록", description = "사용자가 장바구니에 상품을 등록하는 기능")
    @PostMapping("/cart/insert")
    public ResponseEntity<Void> cartInsert(
            @RequestBody StoreCartInsertReqDto reqDto,
            @AuthenticationPrincipal String username
    ) {
        storeOrderService.cartInsert(reqDto, username);

        return ResponseEntity.status(HttpStatus.CREATED)
                .build();
    }

    // 2. 사용자 : 장바구니 목록 조회
    @Operation(summary = "장바구니 목록 조회", description = "사용자의 장바구니 상품 목록과 주문금액을 조회하는 기능")
    @GetMapping("/cart/list")
    public ResponseEntity<StoreCartListResDto> getCartList(
            @AuthenticationPrincipal String username
    ) {
        StoreCartListResDto result = storeOrderService.getCartList(username);

        return ResponseEntity.ok(result);
    }

    // 3. 사용자 : 장바구니 상품 삭제
    @Operation(summary = "장바구니 상품 삭제", description = "사용자가 장바구니에 담긴 특정 상품을 삭제하는 기능")
    @DeleteMapping("/cart/delete/{cartItemId}")
    public ResponseEntity<Void> cartDelete(
            @PathVariable Long cartItemId,
            @AuthenticationPrincipal String username
    ) {
        storeOrderService.cartDelete(cartItemId, username);

        return ResponseEntity.noContent()
                .build();
    }

    // 4. 사용자 : 장바구니 상품 수량 변경
    @Operation(summary = "장바구니 상품 수량 변경", description = "사용자가 장바구니에 담긴 특정 상품의 수량을 변경하는 기능")
    @PatchMapping("/cart/update/{cartItemId}")
    public ResponseEntity<Object> cartQtyUpdate(
            @PathVariable Long cartItemId,
            @RequestBody StoreCartQtyUpdateReqDto reqDto,
            @AuthenticationPrincipal String username

    ){
        storeOrderService.cartQtyUpdate(cartItemId, reqDto, username);

        return ResponseEntity.ok()
                .build();
    }
}