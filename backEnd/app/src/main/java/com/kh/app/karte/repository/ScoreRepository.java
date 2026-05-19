package com.kh.app.karte.repository;

import com.kh.app.karte.entity.KarteEntity;
import com.kh.app.karte.entity.ScoreEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScoreRepository extends JpaRepository<ScoreEntity, Long>, ScoreRepositoryCustom {
}
