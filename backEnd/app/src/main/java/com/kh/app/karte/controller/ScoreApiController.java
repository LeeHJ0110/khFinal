package com.kh.app.karte.controller;

import com.kh.app.karte.service.ScoreService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "점수", description = "점수 관련 api")
@RestController
@RequestMapping("/api/score")
@RequiredArgsConstructor
public class ScoreApiController {
    private final ScoreService scoreService;
}
