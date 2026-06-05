
package com.kh.app.petinsurance.repository;

import com.kh.app.common.entity.DelYn;
import com.kh.app.petinsurance.entity.PetInsuranceApplicationEntity;
import com.kh.app.petinsurance.entity.PetInsuranceApproveStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PetInsuranceApplicationRepository
        extends JpaRepository<PetInsuranceApplicationEntity, Long> {

    // 삭제되지 않은 신청 중에서
    // 신청 대기 또는 가입 완료 상태가 있는지 확인
    boolean existsByPet_IdAndApproveStatusInAndDelYn(
            Long petId,
            List<PetInsuranceApproveStatus> approveStatuses,
            DelYn delYn
    );
}
