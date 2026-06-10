package com.kh.app.admin.dto.response;

import com.kh.app.petinsurance.entity.PetInsuranceApplicationEntity;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class AdminInsuranceDetailResDto {

    private Long applicationId;

    private String memberNickname;
    private String memberEmail;
    private String memberPhone;

    private String petName;
    private String petGender;
    private String petBirthDate;
    private BigDecimal petWeight;
    private String breedName;

    private String productName;
    private String productContent;

    private Long monthlyPrice;

    private String imageOriginName;
    private String imageUrl;

    private String approveStatus;

    private LocalDateTime createdAt;
    private String imageChangedName;

    public static AdminInsuranceDetailResDto from(
            PetInsuranceApplicationEntity application,
            String imageUrl
    ) {
        return AdminInsuranceDetailResDto.builder()
                .applicationId(application.getApplicationId())

                .memberNickname(application.getPet().getMember().getNickname())
                .memberEmail(application.getPet().getMember().getEmail())
                .memberPhone(application.getPet().getMember().getPhone())

                .petName(application.getPet().getName())
                .petGender(application.getPet().getGender().name())
                .petBirthDate(application.getPet().getBirthDate())
                .petWeight(application.getPet().getWeight())
                .breedName(application.getPet().getBreed().getName())

                .productName(application.getProduct().getProductName())
                .productContent(application.getProduct().getProductContent())

                .monthlyPrice(application.getMonthlyPrice())

                .imageOriginName(application.getImageOriginName())
                .imageChangedName(application.getImageChangedName())
                .imageUrl(imageUrl)

                .approveStatus(application.getApproveStatus().name())
                .createdAt(application.getCreatedAt())
                .build();
    }
}