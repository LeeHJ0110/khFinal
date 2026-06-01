package com.kh.app.karte.controller;

import com.kh.app.karte.dto.request.KarteReqDto;
import com.kh.app.karte.service.KarteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Tag(name = "건강진단결과", description = "건강진단결과 관련 api")
@RestController
@RequestMapping("/api/karte")
@RequiredArgsConstructor
public class KarteApiController {

    private final KarteService karteService;
    //등록
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

//    //목록조회
//    @GetMapping
//    public ResponseEntity<List<TrainingResDto>> selectList(@AuthenticationPrincipal String username){
//        List<TrainingResDto> resDtoList = trainingService.selectList(username);
//        return ResponseEntity.ok(resDtoList);
//    }

//    //상세조회
//    @GetMapping("{id}")
//    public ResponseEntity<EventResDto> selectOne(
//            @PathVariable Long id,
//            @AuthenticationPrincipal String username    //TODO 유저가 맞는지 확인 방어 로직
//    ){
//        EventResDto resDto = scheduleService.selectOne(id);
//        return ResponseEntity.ok(resDto);
//    }

//    //삭제
//    @DeleteMapping("{id}")
//    public ResponseEntity.BodyBuilder delete(@PathVariable Long id){
//        trainingService.delete(id);
//        return ResponseEntity.ok();
//    }
//
//    //수정
//    @PutMapping("{id}")
//    public ResponseEntity.BodyBuilder update(
//            @PathVariable Long id,
//            @RequestBody TrainReqDto reqDto){
//        trainingService.update(id, reqDto);
//        return ResponseEntity.ok();
//    }
}
