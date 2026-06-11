package com.kh.app.point.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PointEventJoinResDto {

    private String message;
    private Long currentPoint;
}