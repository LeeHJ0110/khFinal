package com.kh.app.board.repository;

import com.kh.app.board.dto.request.BoardSearchCondition;
import com.kh.app.board.entity.BoardEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.nio.channels.FileChannel;

public interface BoardRepositoryCustom {
    Page<BoardEntity> getListByCategory(String category, BoardSearchCondition condition, Pageable pageable);

    Page<BoardEntity> getList(String category, BoardSearchCondition condition, Pageable pageable);

}