package com.kh.app.petcare.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.app.aws.service.S3Service;
import com.kh.app.common.entity.DelYn;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.message.entity.MessageReasonType;
import com.kh.app.message.service.SystemMessageService;
import com.kh.app.pet.entity.PetEntity;
import com.kh.app.pet.entity.PetType;
import com.kh.app.pet.repository.PetRepository;
import com.kh.app.petcare.dto.request.DiagnosisAnswerDto;
import com.kh.app.petcare.dto.request.PetCareReqDto;
import com.kh.app.petcare.dto.response.DiagnosisDetailResDto;
import com.kh.app.petcare.dto.response.DiagnosisResDto;
import com.kh.app.petcare.dto.response.ImgUrlResDto;
import com.kh.app.petcare.dto.response.PetDiagnosisResDto;
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
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

import com.kh.app.point.service.PointService;

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
    private final PointService pointService;
    private final SystemMessageService systemMessageService;

    // =========================================================
    // 건강진단 신청
    // =========================================================
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

        // 로그인 회원 조회
        MemberEntity member = memberRepository.findByUsername(username)
                .or(() -> memberRepository.findBySocialId(username))
                .orElseThrow(() ->
                        new IllegalArgumentException("회원 정보가 존재하지 않습니다.")
                );

        // 선택한 반려동물 조회
        PetEntity pet = petRepository.findById(reqDto.getPetId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "반려동물을 찾을 수 없습니다."
                        )
                );

        // 로그인 회원의 반려동물인지 확인
        if (pet.getMember() == null || !pet.getMember().getId().equals(member.getId())) {
            throw new IllegalArgumentException("본인의 반려동물만 건강진단을 신청할 수 있습니다.");
        }

        /*
         * 해당 펫에 진행 중인 건강진단 신청이 이미 있는지 확인
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
         * 건강진단 서비스 이용 포인트 차감
         *
         * 포인트 부족 시 여기서 CustomException 발생
         * 이후 진단 신청 저장/이미지 저장은 진행되지 않음
         */
        pointService.useHealthcarePoint(member, "건강진단");

        /*
         * 새로운 진단 신청 생성
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

    // =========================================================
    // 건강진단 완료 처리
    // =========================================================
    @Transactional
    public void completeDiagnosis(Long diagnosisReqId) {

        DiagnosisReqEntity diagnosisReq =
                diagnosisReqRepository.findById(diagnosisReqId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "진단 신청이 없습니다."
                                )
                        );

        diagnosisReq.closeDiagnosis();
    }

    // =========================================================
    // 건강진단 이미지 S3 저장
    // =========================================================
    private void saveImages(
            List<MultipartFile> files,
            DiagnosisReqEntity diagnosisReq,
            ImgCategory category
    ) throws IOException {

        if (files == null || files.isEmpty()) {return;
        }
        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) {continue;}

            // S3에 업로드하고 저장 경로 반환
            String s3Key = s3Service.upload(
                    file,
                    "diagnosis/" + category.name().toLowerCase()
            );

            ImgUrlEntity image = ImgUrlEntity.builder()
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

    // =========================================================
    // 수의사 건강진단 신청 목록 조회
    // 신청 중인 데이터만 오래된 순서대로 페이징 조회
    // =========================================================
    public Page<DiagnosisResDto> requestDiagnosisList(
            int pno,
            String petType
    ) {

        Pageable pageable = PageRequest.of(
                pno,
                10,
                Sort.by(
                        Sort.Order.asc("createdAt"),
                        Sort.Order.asc("diagnosisReqId")
                )
        );

        Page<DiagnosisReqEntity> page;

        if ("D".equalsIgnoreCase(petType)) {
            page = diagnosisReqRepository
                    .findAllByDiagnosisReqStatusAndPetEntity_Breed_PetType(
                            DelYn.Y,
                            PetType.D,
                            pageable
                    );
        } else if ("C".equalsIgnoreCase(petType)) {
            page = diagnosisReqRepository
                    .findAllByDiagnosisReqStatusAndPetEntity_Breed_PetType(
                            DelYn.Y,
                            PetType.C,
                            pageable
                    );
        } else {
            page = diagnosisReqRepository
                    .findAllByDiagnosisReqStatus(
                            DelYn.Y,
                            pageable
                    );
        }

        return page.map(entity -> {

            PetEntity pet = entity.getPetEntity();

            return DiagnosisResDto.builder()
                    .diagnosisReqId(entity.getDiagnosisReqId())

                    .memberNickname(
                            pet.getMember() != null
                                    ? pet.getMember().getNickname()
                                    : null
                    )

                    .petId(pet.getId())

                    .petName(pet.getName())

                    .petType(
                            pet.getBreed() != null
                                    ? pet.getBreed().getPetType().name()
                                    : null
                    )

                    .diagnosisReqStatus(entity.getDiagnosisReqStatus())

                    .createdAt(entity.getCreatedAt())

                    .build();
        });
    }

    // =========================================================
    // 건강진단 상세 조회
    // =========================================================
    @Transactional(readOnly = true)
    public DiagnosisDetailResDto getDiagnosisDetail(Long diagnosisReqId) {

        DiagnosisReqEntity diagnosisReq =
                diagnosisReqRepository.findById(diagnosisReqId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "진단 신청이 없습니다."
                                )
                        );

        List<DiagnosisAnswerDto> answerList =
                diagnosisReq.getAnswerList()
                        .stream()
                        .map(answer -> {
                            DiagnosisAnswerDto dto =
                                    new DiagnosisAnswerDto();

                            dto.setQuestionId(
                                    answer.getQuestion().getQuestionId()
                            );

                            dto.setQuestionCategory(
                                    answer.getQuestion().getQuestionCategory()
                            );

                            dto.setQuestionContent(
                                    answer.getQuestion().getQuestionContent()
                            );

                            dto.setAnswerValue(
                                    answer.getAnswerValue()
                            );

                            return dto;
                        })
                        .toList();

        // 해당 진단 신청에 저장된 이미지 목록 조회
        List<ImgUrlResDto> fileList =
                imageRepository.findByDiagnosisReq(diagnosisReq)
                        .stream()
                        .map(image ->
                                ImgUrlResDto.from(
                                        image,

                                        // DB에 저장된 S3 Key를
                                        // 실제 접근 가능한 이미지 URL로 변환
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

    // =========================================================
    // 펫 타입별 자가진단 질문 조회
    // =========================================================
    @Transactional(readOnly = true)
    public List<SelfDiagnosisQuestionResDto> getQuestionList(
            PetType petType
    ) {

        return questionRepository
                .findByPetType(petType)
                .stream()
                .map(SelfDiagnosisQuestionResDto::from)
                .toList();
    }

    // =========================================================
    // 건강진단 신청 화면용 내 반려동물 목록 조회
    //
    // PET_IMAGE_URL에는 S3 Key가 저장되어 있으므로
    // 조회 시 브라우저에서 접근 가능한 URL로 변환하여 전달
    // =========================================================
    @Transactional(readOnly = true)
    public List<PetDiagnosisResDto> getMyPetListForDiagnosis(
            String username
    ) {

        MemberEntity member =
                memberRepository.findByUsername(username)
                        .or(() ->
                                memberRepository.findBySocialId(username)
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "회원 정보가 존재하지 않습니다."
                                )
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

                    String imageUrl =
                            pet.getImageUrl() != null
                                    ? s3Service.getFileUrl(pet.getImageUrl())
                                    : null;

                    return PetDiagnosisResDto.from(
                            pet,
                            diagnosisInProgress,
                            imageUrl
                    );
                })
                .toList();
    }

    // =========================================================
// 건강진단 신청 반려
//
// 현재 구조에서는 diagnosisReqStatus가
// Y = 진행 중
// N = 진행 종료
//
// 반려 시 N으로 변경하여
// 사용자가 동일한 펫으로 다시 신청할 수 있도록 처리
//
// 반려 처리 후 회원에게 자동 쪽지 발송
// =========================================================
    @Transactional
    public void rejectDiagnosis(
            Long diagnosisReqId,
            String adminUsername
    ) {

        DiagnosisReqEntity diagnosisReq =
                diagnosisReqRepository.findById(diagnosisReqId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "건강진단 신청 정보를 찾을 수 없습니다."
                                )
                        );

        PetEntity pet = diagnosisReq.getPetEntity();

        if (pet == null || pet.getMember() == null) {
            throw new IllegalStateException(
                    "쪽지를 받을 회원 정보를 찾을 수 없습니다."
            );
        }

        MemberEntity receiverMember = pet.getMember();

        // 반려 시 진행 상태 해제
        // 다시 건강진단 신청 가능
        diagnosisReq.closeDiagnosis();

        // 회원에게 반려 안내 쪽지 자동 발송
        systemMessageService.sendByAdmin(
                adminUsername,
                receiverMember,
                MessageReasonType.NOTICE,
                "건강진단 신청 반려 안내",
                pet.getName() + "의 건강진단 신청이 반려되었습니다."
        );

        log.info(
                "건강진단 신청 반려 처리 및 쪽지 발송 완료 - diagnosisReqId={}, petId={}",
                diagnosisReqId,
                pet.getId()
        );
    }

}