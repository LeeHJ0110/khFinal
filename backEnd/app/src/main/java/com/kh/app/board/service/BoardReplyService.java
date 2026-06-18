package com.kh.app.board.service;

import com.kh.app.board.dto.request.BoardReplyWriteReqDto;
import com.kh.app.board.dto.response.BoardReplyReportResDto;
import com.kh.app.board.entity.BoardEntity;
import com.kh.app.board.entity.BoardReplyEntity;
import com.kh.app.board.entity.BoardReplyReportEntity;
import com.kh.app.board.repository.BoardReplyReportRepository;
import com.kh.app.board.repository.BoardReplyRepository;
import com.kh.app.board.repository.BoardRepository;
import com.kh.app.common.entity.DelYn;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.entity.MemberRole;
import com.kh.app.member.repository.MemberRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class BoardReplyService {

    private final BoardReplyRepository boardReplyRepository;
    private final BoardReplyReportRepository boardReplyReportRepository;
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

        BoardReplyEntity savedReply = boardReplyRepository.save(builder.build());
        log.info("[댓글 DB 저장 성공] ID: {}, 게시글ID: {}, 작성자닉네임: {}, 내용: {}, 부모댓글ID: {}",
                savedReply.getId(),
                board.getId(),
                member.getNickname(),
                savedReply.getContent(),
                savedReply.getParent() != null ? savedReply.getParent().getId() : "없음"
        );
    }

    @Transactional
    public void deleteReply(Long replyId, String username) {
        BoardReplyEntity reply = boardReplyRepository.findById(replyId)
                .orElseThrow(() -> new EntityNotFoundException("REPLY NOT FOUND"));

        MemberEntity member = memberRepository.findByUsernameAndDelYn(username, DelYn.N)
                .orElseThrow(() -> new EntityNotFoundException("MEMBER NOT FOUND"));

        // 본인 글이거나 관리자일 때만 삭제 허용
        if (!reply.getMember().getUsername().equals(username) && member.getRole() != MemberRole.A && member.getRole() != MemberRole.B) {
            throw new IllegalStateException("삭제할 권한이 없습니다.");
        }

        reply.delete();
    }

    @Transactional
    public void updateReply(Long replyId, BoardReplyWriteReqDto reqDto, String username) {
        BoardReplyEntity reply = boardReplyRepository.findById(replyId)
                .orElseThrow(() -> new EntityNotFoundException("REPLY NOT FOUND"));

        if (!reply.getMember().getUsername().equals(username)) {
            throw new IllegalStateException("수정할 권한이 없습니다.");
        }

        reply.setContent(reqDto.getContent());
    }

    // 댓글 신고 등록 로직
    @Transactional
    public void reportReply(Long replyId, String reason, String username) {
        BoardReplyEntity reply = boardReplyRepository.findById(replyId)
                .orElseThrow(() -> new EntityNotFoundException("댓글이 없습니다."));
        MemberEntity reporter = memberRepository.findByUsernameAndDelYn(username, DelYn.N)
                .orElseThrow(() -> new EntityNotFoundException("유저를 찾을 수 없습니다"));

        if (reply.getMember().getId().equals(reporter.getId())) {
            throw new IllegalStateException("자신의 댓글은 신고할 수 없습니다.");
        }
        if (boardReplyReportRepository.existsByReplyAndReporter(reply, reporter)) {
            throw new IllegalStateException("이미 신고한 댓글입니다.");
        }

        BoardReplyReportEntity report = BoardReplyReportEntity.builder()
                .reply(reply)
                .reporter(reporter)
                .reason(reason)
                .status("PENDING")
                .build();
        boardReplyReportRepository.save(report);
    }

    // 2. 관리자용 댓글 신고 목록 조회 로직
    public List<BoardReplyReportResDto> getReplyReportList(String status, String username) {
        MemberEntity admin = memberRepository.findByUsernameAndDelYn(username, DelYn.N)
                .orElseThrow(() -> new EntityNotFoundException("MEMBER NOT FOUND"));
        if (admin.getRole() != MemberRole.A && admin.getRole() != MemberRole.B) {
            throw new IllegalStateException("관리자 권한이 없습니다.");
        }
        List<BoardReplyReportEntity> list;
        if (status != null && !status.isBlank()) {
            list = boardReplyReportRepository.findAllByStatus(status);
        } else {
            list = boardReplyReportRepository.findAll();
        }
        return list.stream().map(r -> BoardReplyReportResDto.builder()
                .id(r.getId())
                .replyId(r.getReply().getId())
                .replyContent(r.getReply().getContent())
                .reporterNickname(r.getReporter().getNickname())
                .writerNickname(r.getReply().getMember() != null ? r.getReply().getMember().getNickname() : "탈퇴회원")
                .reason(r.getReason())
                .status(r.getStatus())
                .createdAt(r.getCreatedAt() != null ? r.getCreatedAt().toString() : "")
                .build()
        ).toList();
    }
    // 3. 관리자용 댓글 신고 처리 로직 (승인 / 반려)
    @Transactional
    public void processReplyReport(Long reportId, String status, String username) {
        MemberEntity admin = memberRepository.findByUsernameAndDelYn(username, DelYn.N)
                .orElseThrow(() -> new EntityNotFoundException("MEMBER NOT FOUND"));
        if (admin.getRole() != MemberRole.A && admin.getRole() != MemberRole.B) {
            throw new IllegalStateException("관리자 권한이 없습니다.");
        }
        BoardReplyReportEntity report = boardReplyReportRepository.findById(reportId)
                .orElseThrow(() -> new EntityNotFoundException("REPORT NOT FOUND"));
        if (!"PENDING".equals(report.getStatus())) {
            throw new IllegalStateException("이미 처리 완료된 신고 내역입니다.");
        }
        if ("APPROVED".equalsIgnoreCase(status)) {
            report.setStatus("APPROVED");
            // 해당 댓글 블라인드 처리
            report.getReply().setBlindYn("Y");
        } else if ("REJECTED".equalsIgnoreCase(status)) {
            report.setStatus("REJECTED");
            // 반려 시 댓글은 정상 노출 유지 (blindYn = "N")
        } else {
            throw new IllegalArgumentException("올바르지 않은 처리 상태값입니다.");
        }
    }
}
