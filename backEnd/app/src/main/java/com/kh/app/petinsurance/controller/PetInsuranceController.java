package com.kh.app.petinsurance.controller;

import com.kh.app.petinsurance.dto.request.PetInsuranceCalculateReqDto;
import com.kh.app.petinsurance.dto.response.PetInsuranceAdminApplicationResDto;
import com.kh.app.petinsurance.dto.response.PetInsuranceApplicationResDto;
import com.kh.app.petinsurance.dto.response.PetInsuranceCalculateResDto;
import com.kh.app.petinsurance.dto.response.PetInsurancePaymentHistoryResDto;
import com.kh.app.petinsurance.dto.response.PetInsurancePetResDto;
import com.kh.app.petinsurance.kakao.dto.KakaoPayReadyRespDto;
import com.kh.app.petinsurance.service.PetInsuranceService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
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

    /*
     * 로컬에서는 별도 설정이 없으면
     * http://localhost:5173 사용
     *
     * AWS 배포 환경에서는
     * FRONTEND_BASE_URL 환경변수로
     * https://www.petandifor.store 주입
     */
    @Value("${frontend.base-url:http://localhost:5173}")
    private String frontendBaseUrl;

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
    // 저장된 생년월일과 선택 상품 기준 예상 보험료 계산
    // 화면 표시용이며 DB에는 저장하지 않음
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
    //
    // JSON 데이터와 진료확인서 파일을
    // multipart/form-data로 받음
    //
    // 생성된 applicationId 반환
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
    //
    // SID가 존재하면
    // 카카오페이 정기결제도 비활성화 하기
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

        return ResponseEntity
                .ok()
                .build();
    }

    // =========================================================
    // 관리자 보험 가입 승인
    //
    // 승인 시 최초 월 보험료 결제
    // 승인 완료 후 회원에게 자동 쪽지 발송
    // =========================================================
    @PatchMapping("/application/{applicationId}/approve")
    public ResponseEntity<Void> approveApplication(
            @PathVariable Long applicationId,

            Authentication authentication
    ) {

        petInsuranceService.approveApplication(
                applicationId,
                authentication.getName()
        );

        return ResponseEntity
                .ok()
                .build();
    }

    // =========================================================
    // 관리자 보험 가입 반려
    //
    // 반려 처리 후 회원에게 자동 쪽지 발송
    // =========================================================
    @PatchMapping("/application/{applicationId}/reject")
    public ResponseEntity<Void> rejectApplication(
            @PathVariable Long applicationId,

            Authentication authentication
    ) {

        petInsuranceService.rejectApplication(
                applicationId,
                authentication.getName()
        );

        return ResponseEntity
                .ok()
                .build();
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

        return ResponseEntity.ok(
                result
        );
    }

    // =========================================================
    // 카카오페이 결제수단 등록 성공 콜백
    //
    // 카카오페이 인증 완료
    // → pg_token 수신
    // → SID 저장
    // → 프론트 성공 페이지로 이동
    // =========================================================
    @GetMapping("/payment/success")
    public ResponseEntity<Void> paymentSuccess(
            @RequestParam Long applicationId,

            @RequestParam("pg_token")
            String pgToken
    ) {

        petInsuranceService
                .approveSubscriptionPayment(
                        applicationId,
                        pgToken
                );

        String redirectUrl =
                buildFrontendUrl(
                        "/healthcare/petinsurance/payment/success"
                );

        log.info(
                "카카오페이 결제수단 등록 완료 후 프론트 이동 - applicationId={}, redirectUrl={}",
                applicationId,
                redirectUrl
        );

        return ResponseEntity
                .status(HttpStatus.FOUND)
                .location(
                        URI.create(
                                redirectUrl
                        )
                )
                .build();
    }

    // =========================================================
    // 사용자가 카카오페이 결제창에서 취소
    //
    // 별도 프론트 페이지를 만들기 전까지
    // 문자열 응답 유지
    // =========================================================
    @GetMapping("/payment/cancel")
    public ResponseEntity<String> paymentCancel() {

        return ResponseEntity.ok(
                "카카오페이 결제수단 등록이 취소되었습니다."
        );
    }

    // =========================================================
    // 카카오페이 결제수단 등록 실패
    //
    // 별도 프론트 페이지를 만들기 전까지
    // 문자열 응답 유지
    // =========================================================
    @GetMapping("/payment/fail")
    public ResponseEntity<String> paymentFail() {

        return ResponseEntity.ok(
                "카카오페이 결제수단 등록에 실패했습니다."
        );
    }

    // =========================================================
    // 관리자용 보험 가입 신청 목록 조회
    //
    // 카드 등록을 완료한 대기 상태 신청만 조회
    // =========================================================
    @GetMapping("/admin/applications")
    public ResponseEntity<List<PetInsuranceAdminApplicationResDto>>
    getWaitingApplicationList() {

        return ResponseEntity.ok(
                petInsuranceService
                        .getWaitingApplicationList()
        );
    }

    // =========================================================
    // 사용자 본인의 펫 보험 결제 내역 조회
    // =========================================================
    @GetMapping("/payment/history")
    public ResponseEntity<List<PetInsurancePaymentHistoryResDto>>
    getMyPaymentHistory(
            @AuthenticationPrincipal String username
    ) {

        return ResponseEntity.ok(
                petInsuranceService
                        .getMyPaymentHistory(username)
        );
    }

    // =========================================================
    // 프론트 주소 생성
    //
    // 설정값 마지막에 /가 있어도
    // 주소가 // 형태로 만들어지지 않도록 제거
    // =========================================================
    private String buildFrontendUrl(
            String path
    ) {

        String baseUrl =
                frontendBaseUrl
                        .trim()
                        .replaceAll("/+$", "");

        return baseUrl + path;
    }
}