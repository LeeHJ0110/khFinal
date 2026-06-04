package com.kh.app.petinsurance.repository;

import com.kh.app.petinsurance.entity.PetInsurancePaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PetInsurancePaymentRepository
        extends JpaRepository<PetInsurancePaymentEntity, Long> {
}