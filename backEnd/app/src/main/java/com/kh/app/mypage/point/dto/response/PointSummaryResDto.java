package com.kh.app.mypage.point.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PointSummaryResDto {

    private Long currentPoint;

    private boolean attendanceCompleted;

    private boolean trainingDiaryCompleted;

    private boolean communityPostCompleted;

    private Long reviewWriteCount;

    private Long eventJoinCount;
}
