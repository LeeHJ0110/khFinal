package com.kh.app.board.repository;

import com.kh.app.board.entity.BoardReplyEntity;
import com.kh.app.board.entity.BoardReplyReportEntity;
import com.kh.app.member.entity.MemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardReplyReportRepository extends JpaRepository<BoardReplyReportEntity, Long> {
    boolean existsByReplyAndReporter(BoardReplyEntity reply, MemberEntity reporter);
    List<BoardReplyReportEntity> findAllByStatus(String status);

    List<BoardReplyReportEntity> findAllByReply_IdOrderByCreatedAtDesc(Long replyId);
}
