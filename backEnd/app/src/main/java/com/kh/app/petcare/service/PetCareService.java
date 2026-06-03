package com.kh.app.petcare.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.app.aws.service.S3Service;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.pet.dto.response.PetMyPageResDto;
import com.kh.app.pet.entity.PetEntity;
import com.kh.app.pet.entity.PetType;
import com.kh.app.pet.repository.PetRepository;
import com.kh.app.petcare.dto.request.DiagnosisAnswerDto;
import com.kh.app.petcare.dto.request.PetCareReqDto;
import com.kh.app.petcare.dto.response.*;
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
import org.springframework.data.domain.Sort;
import java.io.IOException;
import java.util.List;
import com.kh.app.common.entity.DelYn;


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
    private final S3Service s3Service;


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

        // 선택한 반려동물 조회
        PetEntity pet = petRepository.findById(reqDto.getPetId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "반려동물을 찾을 수 없습니다."
                        )
                );

        /*
         * 해당 펫에 진행 중인 건강진단 신청이 이미 있는지 확인
         *
         * Y = 신청 중
         * N = 신청 가능
         */
        boolean hasActiveDiagnosis =
                diagnosisReqRepository
                        .existsByPetEntity_IdAndDiagnosisReqStatus(
                                pet.getId(),
                                DelYn.Y
                        );

        if (hasActiveDiagnosis) {
            throw new IllegalStateException(
                    "이미 진행 중인 건강진단 신청이 있습니다."
            );
        }

        /*
         * 새로운 진단 신청 생성
         *
         * DiagnosisReqEntity에서
         * diagnosisReqStatus 기본값이 DelYn.Y로 설정되어 있으므로
         * 새 신청을 저장하면 자동으로 신청 중 상태가 됨
         */
        DiagnosisReqEntity diagnosisReq =
                DiagnosisReqEntity.builder()
                        .petEntity(pet)
                        .build();

        diagnosisReqRepository.save(diagnosisReq);



        // 사용자가 작성한 문진 답변 저장
        for (DiagnosisAnswerDto answerDto : reqDto.getAnswerList()) {

            SelfDiagnosisQuestionEntity question =
                    questionRepository.findById(
                                    answerDto.getQuestionId()
                            )
                            .orElseThrow(() ->
                                    new IllegalArgumentException(
                                            "질문을 찾을 수 없습니다."
                                    )
                            );

            SelfDiagnosisAnswerEntity answer =
                    SelfDiagnosisAnswerEntity.builder()
                            .question(question)
                            .diagnosisReq(diagnosisReq)
                            .answerValue(answerDto.getAnswerValue())
                            .build();

            answerRepository.save(answer);
        }

        // 눈, 피부, 치아 이미지 저장
        saveImages(
                eyeFiles,
                diagnosisReq,
                ImgCategory.EYE
        );

        saveImages(
                skinFiles,
                diagnosisReq,
                ImgCategory.SKIN
        );

        saveImages(
                teethFiles,
                diagnosisReq,
                ImgCategory.TEETH
        );

        log.info(
                "건강진단 신청 완료 - petId={}, diagnosisReqId={}",
                pet.getId(),
                diagnosisReq.getDiagnosisReqId()
        );
    }
    // 건강진단 완료 처리
    @Transactional
    public void completeDiagnosis(Long diagnosisReqId) {

        DiagnosisReqEntity diagnosisReq =
                diagnosisReqRepository.findById(diagnosisReqId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "진단 신청이 없습니다."
                                )
                        );

        diagnosisReq.completeDiagnosis();
    }
//s3저장
    private void saveImages(
            List<MultipartFile> files,
            DiagnosisReqEntity diagnosisReq,
            ImgCategory category
    ) throws IOException {

        if (files == null || files.isEmpty()) {
            return;
        }

        for (MultipartFile file : files) {

            if (file == null || file.isEmpty()) {
                continue;
            }

            // S3에 업로드하고 저장 경로 반환
            String s3Key = s3Service.upload(
                    file,
                    "diagnosis/" + category.name().toLowerCase()
            );

            ImgUrlEntity image =
                    ImgUrlEntity.builder()
                            .diagnosisReq(diagnosisReq)
                            .imgCategory(category)

                            // 사용자가 올린 실제 파일명
                            .imageOriginName(file.getOriginalFilename())

                            // S3 저장 경로
                            .imageChangedName(s3Key)
                            .build();

            imageRepository.save(image);
        }
    }
//수의사 목록 페이징 오래된순 정렬 최상단으로 위치
public Page<DiagnosisResDto> requestDiagnosisList(int pno) {

    Pageable pageable = PageRequest.of(
            pno,
            10,
            Sort.by(
                    Sort.Order.asc("createdAt"),
                    Sort.Order.asc("diagnosisReqId")
            )
    );
//신청중만 보임
    return diagnosisReqRepository
            .findAllByDiagnosisReqStatus(
                    DelYn.Y,
                    pageable
            )
            .map(DiagnosisResDto::from);
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
                            dto.setAnswerValue(answer.getAnswerValue());

                            return dto;
                        })
                        .toList();
// 해당 진단 신청에 저장된 이미지 목록 조회
        List<ImgUrlResDto> fileList =
                imageRepository.findByDiagnosisReq(diagnosisReq)
                        // 조회 결과를 하나씩 꺼내서 DTO로 변환
                        .stream()
                        .map(image ->
                                ImgUrlResDto.from(
                                        image,
                                        // DB에 저장된 S3 Key를 실제 접근 가능한 이미지 URL로 변환
                                        s3Service.getFileUrl(
                                                image.getImageChangedName()
                                        )
                                )
                        )
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
 public List<PetDiagnosisResDto> getMyPetListForDiagnosis(
         String username
 ) {

     MemberEntity member = memberRepository.findByUsername(username)
             .or(() -> memberRepository.findBySocialId(username))
             .orElseThrow(() ->
                     new IllegalArgumentException("회원 없음")
             );

     // 삭제되지 않은 반려동물만 조회
     return petRepository
             .findAllByMember_IdAndDelYn(
                     member.getId(),
                     DelYn.N
             )
             .stream()
             .map(pet -> {

                 boolean diagnosisInProgress =
                         diagnosisReqRepository
                                 .existsByPetEntity_IdAndDiagnosisReqStatus(
                                         pet.getId(),
                                         DelYn.Y
                                 );

                 return PetDiagnosisResDto.from(
                         pet,
                         diagnosisInProgress
                 );
             })
             .toList();
 }
    }