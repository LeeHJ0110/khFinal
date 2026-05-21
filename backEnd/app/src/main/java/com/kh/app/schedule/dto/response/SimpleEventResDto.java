package com.kh.app.schedule.dto.response;

import com.kh.app.schedule.entity.ScheduleEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SimpleEventResDto {
    private Long id;
    private String title;
    private String startDate;
    private String endDate;
    private String backgroundColor;

    public static SimpleEventResDto from(ScheduleEntity entity){
        return SimpleEventResDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .backgroundColor(entity.getColor())
                .build();
    }
}
