package com.kh.app.petinsurance.controller;

import com.kh.app.petinsurance.kakao.dto.KakaoPayApproveRespDto;
import com.kh.app.petinsurance.kakao.dto.KakaoPayReadyRespDto;
import com.kh.app.petinsurance.service.PetInsuranceService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;
@Tag(name = "펫 보험", description = "펫보험 관련 API")
@RestController
@RequestMapping("/api/petinsurance")
@RequiredArgsConstructor
@Slf4j
public class PetInsuranceController {

    private final PetInsuranceService petInsuranceService;

    // 보험 가입 신청
    @PostMapping("/application")
    public ResponseEntity<Object> applyInsurance(
            @RequestPart("data") String data,
            @RequestPart("medicalCertificate") MultipartFile medicalCertificate,
            @AuthenticationPrincipal String username
    ) throws Exception {

        petInsuranceService.applyInsurance(
                data,
                medicalCertificate,
                username
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }

    // 관리자 보험 가입 승인
    @PatchMapping("/application/{applicationId}/approve")
    public ResponseEntity<Void> approveApplication(
            @PathVariable Long applicationId
    ) {

        petInsuranceService.approveApplication(applicationId);

        return ResponseEntity.ok().build();
    }

    // 최초 정기결제 준비
    @PostMapping("/payment/ready/{applicationId}")
    public ResponseEntity<KakaoPayReadyRespDto>
    readySubscriptionPayment(
            @PathVariable Long applicationId,
            @AuthenticationPrincipal String username
    ) {

        KakaoPayReadyRespDto result =
                petInsuranceService
                        .readySubscriptionPayment(
                                applicationId,
                                username
                        );

        return ResponseEntity.ok(result);
    }

    // 결제창 인증 완료 후 최초 정기결제 승인
    @GetMapping("/payment/success")
    public ResponseEntity<KakaoPayApproveRespDto>
    paymentSuccess(
            @RequestParam Long applicationId,
            @RequestParam("pg_token") String pgToken
    ) {

        KakaoPayApproveRespDto result =
                petInsuranceService
                        .approveSubscriptionPayment(
                                applicationId,
                                pgToken
                        );

        return ResponseEntity.ok(result);
    }

    // 사용자가 결제창에서 취소
    @GetMapping("/payment/cancel")
    public ResponseEntity<String> paymentCancel() {
        return ResponseEntity.ok(
                "카카오페이 결제가 취소되었습니다."
        );
    }

    // 결제 실패
    @GetMapping("/payment/fail")
    public ResponseEntity<String> paymentFail() {
        return ResponseEntity.ok(
                "카카오페이 결제에 실패했습니다."
        );
    }
}