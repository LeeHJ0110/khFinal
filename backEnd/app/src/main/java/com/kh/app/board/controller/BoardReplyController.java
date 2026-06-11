package com.kh.app.board.controller;

import com.kh.app.board.dto.request.BoardReplyReportReqDto;
import com.kh.app.board.dto.request.BoardReplyWriteReqDto;
import com.kh.app.board.dto.response.BoardReplyReportResDto;
import com.kh.app.board.service.BoardReplyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "게시판 댓글", description = "게시판 댓글 관련 API")
@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardReplyController {

    private final BoardReplyService boardReplyService;

    @Operation(summary = "댓글 작성", description = "댓글 또는 대댓글 작성")
    @PostMapping("/{boardId}/reply")
    public ResponseEntity<Void> writeReply(
            @PathVariable Long boardId,
            @RequestBody BoardReplyWriteReqDto reqDto,
            @AuthenticationPrincipal String username
    ) {
        boardReplyService.writeReply(boardId, reqDto, username);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(summary = "댓글 삭제", description = "작성자 본인 또는 관리자만 댓글 삭제")
    @DeleteMapping("/reply/{replyId}")
    public ResponseEntity<Void> deleteReply(
            @PathVariable Long replyId,
            @AuthenticationPrincipal String username
    ) {
        boardReplyService.deleteReply(replyId, username);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "댓글 수정", description = "댓글 작성자 본인만 댓글 수정")
    @PutMapping("/reply/{replyId}")
    public ResponseEntity<Void> updateReply(
            @PathVariable Long replyId,
            @RequestBody BoardReplyWriteReqDto reqDto,
            @AuthenticationPrincipal String username
    ) {
        boardReplyService.updateReply(replyId, reqDto, username);
        return ResponseEntity.ok().build();
    }

    // 댓글 신고 등록
    @PostMapping("/reply/{replyId}/report")
    public ResponseEntity<Object> reportReply(
            @PathVariable Long replyId,
            @RequestBody BoardReplyReportReqDto reqDto,
            @AuthenticationPrincipal String username
    ) {
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            boardReplyService.reportReply(replyId, reqDto.getReason(), username);
            return ResponseEntity.ok().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // 2. 관리자용 댓글 신고 내역 조회 API
    @GetMapping("/admin/reply/reports")
    public ResponseEntity<List<BoardReplyReportResDto>> getReplyReports(
            @RequestParam(name = "status", required = false) String status,
            @AuthenticationPrincipal String username
    ) {
        List<BoardReplyReportResDto> list = boardReplyService.getReplyReportList(status, username);
        return ResponseEntity.ok(list);
    }
    // 3. 관리자용 댓글 신고 처리 API (승인/반려)
    @PutMapping("/admin/reply/reports/{reportId}")
    public ResponseEntity<Object> processReplyReport(
            @PathVariable Long reportId,
            @RequestParam(name = "status") String status,
            @AuthenticationPrincipal String username
    ) {
        try {
            boardReplyService.processReplyReport(reportId, status, username);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
