package com.kh.app.store.controller;


import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//장바구니
//주문하기
//배송
//결제 프로세스
//주문취소
//관리자 배송상태 변경

@Tag(name = "스토어주문", description = "스토어주문 관련 API")
@RestController
@RequestMapping("/api/store")
@RequiredArgsConstructor
@Slf4j
public class StoreOrderController {
}
