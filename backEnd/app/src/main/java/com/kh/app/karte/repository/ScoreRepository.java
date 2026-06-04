package com.kh.app.karte.repository;

import com.kh.app.karte.entity.KarteEntity;
import com.kh.app.karte.entity.ScoreCategory;
import com.kh.app.karte.entity.ScoreEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScoreRepository extends JpaRepository<ScoreEntity, Long>, ScoreRepositoryCustom {
    List<ScoreEntity> findAllByKarte(KarteEntity karte);

    void deleteAllByKarteId(Long id);

}
