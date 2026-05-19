package com.kh.app.karte.controller;

import com.kh.app.karte.service.KarteService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "건강진단결과", description = "건강진단결과 관련 api")
@RestController
@RequestMapping("/api/karte")
@RequiredArgsConstructor
public class KarteApiController {

    private final KarteService karteService;
}
