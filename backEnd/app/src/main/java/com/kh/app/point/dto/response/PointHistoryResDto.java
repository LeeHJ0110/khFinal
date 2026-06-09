package com.kh.app.point.dto.response;

import com.kh.app.point.entity.PointHistoryEntity;
import com.kh.app.point.entity.PointHistoryType;
import com.kh.app.point.entity.PointReasonType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PointHistoryResDto {

    private Long pointHistoryId;
    private PointHistoryType pointHistoryType;
    private PointReasonType pointReasonType;
    private Long pointAmount;
    private Long pointBalanceAfter;
    private Long relatedOrderId;
    private String pointHistoryMemo;
    private LocalDateTime createdAt;

    public static PointHistoryResDto from(PointHistoryEntity entity) {
        return PointHistoryResDto.builder()
                .pointHistoryId(entity.getId())
                .pointHistoryType(entity.getPointHistoryType())
                .pointReasonType(entity.getPointReasonType())
                .pointAmount(entity.getPointAmount())
                .pointBalanceAfter(entity.getPointBalanceAfter())
                .relatedOrderId(entity.getRelatedOrderId())
                .pointHistoryMemo(entity.getPointHistoryMemo())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}