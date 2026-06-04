
package com.kh.app.petinsurance.repository;

import com.kh.app.petinsurance.entity.PetInsuranceApplicationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PetInsuranceApplicationRepository
        extends JpaRepository<PetInsuranceApplicationEntity, Long> {
}