package com.kh.app.petcare.repository;

import com.kh.app.petcare.entity.DiagnosisReqEntity;
import com.kh.app.petcare.entity.ImgUrlEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface ImageRepository extends JpaRepository<ImgUrlEntity, Long> {
    List<ImgUrlEntity> findByDiagnosisReq(DiagnosisReqEntity diagnosisReq);;
}
