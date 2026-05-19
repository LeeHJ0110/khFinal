package com.kh.app.schedule.repository;

import com.kh.app.schedule.entity.TrainingDiaryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainingRepository extends JpaRepository<TrainingDiaryEntity, Long>, TrainingRepositoryCustom {
}
