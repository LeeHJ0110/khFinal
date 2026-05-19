package com.kh.app.schedule.entity;

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
    private Long petID;             //TODO Type -> PetEntity
}
