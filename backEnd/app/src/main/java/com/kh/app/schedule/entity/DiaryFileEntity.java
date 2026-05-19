package com.kh.app.schedule.entity;

import com.kh.app.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "DIARY_IMAGE")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class DiaryFileEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TRAINING_DIARY_ID", nullable = false)
    private TrainingDiaryEntity diary;

    @Column(name = "IMAGE_ORIGIN_NAME", nullable = false, length = 4000)
    private String imageOriginName;

    @Column(name = "IMAGE_CHANGED_NAME", nullable = false, length = 4000)
    private String imageChangedName;
}
