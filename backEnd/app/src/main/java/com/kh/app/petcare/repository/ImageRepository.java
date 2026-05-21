package com.kh.app.petcare.repository;

import com.kh.app.petcare.entity.ImgUrlEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<ImgUrlEntity, Long> {
}
