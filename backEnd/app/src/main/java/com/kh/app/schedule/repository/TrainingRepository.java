package com.kh.app.schedule.repository;

import com.kh.app.schedule.entity.ScheduleEntity;
import com.kh.app.schedule.entity.TrainingDiaryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface TrainingRepository extends JpaRepository<TrainingDiaryEntity, Long>, TrainingRepositoryCustom {
    List<TrainingDiaryEntity> findAllByMemberUsername(String username);
}
