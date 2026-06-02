package com.kh.app.petcare.dto.response;

import com.kh.app.common.entity.DelYn;
import com.kh.app.pet.entity.PetEntity;
import com.kh.app.petcare.entity.DiagnosisReqEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
// 수의사 목록 화면용
public class DiagnosisResDto {

    private Long diagnosisReqId;

    // 신청자 닉네임
    private String memberNickname;

    // 반려동물 정보
    private Long petId;
    private String petName;
    private String petType;

    private DelYn diagnosisReqStatus;

    private LocalDateTime createdAt;

    public static DiagnosisResDto from(DiagnosisReqEntity diagnosisReq) {
        PetEntity pet = diagnosisReq.getPetEntity();

        return DiagnosisResDto.builder()
                .diagnosisReqId(diagnosisReq.getDiagnosisReqId())

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

                .diagnosisReqStatus(diagnosisReq.getDiagnosisReqStatus())
                .createdAt(diagnosisReq.getCreatedAt())
                .build();
    }
}