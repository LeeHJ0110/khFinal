package com.kh.app.schedule.controller;

import com.kh.app.schedule.dto.request.TrainReqDto;
import com.kh.app.schedule.dto.response.TrainingResDto;
import com.kh.app.schedule.service.TrainingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Tag(name = "훈련", description = "훈련 관련 api")
@RestController
@RequestMapping("/api/training")
@RequiredArgsConstructor
public class TrainingController {

    private final TrainingService trainingService;

    //등록
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "일정작성 성공"),
            @ApiResponse(responseCode = "401", description = "인증정보 없음")
    })
    @PostMapping
    public ResponseEntity<Object> write(
            @RequestBody TrainReqDto reqDto,
            @AuthenticationPrincipal String username
    ){
        trainingService.write(reqDto, username);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }

    @Operation(summary = "날짜 중복 확인")
    @GetMapping("/checkDate")
    public ResponseEntity<String> checkDate(
            @AuthenticationPrincipal String username,
            @RequestParam LocalDate date
    ) {
        return ResponseEntity.ok(trainingService.checkDate(date, username));
    }

    //목록조회
    @GetMapping
    public ResponseEntity<List<TrainingResDto>> selectList(@AuthenticationPrincipal String username){
        List<TrainingResDto> resDtoList = trainingService.selectList(username);
        return ResponseEntity.ok(resDtoList);
    }

//    //상세조회
//    @GetMapping("{id}")
//    public ResponseEntity<EventResDto> selectOne(
//            @PathVariable Long id,
//            @AuthenticationPrincipal String username    //TODO 유저가 맞는지 확인 방어 로직
//    ){
//        EventResDto resDto = scheduleService.selectOne(id);
//        return ResponseEntity.ok(resDto);
//    }

    //삭제
    @DeleteMapping("{id}")
    public ResponseEntity.BodyBuilder delete(@PathVariable Long id){
        trainingService.delete(id);
        return ResponseEntity.ok();
    }

    //수정
    @PutMapping("{id}")
    public ResponseEntity.BodyBuilder update(
            @PathVariable Long id,
            @RequestBody TrainReqDto reqDto){
        trainingService.update(id, reqDto);
        return ResponseEntity.ok();
    }
}
