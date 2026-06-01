package com.kh.app.schedule.entity;

import com.kh.app.pet.entity.PetEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "TRAINING_PET")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class TrainingPetEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PET_ID", nullable = false)
    private PetEntity pet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TRAINING_DIARY", nullable = false)
    private TrainingDiaryEntity trainingDiary;

    public static TrainingPetEntity from(PetEntity petEntity, TrainingDiaryEntity diaryEntity) {
        return TrainingPetEntity.builder()
                .pet(petEntity)
                .trainingDiary(diaryEntity)
                .build();
    }
}
