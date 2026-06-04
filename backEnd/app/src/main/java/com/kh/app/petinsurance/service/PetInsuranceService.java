package com.kh.app.petinsurance.service;

import com.kh.app.aws.service.S3Service;
import com.kh.app.pet.entity.PetEntity;
import com.kh.app.pet.repository.PetRepository;
import com.kh.app.petinsurance.dto.request.PetInsuranceApplicationReqDto;
import com.kh.app.petinsurance.dto.request.PetInsuranceCalculateReqDto;
import com.kh.app.petinsurance.dto.response.PetInsuranceCalculateResDto;
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
import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeParseException;
import java.util.List;

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

    // 보험 상품 목록 조회
    @Transactional(readOnly = true)
    public List<PetInsuranceProductEntity> getProductList() {

        return petInsuranceProductRepository.findAllByDelYn("N");
    }

    // 생년월일과 선택한 상품을 기준으로 예상 보험료 계산
    // 계산 결과는 DB에 저장하지 않고 사용자에게 반환만 함
    @Transactional(readOnly = true)
    public PetInsuranceCalculateResDto calculateMonthlyPrice(
            PetInsuranceCalculateReqDto dto
    ) {

        // 상품 선택 여부 확인
        if (dto.getProductId() == null) {
            throw new IllegalArgumentException(
                    "보험 상품을 선택해 주세요."
            );
        }

        // 생년월일 입력 여부 확인
        if (dto.getBirthDate() == null
                || dto.getBirthDate().isBlank()) {

            throw new IllegalArgumentException(
                    "반려동물의 생년월일을 입력해 주세요."
            );
        }

        // 선택한 상품 조회
        PetInsuranceProductEntity product =
                petInsuranceProductRepository
                        .findById(dto.getProductId())
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "보험 상품을 찾을 수 없습니다."
                                )
                        );

        LocalDate birthDate;

        try {
            // yyyy-MM-dd 형식으로 입력받음
            birthDate = LocalDate.parse(dto.getBirthDate());

        } catch (DateTimeParseException e) {

            throw new IllegalArgumentException(
                    "생년월일 형식이 올바르지 않습니다. yyyy-MM-dd 형식으로 입력해 주세요."
            );
        }

        LocalDate today = LocalDate.now();

        // 미래 날짜 입력 방지
        if (birthDate.isAfter(today)) {
            throw new IllegalArgumentException(
                    "생년월일은 오늘 이후 날짜로 입력할 수 없습니다."
            );
        }

        // 현재 날짜 기준 만 나이 계산
        int age = Period.between(
                birthDate,
                today
        ).getYears();

        // 상품 테이블에 저장된 기본 보험료
        Long baseMonthlyPrice =
                product.getProductMonthly();

        // 만 3세부터 한 살마다 10,000원씩 증가
        Long additionalPrice = 0L;

        if (age >= 3) {
            additionalPrice =
                    (long) (age - 2) * 10000L;
        }

        // 최종 예상 월 보험료
        Long monthlyPrice =
                baseMonthlyPrice + additionalPrice;

        return PetInsuranceCalculateResDto.builder()
                .productId(product.getProductId())
                .productName(product.getProductName())
                .birthDate(dto.getBirthDate())
                .age(age)
                .baseMonthlyPrice(baseMonthlyPrice)
                .additionalPrice(additionalPrice)
                .monthlyPrice(monthlyPrice)
                .build();
    }

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
        String s3Key = s3Service.upload(
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

        log.info("펫 보험 가입 신청 완료");
    }

    // 관리자 가입 신청 승인
    @Transactional
    public void approveApplication(Long applicationId) {

        PetInsuranceApplicationEntity application =
                petInsuranceApplicationRepository
                        .findById(applicationId)
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
                        application.getProduct()
                                .getProductName(),
                        monthlyPrice
                );

        if (response == null
                || response.getTid() == null) {

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

        if (response == null
                || response.getSid() == null) {

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