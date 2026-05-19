package com.kh.app.schedule.dto.request;

import com.kh.app.board.entity.BoardEntity;
import com.kh.app.schedule.entity.ScheduleEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EventReqDto {
    private String title;
    private String content;
    private String at;
    private String startDate;
    private String endDate;
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
