package com.kh.app.petinsurance.service;

import com.kh.app.aws.service.S3Service;
import com.kh.app.pet.entity.PetEntity;
import com.kh.app.pet.repository.PetRepository;
import com.kh.app.petinsurance.dto.PetInsuranceApplicationReqDto;
import com.kh.app.petinsurance.entity.PetInsuranceApplicationEntity;
import com.kh.app.petinsurance.entity.PetInsuranceApproveStatus;
import com.kh.app.petinsurance.entity.PetInsurancePaymentEntity;
import com.kh.app.petinsurance.entity.PetInsurancePaymentStatus;
import com.kh.app.petinsurance.entity.PetInsuranceProductEntity;
import com.kh.app.petinsurance.kakao.KakaoPayClient;
import com.kh.app.petinsurance.kakao.dto.KakaoPayApproveRespDto;
import com.kh.app.petinsurance.kakao.dto.KakaoPayReadyRespDto;
import com.kh.app.petinsurance.kakao.dto.KakaoPaySubscriptionRespDto;
import com.kh.app.petinsurance.repository.PetInsuranceApplicationRepository;
import com.kh.app.petinsurance.repository.PetInsurancePaymentRepository;
import com.kh.app.petinsurance.repository.PetInsuranceProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class PetInsuranceService {

    private final ObjectMapper objectMapper;
    private final PetRepository petRepository;
    private final PetInsuranceProductRepository petInsuranceProductRepository;
    private final PetInsuranceApplicationRepository petInsuranceApplicationRepository;
    private final PetInsurancePaymentRepository petInsurancePaymentRepository;
    private final KakaoPayClient kakaoPayClient;
    private final S3Service s3Service;

    // =========================================================
    // 보험 가입 신청
    // =========================================================
    @Transactional
    public void applyInsurance(
            String data,
            MultipartFile medicalCertificate,
            String username
    ) throws IOException {

        validateUsername(username);

        // 프론트에서 받은 JSON 문자열을 DTO로 변환
        PetInsuranceApplicationReqDto dto =
                objectMapper.readValue(
                        data,
                        PetInsuranceApplicationReqDto.class
                );

        // 가입 대상 반려동물 조회
        PetEntity pet =
                petRepository.findById(dto.getPetId())
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "반려동물을 찾을 수 없습니다."
                                )
                        );

        // 로그인한 사용자가 해당 반려동물의 보호자인지 확인
        validatePetOwner(
                pet,
                username
        );

        // 보험 상품 조회
        PetInsuranceProductEntity product =
                petInsuranceProductRepository
                        .findById(dto.getProductId())
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "보험 상품을 찾을 수 없습니다."
                                )
                        );

        // 진료확인서 첨부 여부 확인
        if (medicalCertificate == null
                || medicalCertificate.isEmpty()) {

            throw new IllegalArgumentException(
                    "진료확인서를 첨부해 주세요."
            );
        }

        // 진료확인서 S3 업로드
        String s3Key =
                s3Service.upload(
                        medicalCertificate,
                        "insurance/medical-certificate"
                );

        // 보험 가입 신청 저장
        PetInsuranceApplicationEntity application =
                PetInsuranceApplicationEntity.builder()
                        .pet(pet)
                        .product(product)
                        .approveStatus(
                                PetInsuranceApproveStatus.WAITING
                        )
                        .imageOriginName(
                                medicalCertificate.getOriginalFilename()
                        )
                        .imageChangedName(s3Key)
                        .build();

        petInsuranceApplicationRepository.save(application);

        log.info(
                "펫 보험 가입 신청 완료 username = {}, petId = {}, productId = {}",
                username,
                dto.getPetId(),
                dto.getProductId()
        );
    }

    // =========================================================
    // 카카오페이 정기결제 수단 등록 준비
    // 보험 신청 직후 WAITING 상태에서 호출
    // totalAmount = 0원
    // =========================================================
    @Transactional
    public KakaoPayReadyRespDto readySubscriptionPayment(
            Long applicationId,
            String username
    ) {

        validateUsername(username);

        // 보험 가입 신청 조회
        PetInsuranceApplicationEntity application =
                petInsuranceApplicationRepository
                        .findById(applicationId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "보험 가입 신청을 찾을 수 없습니다."
                                )
                        );

        // 심사 대기 중인 신청만 결제수단 등록 가능
        if (application.getApproveStatus()
                != PetInsuranceApproveStatus.WAITING) {

            throw new IllegalStateException(
                    "심사 대기 중인 보험 신청만 결제수단을 등록할 수 있습니다."
            );
        }

        // 로그인한 사용자의 보험 신청인지 확인
        validatePetOwner(
                application.getPet(),
                username
        );

        // 이미 SID가 있으면 중복 등록 차단
        if (application.getKakaoPaySid() != null
                && !application.getKakaoPaySid().isBlank()) {

            throw new IllegalStateException(
                    "이미 정기결제 수단이 등록된 보험 신청입니다."
            );
        }

        // 0원 결제수단 등록 준비 요청
        KakaoPayReadyRespDto response =
                kakaoPayClient.readySubscription(
                        applicationId,
                        username,
                        application.getProduct().getProductName()
                                + " 정기결제 등록",
                        0L
                );

        if (response == null || response.getTid() == null) {
            throw new IllegalStateException(
                    "카카오페이 결제수단 등록 준비 요청에 실패했습니다."
            );
        }

        // 승인 단계에서 사용할 TID 임시 저장
        application.updateKakaoPayTid(
                response.getTid()
        );

        log.info(
                "카카오페이 정기결제 수단 등록 준비 완료 applicationId = {}, tid = {}",
                applicationId,
                response.getTid()
        );

        return response;
    }

    // =========================================================
    // 카카오페이 정기결제 수단 등록 승인
    // 카카오페이 결제창에서 돌아온 pg_token 사용
    // SID만 저장하고 결제 이력은 저장하지 않음
    // =========================================================
    @Transactional
    public KakaoPayApproveRespDto approveSubscriptionPayment(
            Long applicationId,
            String pgToken
    ) {

        // 보험 가입 신청 조회
        PetInsuranceApplicationEntity application =
                petInsuranceApplicationRepository
                        .findById(applicationId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "보험 가입 신청을 찾을 수 없습니다."
                                )
                        );

        // 심사 대기 중인 신청만 결제수단 등록 가능
        if (application.getApproveStatus()
                != PetInsuranceApproveStatus.WAITING) {

            throw new IllegalStateException(
                    "심사 대기 중인 보험 신청만 결제수단을 등록할 수 있습니다."
            );
        }

        // ready 단계에서 저장한 TID 확인
        if (application.getKakaoPayTid() == null
                || application.getKakaoPayTid().isBlank()) {

            throw new IllegalStateException(
                    "결제수단 등록 준비 정보가 없습니다."
            );
        }

        // 중복 승인 차단
        if (application.getKakaoPaySid() != null
                && !application.getKakaoPaySid().isBlank()) {

            throw new IllegalStateException(
                    "이미 정기결제 수단이 등록된 보험 신청입니다."
            );
        }

        // 카카오페이가 전달한 승인 토큰 확인
        if (pgToken == null || pgToken.isBlank()) {
            throw new IllegalArgumentException(
                    "카카오페이 승인 토큰이 없습니다."
            );
        }

        String username =
                application.getPet()
                        .getMember()
                        .getUsername();

        // 최초 0원 등록 승인 요청
        KakaoPayApproveRespDto response =
                kakaoPayClient.approveSubscription(
                        applicationId,
                        username,
                        application.getKakaoPayTid(),
                        pgToken
                );

        if (response == null
                || response.getSid() == null
                || response.getSid().isBlank()) {

            throw new IllegalStateException(
                    "카카오페이 정기결제 수단 등록에 실패했습니다."
            );
        }

        // 이후 정기결제에 사용할 SID 저장
        application.updateKakaoPaySid(
                response.getSid()
        );

        log.info(
                "카카오페이 정기결제 수단 등록 완료 applicationId = {}, tid = {}, sid = {}",
                applicationId,
                response.getTid(),
                response.getSid()
        );

        return response;
    }

    // =========================================================
    // 관리자 가입 신청 승인 + 최초 월 보험료 결제
    // SID 기반 정기결제 성공 후 APPROVED로 상태 변경
    // =========================================================
    @Transactional
    public void approveApplication(Long applicationId) {

        // 보험 가입 신청 조회
        PetInsuranceApplicationEntity application =
                petInsuranceApplicationRepository
                        .findById(applicationId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "보험 가입 신청을 찾을 수 없습니다."
                                )
                        );

        // 심사 대기 중인 신청만 승인 가능
        if (application.getApproveStatus()
                != PetInsuranceApproveStatus.WAITING) {

            throw new IllegalStateException(
                    "대기 중인 신청만 승인할 수 있습니다."
            );
        }

        // 사용자가 결제수단을 먼저 등록했는지 확인
        if (application.getKakaoPaySid() == null
                || application.getKakaoPaySid().isBlank()) {

            throw new IllegalStateException(
                    "카카오페이 정기결제 수단이 등록되지 않았습니다."
            );
        }

        String username =
                application.getPet()
                        .getMember()
                        .getUsername();

        Long monthlyPrice =
                application.getProduct()
                        .getProductMonthly();

        // SID 기반 최초 월 보험료 결제 요청
        KakaoPaySubscriptionRespDto response =
                kakaoPayClient.requestSubscriptionPayment(
                        applicationId,
                        username,
                        application.getKakaoPaySid(),
                        application.getProduct()
                                .getProductName(),
                        monthlyPrice
                );

        if (response == null
                || response.getTid() == null
                || response.getTid().isBlank()) {

            throw new IllegalStateException(
                    "최초 월 보험료 결제에 실패했습니다."
            );
        }

        // 결제 성공 후 상태 변경
        application.approve();

        // 결제 이력 저장
        PetInsurancePaymentEntity payment =
                PetInsurancePaymentEntity.builder()
                        .application(application)
                        .kakaoPayTid(
                                response.getTid()
                        )
                        .paymentStatus(
                                PetInsurancePaymentStatus.SUCCESS
                        )
                        .paymentAmount(
                                monthlyPrice
                        )
                        .build();

        petInsurancePaymentRepository.save(payment);

        log.info(
                "펫 보험 가입 승인 및 최초 보험료 결제 완료 applicationId = {}, tid = {}, amount = {}",
                applicationId,
                response.getTid(),
                monthlyPrice
        );
    }

    // =========================================================
    // 로그인 정보 검증
    // =========================================================
    private void validateUsername(String username) {

        if (username == null
                || username.isBlank()
                || "anonymousUser".equals(username)) {

            throw new IllegalArgumentException(
                    "로그인 정보를 확인할 수 없습니다."
            );
        }
    }

    // =========================================================
    // 로그인한 회원의 반려동물인지 검증
    // =========================================================
    private void validatePetOwner(
            PetEntity pet,
            String username
    ) {

        String petOwnerUsername =
                pet.getMember() != null
                        ? pet.getMember().getUsername()
                        : null;

        log.info(
                "펫보험 소유자 검증 petOwnerUsername = {}, loginUsername = {}",
                petOwnerUsername,
                username
        );

        if (!Objects.equals(
                petOwnerUsername,
                username
        )) {
            throw new IllegalArgumentException(
                    "본인의 반려동물만 보험을 신청할 수 있습니다."
            );
        }
    }
}