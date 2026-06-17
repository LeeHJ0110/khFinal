package com.kh.app.member.kakao;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class KakaoClient {

    @Value("${kakao.client-id}")
    private String clientId;

    @Value("${kakao.client-secret:}")
    private String clientSecret;

    @Value("${kakao.redirect-uri}")
    private String redirectUri;

    private final RestTemplate restTemplate = new RestTemplate();

    public String getAccessToken(String code) {
        String url = "https://kauth.kakao.com/oauth/token";

        log.info("[카카오 토큰 요청 redirectUri] {}", redirectUri);
        log.info("[카카오 토큰 요청 clientId] {}", clientId);
        log.info("[카카오 토큰 요청 code 앞 10자리] {}",
                code == null ? null : code.substring(0, Math.min(10, code.length())));

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant_type", "authorization_code");
            params.add("client_id", clientId);
            params.add("redirect_uri", redirectUri);
            params.add("code", code);

            if (clientSecret != null && !clientSecret.isBlank()) {
                params.add("client_secret", clientSecret);
            }

            HttpEntity<MultiValueMap<String, String>> request =
                    new HttpEntity<>(params, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    request,
                    Map.class
            );

            log.info("[카카오 토큰 응답] {}", response.getBody());

            Map<String, Object> body = response.getBody();

            if (body == null || body.get("access_token") == null) {
                throw new IllegalStateException("카카오 access token 요청 실패");
            }

            return body.get("access_token").toString();

        } catch (Exception e) {
            log.error("[카카오 토큰 요청 실패]", e);
            throw e;
        }
    }

    public KakaoUserInfo getUserInfo(String accessToken) {
        String url = "https://kapi.kakao.com/v2/user/me";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                request,
                Map.class
        );

        Map<String, Object> body = response.getBody();

        if (body == null || body.get("id") == null) {
            throw new IllegalStateException("카카오 사용자 정보 조회 실패");
        }

        String socialId = body.get("id").toString();

        String email = null;
        String nickname = null;

        Object accountObj = body.get("kakao_account");

        if (accountObj instanceof Map<?, ?> accountMap) {
            Object emailObj = accountMap.get("email");

            if (emailObj != null) {
                email = emailObj.toString();
            }

            Object profileObj = accountMap.get("profile");

            if (profileObj instanceof Map<?, ?> profileMap) {
                Object nicknameObj = profileMap.get("nickname");

                if (nicknameObj != null) {
                    nickname = nicknameObj.toString();
                }
            }
        }

        return KakaoUserInfo.builder()
                .socialId(socialId)
                .email(email)
                .nickname(nickname)
                .build();
    }
}