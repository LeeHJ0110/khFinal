package com.kh.app.board.repository;

import com.kh.app.board.entity.BoardEntity;
import com.kh.app.board.entity.BoardLikeEntity;
import com.kh.app.member.entity.MemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BoardLikeRepository extends JpaRepository<BoardLikeEntity, Long> {
    long countByBoard(BoardEntity board);
    Optional<BoardLikeEntity> findByBoardAndMember(BoardEntity board, MemberEntity member);
    boolean existsByBoardAndMember(BoardEntity board, MemberEntity member);
}
