package com.kh.app.schedule.repository;

import com.kh.app.schedule.entity.ScheduleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduleRepository extends JpaRepository<ScheduleEntity, Long>, ScheduleRepositoryCustom {
}
