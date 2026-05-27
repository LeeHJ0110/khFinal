package com.kh.app.pet.repository;

import com.kh.app.pet.entity.BreedEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BreedRepository extends JpaRepository<BreedEntity, Long> {
    Optional<BreedEntity> findByName(String name);
    List<BreedEntity> findAllByPetType(String petType);
}
