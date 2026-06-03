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

    // 보험 가입 신청
    @Transactional
    public void applyInsurance(
            String data,
            MultipartFile medicalCertificate,
            String username
    ) throws IOException {

        // JSON 문자열을 DTO로 변환
        PetInsuranceApplicationReqDto dto =
                objectMapper.readValue(
                        data,
                        PetInsuranceApplicationReqDto.class
                );

        // 가입 대상 반려동물 조회
        PetEntity pet = petRepository.findById(dto.getPetId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "반려동물을 찾을 수 없습니다."
                        )
                );

        // 로그인한 회원의 반려동물인지 확인
        if (!pet.getMember().getUsername().equals(username)) {
            throw new IllegalArgumentException(
                    "본인의 반려동물만 보험을 신청할 수 있습니다."
            );
        }

        // 보험 상품 조회
        PetInsuranceProductEntity product =
                petInsuranceProductRepository.findById(dto.getProductId())
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "보험 상품을 찾을 수 없습니다."
                                )
                        );

        // 진료확인서 첨부 여부 확인
        if (medicalCertificate == null || medicalCertificate.isEmpty()) {
            throw new IllegalArgumentException(
                    "진료확인서를 첨부해 주세요."
            );
        }

        // 진료확인서 S3 업로드
        String s3Key = s3Service.upload(
                medicalCertificate,
                "insurance/medical-certificate"
        );

        // 보험 가입 신청 저장
        PetInsuranceApplicationEntity application =
                PetInsuranceApplicationEntity.builder()
                        .pet(pet)
                        .product(product)
                        .approveStatus(PetInsuranceApproveStatus.WAITING)
                        .imageOriginName(
                                medicalCertificate.getOriginalFilename()
                        )
                        .imageChangedName(s3Key)
                        .build();

        petInsuranceApplicationRepository.save(application);

        log.info("펫 보험 가입 신청 완료");
    }

    // 관리자 가입 신청 승인
    @Transactional
    public void approveApplication(Long applicationId) {

        PetInsuranceApplicationEntity application =
                petInsuranceApplicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "보험 가입 신청을 찾을 수 없습니다."
                                )
                        );

        if (application.getApproveStatus()
                != PetInsuranceApproveStatus.WAITING) {

            throw new IllegalStateException(
                    "대기 중인 신청만 승인할 수 있습니다."
            );
        }

        application.approve();

        log.info(
                "펫 보험 가입 신청 승인 완료 applicationId = {}",
                applicationId
        );
    }

    // 최초 정기결제 준비
    @Transactional
    public KakaoPayReadyRespDto readySubscriptionPayment(
            Long applicationId,
            String username
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

        // 관리자 승인 여부 확인
        if (application.getApproveStatus()
                != PetInsuranceApproveStatus.APPROVED) {

            throw new IllegalStateException(
                    "승인된 보험 가입 신청만 결제할 수 있습니다."
            );
        }

        // 본인의 보험 신청인지 확인
        if (!application.getPet()
                .getMember()
                .getUsername()
                .equals(username)) {

            throw new IllegalArgumentException(
                    "본인의 보험 가입 신청만 결제할 수 있습니다."
            );
        }

        // 최초 결제가 이미 완료된 경우 차단
        if (application.getKakaoPaySid() != null) {
            throw new IllegalStateException(
                    "이미 최초 결제가 완료된 보험 신청입니다."
            );
        }

        // 보험 상품의 월 보험료
        Long monthlyPrice =
                application.getProduct()
                        .getProductMonthly();

        // 카카오페이 최초 정기결제 준비 요청
        KakaoPayReadyRespDto response =
                kakaoPayClient.readySubscription(
                        applicationId,
                        username,
                        application.getProduct().getProductName(),
                        monthlyPrice
                );

        if (response == null || response.getTid() == null) {
            throw new IllegalStateException(
                    "카카오페이 결제 준비 요청에 실패했습니다."
            );
        }

        // 결제 승인 단계에서 사용할 TID 임시 저장
        application.updateKakaoPayTid(response.getTid());

        log.info(
                "카카오페이 최초 정기결제 준비 완료 applicationId = {}, tid = {}",
                applicationId,
                response.getTid()
        );

        return response;
    }

    // 최초 정기결제 승인
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

        // 관리자 승인이 완료된 신청인지 확인
        if (application.getApproveStatus()
                != PetInsuranceApproveStatus.APPROVED) {

            throw new IllegalStateException(
                    "승인된 보험 가입 신청만 결제할 수 있습니다."
            );
        }

        // ready 단계에서 저장한 TID 확인
        if (application.getKakaoPayTid() == null) {
            throw new IllegalStateException(
                    "결제 준비 정보가 없습니다."
            );
        }

        // 새로고침 등에 의한 중복 승인 차단
        if (application.getKakaoPaySid() != null) {
            throw new IllegalStateException(
                    "이미 최초 결제가 완료된 보험 신청입니다."
            );
        }

        String username =
                application.getPet()
                        .getMember()
                        .getUsername();

        // 카카오페이 최초 정기결제 승인 요청
        KakaoPayApproveRespDto response =
                kakaoPayClient.approveSubscription(
                        applicationId,
                        username,
                        application.getKakaoPayTid(),
                        pgToken
                );

        if (response == null || response.getSid() == null) {
            throw new IllegalStateException(
                    "카카오페이 정기결제 승인에 실패했습니다."
            );
        }

        // 다음 회차 결제에 사용할 SID 저장
        application.updateKakaoPaySid(response.getSid());

        // 최초 결제 내역 저장
        PetInsurancePaymentEntity payment =
                PetInsurancePaymentEntity.builder()
                        .application(application)
                        .kakaoPayTid(response.getTid())
                        .paymentStatus(
                                PetInsurancePaymentStatus.SUCCESS
                        )
                        .paymentAmount(
                                application.getProduct()
                                        .getProductMonthly()
                        )
                        .build();

        petInsurancePaymentRepository.save(payment);

        log.info(
                "카카오페이 최초 정기결제 승인 완료 applicationId = {}, tid = {}, sid = {}",
                applicationId,
                response.getTid(),
                response.getSid()
        );

        return response;
    }
}