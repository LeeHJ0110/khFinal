package com.kh.app.store.service;

import com.kh.app.store.dto.response.StoreKakaoPayApproveResDto;
import com.kh.app.store.dto.response.StoreKakaoPayReadyResDto;
import com.kh.app.store.exception.StoreErrorCode;
import com.kh.app.store.exception.StoreException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class StoreKakaoPayService {


    private static final String READY_URL = "https://open-api.kakaopay.com/online/v1/payment/ready";
    private static final String APPROVE_URL = "https://open-api.kakaopay.com/online/v1/payment/approve";

    @Value("${kakaopay.store.cid}")
    private String cid;

    @Value("${kakaopay.store.secret-key}")
    private String secretKey;

    // 백엔드 콜백 주소
// 예: https://www.petandifor.store
    @Value("${kakaopay.store.redirect-base-url}")
    private String redirectBaseUrl;

// =====================================================
// 카카오페이 결제 준비
// =====================================================

    public StoreKakaoPayReadyResDto ready(
            String partnerOrderId,
            String partnerUserId,
            String itemName,
            Integer quantity,
            Long totalAmount,
            Long orderId
    ) {
        Map<String, Object> body = new HashMap<>();

        body.put("cid", cid);
        body.put("partner_order_id", partnerOrderId);
        body.put("partner_user_id", partnerUserId);
        body.put("item_name", itemName);
        body.put("quantity", quantity);
        body.put("total_amount", totalAmount);
        body.put("tax_free_amount", 0);

        // 카카오 결제 성공 시 카카오가 호출할 백엔드 승인 URL
        String approvalUrl = UriComponentsBuilder
                .fromUriString(redirectBaseUrl)
                .path("/api/store/order/pay/approve")
                .queryParam("orderId", orderId)
                .toUriString();

        // 사용자가 카카오 결제창에서 취소했을 때 호출될 URL
        String cancelUrl = UriComponentsBuilder
                .fromUriString(redirectBaseUrl)
                .path("/api/store/order/pay/cancel")
                .queryParam("orderId", orderId)
                .toUriString();

        // 카카오 결제 실패 시 호출될 URL
        String failUrl = UriComponentsBuilder
                .fromUriString(redirectBaseUrl)
                .path("/api/store/order/pay/fail")
                .queryParam("orderId", orderId)
                .toUriString();

        body.put("approval_url", approvalUrl);
        body.put("cancel_url", cancelUrl);
        body.put("fail_url", failUrl);

        log.info("[스토어 카카오페이 ready 요청] orderId={}, partnerOrderId={}, amount={}",
                orderId,
                partnerOrderId,
                totalAmount
        );
        log.info("[스토어 카카오페이 ready URL] approvalUrl={}", approvalUrl);
        log.info("[스토어 카카오페이 ready URL] cancelUrl={}", cancelUrl);
        log.info("[스토어 카카오페이 ready URL] failUrl={}", failUrl);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, getHeaders());

        try {
            RestTemplate restTemplate = new RestTemplate();

            ResponseEntity<StoreKakaoPayReadyResDto> response = restTemplate.postForEntity(
                    READY_URL,
                    requestEntity,
                    StoreKakaoPayReadyResDto.class
            );

            StoreKakaoPayReadyResDto responseBody = response.getBody();

            if (responseBody == null || responseBody.getTid() == null) {
                log.warn("[스토어 카카오페이 ready 실패] 응답 body 또는 tid 없음. responseBody={}", responseBody);
                throw new StoreException(StoreErrorCode.KAKAO_PAY_READY_FAIL);
            }

            log.info("[스토어 카카오페이 ready 응답] tid={}, nextRedirectPcUrl={}",
                    responseBody.getTid(),
                    responseBody.getNextRedirectPcUrl()
            );

            return responseBody;
        } catch (RestClientException e) {
            log.error("[스토어 카카오페이 ready API 호출 실패] orderId={}, message={}",
                    orderId,
                    e.getMessage(),
                    e
            );

            throw new StoreException(StoreErrorCode.KAKAO_PAY_READY_FAIL);
        }
    }

// =====================================================
// 카카오페이 결제 승인
// =====================================================

    public StoreKakaoPayApproveResDto approve(
            String tid,
            String partnerOrderId,
            String partnerUserId,
            String pgToken,
            Long totalAmount
    ) {
        Map<String, Object> body = new HashMap<>();

        body.put("cid", cid);
        body.put("tid", tid);
        body.put("partner_order_id", partnerOrderId);
        body.put("partner_user_id", partnerUserId);
        body.put("pg_token", pgToken);
        body.put("total_amount", totalAmount);

        log.info("[스토어 카카오페이 approve 요청] tid={}, partnerOrderId={}, amount={}",
                tid,
                partnerOrderId,
                totalAmount
        );

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, getHeaders());

        try {
            RestTemplate restTemplate = new RestTemplate();

            StoreKakaoPayApproveResDto response = restTemplate.postForObject(
                    APPROVE_URL,
                    requestEntity,
                    StoreKakaoPayApproveResDto.class
            );

            if (response == null || response.getTid() == null) {
                log.warn("[스토어 카카오페이 approve 실패] 응답 body 또는 tid 없음. response={}", response);
                throw new StoreException(StoreErrorCode.KAKAO_PAY_APPROVE_FAIL);
            }

            log.info("[스토어 카카오페이 approve 응답] tid={}", response.getTid());

            return response;
        } catch (RestClientException e) {
            log.error("[스토어 카카오페이 approve API 호출 실패] partnerOrderId={}, message={}",
                    partnerOrderId,
                    e.getMessage(),
                    e
            );

            throw new StoreException(StoreErrorCode.KAKAO_PAY_APPROVE_FAIL);
        }
    }

// =====================================================
// 카카오페이 요청 Header
// =====================================================

    private HttpHeaders getHeaders() {
        HttpHeaders headers = new HttpHeaders();

        headers.set("Authorization", "SECRET_KEY " + secretKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        return headers;
    }


}
