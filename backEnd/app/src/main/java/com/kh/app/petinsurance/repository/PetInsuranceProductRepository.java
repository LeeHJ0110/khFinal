package com.kh.app.petinsurance.repository;

import com.kh.app.petinsurance.entity.PetInsuranceProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

//펫보험상품
public interface PetInsuranceProductRepository
        extends JpaRepository<PetInsuranceProductEntity, Long> {

    List<PetInsuranceProductEntity> findAllByDelYn(String delYn);
}