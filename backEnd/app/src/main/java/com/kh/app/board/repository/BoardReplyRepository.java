package com.kh.app.board.repository;

import com.kh.app.board.entity.BoardEntity;
import com.kh.app.board.entity.BoardReplyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BoardReplyRepository extends JpaRepository<BoardReplyEntity, Long> {
    List<BoardReplyEntity> findByBoardAndParentIsNullOrderByCreatedAtAsc(BoardEntity board);
}
