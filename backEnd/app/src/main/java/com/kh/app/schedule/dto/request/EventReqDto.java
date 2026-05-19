package com.kh.app.schedule.dto.request;

import com.kh.app.board.entity.BoardEntity;
import com.kh.app.schedule.entity.ScheduleEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EventReqDto {
    private Long id;
    private String title;
    private String content;
    private String startDate;
    private String endDate;
    private String backgroundColor;

    public ScheduleEntity toEntity(MemberEntity entity){
        return ScheduleEntity.builder()
                .id(id)
                .member(entity)
                .title(title)
                .content(content)
                .startDate(startDate)
                .endDate(endDate)
                .color(backgroundColor)
                .build();
    }
}
