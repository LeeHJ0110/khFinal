package com.kh.app.petinsurance.repository;

import com.kh.app.petinsurance.entity.PetInsuranceProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
//펫보험상품
public interface PetInsuranceProductRepository
        extends JpaRepository<PetInsuranceProductEntity, Long> {
}
