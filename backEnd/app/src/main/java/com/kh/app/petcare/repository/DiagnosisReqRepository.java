package com.kh.app.petcare.repository;

import com.kh.app.petcare.entity.DiagnosisReqEntity;
import org.springframework.data.jpa.repository.JpaRepository;


public interface DiagnosisReqRepository  extends JpaRepository<DiagnosisReqEntity, Long> {
}
