package com.kh.app.board.controller;

import com.kh.app.board.dto.request.BoardReplyWriteReqDto;
import com.kh.app.board.service.BoardReplyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
}
