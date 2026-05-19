package com.kh.app.schedule.repository;

import com.kh.app.schedule.entity.ScheduleFileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduleFileRepository extends JpaRepository<ScheduleFileEntity, Long> {
}
