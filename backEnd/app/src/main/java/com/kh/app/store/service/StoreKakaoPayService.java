package com.kh.app.store.service;

import com.kh.app.store.dto.response.StoreKakaoPayApproveResDto;

import com.kh.app.store.dto.response.StoreKakaoPayReadyResDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

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

    @Value("${kakaopay.store.redirect-base-url}")
    private String redirectBaseUrl;

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

        body.put("approval_url", redirectBaseUrl + "/api/store/order/pay/approve?orderId=" + orderId);
        body.put("cancel_url", redirectBaseUrl + "/api/store/order/pay/cancel?orderId=" + orderId);
        body.put("fail_url", redirectBaseUrl + "/api/store/order/pay/fail?orderId=" + orderId);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, getHeaders());

        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<StoreKakaoPayReadyResDto> response = restTemplate.postForEntity(
                READY_URL,
                requestEntity,
                StoreKakaoPayReadyResDto.class
        );

        log.info("[카카오페이 ready 응답] {}", response.getBody());

        return response.getBody();
    }

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

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, getHeaders());

        RestTemplate restTemplate = new RestTemplate();

        StoreKakaoPayApproveResDto response = restTemplate.postForObject(
                APPROVE_URL,
                requestEntity,
                StoreKakaoPayApproveResDto.class
        );

        log.info("[카카오페이 approve 응답] {}", response);

        return response;
    }

    private HttpHeaders getHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "SECRET_KEY " + secretKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }
}