package com.kh.app.pet.repository;

import com.kh.app.pet.entity.BreedEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BreedRepository extends JpaRepository<BreedEntity, Long> {
}
