package com.kh.app.schedule.dto.response;

import com.kh.app.schedule.entity.ScheduleEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EventResDto {
    private Long id;
    private String title;
    private String content;
    private String startDate;
    private String endDate;
    private String backgroundColor;

    public static EventResDto from(ScheduleEntity entity){
        return EventResDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .backgroundColor(entity.getColor())
                .build();
    }
}
