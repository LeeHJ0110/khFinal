package com.kh.app.karte.controller;

import com.kh.app.board.dto.response.BoardListResDto;
import com.kh.app.karte.dto.request.KarteReqDto;
import com.kh.app.karte.dto.response.KarteListResDto;
import com.kh.app.karte.dto.response.KarteResDto;
import com.kh.app.karte.service.KarteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Tag(name = "건강진단결과", description = "건강진단결과 관련 api")
@RestController
@RequestMapping("/api/karte")
@RequiredArgsConstructor
public class KarteApiController {

    private final KarteService karteService;
    //등록
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "일정작성 성공"),
            @ApiResponse(responseCode = "401", description = "인증정보 없음")
    })
    @PostMapping
    public ResponseEntity<Object> write(
            @RequestBody KarteReqDto reqDto,
            @AuthenticationPrincipal String username
    ){
        karteService.write(reqDto, username);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }

    @Operation(summary = "게시글 목록 조회", description = "게시글 목록 불러옴(번호, 제목, 작성자")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "게시글조회 성공"),
    })
    @GetMapping
    public ResponseEntity<Page<KarteListResDto>> getKarteList(
            @RequestParam(defaultValue = "0") int pno,
            @AuthenticationPrincipal String username
    ){
        Page<KarteListResDto> karteListPage = karteService.getKarteList(pno, username);
        return ResponseEntity.ok(karteListPage);
    }

    //상세조회
    @GetMapping("{id}")
    public ResponseEntity<KarteResDto> selectOne(
            @PathVariable Long id,
            @AuthenticationPrincipal String username
    ){
        KarteResDto resDto = karteService.selectOne(id, username);
        return ResponseEntity.ok(resDto);
    }

//    //삭제
//    @DeleteMapping("{id}")
//    public ResponseEntity.BodyBuilder delete(@PathVariable Long id){
//        karteService.delete(id);
//        return ResponseEntity.ok();
//    }

}
