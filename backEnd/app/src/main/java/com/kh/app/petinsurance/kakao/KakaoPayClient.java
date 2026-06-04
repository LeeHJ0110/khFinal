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

    // 정기결제 테스트용 CID
    private static final String SUBSCRIPTION_TEST_CID =
            "TCSUBSCRIP";

    private final RestClient restClient;
    private final String secretKey;

    public KakaoPayClient(
            @Value("${kakaopay.secret-key}")
            String secretKey
    ) {
        this.restClient = RestClient.builder()
                .baseUrl(KAKAO_PAY_BASE_URL)
                .build();

        this.secretKey = secretKey;
    }

    // 최초 정기결제 준비 요청
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

        body.put("cid", SUBSCRIPTION_TEST_CID);
        body.put("partner_order_id", partnerOrderId);
        body.put("partner_user_id", username);
        body.put("item_name", itemName);
        body.put("quantity", 1);
        body.put("total_amount", totalAmount);
        body.put("tax_free_amount", 0);

        // 결제창 인증 완료 후 돌아올 주소
        body.put(
                "approval_url",
                "http://localhost/api/petinsurance/payment/success"
                        + "?applicationId=" + applicationId
        );

        // 사용자가 결제를 취소했을 때 이동할 주소
        body.put(
                "cancel_url",
                "http://localhost/api/petinsurance/payment/cancel"
        );

        // 결제에 실패했을 때 이동할 주소
        body.put(
                "fail_url",
                "http://localhost/api/petinsurance/payment/fail"
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

    // 최초 정기결제 승인 요청
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

        body.put("cid", SUBSCRIPTION_TEST_CID);
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
