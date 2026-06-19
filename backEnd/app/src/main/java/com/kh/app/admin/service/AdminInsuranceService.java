package com.kh.app.admin.service;

import com.kh.app.admin.dto.request.AdminInsuranceBulkReqDto;
import com.kh.app.admin.dto.response.AdminInsuranceDetailResDto;
import com.kh.app.admin.dto.response.AdminInsuranceListResDto;
import com.kh.app.aws.service.S3Service;
import com.kh.app.message.entity.MessageReasonType;
import com.kh.app.message.service.SystemMessageService;
import com.kh.app.petinsurance.entity.PetInsuranceApplicationEntity;
import com.kh.app.petinsurance.entity.PetInsuranceApproveStatus;
import com.kh.app.petinsurance.entity.PetInsurancePaymentEntity;
import com.kh.app.petinsurance.entity.PetInsurancePaymentStatus;
import com.kh.app.petinsurance.kakao.KakaoPayClient;
import com.kh.app.petinsurance.kakao.dto.KakaoPaySubscriptionRespDto;
import com.kh.app.petinsurance.repository.PetInsuranceApplicationRepository;
import com.kh.app.petinsurance.repository.PetInsurancePaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminInsuranceService {

    private final PetInsuranceApplicationRepository applicationRepository;
    private final PetInsurancePaymentRepository petInsurancePaymentRepository;
    private final S3Service s3Service;
    private final SystemMessageService systemMessageService;
    private final KakaoPayClient kakaoPayClient;

    public Page<AdminInsuranceListResDto> getApplications(
            PetInsuranceApproveStatus status,
            Pageable pageable
    ) {
        return applicationRepository
                .findByApproveStatusAndKakaoPaySidIsNotNullOrderByCreatedAtAsc(status, pageable)
                .map(AdminInsuranceListResDto::from);
    }

    public AdminInsuranceDetailResDto getApplicationDetail(Long applicationId) {
        PetInsuranceApplicationEntity application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() -> new IllegalStateException("보험 신청 정보를 찾을 수 없습니다."));

        String imageUrl = s3Service.getFileUrl(application.getImageChangedName());

        return AdminInsuranceDetailResDto.from(application, imageUrl);
    }

    @Transactional
    public void approve(
            Long applicationId,
            String adminUsername
    ) {
        PetInsuranceApplicationEntity application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() -> new IllegalStateException("보험 신청 정보를 찾을 수 없습니다."));

        if (application.getApproveStatus() != PetInsuranceApproveStatus.WAITING) {
            throw new IllegalStateException("승인 대기 상태만 승인할 수 있습니다.");
        }

        if (application.getKakaoPaySid() == null
                || application.getKakaoPaySid().isBlank()) {
            throw new IllegalStateException("카카오페이 정기결제 수단이 등록되지 않았습니다.");
        }

        Long monthlyPrice = application.getMonthlyPrice();

        if (monthlyPrice == null || monthlyPrice <= 0) {
            throw new IllegalStateException("결제할 월 보험료 정보가 없습니다.");
        }

        String username =
                application.getPet()
                        .getMember()
                        .getUsername();

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

        systemMessageService.sendByAdmin(
                adminUsername,
                application.getPet().getMember(),
                MessageReasonType.INSURANCE,
                "펫보험 승인 안내",
                application.getPet().getName()
                        + "의 펫보험 가입 신청이 승인되었습니다."
        );
    }

    @Transactional
    public void reject(
            Long applicationId,
            String adminUsername
    ) {
        PetInsuranceApplicationEntity application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() -> new IllegalStateException("보험 신청 정보를 찾을 수 없습니다."));

        if (application.getApproveStatus() != PetInsuranceApproveStatus.WAITING) {
            throw new IllegalStateException("승인 대기 상태만 반려할 수 있습니다.");
        }

        application.reject();

        systemMessageService.sendByAdmin(
                adminUsername,
                application.getPet().getMember(),
                MessageReasonType.INSURANCE,
                "펫보험 반려 안내",
                application.getPet().getName()
                        + "의 펫보험 가입 신청이 반려되었습니다."
        );
    }

    @Transactional
    public void approveBulk(
            AdminInsuranceBulkReqDto reqDto,
            String adminUsername
    ) {
        List<Long> applicationIds = reqDto.getApplicationIds();

        for (Long applicationId : applicationIds) {
            approve(applicationId, adminUsername);
        }
    }

    @Transactional
    public void rejectBulk(
            AdminInsuranceBulkReqDto reqDto,
            String adminUsername
    ) {
        List<PetInsuranceApplicationEntity> applications =
                applicationRepository.findAllByApplicationIdIn(reqDto.getApplicationIds());

        for (PetInsuranceApplicationEntity application : applications) {
            if (application.getApproveStatus() == PetInsuranceApproveStatus.WAITING) {
                application.reject();


            }
        }

    }
}