package com.kh.app.petcare.repository;

import com.kh.app.common.entity.DelYn;
import com.kh.app.pet.entity.PetType;
import com.kh.app.petcare.entity.DiagnosisReqEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiagnosisReqRepository
        extends JpaRepository<DiagnosisReqEntity, Long> {

    // 해당 펫에 진행 중인 건강진단 신청이 있는지 확인
    boolean existsByPetEntity_IdAndDiagnosisReqStatus(
            Long petId,
            DelYn diagnosisReqStatus
    );

    // 진행 중인 건강진단 신청 전체 조회
    Page<DiagnosisReqEntity> findAllByDiagnosisReqStatus(
            DelYn diagnosisReqStatus,
            Pageable pageable
    );

    // 진행 중인 건강진단 신청 중 강아지 또는 고양이만 조회
    Page<DiagnosisReqEntity> findAllByDiagnosisReqStatusAndPetEntity_Breed_PetType(
            DelYn diagnosisReqStatus,
            PetType petType,
            Pageable pageable
    );
}