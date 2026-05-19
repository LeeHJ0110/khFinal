package com.kh.app.karte.repository;

import com.kh.app.board.entity.BoardEntity;
import com.kh.app.karte.entity.KarteEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KarteRepository extends JpaRepository<KarteEntity, Long>, KarteRepositoryCustom {
}
