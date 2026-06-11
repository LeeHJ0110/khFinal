package com.kh.app.schedule.service;

import com.kh.app.common.exception.CustomException;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.exception.MemberErrorCode;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.pet.entity.PetEntity;
import com.kh.app.pet.repository.PetRepository;
import com.kh.app.pet.service.PetService;
import com.kh.app.schedule.dto.request.TrainReqDto;
import com.kh.app.schedule.dto.response.EventResDto;
import com.kh.app.schedule.dto.response.TrainingResDto;
import com.kh.app.schedule.entity.ScheduleEntity;
import com.kh.app.schedule.entity.TrainingDiaryEntity;
import com.kh.app.schedule.entity.TrainingPetEntity;
import com.kh.app.schedule.repository.TrainingPetRepository;
import com.kh.app.schedule.repository.TrainingRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


import com.kh.app.point.service.PointService;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class TrainingService {
    private final TrainingRepository trainingRepository;
    private final TrainingPetRepository trainingPetRepository;
    private final PetRepository petRepository;
    private final MemberRepository memberRepository;


    private final PointService pointService;

    @Transactional
    public void write(TrainReqDto reqDto, String username) {
        MemberEntity memberEntity = memberRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(MemberErrorCode.MEMBER_NOT_FOUND));
        TrainingDiaryEntity diaryEntity = reqDto.toEntity(memberEntity);

        trainingRepository.save(diaryEntity);
        log.info("[훈련일기 작성]");
        for(Long id : reqDto.getTrainingPetList()){
            PetEntity petEntity = petRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("pet 검색 실패"));
            trainingPetRepository.save(TrainingPetEntity.from(petEntity, diaryEntity));
            log.info("[펫, 일기]:"+ petEntity.getName() + ", "+ diaryEntity.getId());
        }


        // 주간 훈련일기 작성 포인트 지급
        boolean pointEarned = pointService.tryEarnWeeklyTrainingDiaryPoint(memberEntity);

        if (pointEarned) {
            log.info("[포인트 지급] 주간 훈련일기 작성 포인트 500P 지급");
        } else {
            log.info("[포인트 미지급] 이번 주 훈련일기 작성 포인트 이미 지급됨");
        }
    }

    public String checkDate(LocalDate date, String username) {
        MemberEntity memberEntity = memberRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(MemberErrorCode.MEMBER_NOT_FOUND));
        String message = "등록가능";

        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.plusDays(1).atStartOfDay();

        boolean exists = trainingRepository.existsByDate(start, end, memberEntity.getUsername());

        if (exists) {
            if (date.equals(LocalDate.now())) {
                return "오늘 이미 작성했습니다";
            }
            return "이미 작성된 날짜입니다";
        }
        return message;
    }

    public List<TrainingResDto> selectList(String username) {
        MemberEntity memberEntity = memberRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(MemberErrorCode.MEMBER_NOT_FOUND));
        return trainingRepository
                .findAllByMemberUsername(memberEntity.getUsername())
                .stream()
                .map(trainingDiary -> {

                    List<PetEntity> petList = trainingPetRepository
                            .findAllByTrainingDiary(trainingDiary)
                            .stream()
                            .map(TrainingPetEntity::getPet)
                            .toList();

                    return TrainingResDto.from(trainingDiary, petList);
                })
                .toList();
    }

    @Transactional
    public void delete(Long id) {
        trainingPetRepository.deleteAllByTrainingDiaryId(id);
        trainingRepository.deleteById(id);
    }

    @Transactional
    public void update(Long id, TrainReqDto reqDto) {
        TrainingDiaryEntity entity = trainingRepository
                .findById(id)
                .orElseThrow(EntityNotFoundException::new);
        entity.update(reqDto);

        //trainingPet 지우고 다시 생성
        trainingPetRepository.deleteAllByTrainingDiaryId(id);
        log.info(id +"번 팻 일시 삭제");
        for(Long petId : reqDto.getTrainingPetList()) {

            PetEntity petEntity = petRepository.findById(petId)
                    .orElseThrow(() -> new IllegalArgumentException("pet 검색 실패"));

            trainingPetRepository.save(
                    TrainingPetEntity.from(petEntity, entity)
            );
        }

    }
}
