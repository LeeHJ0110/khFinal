package com.kh.app.petcare.dto.response;

import com.kh.app.common.entity.DelYn;
import com.kh.app.pet.entity.PetEntity;
import com.kh.app.petcare.dto.request.DiagnosisAnswerDto;
import com.kh.app.petcare.entity.DiagnosisReqEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class DiagnosisDetailResDto {

    private Long diagnosisReqId;

    // 신청자 닉네임
    private String memberNickname;
    private Long petId;

    private String petName;
    private String petType;
    private String breedName;
    private String gender;
    private String birthDate;
    private BigDecimal weight;

    private DelYn diagnosisReqStatus;

    private LocalDateTime createdAt;

    private List<DiagnosisAnswerDto> answerList;

    private List<ImgUrlResDto> fileList;

    public static DiagnosisDetailResDto from(
            DiagnosisReqEntity diagnosisReq,
            List<DiagnosisAnswerDto> answerList,
            List<ImgUrlResDto> fileList
    ) {
        PetEntity pet = diagnosisReq.getPetEntity();

        return DiagnosisDetailResDto.builder()
                .diagnosisReqId(diagnosisReq.getDiagnosisReqId())
                .memberNickname(
                        pet.getMember() != null
                                ? pet.getMember().getNickname()
                                : null
                )

                .petId(pet.getId())
                .petName(pet.getName())
                .petType(pet.getBreed() != null ? pet.getBreed().getPetType().name() : null)
                .breedName(pet.getBreed() != null ? pet.getBreed().getName() : null)
                .gender(pet.getGender() != null ? pet.getGender().name() : null)
                .birthDate(pet.getBirthDate())
                .weight(pet.getWeight())
                .diagnosisReqStatus(diagnosisReq.getDiagnosisReqStatus())
                .createdAt(diagnosisReq.getCreatedAt())
                .answerList(answerList)
                .fileList(fileList)
                .build();
    }
}