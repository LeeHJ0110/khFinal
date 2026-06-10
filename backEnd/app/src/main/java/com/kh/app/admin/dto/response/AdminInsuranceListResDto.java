package com.kh.app.admin.dto.response;

import com.kh.app.petinsurance.entity.PetInsuranceApplicationEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AdminInsuranceListResDto {

    private Long applicationId;

    private String memberNickname;
    private String petName;
    private String productName;

    private Long monthlyPrice;
    private String approveStatus;

    private LocalDateTime createdAt;

    public static AdminInsuranceListResDto from(PetInsuranceApplicationEntity application) {
        return AdminInsuranceListResDto.builder()
                .applicationId(application.getApplicationId())
                .memberNickname(application.getPet().getMember().getNickname())
                .petName(application.getPet().getName())
                .productName(application.getProduct().getProductName())
                .monthlyPrice(application.getMonthlyPrice())
                .approveStatus(application.getApproveStatus().name())
                .createdAt(application.getCreatedAt())
                .build();
    }
}