package com.kh.app.petinsurance.repository;

import com.kh.app.petinsurance.entity.PetInsurancePaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PetInsurancePaymentRepository
        extends JpaRepository<PetInsurancePaymentEntity, Long> {

    List<PetInsurancePaymentEntity>
    findAllByApplication_Pet_Member_IdOrderByCreatedAtDesc(
            Long memberId
    );

    List<PetInsurancePaymentEntity>
    findAllByApplication_Pet_IdOrderByCreatedAtDesc(
            Long petId
    );
}