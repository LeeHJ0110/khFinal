package com.kh.app.board.controller;

import com.kh.app.board.dto.request.BoardSearchCondition;
import com.kh.app.board.dto.request.BoardWriteReqDto;
import com.kh.app.board.dto.response.BoardResDto;
import com.kh.app.board.service.BoardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Tag(name = "게시판", description = "게시판 관련 API")
@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
@Slf4j
public class BoardController {

    private final BoardService boardService;

    @Operation(summary = "게시글 작성", description = "제목, 내용 + 토큰 으로 게시글 작성 ( + 파일)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "게시글 작성 성공 ~~~"),
            @ApiResponse(responseCode = "401", description = "인증 정보 없음 ㅠㅠ")
    })
    @PostMapping("/new")
    public ResponseEntity<Object> write(
            @RequestPart(name = "data") BoardWriteReqDto reqDto,
            @RequestPart(name = "fileList", required = false) List<MultipartFile> fileList,
            @AuthenticationPrincipal String username
    ) throws IOException {
        boardService.write(reqDto, fileList, username);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }


    @Operation(summary = "카테고리별 게시글 목록 조회")
    @GetMapping("/{category}")
    public ResponseEntity<Page<BoardResDto>> getList(
            @PathVariable(name = "category") String category,
            @ModelAttribute BoardSearchCondition condition,
            @RequestParam(name = "page", defaultValue = "0") int page
            ){
        Page<BoardResDto> result = boardService.getList(category, condition, page);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "게시글 수정", description = "제목, 내용 + 토큰 으로 게시글 수정 ( + 파일)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "게시글 수정 성공"),

    })
    @PutMapping("/edit/{boardId}")
    public ResponseEntity<Object> update(
            @PathVariable(name = "boardId") Long boardId,
            @RequestPart(name = "data") BoardWriteReqDto reqDto,
            @RequestPart(name = "fileList", required = false) List<MultipartFile> fileList,
            
    ) throws IOException {
        boardService.update(boardId, reqDto, fileList, username);
        return ResponseEntity.ok().build();
    }



//    @Operation(summary = "게시글 상세조회")
//    @GetMapping("/{category}/{boardId}")
//    public void getOne(
//            @PathVariable(name = "category") String category,
//    ){
//        boardService.getOne(category)
//    }
}
