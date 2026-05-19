package com.kh.app.board.repository;

import com.kh.app.board.dto.request.BoardSearchCondition;
import com.kh.app.board.entity.BoardEntity;
//import com.kh.app.board.entity.QBoardEntity;
import com.kh.app.common.entity.DelYn;
//import com.kh.app.member.entity.QMemberEntity;
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

    @Override
    public Page<BoardEntity> getList(String category, BoardSearchCondition condition, Pageable pageable) {
        return null;
    }

    @Override
    public Page<BoardEntity> getListByCategory(String category, BoardSearchCondition condition, Pageable pageable) {
        return null;
    }

}