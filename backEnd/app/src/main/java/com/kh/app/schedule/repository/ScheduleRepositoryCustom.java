package com.kh.app.schedule.repository;

import com.kh.app.schedule.entity.ScheduleEntity;

import java.util.Optional;

public interface ScheduleRepositoryCustom {
    Optional<ScheduleEntity> selectList(Long memberId);
}
