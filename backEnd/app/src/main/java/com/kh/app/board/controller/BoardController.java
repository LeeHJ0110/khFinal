package com.kh.app.board.controller;

import com.kh.app.board.dto.request.BoardSearchCondition;
import com.kh.app.board.dto.request.BoardWriteReqDto;
import com.kh.app.board.dto.response.BoardDetailResDto;
import com.kh.app.board.dto.response.BoardResDto;
import com.kh.app.board.dto.response.BoardLikeResDto;
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
            @ApiResponse(responseCode = "401", description = "인증 정보 없음"),
            @ApiResponse(responseCode = "403", description = "수정 권한 없음")
    })
    @PutMapping("/edit/{boardId}")
    public ResponseEntity<Object> update(
            @PathVariable(name = "boardId") Long boardId,
            @RequestPart(name = "data") BoardWriteReqDto reqDto,
            @RequestPart(name = "fileList", required = false) List<MultipartFile> fileList,
            @AuthenticationPrincipal String username
    ) throws IOException {
        boardService.update(boardId, reqDto, fileList, username);
        return ResponseEntity.ok().build();
    }



    @Operation(summary = "게시글 상세조회", description = "게시글 내용을 번호로 조회 (첨부파일들도 함께 조회)")
    @ApiResponses({
            @ApiResponse(responseCode = "200" , description = "게시글 상세조회 성공 ~~~") ,
    })
    @GetMapping("/detail/{id}")
    public ResponseEntity<BoardDetailResDto> getBoardDetail(
            @PathVariable Long id,
            @AuthenticationPrincipal String username
    ){
        System.out.println("id = " + id);
        BoardDetailResDto dto = boardService.getBoardDetail(id, username);
        return ResponseEntity.ok(dto);
    }

    @Operation(summary = "게시글 좋아요 토글", description = "로그인 유저가 좋아요를 누르지 않았다면 누름, 이미 눌렀다면 취소")
    @PostMapping("/{boardId}/like")
    public ResponseEntity<BoardLikeResDto> toggleLike(
            @PathVariable Long boardId,
            @AuthenticationPrincipal String username
    ) {
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        BoardLikeResDto result = boardService.toggleLike(boardId, username);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "게시글 삭제", description = "게시글의 DelYn을 Y처리 해서 조회 못하게 변경")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "게시글 삭제성공 ~~~"),
            @ApiResponse(responseCode = "401", description = "인증 정보 없음"),
            @ApiResponse(responseCode = "403", description = "삭제 권한 없음")
    })
    @DeleteMapping
    public ResponseEntity<Object> delete(
            @RequestParam Long id,
            @AuthenticationPrincipal String username
    ){
        System.out.println("삭제 요청 들어온 boardId = " + id + ", username = " + username);
        boardService.delete(id, username);
        return ResponseEntity.ok().build();
    }

}



