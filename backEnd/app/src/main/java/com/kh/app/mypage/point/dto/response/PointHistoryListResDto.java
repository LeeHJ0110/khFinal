package com.kh.app.mypage.point.dto.response;

import com.kh.app.point.entity.PointHistoryEntity;
import com.kh.app.point.entity.PointReasonType;
import lombok.Builder;
import lombok.Getter;

import java.time.format.DateTimeFormatter;

@Getter
@Builder
public class PointHistoryListResDto {

    private Long pointHistoryId;

    private String reasonName;

    private Long pointAmount;

    private Long pointBalanceAfter;

    private String memo;

    private String createdAt;

    public static PointHistoryListResDto from(
            PointHistoryEntity entity
    ) {

        return PointHistoryListResDto.builder()
                .pointHistoryId(entity.getId())
                .reasonName(
                        convertReasonName(
                                entity.getPointReasonType()
                        )
                )
                .pointAmount(entity.getPointAmount())
                .pointBalanceAfter(entity.getPointBalanceAfter())
                .memo(entity.getPointHistoryMemo())
                .createdAt(
                        entity.getCreatedAt() != null
                                ? entity.getCreatedAt().format(
                                DateTimeFormatter.ofPattern("yyyy.MM.dd")
                        )
                                : null
                )
                .build();
    }

    private static String convertReasonName(
            PointReasonType type
    ) {

        return switch (type) {
            case DAILY_ATTENDANCE -> "출석 체크";
            case WEEKLY_TRAINING_DIARY -> "훈련일기 작성";
            case WEEKLY_COMMUNITY_POST -> "게시글 작성";
            case REVIEW_WRITE -> "리뷰 작성";
            case EVENT_JOIN -> "이벤트 참여";
            case HEALTHCARE_USE -> "건강관리 이용";
            case ORDER_USE -> "주문 포인트 사용";
            case ORDER_CANCEL_REFUND -> "주문 취소 환불";
        };
    }
}
