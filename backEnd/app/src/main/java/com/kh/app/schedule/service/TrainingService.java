package com.kh.app.schedule.service;

import com.kh.app.pet.entity.PetEntity;
import com.kh.app.pet.repository.PetRepository;
import com.kh.app.pet.service.PetService;
import com.kh.app.schedule.dto.request.TrainReqDto;
import com.kh.app.schedule.entity.TrainingDiaryEntity;
import com.kh.app.schedule.entity.TrainingPetEntity;
import com.kh.app.schedule.repository.TrainingPetRepository;
import com.kh.app.schedule.repository.TrainingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class TrainingService {
    private final TrainingRepository trainingRepository;
    private final TrainingPetRepository trainingPetRepository;
    private final PetRepository petRepository;

    @Transactional
    public void write(TrainReqDto reqDto) {
        TrainingDiaryEntity diaryEntity = reqDto.toEntity();
        trainingRepository.save(diaryEntity);
        log.info("[훈련일기 작성]");
        for(Long id : reqDto.getTrainingPetList()){
            PetEntity petEntity = petRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("pet 검색 실패"));
            trainingPetRepository.save(TrainingPetEntity.from(petEntity, diaryEntity));
            log.info("[펫, 일기]:"+ petEntity.getName() + ", "+ diaryEntity.getId());
        }
    }
}
