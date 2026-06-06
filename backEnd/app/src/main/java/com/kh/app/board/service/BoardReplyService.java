package com.kh.app.board.service;

import com.kh.app.board.dto.request.BoardReplyWriteReqDto;
import com.kh.app.board.entity.BoardEntity;
import com.kh.app.board.entity.BoardReplyEntity;
import com.kh.app.board.repository.BoardReplyRepository;
import com.kh.app.board.repository.BoardRepository;
import com.kh.app.common.entity.DelYn;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.entity.MemberRole;
import com.kh.app.member.repository.MemberRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class BoardReplyService {

    private final BoardReplyRepository boardReplyRepository;
    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public void writeReply(Long boardId, BoardReplyWriteReqDto reqDto, String username) {
        BoardEntity board = boardRepository.findById(boardId)
                .orElseThrow(() -> new EntityNotFoundException("BOARD NOT FOUND"));

        MemberEntity member = memberRepository.findByUsernameAndDelYn(username, DelYn.N)
                .orElseThrow(() -> new EntityNotFoundException("MEMBER NOT FOUND"));

        BoardReplyEntity.BoardReplyEntityBuilder builder = BoardReplyEntity.builder()
                .board(board)
                .member(member)
                .content(reqDto.getContent());

        if (reqDto.getParentId() != null) {
            BoardReplyEntity parent = boardReplyRepository.findById(reqDto.getParentId())
                    .orElseThrow(() -> new EntityNotFoundException("PARENT REPLY NOT FOUND"));
            
            // 대댓글에 다시 대댓글을 다는 경우(뎁스 3단계 이상) 제한
            if (parent.getParent() != null) {
                throw new IllegalStateException("대댓글에는 답글을 달 수 없습니다. 최대 2단계까지만 지원합니다.");
            }
            builder.parent(parent);
        }

        boardReplyRepository.save(builder.build());
    }

    @Transactional
    public void deleteReply(Long replyId, String username) {
        BoardReplyEntity reply = boardReplyRepository.findById(replyId)
                .orElseThrow(() -> new EntityNotFoundException("REPLY NOT FOUND"));

        MemberEntity member = memberRepository.findByUsernameAndDelYn(username, DelYn.N)
                .orElseThrow(() -> new EntityNotFoundException("MEMBER NOT FOUND"));

        // 본인 글이거나 관리자일 때만 삭제 허용
        if (!reply.getMember().getUsername().equals(username) && member.getRole() != MemberRole.A) {
            throw new IllegalStateException("NO PERMISSION TO DELETE REPLY");
        }

        reply.delete();
    }
}
