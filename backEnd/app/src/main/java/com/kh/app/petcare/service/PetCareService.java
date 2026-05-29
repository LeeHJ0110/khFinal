package com.kh.app.petcare.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.pet.dto.response.PetMyPageResDto;
import com.kh.app.pet.entity.PetEntity;
import com.kh.app.pet.entity.PetType;
import com.kh.app.pet.repository.PetRepository;
import com.kh.app.petcare.dto.request.DiagnosisAnswerDto;
import com.kh.app.petcare.dto.request.PetCareReqDto;
import com.kh.app.petcare.dto.response.DiagnosisDetailResDto;
import com.kh.app.petcare.dto.response.DiagnosisResDto;
import com.kh.app.petcare.dto.response.ImgUrlResDto;
import com.kh.app.petcare.dto.response.SelfDiagnosisQuestionResDto;
import com.kh.app.petcare.entity.DiagnosisReqEntity;
import com.kh.app.petcare.entity.ImgCategory;
import com.kh.app.petcare.entity.ImgUrlEntity;
import com.kh.app.petcare.entity.SelfDiagnosisAnswerEntity;
import com.kh.app.petcare.entity.SelfDiagnosisQuestionEntity;
import com.kh.app.petcare.repository.DiagnosisReqRepository;
import com.kh.app.petcare.repository.ImageRepository;
import com.kh.app.petcare.repository.SelfDiagnosisAnswerRepository;
import com.kh.app.petcare.repository.SelfDiagnosisQuestionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PetCareService {

    private final DiagnosisReqRepository diagnosisReqRepository;
    private final SelfDiagnosisQuestionRepository questionRepository;
    private final SelfDiagnosisAnswerRepository answerRepository;
    private final ImageRepository imageRepository;
    private final PetRepository petRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public void requestDiagnosis(
            String data,
            List<MultipartFile> eyeFiles,
            List<MultipartFile> skinFiles,
            List<MultipartFile> teethFiles,
            String username
    ) throws IOException {

        ObjectMapper objectMapper = new ObjectMapper();

        PetCareReqDto reqDto =
                objectMapper.readValue(data, PetCareReqDto.class);

        PetEntity pet = petRepository.findById(reqDto.getPetId())
                .orElseThrow(() ->
                        new IllegalArgumentException("반려동물을 찾을 수 없습니다.")
                );

        DiagnosisReqEntity diagnosisReq =
                DiagnosisReqEntity.builder()
                        .petEntity(pet)
                        .build();

        diagnosisReqRepository.save(diagnosisReq);

        for (DiagnosisAnswerDto answerDto : reqDto.getAnswerList()) {

            SelfDiagnosisQuestionEntity question =
                    questionRepository.findById(answerDto.getQuestionId())
                            .orElseThrow(() ->
                                    new IllegalArgumentException("질문을 찾을 수 없습니다.")
                            );

            SelfDiagnosisAnswerEntity answer =
                    SelfDiagnosisAnswerEntity.builder()
                            .question(question)
                            .diagnosisReq(diagnosisReq)
                            .answerValue(answerDto.getAnswerValue())
                            .build();

            answerRepository.save(answer);
        }

        saveImages(eyeFiles, diagnosisReq, ImgCategory.EYE);
        saveImages(skinFiles, diagnosisReq, ImgCategory.SKIN);
        saveImages(teethFiles, diagnosisReq, ImgCategory.TEETH);

        log.info("건강진단 신청 완료");
    }

    private void saveImages(
            List<MultipartFile> files,
            DiagnosisReqEntity diagnosisReq,
            ImgCategory category
    ) {

        if (files == null || files.isEmpty()) {
            return;
        }

        for (MultipartFile file : files) {

            ImgUrlEntity image =
                    ImgUrlEntity.builder()
                            .diagnosisReq(diagnosisReq)
                            .imgCategory(category)
                            .imageOriginName(file.getOriginalFilename())
                            .imageChangedName(file.getOriginalFilename())
                            .build();

            imageRepository.save(image);
        }
    }

    public Page<DiagnosisResDto> requestDiagnosisList(int pno) {

        Pageable pageable = PageRequest.of(pno, 10);

        return diagnosisReqRepository.findAll(pageable)
                .map(entity -> DiagnosisResDto.builder()
                        .diagnosisReqId(entity.getDiagnosisReqId())
                        .diagnosisReqStatus(entity.getDiagnosisReqStatus())
                        .createdAt(entity.getCreatedAt())
                        .build()
                );
    }

    //상세보기
    @Transactional(readOnly = true)
    public DiagnosisDetailResDto getDiagnosisDetail(Long diagnosisReqId) {

        DiagnosisReqEntity diagnosisReq =
                diagnosisReqRepository.findById(diagnosisReqId)
                        .orElseThrow(() ->
                                new IllegalArgumentException("진단 신청이 없습니다.")
                        );

        List<DiagnosisAnswerDto> answerList =
                diagnosisReq.getAnswerList().stream()
                        .map(answer -> {
                            DiagnosisAnswerDto dto = new DiagnosisAnswerDto();
                            dto.setQuestionId(answer.getQuestion().getQuestionId());
                            dto.setQuestionCategory(
                                    answer.getQuestion().getQuestionCategory()
                            );
                            dto.setQuestionContent(
                                    answer.getQuestion().getQuestionContent()
                            );
                            dto.setQuestionContent(
                                    answer.getQuestion().getQuestionContent()
                            );
                            dto.setAnswerValue(answer.getAnswerValue());

                            return dto;
                        })
                        .toList();

        List<ImgUrlResDto> fileList =
                imageRepository.findByDiagnosisReq(diagnosisReq)
                        .stream()
                        .map(ImgUrlResDto::from)
                        .toList();


        return DiagnosisDetailResDto.from(
                diagnosisReq,
                answerList,
                fileList
        );
    }
    //펫 타입별 질문 조회
    public List<SelfDiagnosisQuestionResDto> getQuestionList(
            PetType petType
    ) {

        return questionRepository
                .findByPetType(petType)
                .stream()
                .map(SelfDiagnosisQuestionResDto::from)
                .toList();
    }
 //반려동물 목록 조회
    @Transactional(readOnly = true)
    public List<PetMyPageResDto> getMyPetListForDiagnosis(String username) {

        MemberEntity member = memberRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("회원 없음"));

        return petRepository.findAllByMember_Id(member.getId())
                .stream()
                .map(PetMyPageResDto::from)
                .toList();
    }
}