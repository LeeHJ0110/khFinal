package com.kh.app.schedule.entity;

import com.kh.app.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "TRAINING_DIARY")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class TrainingDiaryEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TRAINING_PET_ID", nullable = false)
    private TrainingPetEntity trainingId;

    @Column(name = "DATE", nullable = false)
    private LocalDate date;

    @Column(name = "CONTENT", nullable = false, length = 4000)
    private String content;

    @Column(name = "TRAINING_TIME", nullable = false, length = 4)
    private String trainingTime;
}
