package com.kh.app.schedule.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.kh.app.board.entity.BoardEntity;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.pet.entity.PetEntity;
import com.kh.app.schedule.entity.TrainingDiaryEntity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
public class TrainReqDto {
    private String content;
    @JsonFormat(pattern = "HH:mm")
    private LocalTime trainingTime;
    private List<Long> trainingPetList;

    public TrainingDiaryEntity toEntity(MemberEntity memberEntity){
        return TrainingDiaryEntity.builder()
                .content(content)
                .trainingTime(trainingTime)
                .member(memberEntity)
                .build();
    }

}
