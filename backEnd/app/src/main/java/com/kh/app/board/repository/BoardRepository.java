package com.kh.app.board.repository;

import com.kh.app.board.entity.BoardCategory;
import com.kh.app.board.entity.BoardEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardRepository extends JpaRepository<BoardEntity, Long>, BoardRepositoryCustom {
    Page<BoardEntity> findByWriter_IdAndCategoryOrderByCreatedAtDesc(
            Long writerId,
            BoardCategory category,
            Pageable pageable
    );
}