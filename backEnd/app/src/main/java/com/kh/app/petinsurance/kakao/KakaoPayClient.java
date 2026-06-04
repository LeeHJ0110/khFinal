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

    /**
     * 정기결제 수단 등록 준비 요청
     *
     * 보험 신청 후 사용자가 결제수단을 등록할 때 호출한다.
     * 서비스에서 totalAmount를 0원으로 전달한다.
     *
     * 응답으로 받은 TID는 승인 요청에서 다시 사용해야 한다.
     */
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
                        + "?applicationId=" + applicationId
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
                        "SECRET_KEY " + secretKey
                )
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(KakaoPayReadyRespDto.class);
    }

    /**
     * 정기결제 수단 등록 승인 요청
     *
     * 결제창 인증 완료 후 전달받은 pgToken과
     * ready 단계에서 저장한 TID를 사용한다.
     *
     * 응답으로 받은 SID는 이후 정기결제에 사용한다.
     */
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
                        "SECRET_KEY " + secretKey
                )
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(KakaoPayApproveRespDto.class);
    }

    /**
     * SID를 이용한 월 보험료 정기결제 요청
     *
     * 관리자가 보험 가입을 승인할 때 호출한다.
     * 결제 성공 후 보험 신청 상태를 APPROVED로 변경한다.
     *
     * 이후 매월 자동결제를 붙이면 이 메서드를 다시 사용하면 된다.
     */
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
                        "SECRET_KEY " + secretKey
                )
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(KakaoPaySubscriptionRespDto.class);
    }
}