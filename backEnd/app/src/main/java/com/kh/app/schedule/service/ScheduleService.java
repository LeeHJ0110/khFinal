package com.kh.app.schedule.service;

import com.kh.app.common.exception.CustomException;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.exception.MemberErrorCode;
import com.kh.app.member.repository.MemberRepository;
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

import static com.kh.app.member.entity.QMemberEntity.memberEntity;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public void write(EventReqDto reqDto, String username) {

        MemberEntity memberEntity = memberRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(MemberErrorCode.MEMBER_NOT_FOUND));
        scheduleRepository.save(reqDto.toEntity(memberEntity));
        log.info("[일정 작성 완료] writer: {}", memberEntity);
    }

    public List<EventResDto> selectList(String username) {
        MemberEntity memberEntity = memberRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(MemberErrorCode.MEMBER_NOT_FOUND));
        return scheduleRepository
                .findAllByMemberUsername(memberEntity.getUsername())
                .stream()
                .map(EventResDto::from)
                .toList();
    }

    public EventResDto selectOne(Long id) {
        ScheduleEntity entity = scheduleRepository
                .findById(id)
                .orElseThrow(EntityNotFoundException::new);
        return EventResDto.from(entity);
    }

    public List<EventResDto> selectToday(String username) {
        MemberEntity memberEntity = memberRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(MemberErrorCode.MEMBER_NOT_FOUND));
        return scheduleRepository.findTodaySchedule(memberEntity.getUsername());
    }

    @Transactional
    public void delete(Long id) {
        scheduleRepository.deleteById(id);
    }

    @Transactional
    public void update(Long id, EventReqDto reqDto) {
        ScheduleEntity entity = scheduleRepository
                .findById(id)
                .orElseThrow(EntityNotFoundException::new);
        entity.update(reqDto);
    }


}
