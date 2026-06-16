package com.kh.app.board.repository;

import com.kh.app.board.entity.BoardCategory;
import com.kh.app.board.entity.BoardEntity;
import com.kh.app.common.entity.DelYn;
import com.kh.app.member.entity.MemberEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface BoardRepository extends JpaRepository<BoardEntity, Long>, BoardRepositoryCustom {
    @Query("select b from BoardEntity b where b.writer.id = :writerId and b.category = :category and b.delYn = com.kh.app.common.entity.DelYn.N and b.blindYn = 'N'")
    Page<BoardEntity> findByWriter_IdAndCategoryOrderByCreatedAtDesc(
            @Param("writerId") Long writerId,
            @Param("category") BoardCategory category,
            Pageable pageable
    );

    long countByWriterAndBlindYnAndDelYn(MemberEntity writer, String blindYn, DelYn delYn);

    Page<BoardEntity> findAllByBlindYnAndDelYnOrderByCreatedAtDesc(
            String  blindYn,
            DelYn  delYn,
            Pageable pageable
    );

    @Modifying
    @Query("""
    update BoardEntity b
       set b.blindYn = :blindYn
     where b.id = :boardId
""")
    void updateBlindYn(
            @Param("boardId") Long boardId,
            @Param("blindYn") String  blindYn
    );

}