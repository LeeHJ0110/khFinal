package com.kh.app.store.controller;


import com.kh.app.store.dto.request.StoreCartInsertReqDto;
import com.kh.app.store.dto.request.StoreCartQtyUpdateReqDto;
import com.kh.app.store.dto.request.StorePayReadyReqDto;
import com.kh.app.store.dto.response.StoreCartListResDto;
import com.kh.app.store.dto.response.StorePayReadyResDto;
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
//사용자 : 장바구니 상품 목록 조회
//사용자 : 장바구니 상품 삭제
//사용자 : 장바구니 상품 수량 변경


//<미완성>
//주문하기 (카카오 결제 API) + 배송정보 받아오기
//결제하기
//주문 취소

//<일단후순위>
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

    //결제
    // 5. 사용자 : 카카오페이 결제 준비
    @Operation(summary = "카카오페이 결제 준비", description = "장바구니 상품 기준으로 주문을 생성하고 카카오페이 결제 URL을 발급받는 기능")
    @PostMapping("/checkout/ready")
    public ResponseEntity<StorePayReadyResDto> payReady(
            @RequestBody StorePayReadyReqDto reqDto,
            @AuthenticationPrincipal String username
    ) {
        StorePayReadyResDto result = storeOrderService.payReady(reqDto, username);

        return ResponseEntity.ok(result);
    }

    // 6. 사용자 : 카카오페이 결제 승인
    @Operation(summary = "카카오페이 결제 승인", description = "카카오페이 결제 성공 후 pg_token으로 최종 결제 승인을 처리하는 기능")
    @GetMapping("/pay/approve")
    public ResponseEntity<Void> payApprove(
            @RequestParam Long orderId,
            @RequestParam("pg_token") String pgToken
    ) {
        storeOrderService.payApprove(orderId, pgToken);

        return ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", "http://localhost:5173/store/order/complete?orderId=" + orderId)
                .build();
    }

    @GetMapping("/pay/cancel")
    public ResponseEntity<Void> payCancel(
            @RequestParam Long orderId
    ) {
        return ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", "http://localhost:5173/store/order/cancel?orderId=" + orderId)
                .build();
    }

    @GetMapping("/pay/fail")
    public ResponseEntity<Void> payFail(
            @RequestParam Long orderId
    ) {
        return ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", "http://localhost:5173/store/order/fail?orderId=" + orderId)
                .build();
    }
}