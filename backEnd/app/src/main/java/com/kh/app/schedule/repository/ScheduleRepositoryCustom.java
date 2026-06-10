package com.kh.app.schedule.repository;

import com.kh.app.schedule.dto.response.EventResDto;
import com.kh.app.schedule.entity.ScheduleEntity;

import java.util.List;

public interface ScheduleRepositoryCustom {
    List<EventResDto> findTodaySchedule(String username);
}
