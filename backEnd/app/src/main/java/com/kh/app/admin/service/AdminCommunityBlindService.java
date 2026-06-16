package com.kh.app.admin.service;

import com.kh.app.admin.dto.response.AdminBoardReportResDto;
import com.kh.app.admin.dto.response.AdminCommunityBlindResDto;
import com.kh.app.admin.dto.response.AdminReplyReportResDto;
import com.kh.app.board.entity.BoardEntity;
import com.kh.app.board.entity.BoardReplyEntity;
import com.kh.app.board.entity.BoardReplyReportEntity;
import com.kh.app.board.entity.BoardReportEntity;
import com.kh.app.board.repository.BoardReplyReportRepository;
import com.kh.app.board.repository.BoardReplyRepository;
import com.kh.app.board.repository.BoardReportRepository;
import com.kh.app.board.repository.BoardRepository;
import com.kh.app.common.entity.DelYn;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminCommunityBlindService {

    private final BoardRepository boardRepository;
    private final BoardReplyRepository boardReplyRepository;
    private final BoardReportRepository boardReportRepository;
    private final BoardReplyReportRepository boardReplyReportRepository;

    public Page<AdminCommunityBlindResDto> getBlindBoards(Pageable pageable) {
        return boardRepository
                .findAllByBlindYnAndDelYnOrderByCreatedAtDesc("Y", DelYn.N, pageable)
                .map(this::toBoardDto);
    }

    public Page<AdminCommunityBlindResDto> getBlindReplies(Pageable pageable) {
        return boardReplyRepository
                .findAllByBlindYnAndDelYnOrderByCreatedAtDesc("Y", DelYn.N, pageable)
                .map(this::toReplyDto);
    }

    public List<AdminBoardReportResDto> getBoardReports(Long boardId) {
        return boardReportRepository
                .findAllByBoard_IdOrderByCreatedAtDesc(boardId)
                .stream()
                .map(this::toBoardReportDto)
                .toList();
    }

    public List<AdminReplyReportResDto> getReplyReports(Long replyId) {
        return boardReplyReportRepository
                .findAllByReply_IdOrderByCreatedAtDesc(replyId)
                .stream()
                .map(this::toReplyReportDto)
                .toList();
    }

    @Transactional
    public void cancelBoardBlind(Long boardId) {
        boardRepository.updateBlindYn(boardId, "N");
    }

    @Transactional
    public void cancelReplyBlind(Long replyId) {
        boardReplyRepository.updateBlindYn(replyId, "N");
    }

    @Transactional
    public void deleteBoardReport(Long reportId) {
        boardReportRepository.deleteById(reportId);
    }

    @Transactional
    public void deleteReplyReport(Long reportId) {
        boardReplyReportRepository.deleteById(reportId);
    }

    private AdminCommunityBlindResDto toBoardDto(BoardEntity board) {
        return AdminCommunityBlindResDto.builder()
                .id(board.getId())
                .title(board.getTitle())
                .content(board.getContent())
                .writerNickname(board.getWriter().getNickname())
                .createdAt(board.getCreatedAt())
                .build();
    }

    private AdminCommunityBlindResDto toReplyDto(BoardReplyEntity reply) {
        return AdminCommunityBlindResDto.builder()
                .id(reply.getId())
                .title(reply.getBoard().getTitle())
                .content(reply.getContent())
                .writerNickname(reply.getMember().getNickname())
                .createdAt(reply.getCreatedAt())
                .build();
    }

    private AdminBoardReportResDto toBoardReportDto(BoardReportEntity report) {
        return AdminBoardReportResDto.builder()
                .reportId(report.getId())
                .reporterNickname(report.getReporter().getNickname())
                .reason(report.getReason())
                .createdAt(report.getCreatedAt())
                .build();
    }

    private AdminReplyReportResDto toReplyReportDto(BoardReplyReportEntity report) {
        return AdminReplyReportResDto.builder()
                .reportId(report.getId())
                .reporterNickname(report.getReporter().getNickname())
                .reason(report.getReason())
                .createdAt(report.getCreatedAt())
                .build();
    }
}