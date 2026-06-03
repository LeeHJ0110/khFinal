package com.kh.app.petcare.repository;

import com.kh.app.common.entity.DelYn;
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

    // 진행 중인 건강진단 신청만 페이징 조회
    Page<DiagnosisReqEntity> findAllByDiagnosisReqStatus(
            DelYn diagnosisReqStatus,
            Pageable pageable
    );
}