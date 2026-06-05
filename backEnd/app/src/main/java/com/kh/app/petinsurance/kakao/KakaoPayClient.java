package com.kh.app.petinsurance.kakao;

import com.kh.app.petinsurance.kakao.dto.KakaoPayApproveRespDto;
import com.kh.app.petinsurance.kakao.dto.KakaoPayReadyRespDto;
import com.kh.app.petinsurance.kakao.dto.KakaoPaySubscriptionRespDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.LinkedHashMap;
import java.util.Map;

@Component
public class KakaoPayClient {

    private static final String KAKAO_PAY_BASE_URL =
            "https://open-api.kakaopay.com";

    private final RestClient restClient;

    // private.properties에서 가져오는 값
    private final String secretKey;
    private final String cid;
    private final String redirectBaseUrl;

    public KakaoPayClient(
            @Value("${kakaopay.secret-key}")
            String secretKey,

            @Value("${kakaopay.cid}")
            String cid,

            @Value("${kakaopay.redirect-base-url}")
            String redirectBaseUrl
    ) {

        this.restClient =
                RestClient.builder()
                        .baseUrl(KAKAO_PAY_BASE_URL)
                        .build();

        this.secretKey = secretKey;
        this.cid = cid;

        // 주소 마지막에 /가 있으면 제거
        this.redirectBaseUrl =
                redirectBaseUrl.replaceAll("/+$", "");
    }

    // =========================================================
    // 카카오페이 인증 헤더 값 생성
    // =========================================================
    private String getAuthorizationHeader() {

        return "SECRET_KEY " + secretKey;
    }

    // =========================================================
    // 정기결제 수단 등록 준비 요청
    // 보험 신청 후 사용자가 결제수단을 등록할 때 호출
    // 응답으로 받은 TID는 승인 요청에서 다시 사용
    // =========================================================
    public KakaoPayReadyRespDto readySubscription(
            Long applicationId,
            String username,
            String itemName,
            Long totalAmount
    ) {

        String partnerOrderId =
                "insurance-" + applicationId;

        Map<String, Object> body =
                new LinkedHashMap<>();

        body.put("cid", cid);
        body.put("partner_order_id", partnerOrderId);
        body.put("partner_user_id", username);
        body.put("item_name", itemName);
        body.put("quantity", 1);
        body.put("total_amount", totalAmount);
        body.put("tax_free_amount", 0);

        // 결제수단 등록 인증 성공 후 이동
        body.put(
                "approval_url",
                redirectBaseUrl
                        + "/api/petinsurance/payment/success"
                        + "?applicationId="
                        + applicationId
        );

        // 사용자가 결제수단 등록을 취소했을 때 이동
        body.put(
                "cancel_url",
                redirectBaseUrl
                        + "/api/petinsurance/payment/cancel"
        );

        // 결제수단 등록 과정에서 오류가 발생했을 때 이동
        body.put(
                "fail_url",
                redirectBaseUrl
                        + "/api/petinsurance/payment/fail"
        );

        return restClient.post()
                .uri("/online/v1/payment/ready")
                .header(
                        "Authorization",
                        getAuthorizationHeader()
                )
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(KakaoPayReadyRespDto.class);
    }

    // =========================================================
    // 정기결제 수단 등록 승인 요청
    // 결제창 인증 후 전달받은 pgToken과
    // ready 단계에서 저장한 TID를 사용
    // 응답으로 받은 SID는 이후 정기결제에 사용
    // =========================================================
    public KakaoPayApproveRespDto approveSubscription(
            Long applicationId,
            String username,
            String tid,
            String pgToken
    ) {

        String partnerOrderId =
                "insurance-" + applicationId;

        Map<String, Object> body =
                new LinkedHashMap<>();

        body.put("cid", cid);
        body.put("tid", tid);
        body.put("partner_order_id", partnerOrderId);
        body.put("partner_user_id", username);
        body.put("pg_token", pgToken);

        return restClient.post()
                .uri("/online/v1/payment/approve")
                .header(
                        "Authorization",
                        getAuthorizationHeader()
                )
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(KakaoPayApproveRespDto.class);
    }

    // =========================================================
    // SID를 이용한 월 보험료 정기결제 요청
    // 관리자 승인 시 최초 보험료 결제에 사용
    // 이후 매월 정기결제에도 다시 사용할 수 있음
    // =========================================================
    public KakaoPaySubscriptionRespDto requestSubscriptionPayment(
            Long applicationId,
            String username,
            String sid,
            String itemName,
            Long totalAmount
    ) {

        // 결제 회차마다 주문번호가 중복되지 않도록 생성
        String partnerOrderId =
                "insurance-"
                        + applicationId
                        + "-"
                        + System.currentTimeMillis();

        Map<String, Object> body =
                new LinkedHashMap<>();

        body.put("cid", cid);
        body.put("sid", sid);
        body.put("partner_order_id", partnerOrderId);
        body.put("partner_user_id", username);
        body.put("item_name", itemName);
        body.put("quantity", 1);
        body.put("total_amount", totalAmount);
        body.put("tax_free_amount", 0);

        return restClient.post()
                .uri("/online/v1/payment/subscription")
                .header(
                        "Authorization",
                        getAuthorizationHeader()
                )
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(KakaoPaySubscriptionRespDto.class);
    }

    // =========================================================
    // 카카오페이 정기결제 SID 비활성화
    // 보험 해지 후 이후 정기결제를 차단
    // =========================================================
    public void inactivateSubscription(
            String sid
    ) {

        if (sid == null || sid.isBlank()) {
            throw new IllegalArgumentException(
                    "비활성화할 SID가 없습니다."
            );
        }

        Map<String, Object> body =
                new LinkedHashMap<>();

        body.put("cid", cid);
        body.put("sid", sid);

        restClient.post()
                .uri(
                        "/online/v1/payment/manage/subscription/inactive"
                )
                .header(
                        "Authorization",
                        getAuthorizationHeader()
                )
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .toBodilessEntity();
    }
}