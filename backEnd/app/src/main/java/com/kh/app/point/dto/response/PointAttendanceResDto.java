package com.kh.app.point.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PointAttendanceResDto {

    private String message;
    private Long currentPoint;
}