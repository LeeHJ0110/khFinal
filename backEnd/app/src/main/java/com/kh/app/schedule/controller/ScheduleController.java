package com.kh.app.schedule.controller;

import com.kh.app.schedule.dto.request.EventReqDto;
import com.kh.app.schedule.dto.response.EventResDto;
import com.kh.app.schedule.dto.response.SimpleEventResDto;
import com.kh.app.schedule.service.ScheduleService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "일정", description = "일정 관련 api")
@RestController
@RequestMapping("/api/schedule")
@RequiredArgsConstructor
public class ScheduleController {
    private final ScheduleService scheduleService;

    //등록
    @PostMapping
    public ResponseEntity<Object> write(@RequestBody EventReqDto reqDto){

        scheduleService.write(reqDto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }

    //목록조회
    @GetMapping("{memberId}")
    public ResponseEntity<List<SimpleEventResDto>> selectList(@PathVariable Long memberId){
        List<SimpleEventResDto> resDtoList = scheduleService.selectList(memberId);
        return ResponseEntity.ok(resDtoList);
    }

    //상세조회
    @GetMapping("/one/{id}")
    public ResponseEntity<EventResDto> selectOne(@PathVariable Long id){
        EventResDto resDto = scheduleService.selectOne(id);
        return ResponseEntity.ok(resDto);
    }

    //삭제
    @DeleteMapping("{id}")
    public ResponseEntity.BodyBuilder delete(@PathVariable Long id){
        scheduleService.delete(id);
        return ResponseEntity.ok();
    }

    //수정
    @PutMapping("{id}")
    public ResponseEntity.BodyBuilder update(@PathVariable Long id, EventReqDto reqDto){
        scheduleService.update(id, reqDto);
        return ResponseEntity.ok();
    }
}
