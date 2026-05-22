package com.kh.app.petcare.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.app.common.entity.DelYn;
import com.kh.app.pet.entity.PetEntity;
import com.kh.app.pet.repository.PetRepository;
import com.kh.app.petcare.dto.request.DiagnosisAnswerDto;
import com.kh.app.petcare.dto.request.PetCareReqDto;
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

    @Transactional
    public void requestDiagnosis(
            String data,
            List<MultipartFile> eyeFiles,
            List<MultipartFile> skinFiles,
            List<MultipartFile> teethFiles,
            String username
    ) throws IOException {

        // JSON 문자열 -> DTO 변환
        ObjectMapper objectMapper = new ObjectMapper();

        PetCareReqDto reqDto =
                objectMapper.readValue(data, PetCareReqDto.class);

        // 펫 조회
        PetEntity pet = petRepository.findById(reqDto.getPetId())
                .orElseThrow(() -> new IllegalArgumentException("반려동물을 찾을 수 없습니다."));

        // 건강진단 신청 저장
        DiagnosisReqEntity diagnosisReq =
                DiagnosisReqEntity.builder()
                        .petEntity(pet)
                        .build();

        diagnosisReqRepository.save(diagnosisReq);

        // 답변 저장
        for (DiagnosisAnswerDto answerDto : reqDto.getAnswerList()) {

            // 질문 조회
            SelfDiagnosisQuestionEntity question =
                    questionRepository.findById(answerDto.getQuestionId())
                            .orElseThrow(() -> new IllegalArgumentException("질문을 찾을 수 없습니다."));

            // 답변 저장
            SelfDiagnosisAnswerEntity answer =
                    SelfDiagnosisAnswerEntity.builder()
                            .question(question)
                            .diagnosisReq(diagnosisReq)
                            .answerValue(answerDto.getAnswerValue())
                            .build();

            answerRepository.save(answer);
        }

        // 이미지 저장
        saveImages(eyeFiles, diagnosisReq, ImgCategory.EYE);
        saveImages(skinFiles, diagnosisReq, ImgCategory.SKIN);
        saveImages(teethFiles, diagnosisReq, ImgCategory.TEETH);

        log.info("건강진단 신청 완료");
    }

    // 이미지 저장 메서드
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
}