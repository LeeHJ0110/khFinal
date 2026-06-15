package com.kh.app.board.repository;

import com.kh.app.board.entity.BoardEntity;
import com.kh.app.board.entity.BoardReplyEntity;
import com.kh.app.common.entity.DelYn;
import com.kh.app.member.entity.MemberEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface BoardReplyRepository extends JpaRepository<BoardReplyEntity, Long> {
    List<BoardReplyEntity> findByBoardAndParentIsNullOrderByCreatedAtAsc(BoardEntity board);
    long countByBoardAndDelYn(BoardEntity board, com.kh.app.common.entity.DelYn delYn);

    @Query("select r from BoardReplyEntity r where r.member.id = :memberId and r.delYn = :delYn and r.board.delYn = com.kh.app.common.entity.DelYn.N and r.board.blindYn = 'N'")
    Page<BoardReplyEntity> findByMember_IdAndDelYnOrderByCreatedAtDesc(
            @Param("memberId") Long memberId,
            @Param("delYn") DelYn delYn,
            Pageable pageable
    );

    Page<BoardReplyEntity> findAllByBlindYnAndDelYnOrderByCreatedAtDesc(
            String blindYn,
            DelYn delYn,
            Pageable pageable
    );

    @Modifying
    @Query("""
    update BoardReplyEntity r
       set r.blindYn = :blindYn
     where r.id = :replyId
""")
    void updateBlindYn(
            @Param("replyId") Long replyId,
            @Param("blindYn") String blindYn
    );

}
