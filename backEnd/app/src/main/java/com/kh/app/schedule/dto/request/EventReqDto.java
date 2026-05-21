package com.kh.app.schedule.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.kh.app.board.entity.BoardEntity;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.schedule.entity.ScheduleEntity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class EventReqDto {
    private String title;
    private String content;
    @JsonFormat(pattern = "HH:mm")
    private LocalTime at;
    private LocalDate startDate;
    private LocalDate endDate;
    private String backgroundColor;

    public ScheduleEntity toEntity(MemberEntity entity){
        return ScheduleEntity.builder()
                .member(entity)
                .title(title)
                .content(content)
                .at(at)
                .startDate(startDate)
                .endDate(endDate)
                .color(backgroundColor)
                .build();
    }
}
