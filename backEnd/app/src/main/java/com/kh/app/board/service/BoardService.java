package com.kh.app.board.service;

import com.kh.app.board.dto.request.BoardSearchCondition;
import com.kh.app.board.dto.request.BoardWriteReqDto;
import com.kh.app.board.dto.response.BoardResDto;
import com.kh.app.board.entity.BoardEntity;
import com.kh.app.board.repository.BoardRepository;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class BoardService {

    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;

    public Page<BoardResDto> getList(String category, BoardSearchCondition condition, int page) {
        Pageable pageable = PageRequest.of(page, 10);
        System.out.println("BoardService.getList@@@@@servicedeee ");
        Page<BoardEntity> entityPage = boardRepository.getListByCategory(category, condition, pageable);
        return entityPage
                .map(BoardResDto::from);
    }

    public void write(BoardWriteReqDto reqDto, List<MultipartFile> fileList, String username) {
        MemberEntity memberEntity = memberRepository
                .findByUsernameAndDelYn(username, "N")
                .orElseThrow(() -> new EntityNotFoundException("MEMBER NOT FOUND ........"));

        boardRepository.save(reqDto.toEntity(memberEntity));
    }
}
