package com.kh.app.petcare.service;

import com.kh.app.common.entity.DelYn;
import com.kh.app.petcare.dto.request.PetCareReqDto;
import com.kh.app.petcare.entity.DiagnosisReqEntity;
import com.kh.app.petcare.entity.ImgCategory;
import com.kh.app.petcare.entity.ImgUrlEntity;
import com.kh.app.petcare.repository.DiagnosisReqRepository;
import com.kh.app.petcare.repository.ImageRepository;
import com.kh.app.petcare.repository.SelfDiagnosisAnswerRepository;
import com.kh.app.petcare.repository.SelfDiagnosisQuestionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class PetCareService {

    private final DiagnosisReqRepository diagnosisReqRepository;
    private final SelfDiagnosisQuestionRepository questionRepository;
    private final SelfDiagnosisAnswerRepository answerRepository;
    private final ImageRepository imageRepository;

    @Transactional
    public void requestDiagnosis(
            PetCareReqDto reqDto,
            List<MultipartFile> fileList,
            String username
    ) {

        // 1. 진단 신청 저장
        DiagnosisReqEntity diagnosisReq =
                diagnosisReqRepository.save(
                        DiagnosisReqEntity.builder()
                                .diagnosisReqStatus(DelYn.Y)
                                .build()
                );

        log.info("진단 신청 저장 완료");

        // 2. 이미지 저장
        if (fileList != null) {

            for (MultipartFile file : fileList) {

                ImgUrlEntity img = ImgUrlEntity.builder()
                        .imgCategory(ImgCategory.EYE)
                        .diagnosisReq(diagnosisReq)
                        .imageOriginName(file.getOriginalFilename())
                        .imageChangedName(
                                System.currentTimeMillis()
                                        + "_" +
                                        file.getOriginalFilename()
                        )
                        .build();

                imageRepository.save(img);

                log.info("이미지 저장 완료 : {}", file.getOriginalFilename());
            }
        }
    }
}