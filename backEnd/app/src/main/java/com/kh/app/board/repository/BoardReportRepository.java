package com.kh.app.board.repository;

import com.kh.app.board.entity.BoardEntity;
import com.kh.app.board.entity.BoardReportEntity;
import com.kh.app.common.entity.DelYn;
import com.kh.app.member.entity.MemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardReportRepository extends JpaRepository<BoardReportEntity, Long> {
    boolean existsByBoardAndReporter(BoardEntity board, MemberEntity reporter);
    long countByBoardAndDelYn(BoardEntity board, DelYn delYn);
}
