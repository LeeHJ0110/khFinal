package com.kh.app.board.repository;

import com.kh.app.board.entity.BoardEntity;
import com.kh.app.board.entity.BoardFileEntity;
import com.kh.app.common.entity.DelYn;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface BoardFileRepository extends JpaRepository<BoardFileEntity, Long> {


    List<BoardFileEntity> findByBoardEntity(BoardEntity boardEntity);
}