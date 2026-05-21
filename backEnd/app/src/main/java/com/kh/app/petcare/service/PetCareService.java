package com.kh.app.petcare.service;

import com.kh.app.petcare.dto.request.PetCareReqDto;
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

    public void requestDiagnosis(PetCareReqDto reqDto, List<MultipartFile> fileList, String username) {
        // 1. 진단 신청 엔티티 생성

        // 2. diagnosisReqRepository.save()

        // 3. 답변 반복문 저장

        // 4. 이미지 반복문 저장


    }
}
