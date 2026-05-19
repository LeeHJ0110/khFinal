package com.kh.app.schedule.controller;

import com.kh.app.schedule.dto.request.EventReqDto;
import com.kh.app.schedule.service.ScheduleService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    @GetMapping
    public void selectAll(){
        scheduleService.selectAll()
    }

    //상세조회
    @GetMapping("/one/{eventId}")
    public void selectOne(@PathVariable Long eventId){}

    //삭제
    @DeleteMapping("{id}")
    public void delete(@PathVariable Long id){}

    //수정
    @PutMapping("{id}")
    public void edit(@PathVariable Long id){}
}
