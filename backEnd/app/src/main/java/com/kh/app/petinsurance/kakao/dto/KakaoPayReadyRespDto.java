package com.kh.app.petinsurance.kakao.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class KakaoPayReadyRespDto {

    // 카카오페이 거래 식별번호
    private String tid;

    // PC 결제창 URL
    @JsonProperty("next_redirect_pc_url")
    private String nextRedirectPcUrl;

    // 모바일 웹 결제창 URL
    @JsonProperty("next_redirect_mobile_url")
    private String nextRedirectMobileUrl;

    // 앱 결제창 URL
    @JsonProperty("next_redirect_app_url")
    private String nextRedirectAppUrl;

    // 결제 준비 요청 생성 시각
    @JsonProperty("created_at")
    private String createdAt;
}