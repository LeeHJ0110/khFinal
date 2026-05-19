package com.kh.app.schedule.service;

import com.kh.app.schedule.dto.request.EventReqDto;
import com.kh.app.schedule.dto.response.EventResDto;
import com.kh.app.schedule.dto.response.SimpleEventResDto;
import com.kh.app.schedule.entity.ScheduleEntity;
import com.kh.app.schedule.repository.ScheduleRepository;
import com.kh.app.schedule.repository.TrainingRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;
    private final TrainingRepository trainingRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public void write(EventReqDto reqDto) {

//        MemberEntity memberEntity = memberRepository          멤버 entity 찾기
        scheduleRepository.save(reqDto.toEntity(memberEntity));
        log.info("[일정 작성 완료] writer: {}", memberEntity);
    }

    public List<SimpleEventResDto> selectList(Long memberId) {
        return scheduleRepository
                .findAllByMemberId(memberId)
                .stream()
                .map(SimpleEventResDto::from)
                .toList();
    }

    public EventResDto selectOne(Long id) {
        ScheduleEntity entity = scheduleRepository
                .findById(id)
                .orElseThrow(EntityNotFoundException::new);
        return EventResDto.from(entity);
    }

    @Transactional
    public void delete(Long id) {
        ScheduleEntity entity = scheduleRepository
                .findById(id)
                .orElseThrow(EntityNotFoundException::new);
        entity.delete();
    }

    @Transactional
    public void update(Long id, EventReqDto reqDto) {
        ScheduleEntity entity = scheduleRepository
                .findById(id)
                .orElseThrow(EntityNotFoundException::new);
        entity.update(reqDto);
    }
}
