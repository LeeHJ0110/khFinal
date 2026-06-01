package com.kh.app.schedule.repository;

import com.kh.app.schedule.entity.TrainingDiaryEntity;
import com.kh.app.schedule.entity.TrainingPetEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface TrainingPetRepository extends JpaRepository<TrainingPetEntity, Long>{
    List<TrainingPetEntity> findAllByTrainingDiary(TrainingDiaryEntity trainingDiary);

    void deleteAllByTrainingDiaryId(Long id);
}
