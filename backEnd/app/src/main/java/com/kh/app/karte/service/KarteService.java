package com.kh.app.karte.service;

import com.kh.app.board.dto.response.BoardListResDto;
import com.kh.app.common.exception.CustomException;
import com.kh.app.karte.dto.request.KarteReqDto;
import com.kh.app.karte.dto.response.KarteListResDto;
import com.kh.app.karte.dto.response.KarteResDto;
import com.kh.app.karte.dto.response.ScoreResDto;
import com.kh.app.karte.entity.KarteEntity;
import com.kh.app.karte.entity.ScoreEntity;
import com.kh.app.karte.exception.KarteErrorCode;
import com.kh.app.karte.repository.KarteRepository;
import com.kh.app.karte.repository.ScoreRepository;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.exception.MemberErrorCode;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.message.entity.MessageReasonType;
import com.kh.app.message.service.SystemMessageService;
import com.kh.app.pet.entity.PetEntity;
import com.kh.app.pet.repository.PetRepository;
import com.kh.app.petcare.dto.response.DiagnosisDetailResDto;
import com.kh.app.petcare.entity.DiagnosisReqEntity;
import com.kh.app.petcare.repository.DiagnosisReqRepository;
import com.kh.app.petcare.service.PetCareService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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

    private final SystemMessageService systemMessageService;

    @Transactional
    public void write(KarteReqDto reqDto, String username) {
        MemberEntity memberEntity = memberRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(MemberErrorCode.MEMBER_NOT_FOUND));
        DiagnosisReqEntity diagEntity = diagnosisReqRepository.findById(reqDto.getDiaReqId())
                .orElseThrow(() -> new IllegalArgumentException("신청내역 없음"));

        String petName = diagEntity.getPetEntity().getName();
        MemberEntity reqMember = diagEntity.getPetEntity().getMember();

        KarteEntity karte = karteRepository.save(reqDto.toEntity(memberEntity, diagEntity));

        List<ScoreEntity> scores = reqDto.getScores()
                .stream()
                .map(dto -> dto.toEntity(karte))
                .toList();

        scoreRepository.saveAll(scores);
        log.info("[진단결과 작성 완료] writer: {}", memberEntity);

        systemMessageService.sendByAdmin(
                username,
                reqMember,
                MessageReasonType.INSURANCE,
                "펫 진단 완료 알림",
                petName + "의 온라인 진단이 완료되었습니다. 진단확인페이지에서 확인해주세요."
        );
    }

    public Page<KarteListResDto> getKarteList(int pno, String username) {
        MemberEntity memberEntity = memberRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(MemberErrorCode.MEMBER_NOT_FOUND));
        PageRequest pageRequest = PageRequest.of(pno, 10);
        return karteRepository.findKarteList(pageRequest, memberEntity);
    }

    @Transactional
    public KarteResDto selectOne(Long id, String username) {
        MemberEntity memberEntity = memberRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(MemberErrorCode.MEMBER_NOT_FOUND));
        KarteEntity karte = karteRepository.findById(id)
                .orElseThrow(() -> new CustomException(KarteErrorCode.KARTE_NOTFOUND));
        DiagnosisReqEntity diagReq = diagnosisReqRepository.findById(karte.getDiaReq().getDiagnosisReqId())
                .orElseThrow(() -> new IllegalArgumentException("진단신청 없음"));
//        log.info(diagReq.getPetEntity().getMember().equals(memberEntity))
        List<ScoreEntity> scores = scoreRepository.findAllByKarte(karte);
        List<ScoreResDto> scoreDtos = scores.stream()
                .map(ScoreResDto::from)
                .toList();

        karte.visite();
        log.warn(karte.getVisitedYn().toString());
        return KarteResDto.from(karte, diagReq.getPetEntity(), scoreDtos);
    }

    @Transactional
    public void delete(Long id) {
        karteRepository.deleteById(id);
        scoreRepository.deleteAllByKarteId(id);
    }

}
