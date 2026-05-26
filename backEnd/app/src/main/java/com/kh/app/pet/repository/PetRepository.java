package com.kh.app.pet.repository;

import com.kh.app.common.entity.DelYn;
import com.kh.app.pet.entity.PetEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PetRepository extends JpaRepository<PetEntity, Long> {
    List<PetEntity> findAllByMember_UsernameAndDelYn(
            String username,
            DelYn delYn
    );
}
