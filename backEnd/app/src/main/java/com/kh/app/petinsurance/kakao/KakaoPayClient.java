package com.kh.app.petinsurance.kakao;

import com.kh.app.petinsurance.kakao.dto.KakaoPayApproveRespDto;
import com.kh.app.petinsurance.kakao.dto.KakaoPayReadyRespDto;
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

            // 값을 생략하면 정기결제 테스트 CID를 기본값으로 사용
            @Value("${kakaopay.cid:TCSUBSCRIP}")
            String cid,

            // 예: http://localhost 또는 http://localhost:8080
            @Value("${kakaopay.redirect-base-url}")
            String redirectBaseUrl
    ) {
        this.restClient = RestClient.builder()
                .baseUrl(KAKAO_PAY_BASE_URL)
                .build();

        this.secretKey = secretKey;
        this.cid = cid;

        // 주소 마지막에 /가 들어와도 중복되지 않도록 제거
        this.redirectBaseUrl =
                redirectBaseUrl.replaceAll("/+$", "");
    }

    /**
     * 최초 정기결제 준비 요청
     *
     * 사용자가 보험 가입 승인을 받은 뒤 결제 버튼을 눌렀을 때 호출한다.
     * 응답으로 받은 tid는 승인 요청에서 다시 사용해야 한다.
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

        // 카카오페이 결제창에서 승인 후 돌아오는 주소
        body.put(
                "approval_url",
                redirectBaseUrl
                        + "/api/petinsurance/payment/success"
                        + "?applicationId=" + applicationId
        );

        // 사용자가 결제를 취소했을 때 이동하는 주소
        body.put(
                "cancel_url",
                redirectBaseUrl
                        + "/api/petinsurance/payment/cancel"
        );

        // 결제 과정에서 오류가 발생했을 때 이동하는 주소
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
     * 최초 정기결제 승인 요청
     *
     * approval_url로 돌아올 때 전달받은 pgToken과
     * 결제 준비 단계에서 저장한 tid를 사용한다.
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
}