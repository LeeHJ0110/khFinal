package com.kh.app.petinsurance.controller;

import com.kh.app.petinsurance.dto.request.PetInsuranceCalculateReqDto;
import com.kh.app.petinsurance.dto.response.PetInsuranceCalculateResDto;
import com.kh.app.petinsurance.dto.response.PetInsurancePetResDto;
import com.kh.app.petinsurance.kakao.dto.KakaoPayApproveRespDto;
import com.kh.app.petinsurance.kakao.dto.KakaoPayReadyRespDto;
import com.kh.app.petinsurance.service.PetInsuranceService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.kh.app.petinsurance.dto.response.PetInsuranceApplicationResDto;

import java.io.IOException;
import java.util.List;

@Tag(
        name = "펫 보험",
        description = "펫 보험 관련 API"
)
@RestController
@RequestMapping("/api/petinsurance")
@RequiredArgsConstructor
@Slf4j
public class PetInsuranceController {

    private final PetInsuranceService petInsuranceService;

    // =========================================================
    // 보험 상품 목록 조회
    // =========================================================
    @GetMapping("/products")
    public ResponseEntity<Object> getProductList() {

        return ResponseEntity.ok(
                petInsuranceService.getProductList()
        );
    }

    // =========================================================
    // 생년월일과 선택한 상품을 기준으로 예상 보험료 계산
    // 계산 결과는 저장하지 않고 화면에 반환만 함
    // =========================================================
    @PostMapping("/calculate")
    public ResponseEntity<PetInsuranceCalculateResDto>
    calculateMonthlyPrice(
            @RequestBody PetInsuranceCalculateReqDto dto
    ) {

        return ResponseEntity.ok(
                petInsuranceService
                        .calculateMonthlyPrice(dto)
        );
    }

    // =========================================================
    // 보험 가입 신청 화면용 내 반려동물 목록 조회
    // =========================================================
    @GetMapping("/application/pets")
    public ResponseEntity<List<PetInsurancePetResDto>>
    getMyPetListForInsurance(
            @AuthenticationPrincipal String username
    ) {

        return ResponseEntity.ok(
                petInsuranceService
                        .getMyPetListForInsurance(username)
        );
    }
    // =========================================================
// 보험 가입 신청
// JSON 데이터와 진료확인서 파일을 multipart/form-data로 받음
// 생성된 applicationId를 반환함
// =========================================================
    @PostMapping(
            value = "/application",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<PetInsuranceApplicationResDto>
    applyInsurance(
            @RequestPart("data") String data,
            @RequestPart("medicalCertificate")
            MultipartFile medicalCertificate,
            @AuthenticationPrincipal String username
    ) throws IOException {

        PetInsuranceApplicationResDto result =
                petInsuranceService.applyInsurance(
                        data,
                        medicalCertificate,
                        username
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(result);
    }

    // =========================================================
    // 보험 신청 취소 또는 가입 완료 보험 해지
    // SID가 존재하면 카카오페이 정기결제도 비활성화
    // =========================================================
    @PatchMapping("/application/{applicationId}/cancel")
    public ResponseEntity<Void> cancelInsurance(
            @PathVariable Long applicationId,
            @AuthenticationPrincipal String username
    ) {

        petInsuranceService.cancelInsurance(
                applicationId,
                username
        );

        return ResponseEntity.ok().build();
    }

    // =========================================================
    // 관리자 보험 가입 승인
    // 승인 시 최초 월 보험료 결제
    // =========================================================
    @PatchMapping("/application/{applicationId}/approve")
    public ResponseEntity<Void> approveApplication(
            @PathVariable Long applicationId
    ) {

        petInsuranceService
                .approveApplication(applicationId);

        return ResponseEntity.ok().build();
    }

    // =========================================================
    // 카카오페이 정기결제 수단 등록 준비
    // =========================================================
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

    // =========================================================
    // 결제창 인증 완료 후 정기결제 수단 등록 승인
    // =========================================================
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

    // =========================================================
    // 사용자가 카카오페이 결제창에서 취소
    // =========================================================
    @GetMapping("/payment/cancel")
    public ResponseEntity<String> paymentCancel() {

        return ResponseEntity.ok(
                "카카오페이 결제가 취소되었습니다."
        );
    }

    // =========================================================
    // 카카오페이 결제 실패
    // =========================================================
    @GetMapping("/payment/fail")
    public ResponseEntity<String> paymentFail() {

        return ResponseEntity.ok(
                "카카오페이 결제에 실패했습니다."
        );
    }
}