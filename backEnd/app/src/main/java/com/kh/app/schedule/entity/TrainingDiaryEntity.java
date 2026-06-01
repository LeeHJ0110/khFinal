package com.kh.app.schedule.entity;

import com.kh.app.common.entity.BaseEntity;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.schedule.dto.request.EventReqDto;
import com.kh.app.schedule.dto.request.TrainReqDto;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

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
    @JoinColumn(name = "MEMBER_ID", nullable = false)
    private MemberEntity member;

    @Column(name = "CONTENT", nullable = false, length = 4000)
    private String content;

    @Column(name = "TRAINING_TIME", nullable = false, length = 4)
    private LocalTime trainingTime;

    public void update(TrainReqDto reqDto) {
        this.content = reqDto.getContent();
        this.trainingTime = reqDto.getTrainingTime();
    }
}
