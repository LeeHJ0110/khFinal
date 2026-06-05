package com.kh.app.petinsurance.service;

import com.kh.app.aws.service.S3Service;
import com.kh.app.common.entity.DelYn;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.pet.entity.PetEntity;
import com.kh.app.pet.repository.PetRepository;
import com.kh.app.petinsurance.dto.request.PetInsuranceApplicationReqDto;
import com.kh.app.petinsurance.dto.request.PetInsuranceCalculateReqDto;
import com.kh.app.petinsurance.dto.response.PetInsuranceApplicationResDto;
import com.kh.app.petinsurance.dto.response.PetInsuranceCalculateResDto;
import com.kh.app.petinsurance.dto.response.PetInsurancePetResDto;
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
import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class PetInsuranceService {

    private final ObjectMapper objectMapper;
    private final MemberRepository memberRepository;
    private final PetRepository petRepository;
    private final PetInsuranceProductRepository petInsuranceProductRepository;
    private final PetInsuranceApplicationRepository petInsuranceApplicationRepository;
    private final PetInsurancePaymentRepository petInsurancePaymentRepository;
    private final KakaoPayClient kakaoPayClient;
    private final S3Service s3Service;

    // =========================================================
    // 보험 상품 목록 조회
    // =========================================================
    @Transactional(readOnly = true)
    public List<PetInsuranceProductEntity> getProductList() {

        return petInsuranceProductRepository
                .findAllByDelYn(DelYn.N);
    }

    // =========================================================
    // 생년월일과 선택 상품을 기준으로 예상 보험료 계산
    // 계산 결과는 DB에 저장하지 않고 사용자에게 반환만 함
    // =========================================================
    @Transactional(readOnly = true)
    public PetInsuranceCalculateResDto calculateMonthlyPrice(
            PetInsuranceCalculateReqDto dto
    ) {

        if (dto == null) {
            throw new IllegalArgumentException(
                    "보험료 계산 요청 정보가 없습니다."
            );
        }

        if (dto.getProductId() == null) {
            throw new IllegalArgumentException(
                    "보험 상품을 선택해 주세요."
            );
        }

        if (dto.getBirthDate() == null
                || dto.getBirthDate().isBlank()) {

            throw new IllegalArgumentException(
                    "반려동물의 생년월일을 입력해 주세요."
            );
        }

        PetInsuranceProductEntity product =
                petInsuranceProductRepository
                        .findById(dto.getProductId())
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "보험 상품을 찾을 수 없습니다."
                                )
                        );

        if (product.getDelYn() == DelYn.Y) {
            throw new IllegalStateException(
                    "현재 가입할 수 없는 보험 상품입니다."
            );
        }

        LocalDate birthDate;

        try {
            birthDate =
                    LocalDate.parse(dto.getBirthDate());

        } catch (DateTimeParseException e) {

            throw new IllegalArgumentException(
                    "생년월일 형식이 올바르지 않습니다. yyyy-MM-dd 형식으로 입력해 주세요."
            );
        }

        LocalDate today =
                LocalDate.now();

        if (birthDate.isAfter(today)) {
            throw new IllegalArgumentException(
                    "생년월일은 오늘 이후 날짜로 입력할 수 없습니다."
            );
        }

        int age =
                Period.between(
                        birthDate,
                        today
                ).getYears();

        Long baseMonthlyPrice =
                product.getProductMonthly();

        Long additionalPrice = 0L;

        // 만 3세부터 한 살마다 10,000원씩 증가
        if (age >= 3) {
            additionalPrice =
                    (long) (age - 2) * 10000L;
        }

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

    // =========================================================
    // 보험 가입 신청 화면용 내 반려동물 목록 조회
    // 펫 한 마리당 보험 상품 3개 중 하나만 신청 가능
    // =========================================================
    @Transactional(readOnly = true)
    public List<PetInsurancePetResDto> getMyPetListForInsurance(
            String username
    ) {

        MemberEntity member =
                findMemberByLoginId(username);

        return petRepository
                .findAllByMember_IdAndDelYn(
                        member.getId(),
                        DelYn.N
                )
                .stream()
                .map(pet -> {

                    boolean insuranceInProgress =
                            petInsuranceApplicationRepository
                                    .existsByPet_IdAndApproveStatusInAndDelYn(
                                            pet.getId(),
                                            List.of(
                                                    PetInsuranceApproveStatus.WAITING,
                                                    PetInsuranceApproveStatus.APPROVED
                                            ),
                                            DelYn.N
                                    );

                    return PetInsurancePetResDto.from(
                            pet,
                            insuranceInProgress
                    );
                })
                .toList();
    }

    // =========================================================
    // 보험 가입 신청
    // 펫 한 마리당 보험 상품 3개 중 하나만 신청 가능
    // =========================================================
    @Transactional
    public PetInsuranceApplicationResDto applyInsurance(
            String data,
            MultipartFile medicalCertificate,
            String username
    ) throws IOException {

        MemberEntity loginMember =
                findMemberByLoginId(username);

        PetInsuranceApplicationReqDto dto =
                objectMapper.readValue(
                        data,
                        PetInsuranceApplicationReqDto.class
                );

        if (dto.getPetId() == null) {
            throw new IllegalArgumentException(
                    "가입할 반려동물을 선택해 주세요."
            );
        }

        if (dto.getProductId() == null) {
            throw new IllegalArgumentException(
                    "보험 상품을 선택해 주세요."
            );
        }

        PetEntity pet =
                petRepository
                        .findById(dto.getPetId())
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "반려동물을 찾을 수 없습니다."
                                )
                        );

        validatePetOwner(
                pet,
                loginMember
        );

        boolean alreadyApplied =
                petInsuranceApplicationRepository
                        .existsByPet_IdAndApproveStatusInAndDelYn(
                                pet.getId(),
                                List.of(
                                        PetInsuranceApproveStatus.WAITING,
                                        PetInsuranceApproveStatus.APPROVED
                                ),
                                DelYn.N
                        );

        if (alreadyApplied) {
            throw new IllegalStateException(
                    "해당 반려동물은 이미 보험을 신청했거나 가입이 완료된 상태입니다."
            );
        }

        PetInsuranceProductEntity product =
                petInsuranceProductRepository
                        .findById(dto.getProductId())
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "보험 상품을 찾을 수 없습니다."
                                )
                        );

        if (product.getDelYn() == DelYn.Y) {
            throw new IllegalStateException(
                    "현재 가입할 수 없는 보험 상품입니다."
            );
        }

        if (medicalCertificate == null
                || medicalCertificate.isEmpty()) {

            throw new IllegalArgumentException(
                    "진료확인서를 첨부해 주세요."
            );
        }

        String s3Key =
                s3Service.upload(
                        medicalCertificate,
                        "insurance/medical-certificate"
                );

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

        PetInsuranceApplicationEntity savedApplication =
                petInsuranceApplicationRepository.save(
                        application
                );

        log.info(
                "펫 보험 가입 신청 완료 username = {}, petId = {}, productId = {}, applicationId = {}",
                username,
                dto.getPetId(),
                dto.getProductId(),
                savedApplication.getApplicationId()
        );

        return PetInsuranceApplicationResDto.builder()
                .applicationId(
                        savedApplication.getApplicationId()
                )
                .build();
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

        MemberEntity loginMember =
                findMemberByLoginId(username);

        PetInsuranceApplicationEntity application =
                findApplicationById(applicationId);

        validateActiveApplication(
                application
        );

        if (application.getApproveStatus()
                != PetInsuranceApproveStatus.WAITING) {

            throw new IllegalStateException(
                    "심사 대기 중인 보험 신청만 결제수단을 등록할 수 있습니다."
            );
        }

        validatePetOwner(
                application.getPet(),
                loginMember
        );

        if (application.getKakaoPaySid() != null
                && !application.getKakaoPaySid().isBlank()) {

            throw new IllegalStateException(
                    "이미 정기결제 수단이 등록된 보험 신청입니다."
            );
        }

        KakaoPayReadyRespDto response =
                kakaoPayClient.readySubscription(
                        applicationId,
                        username,
                        application.getProduct()
                                .getProductName()
                                + " 정기결제 등록",
                        0L
                );

        if (response == null
                || response.getTid() == null
                || response.getTid().isBlank()) {

            throw new IllegalStateException(
                    "카카오페이 결제수단 등록 준비 요청에 실패했습니다."
            );
        }

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
    // SID만 저장하고 결제 이력은 저장하지 않음
    // =========================================================
    @Transactional
    public KakaoPayApproveRespDto approveSubscriptionPayment(
            Long applicationId,
            String pgToken
    ) {

        PetInsuranceApplicationEntity application =
                findApplicationById(applicationId);

        validateActiveApplication(
                application
        );

        if (application.getApproveStatus()
                != PetInsuranceApproveStatus.WAITING) {

            throw new IllegalStateException(
                    "심사 대기 중인 보험 신청만 결제수단을 등록할 수 있습니다."
            );
        }

        if (application.getKakaoPayTid() == null
                || application.getKakaoPayTid().isBlank()) {

            throw new IllegalStateException(
                    "결제수단 등록 준비 정보가 없습니다."
            );
        }

        if (application.getKakaoPaySid() != null
                && !application.getKakaoPaySid().isBlank()) {

            throw new IllegalStateException(
                    "이미 정기결제 수단이 등록된 보험 신청입니다."
            );
        }

        if (pgToken == null
                || pgToken.isBlank()) {

            throw new IllegalArgumentException(
                    "카카오페이 승인 토큰이 없습니다."
            );
        }

        String username =
                application.getPet()
                        .getMember()
                        .getUsername();

        KakaoPayApproveRespDto response =
                kakaoPayClient.approveSubscription(
                        applicationId,
                        username,
                        application.getKakaoPayTid(),
                        pgToken
                );

        if (response == null
                || response.getSid() == null
                || response.getSid().isBlank()
                || response.getTid() == null
                || response.getTid().isBlank()) {

            throw new IllegalStateException(
                    "카카오페이 정기결제 수단 등록에 실패했습니다."
            );
        }

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
    // 보험 신청 취소 또는 가입 완료 보험 해지
    // SID가 있으면 카카오페이 정기결제를 먼저 비활성화
    // 이후 DEL_YN을 Y로 변경
    // =========================================================
    @Transactional
    public void cancelInsurance(
            Long applicationId,
            String username
    ) {

        MemberEntity loginMember =
                findMemberByLoginId(username);

        PetInsuranceApplicationEntity application =
                findApplicationById(applicationId);

        validatePetOwner(
                application.getPet(),
                loginMember
        );

        validateActiveApplication(
                application
        );

        String sid =
                application.getKakaoPaySid();

        if (sid != null
                && !sid.isBlank()) {

            kakaoPayClient.inactivateSubscription(
                    sid
            );
        }

        application.delete();

        log.info(
                "펫 보험 신청 취소 또는 해지 완료 applicationId = {}, username = {}",
                applicationId,
                username
        );
    }

    // =========================================================
    // 관리자 가입 신청 승인 + 최초 월 보험료 결제
    // =========================================================
    @Transactional
    public void approveApplication(
            Long applicationId
    ) {

        PetInsuranceApplicationEntity application =
                findApplicationById(applicationId);

        validateActiveApplication(
                application
        );

        if (application.getApproveStatus()
                != PetInsuranceApproveStatus.WAITING) {

            throw new IllegalStateException(
                    "대기 중인 신청만 승인할 수 있습니다."
            );
        }

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

        application.approve();

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

        petInsurancePaymentRepository.save(
                payment
        );

        log.info(
                "펫 보험 가입 승인 및 최초 보험료 결제 완료 applicationId = {}, tid = {}, amount = {}",
                applicationId,
                response.getTid(),
                monthlyPrice
        );
    }

    // =========================================================
    // 일반 로그인 또는 소셜 로그인 회원 조회
    // =========================================================
    private MemberEntity findMemberByLoginId(
            String username
    ) {

        validateUsername(
                username
        );

        return memberRepository
                .findByUsername(username)
                .or(() ->
                        memberRepository
                                .findBySocialId(username)
                )
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "회원을 찾을 수 없습니다."
                        )
                );
    }

    // =========================================================
    // 보험 신청 조회
    // =========================================================
    private PetInsuranceApplicationEntity findApplicationById(
            Long applicationId
    ) {

        if (applicationId == null) {
            throw new IllegalArgumentException(
                    "보험 가입 신청 번호가 없습니다."
            );
        }

        return petInsuranceApplicationRepository
                .findById(applicationId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "보험 가입 신청을 찾을 수 없습니다."
                        )
                );
    }

    // =========================================================
    // 로그인 정보 검증
    // =========================================================
    private void validateUsername(
            String username
    ) {

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
    // username 또는 socialId 여부와 관계없이 회원 PK로 비교
    // =========================================================
    private void validatePetOwner(
            PetEntity pet,
            MemberEntity loginMember
    ) {

        Long petOwnerId =
                pet.getMember() != null
                        ? pet.getMember().getId()
                        : null;

        Long loginMemberId =
                loginMember != null
                        ? loginMember.getId()
                        : null;

        log.info(
                "펫보험 소유자 검증 petOwnerId = {}, loginMemberId = {}",
                petOwnerId,
                loginMemberId
        );

        if (!Objects.equals(
                petOwnerId,
                loginMemberId
        )) {

            throw new IllegalArgumentException(
                    "본인의 반려동물만 보험을 신청할 수 있습니다."
            );
        }
    }

    // =========================================================
    // 취소 또는 해지된 보험 신청인지 검증
    // =========================================================
    private void validateActiveApplication(
            PetInsuranceApplicationEntity application
    ) {

        if (application.getDelYn() == DelYn.Y) {
            throw new IllegalStateException(
                    "이미 취소 또는 해지된 보험입니다."
            );
        }
    }
}