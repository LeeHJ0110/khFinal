package com.kh.app.schedule.repository;

import com.kh.app.schedule.entity.TrainingDiaryEntity;
import com.kh.app.schedule.entity.TrainingPetEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainingPetRepository extends JpaRepository<TrainingPetEntity, Long>{
}
