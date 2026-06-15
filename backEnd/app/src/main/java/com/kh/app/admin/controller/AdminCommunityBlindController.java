package com.kh.app.admin.controller;

import com.kh.app.admin.dto.response.AdminBoardReportResDto;
import com.kh.app.admin.dto.response.AdminCommunityBlindResDto;
import com.kh.app.admin.dto.response.AdminReplyReportResDto;
import com.kh.app.admin.service.AdminCommunityBlindService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/community/blind")
@RequiredArgsConstructor
public class AdminCommunityBlindController {

    private final AdminCommunityBlindService adminCommunityBlindService;

    @GetMapping("/boards")
    public ResponseEntity<Page<AdminCommunityBlindResDto>> getBlindBoards(Pageable pageable) {
        return ResponseEntity.ok(adminCommunityBlindService.getBlindBoards(pageable));
    }

    @GetMapping("/replies")
    public ResponseEntity<Page<AdminCommunityBlindResDto>> getBlindReplies(Pageable pageable) {
        return ResponseEntity.ok(adminCommunityBlindService.getBlindReplies(pageable));
    }

    @GetMapping("/boards/{boardId}/reports")
    public ResponseEntity<List<AdminBoardReportResDto>> getBoardReports(
            @PathVariable Long boardId
    ) {
        return ResponseEntity.ok(adminCommunityBlindService.getBoardReports(boardId));
    }

    @GetMapping("/replies/{replyId}/reports")
    public ResponseEntity<List<AdminReplyReportResDto>> getReplyReports(
            @PathVariable Long replyId
    ) {
        return ResponseEntity.ok(adminCommunityBlindService.getReplyReports(replyId));
    }

    @PutMapping("/boards/{boardId}/cancel")
    public ResponseEntity<Void> cancelBoardBlind(@PathVariable Long boardId) {
        adminCommunityBlindService.cancelBoardBlind(boardId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/replies/{replyId}/cancel")
    public ResponseEntity<Void> cancelReplyBlind(@PathVariable Long replyId) {
        adminCommunityBlindService.cancelReplyBlind(replyId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/reports/{reportId}")
    public ResponseEntity<Void> deleteBoardReport(@PathVariable Long reportId) {
        adminCommunityBlindService.deleteBoardReport(reportId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/reply-reports/{reportId}")
    public ResponseEntity<Void> deleteReplyReport(@PathVariable Long reportId) {
        adminCommunityBlindService.deleteReplyReport(reportId);
        return ResponseEntity.ok().build();
    }
}