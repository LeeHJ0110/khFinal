package com.kh.app.schedule.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.kh.app.pet.entity.PetEntity;
import com.kh.app.schedule.entity.ScheduleEntity;
import com.kh.app.schedule.entity.TrainingDiaryEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Builder
public class TrainingResDto {
    private Long id;
    private String content;
    @JsonFormat(pattern = "HH:mm")
    private LocalTime trainingTime;
    private List<PetEntity> petList;

    public static TrainingResDto from(TrainingDiaryEntity entity, List<PetEntity> petList){
        return TrainingResDto.builder()
                .id(entity.getId())
                .content(entity.getContent())
                .trainingTime(entity.getTrainingTime())
                .petList(petList)
                .build();
    }
}
