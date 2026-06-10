package com.kh.app.petinsurance.repository;

import com.kh.app.common.entity.DelYn;
import com.kh.app.petinsurance.entity.PetInsuranceApplicationEntity;
import com.kh.app.petinsurance.entity.PetInsuranceApproveStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PetInsuranceApplicationRepository
        extends JpaRepository<PetInsuranceApplicationEntity, Long> {

    // 관리자 목록 조회
    // SID 등록까지 완료된 대기 신청만 조회
    List<PetInsuranceApplicationEntity>
    findAllByApproveStatusAndKakaoPaySidIsNotNullOrderByCreatedAtAsc(
            PetInsuranceApproveStatus approveStatus
    );

    // 특정 펫의 최근 활성 보험 신청 또는 가입 정보 조회
    Optional<PetInsuranceApplicationEntity>
    findFirstByPet_IdAndApproveStatusInAndDelYnOrderByCreatedAtDesc(
            Long petId,
            List<PetInsuranceApproveStatus> approveStatuses,
            DelYn delYn
    );

    // 해당 펫의 신청 또는 가입 존재 여부 확인
    boolean existsByPet_IdAndApproveStatusInAndDelYn(
            Long petId,
            List<PetInsuranceApproveStatus> approveStatuses,
            DelYn delYn
    );

    Page<PetInsuranceApplicationEntity>
    findByApproveStatusAndKakaoPaySidIsNotNullOrderByCreatedAtAsc(
            PetInsuranceApproveStatus approveStatus,
            Pageable pageable
    );

    List<PetInsuranceApplicationEntity>
    findAllByApplicationIdIn(List<Long> applicationIds);
}