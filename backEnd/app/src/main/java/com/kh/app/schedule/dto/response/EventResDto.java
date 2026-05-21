package com.kh.app.schedule.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.kh.app.schedule.entity.ScheduleEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Builder
public class EventResDto {
    private Long id;
    private String title;
    private String content;
    @JsonFormat(pattern = "HH:mm")
    private LocalTime at;
    private LocalDate startDate;
    private LocalDate endDate;
    private String backgroundColor;

    public static EventResDto from(ScheduleEntity entity){
        return EventResDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .at(entity.getAt())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .backgroundColor(entity.getColor())
                .build();
    }
}
