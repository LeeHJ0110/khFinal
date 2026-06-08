package com.kh.app.board.repository;

import com.kh.app.board.entity.BoardEntity;
import com.kh.app.board.entity.BoardReplyEntity;
import com.kh.app.common.entity.DelYn;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BoardReplyRepository extends JpaRepository<BoardReplyEntity, Long> {
    List<BoardReplyEntity> findByBoardAndParentIsNullOrderByCreatedAtAsc(BoardEntity board);
    long countByBoardAndDelYn(BoardEntity board, com.kh.app.common.entity.DelYn delYn);

    Page<BoardReplyEntity> findByMember_IdAndDelYnOrderByCreatedAtDesc(
            Long memberId,
            DelYn delYn,
            Pageable pageable
    );
}
