package com.kh.app.mypage.home.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MyPageHomeSummaryResDto {

    // 관심상품 수
    private Long wishCount;

    // 현재 보유 포인트
    private Long point;

    // 읽지 않은 쪽지 수
    private Long unreadMessageCount;

    // 가입 보험 수
    private Long insuranceCount;

    public static MyPageHomeSummaryResDto of(
            Long wishCount,
            Long point,
            Long unreadMessageCount,
            Long insuranceCount
    ) {
        return MyPageHomeSummaryResDto.builder()
                .wishCount(wishCount)
                .point(point)
                .unreadMessageCount(unreadMessageCount)
                .insuranceCount(insuranceCount)
                .build();
    }
}