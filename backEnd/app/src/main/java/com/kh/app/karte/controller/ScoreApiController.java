package com.kh.app.karte.controller;

import com.kh.app.karte.dto.request.ScoreAvgReqDto;
import com.kh.app.karte.dto.response.ScoreAvgCominedResDto;
import com.kh.app.karte.dto.response.ScoreHisResDto;
import com.kh.app.karte.dto.response.ScoreResDto;
import com.kh.app.karte.entity.ScoreCategory;
import com.kh.app.karte.service.ScoreService;
import com.kh.app.pet.entity.PetType;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@Tag(name = "점수", description = "점수 관련 api")
@RestController
@RequestMapping("/api/score")
@RequiredArgsConstructor
public class ScoreApiController {
    private final ScoreService scoreService;

    //전체 품종 **점수 평균
    @GetMapping("avg")
    public ResponseEntity<ScoreAvgCominedResDto> getAvg(
            @RequestParam Long petId
    ){
        return ResponseEntity.ok(scoreService.getAvg(petId));
    }
    //해당 pet의 total점수 최근 n개 가져오기
    @GetMapping("history")
    public ResponseEntity<List<ScoreHisResDto>> getHistory(
            @RequestParam Long petId
    ){
        return ResponseEntity.ok(scoreService.getHistory(petId));
    }

    @GetMapping
    public ResponseEntity<Long> get(
            @RequestParam Long petId,
            @RequestParam ScoreCategory category
            ){
        return ResponseEntity.ok(scoreService.getOne(petId, category));
    }
}
