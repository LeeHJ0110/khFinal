package com.kh.app.board.repository;

import com.kh.app.board.entity.BoardEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardRepository extends JpaRepository<BoardEntity, Long>, BoardRepositoryCustom {
}