package com.kh.app.karte.service;

import com.kh.app.karte.dto.request.KarteReqDto;
import com.kh.app.karte.entity.KarteEntity;
import com.kh.app.karte.entity.ScoreEntity;
import com.kh.app.karte.repository.KarteRepository;
import com.kh.app.karte.repository.ScoreRepository;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.petcare.dto.response.DiagnosisDetailResDto;
import com.kh.app.petcare.entity.DiagnosisReqEntity;
import com.kh.app.petcare.repository.DiagnosisReqRepository;
import com.kh.app.petcare.service.PetCareService;
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
public class KarteService {
    private final KarteRepository karteRepository;
    private final MemberRepository memberRepository;
    private final ScoreRepository scoreRepository;
    private final DiagnosisReqRepository diagnosisReqRepository;

    @Transactional
    public void write(KarteReqDto reqDto, String username) {
        MemberEntity memberEntity = memberRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("맴버 없음"));//TODO 권한 관리
        DiagnosisReqEntity diagEntity = diagnosisReqRepository.findById(reqDto.getDiaReqId())
                .orElseThrow(() -> new IllegalArgumentException("신청내역 없음"));

        KarteEntity karte = karteRepository.save(reqDto.toEntity(memberEntity, diagEntity));

        List<ScoreEntity> scores = reqDto.getScores()
                .stream()
                .map(dto -> dto.toEntity(karte))
                .toList();

        scoreRepository.saveAll(scores);
        log.info("[진단결과 작성 완료] writer: {}", memberEntity);
    }
}
