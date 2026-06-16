package com.kh.app.member.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.HexFormat;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SmsService {

    @Value("${solapi.api-key}")
    private String apiKey;

    @Value("${solapi.api-secret}")
    private String apiSecret;

    @Value("${solapi.from}")
    private String from;

    private final RestClient restClient = RestClient.create("https://api.solapi.com");

    public void sendAuthCode(String to, String code) {
        String text = "[펫케어] 인증번호는 [" + code + "] 입니다.";

        Map<String, Object> body = Map.of(
                "messages", new Object[]{
                        Map.of(
                                "to", normalizePhone(to),
                                "from", normalizePhone(from),
                                "text", text
                        )
                }
        );

        restClient.post()
                .uri("/messages/v4/send-many/detail")
                .header(HttpHeaders.AUTHORIZATION, createAuthorizationHeader())
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .toBodilessEntity();
    }

    private String createAuthorizationHeader() {
        String date = Instant.now().toString();
        String salt = UUID.randomUUID().toString().replace("-", "");
        String signature = createSignature(date, salt);

        return "HMAC-SHA256 apiKey=" + apiKey
                + ", date=" + date
                + ", salt=" + salt
                + ", signature=" + signature;
    }

    private String createSignature(String date, String salt) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec keySpec = new SecretKeySpec(
                    apiSecret.getBytes(StandardCharsets.UTF_8),
                    "HmacSHA256"
            );

            mac.init(keySpec);

            byte[] bytes = mac.doFinal((date + salt).getBytes(StandardCharsets.UTF_8));

            return HexFormat.of().formatHex(bytes);
        } catch (Exception e) {
            throw new IllegalStateException("Solapi 서명 생성 실패", e);
        }
    }

    private String normalizePhone(String phone) {
        if (phone == null) {
            return null;
        }

        return phone.replaceAll("[^0-9]", "");
    }
}