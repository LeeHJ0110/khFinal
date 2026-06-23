package com.kh.app.board.controller;

import com.kh.app.board.service.BoardService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/board/image")
@RequiredArgsConstructor
public class BoardImageController {

    private final BoardService boardService;

    @Operation(summary = "에디터 이미지 단독 업로드", description = "에디터 내 이미지 삽입 시 S3에 업로드하고 이미지 URL 반환")
    @PostMapping
    public ResponseEntity<String> uploadEditorImage(
            @RequestParam("image") MultipartFile file
    ) throws IOException {
        String imageUrl = boardService.uploadEditorImage(file);
        return ResponseEntity.ok(imageUrl);
    }
}
