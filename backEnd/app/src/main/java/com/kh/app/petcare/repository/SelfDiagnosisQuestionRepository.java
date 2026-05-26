package com.kh.app.petcare.repository;

import com.kh.app.pet.entity.PetType;
import com.kh.app.petcare.entity.SelfDiagnosisQuestionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SelfDiagnosisQuestionRepository
        extends JpaRepository<SelfDiagnosisQuestionEntity, Long> {

    List<SelfDiagnosisQuestionEntity> findByPetType(
            PetType petType
    );
}