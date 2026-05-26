package com.kh.app.board.repository;

import com.kh.app.board.dto.request.BoardSearchCondition;
import com.kh.app.board.entity.BoardEntity;
//import com.kh.app.board.entity.QBoardEntity;
import com.kh.app.board.entity.QBoardEntity;
import com.kh.app.common.entity.DelYn;
//import com.kh.app.member.entity.QMemberEntity;
import com.kh.app.member.entity.QMemberEntity;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class BoardRepositoryImpl implements BoardRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<BoardEntity> getList(String category, BoardSearchCondition condition, Pageable pageable) {
        return getListByCategory(category, condition, pageable);
    }

    @Override
    public Page<BoardEntity> getListByCategory(String category, BoardSearchCondition condition, Pageable pageable) {

        QBoardEntity board = QBoardEntity.boardEntity;
        QMemberEntity member = QMemberEntity.memberEntity;

        List<BoardEntity> content = queryFactory
                .selectFrom(board)
                .join(board.writer, member).fetchJoin()
                .where(
                        categoryEq(category),
                        titleContains(condition.getTitle()),
                        contentContains(condition.getContent()),
                        subCategoryEq(condition.getBoardSubCategory()),
                        starsGoe(condition.getBoardStars()),
                        hitsGoe(condition.getBoardHits()),
                        board.delYn.eq(DelYn.N)
                )
                .orderBy(board.id.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(board.count())
                .from(board)
                .where(
                        categoryEq(category),
                        titleContains(condition.getTitle()),
                        contentContains(condition.getContent()),
                        subCategoryEq(condition.getBoardSubCategory()),
                        starsGoe(condition.getBoardStars()),
                        hitsGoe(condition.getBoardHits()),
                        board.delYn.eq(DelYn.N)
                )
                .fetchOne();

        long totalCount = (total != null) ? total : 0L;

        return new PageImpl<>(content, pageable, totalCount);
    }

    private BooleanExpression categoryEq(String category) {
        return StringUtils.hasText(category) ? QBoardEntity.boardEntity.category.stringValue().eq(category) : null;
    }

    private BooleanExpression titleContains(String title) {
        return StringUtils.hasText(title) ? QBoardEntity.boardEntity.title.contains(title) : null;
    }

    private BooleanExpression contentContains(String content) {
        return StringUtils.hasText(content) ? QBoardEntity.boardEntity.content.contains(content) : null;
    }

    private BooleanExpression subCategoryEq(String subCategory) {
        return StringUtils.hasText(subCategory) ? QBoardEntity.boardEntity.subCategory.stringValue().eq(subCategory) : null;
    }

    private BooleanExpression starsGoe(Long stars) {
        return stars != null ? QBoardEntity.boardEntity.stars.goe(stars) : null;
    }

    private BooleanExpression hitsGoe(Long hits) {
        return hits != null ? QBoardEntity.boardEntity.hits.goe(hits) : null;
    }

}