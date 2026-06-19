package com.kh.app.petinsurance.service;

import com.kh.app.aws.service.S3Service;
import com.kh.app.common.entity.DelYn;
import com.kh.app.common.exception.CustomException;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.message.entity.MessageReasonType;
import com.kh.app.message.service.SystemMessageService;
import com.kh.app.pet.entity.PetEntity;
import com.kh.app.pet.repository.PetRepository;
import com.kh.app.petinsurance.dto.request.PetInsuranceApplicationReqDto;
import com.kh.app.petinsurance.dto.request.PetInsuranceCalculateReqDto;
import com.kh.app.petinsurance.dto.response.PetInsuranceAdminApplicationResDto;
import com.kh.app.petinsurance.dto.response.PetInsuranceApplicationResDto;
import com.kh.app.petinsurance.dto.response.PetInsuranceCalculateResDto;
import com.kh.app.petinsurance.dto.response.PetInsurancePaymentHistoryResDto;
import com.kh.app.petinsurance.dto.response.PetInsurancePetResDto;
import com.kh.app.petinsurance.entity.PetInsuranceApplicationEntity;
import com.kh.app.petinsurance.entity.PetInsuranceApproveStatus;
import com.kh.app.petinsurance.entity.PetInsurancePaymentEntity;
import com.kh.app.petinsurance.entity.PetInsurancePaymentStatus;
import com.kh.app.petinsurance.entity.PetInsuranceProductEntity;
import com.kh.app.petinsurance.exception.PetInsuranceErrorCode;
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
import java.time.format.DateTimeFormatter;
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
    private final SystemMessageService systemMessageService;
    private final KakaoPayClient kakaoPayClient;
    private final S3Service s3Service;

    // =========================================================
    // 보험 상품 목록 조회
    // =========================================================
    @Transactional(readOnly = true)
    public List<PetInsuranceProductEntity> getProductList() {
        return petInsuranceProductRepository.findAllByDelYn(DelYn.N);
    }

    // =========================================================
    // 예상 월 보험료 계산
    // =========================================================
    @Transactional(readOnly = true)
    public PetInsuranceCalculateResDto calculateMonthlyPrice(
            PetInsuranceCalculateReqDto dto
    ) {

        if (dto == null) {
            throw new IllegalArgumentException("보험료 계산 요청 정보가 없습니다.");
        }

        if (dto.getProductId() == null) {
            throw new IllegalArgumentException("보험 상품을 선택해 주세요.");
        }

        if (dto.getBirthDate() == null || dto.getBirthDate().isBlank()) {
            throw new IllegalArgumentException("반려동물의 생년월일을 입력해 주세요.");
        }

        PetInsuranceProductEntity product =
                findActiveProductById(dto.getProductId());

        LocalDate birthDate =
                parseBirthDate(dto.getBirthDate());

        int age =
                calculateAge(birthDate);

        validateInsurableAge(age);

        Long baseMonthlyPrice =
                product.getProductMonthly();

        Long additionalPrice =
                calculateAdditionalPrice(age);

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
    // 보험 가입 화면용 내 반려동물 목록 조회
    // =========================================================
    @Transactional(readOnly = true)
    public List<PetInsurancePetResDto> getMyPetListForInsurance(
            String username
    ) {

        MemberEntity member =
                findMemberByLoginId(username);

        return petRepository
                .findAllByMember_IdAndDelYn(member.getId(), DelYn.N)
                .stream()
                .map(pet -> {

                    PetInsuranceApplicationEntity application =
                            petInsuranceApplicationRepository
                                    .findFirstByPet_IdAndApproveStatusInAndDelYnOrderByCreatedAtDesc(
                                            pet.getId(),
                                            List.of(
                                                    PetInsuranceApproveStatus.WAITING,
                                                    PetInsuranceApproveStatus.APPROVED
                                            ),
                                            DelYn.N
                                    )
                                    .orElse(null);

                    return PetInsurancePetResDto.from(pet, application);
                })
                .toList();
    }

    // =========================================================
    // 보험 가입 신청
    // =========================================================
    @Transactional(rollbackFor = Exception.class)
    public PetInsuranceApplicationResDto applyInsurance(
            String data,
            MultipartFile medicalCertificate,
            String username
    ) throws IOException {

        log.info("펫 보험 가입 신청 시작 - username={}", username);

        MemberEntity loginMember =
                findMemberByLoginId(username);

        log.info("보험 신청 회원 조회 완료 - memberId={}", loginMember.getId());

        PetInsuranceApplicationReqDto dto =
                objectMapper.readValue(data, PetInsuranceApplicationReqDto.class);

        if (dto == null) {
            throw new IllegalArgumentException("보험 가입 신청 정보가 없습니다.");
        }

        if (dto.getPetId() == null) {
            throw new IllegalArgumentException("가입할 반려동물을 선택해 주세요.");
        }

        if (dto.getProductId() == null) {
            throw new IllegalArgumentException("보험 상품을 선택해 주세요.");
        }

        log.info(
                "보험 신청 요청 데이터 확인 - petId={}, productId={}",
                dto.getPetId(),
                dto.getProductId()
        );

        PetEntity pet =
                petRepository
                        .findById(dto.getPetId())
                        .orElseThrow(() ->
                                new IllegalArgumentException("반려동물을 찾을 수 없습니다.")
                        );

        validatePetOwner(pet, loginMember);

        validateNotAlreadyApplied(pet.getId());

        PetInsuranceProductEntity product =
                findActiveProductById(dto.getProductId());

        Long monthlyPrice =
                calculateFinalMonthlyPrice(pet, product);

        log.info(
                "보험료 계산 완료 - petId={}, productId={}, monthlyPrice={}",
                pet.getId(),
                product.getProductId(),
                monthlyPrice
        );

        if (medicalCertificate == null || medicalCertificate.isEmpty()) {
            throw new CustomException(
                    PetInsuranceErrorCode.MEDICAL_CERTIFICATE_REQUIRED
            );
        }

        String s3Key;

        try {
            log.info(
                    "진료확인서 S3 업로드 시작 - petId={}, originalFilename={}, contentType={}, size={}",
                    pet.getId(),
                    medicalCertificate.getOriginalFilename(),
                    medicalCertificate.getContentType(),
                    medicalCertificate.getSize()
            );

            s3Key =
                    s3Service.upload(
                            medicalCertificate,
                            "insurance/medical-certificate"
                    );

            log.info(
                    "진료확인서 S3 업로드 성공 - petId={}, s3Key={}",
                    pet.getId(),
                    s3Key
            );

        } catch (IOException e) {
            log.error(
                    "진료확인서 S3 업로드 실패 - 파일 읽기 오류 petId={}, filename={}, message={}",
                    pet.getId(),
                    medicalCertificate.getOriginalFilename(),
                    e.getMessage(),
                    e
            );

            throw e;

        } catch (RuntimeException e) {
            log.error(
                    "진료확인서 S3 업로드 실패 - S3 처리 오류 petId={}, filename={}, message={}",
                    pet.getId(),
                    medicalCertificate.getOriginalFilename(),
                    e.getMessage(),
                    e
            );

            throw e;
        }

        PetInsuranceApplicationEntity application =
                PetInsuranceApplicationEntity.builder()
                        .pet(pet)
                        .product(product)
                        .monthlyPrice(monthlyPrice)
                        .approveStatus(PetInsuranceApproveStatus.WAITING)
                        .imageOriginName(medicalCertificate.getOriginalFilename())
                        .imageChangedName(s3Key)
                        .build();

        PetInsuranceApplicationEntity savedApplication =
                petInsuranceApplicationRepository.save(application);

        return PetInsuranceApplicationResDto.builder()
                .applicationId(savedApplication.getApplicationId())
                .build();
    }

    // =========================================================
    // 카카오페이 정기결제 수단 등록 준비
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

        validateActiveApplication(application);

        validateWaitingApplication(application);

        validatePetOwner(application.getPet(), loginMember);

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
                        application.getProduct().getProductName() + " 정기결제 등록",
                        0L
                );

        if (response == null
                || response.getTid() == null
                || response.getTid().isBlank()) {

            throw new CustomException(
                    PetInsuranceErrorCode.PAYMENT_READY_FAILED
            );
        }

        application.updateKakaoPayTid(response.getTid());

        log.info(
                "카카오페이 정기결제 수단 등록 준비 완료 applicationId = {}, tid = {}",
                applicationId,
                response.getTid()
        );

        return response;
    }

    // =========================================================
    // 카카오페이 정기결제 수단 등록 승인
    // =========================================================
    @Transactional
    public KakaoPayApproveRespDto approveSubscriptionPayment(
            Long applicationId,
            String pgToken
    ) {

        PetInsuranceApplicationEntity application =
                findApplicationById(applicationId);

        validateActiveApplication(application);

        validateWaitingApplication(application);

        if (application.getKakaoPayTid() == null
                || application.getKakaoPayTid().isBlank()) {

            throw new IllegalStateException("결제수단 등록 준비 정보가 없습니다.");
        }

        if (application.getKakaoPaySid() != null
                && !application.getKakaoPaySid().isBlank()) {

            throw new IllegalStateException("이미 정기결제 수단이 등록된 보험 신청입니다.");
        }

        if (pgToken == null || pgToken.isBlank()) {
            throw new IllegalArgumentException("카카오페이 승인 토큰이 없습니다.");
        }

        String username =
                application.getPet().getMember().getUsername();

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

            throw new CustomException(
                    PetInsuranceErrorCode.PAYMENT_APPROVE_FAILED
            );
        }

        application.updateKakaoPaySid(response.getSid());

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

        validatePetOwner(application.getPet(), loginMember);

        validateActiveApplication(application);

        String sid =
                application.getKakaoPaySid();

        if (sid != null && !sid.isBlank()) {
            kakaoPayClient.inactivateSubscription(sid);
        }

        application.delete();

        log.info(
                "펫 보험 신청 취소 또는 해지 완료 applicationId = {}, username = {}",
                applicationId,
                username
        );
    }

    // =========================================================
    // 관리자 가입 승인 + 최초 월 보험료 결제
    // =========================================================
    @Transactional
    public void approveApplication(
            Long applicationId,
            String adminUsername
    ) {

        PetInsuranceApplicationEntity application =
                findApplicationById(applicationId);

        validateActiveApplication(application);

        validateWaitingApplication(application);

        if (application.getKakaoPaySid() == null
                || application.getKakaoPaySid().isBlank()) {

            throw new IllegalStateException(
                    "카카오페이 정기결제 수단이 등록되지 않았습니다."
            );
        }

        Long monthlyPrice =
                application.getMonthlyPrice();

        if (monthlyPrice == null || monthlyPrice <= 0) {
            throw new IllegalStateException("결제할 월 보험료 정보가 없습니다.");
        }

        PetEntity pet =
                application.getPet();

        MemberEntity receiverMember =
                pet.getMember();

        if (receiverMember == null) {
            throw new IllegalStateException("쪽지를 받을 회원 정보를 찾을 수 없습니다.");
        }

        String username =
                receiverMember.getUsername();

        KakaoPaySubscriptionRespDto response =
                kakaoPayClient.requestSubscriptionPayment(
                        applicationId,
                        username,
                        application.getKakaoPaySid(),
                        application.getProduct().getProductName(),
                        monthlyPrice
                );

        if (response == null
                || response.getTid() == null
                || response.getTid().isBlank()) {

            throw new IllegalStateException("최초 월 보험료 결제에 실패했습니다.");
        }

        application.approve();

        PetInsurancePaymentEntity payment =
                PetInsurancePaymentEntity.builder()
                        .application(application)
                        .kakaoPayTid(response.getTid())
                        .paymentStatus(PetInsurancePaymentStatus.SUCCESS)
                        .paymentAmount(monthlyPrice)
                        .build();

        petInsurancePaymentRepository.save(payment);
    }

    // =========================================================
    // 관리자 보험 가입 반려
    // =========================================================
    @Transactional
    public void rejectApplication(
            Long applicationId,
            String adminUsername
    ) {

        PetInsuranceApplicationEntity application =
                findApplicationById(applicationId);

        validateActiveApplication(application);

        validateWaitingApplication(application);

        PetEntity pet =
                application.getPet();

        MemberEntity receiverMember =
                pet.getMember();

        if (receiverMember == null) {
            throw new IllegalStateException("쪽지를 받을 회원 정보를 찾을 수 없습니다.");
        }

        String sid =
                application.getKakaoPaySid();

        if (sid != null && !sid.isBlank()) {
            kakaoPayClient.inactivateSubscription(sid);
        }

        application.delete();

        systemMessageService.sendByAdmin(
                adminUsername,
                receiverMember,
                MessageReasonType.INSURANCE,
                "펫보험 신청 반려 안내",
                pet.getName() + "의 펫보험 가입 신청이 반려되었습니다."
        );

        log.info(
                "펫 보험 가입 반려 처리 완료 applicationId = {}, petId = {}",
                applicationId,
                pet.getId()
        );
    }

    // =========================================================
    // 사용자 본인의 펫 보험 결제 내역 조회
    // =========================================================
    @Transactional(readOnly = true)
    public List<PetInsurancePaymentHistoryResDto> getMyPaymentHistory(
            String username
    ) {

        MemberEntity member =
                findMemberByLoginId(username);

        return petInsurancePaymentRepository
                .findAllByApplication_Pet_Member_IdOrderByCreatedAtDesc(
                        member.getId()
                )
                .stream()
                .map(payment -> {

                    PetInsuranceApplicationEntity application =
                            payment.getApplication();

                    return PetInsurancePaymentHistoryResDto.builder()
                            .paymentId(payment.getPaymentId())
                            .applicationId(application.getApplicationId())
                            .petName(application.getPet().getName())
                            .productName(application.getProduct().getProductName())
                            .paymentAmount(payment.getPaymentAmount())
                            .paymentStatus(payment.getPaymentStatus())
                            .paidAt(payment.getCreatedAt())
                            .build();
                })
                .toList();
    }

    // =========================================================
    // 관리자용 승인 대기 신청 목록 조회
    // =========================================================
    @Transactional(readOnly = true)
    public List<PetInsuranceAdminApplicationResDto> getWaitingApplicationList() {

        return petInsuranceApplicationRepository
                .findAllByApproveStatusAndKakaoPaySidIsNotNullOrderByCreatedAtAsc(
                        PetInsuranceApproveStatus.WAITING
                )
                .stream()
                .filter(application -> application.getDelYn() == DelYn.N)
                .map(application ->
                        PetInsuranceAdminApplicationResDto.builder()
                                .applicationId(application.getApplicationId())
                                .memberNickname(application.getPet().getMember().getNickname())
                                .petId(application.getPet().getId())
                                .petName(application.getPet().getName())
                                .productId(application.getProduct().getProductId())
                                .productName(application.getProduct().getProductName())
                                .productMonthly(application.getMonthlyPrice())
                                .medicalCertificateUrl(
                                        s3Service.getFileUrl(
                                                application.getImageChangedName()
                                        )
                                )
                                .approveStatus(application.getApproveStatus())
                                .createdAt(application.getCreatedAt())
                                .build()
                )
                .toList();
    }

    // =========================================================
    // 로그인 회원 조회
    // =========================================================
    private MemberEntity findMemberByLoginId(String username) {

        validateUsername(username);

        return memberRepository
                .findByUsername(username)
                .or(() -> memberRepository.findBySocialId(username))
                .orElseThrow(() ->
                        new IllegalArgumentException("회원을 찾을 수 없습니다.")
                );
    }

    // =========================================================
    // 활성 보험 상품 조회
    // =========================================================
    private PetInsuranceProductEntity findActiveProductById(Long productId) {

        PetInsuranceProductEntity product =
                petInsuranceProductRepository
                        .findById(productId)
                        .orElseThrow(() ->
                                new IllegalArgumentException("보험 상품을 찾을 수 없습니다.")
                        );

        if (product.getDelYn() == DelYn.Y) {
            throw new IllegalStateException("현재 가입할 수 없는 보험 상품입니다.");
        }

        return product;
    }

    // =========================================================
    // 보험 신청 조회
    // =========================================================
    private PetInsuranceApplicationEntity findApplicationById(Long applicationId) {

        if (applicationId == null) {
            throw new IllegalArgumentException("보험 가입 신청 번호가 없습니다.");
        }

        return petInsuranceApplicationRepository
                .findById(applicationId)
                .orElseThrow(() ->
                        new IllegalArgumentException("보험 가입 신청을 찾을 수 없습니다.")
                );
    }

    // =========================================================
    // 중복 가입 신청 검증
    // =========================================================
    private void validateNotAlreadyApplied(Long petId) {

        boolean alreadyApplied =
                petInsuranceApplicationRepository
                        .existsByPet_IdAndApproveStatusInAndDelYn(
                                petId,
                                List.of(
                                        PetInsuranceApproveStatus.WAITING,
                                        PetInsuranceApproveStatus.APPROVED
                                ),
                                DelYn.N
                        );

        if (alreadyApplied) {
            throw new CustomException(
                    PetInsuranceErrorCode.INSURANCE_ALREADY_IN_PROGRESS
            );
        }
    }

    // =========================================================
    // 로그인 정보 검증
    // =========================================================
    private void validateUsername(String username) {

        if (username == null
                || username.isBlank()
                || "anonymousUser".equals(username)) {

            throw new IllegalArgumentException("로그인 정보를 확인할 수 없습니다.");
        }
    }

    // =========================================================
    // 로그인한 회원의 반려동물인지 검증
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

        if (!Objects.equals(petOwnerId, loginMemberId)) {
            throw new IllegalArgumentException("본인의 반려동물만 보험을 신청할 수 있습니다.");
        }
    }

    // =========================================================
    // 취소 또는 해지 여부 검증
    // =========================================================
    private void validateActiveApplication(
            PetInsuranceApplicationEntity application
    ) {

        if (application.getDelYn() == DelYn.Y) {
            throw new IllegalStateException("이미 취소 또는 해지된 보험입니다.");
        }
    }

    // =========================================================
    // 관리자 승인 대기 상태 검증
    // =========================================================
    private void validateWaitingApplication(
            PetInsuranceApplicationEntity application
    ) {

        if (application.getApproveStatus()
                != PetInsuranceApproveStatus.WAITING) {

            throw new IllegalStateException("심사 대기 중인 보험 신청만 처리할 수 있습니다.");
        }
    }

    // =========================================================
    // 생년월일 문자열 변환
    // =========================================================
    private LocalDate parseBirthDate(Object birthDateValue) {

        if (birthDateValue == null) {
            throw new IllegalArgumentException("반려동물의 생년월일 정보가 없습니다.");
        }

        if (birthDateValue instanceof LocalDate localDate) {
            return localDate;
        }

        String birthDate =
                birthDateValue.toString().trim();

        if (birthDate.isBlank()) {
            throw new IllegalArgumentException("반려동물의 생년월일 정보가 없습니다.");
        }

        try {
            if (birthDate.matches("\\d{8}")) {
                return LocalDate.parse(
                        birthDate,
                        DateTimeFormatter.BASIC_ISO_DATE
                );
            }

            return LocalDate.parse(birthDate);

        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException(
                    "생년월일 형식이 올바르지 않습니다. yyyy-MM-dd 형식으로 입력해 주세요."
            );
        }
    }

    // =========================================================
    // 만 나이 계산
    // =========================================================
    private int calculateAge(LocalDate birthDate) {

        LocalDate today =
                LocalDate.now();

        if (birthDate.isAfter(today)) {
            throw new IllegalArgumentException("생년월일은 오늘 이후 날짜로 입력할 수 없습니다.");
        }

        return Period.between(birthDate, today).getYears();
    }

    // =========================================================
    // 보험 가입 가능 나이 검증
    // =========================================================
    private void validateInsurableAge(int age) {

        if (age >= 10) {
            throw new IllegalStateException("만 10세 이상인 반려동물은 보험에 가입할 수 없습니다.");
        }
    }

    // =========================================================
    // 연령 기준 추가 보험료 계산
    // =========================================================
    private Long calculateAdditionalPrice(int age) {

        if (age < 3) {
            return 0L;
        }

        return (long) (((age - 3) / 2) + 1) * 10000L;
    }

    // =========================================================
    // 실제 가입 신청용 최종 월 보험료 계산
    // =========================================================
    private Long calculateFinalMonthlyPrice(
            PetEntity pet,
            PetInsuranceProductEntity product
    ) {

        LocalDate birthDate =
                parseBirthDate(pet.getBirthDate());

        int age =
                calculateAge(birthDate);

        validateInsurableAge(age);

        return product.getProductMonthly()
                + calculateAdditionalPrice(age);
    }
}