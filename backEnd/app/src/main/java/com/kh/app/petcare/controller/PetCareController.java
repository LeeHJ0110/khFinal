package com.kh.app.petcare.controller;

import com.kh.app.petcare.dto.request.PetCareReqDto;
import com.kh.app.petcare.service.PetCareService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Tag(name = "건강진단 신청", description = "건강진단 신청 관련 API")
@RestController
@RequestMapping("/api/petcare")
@RequiredArgsConstructor
@Slf4j
public class PetCareController {

    private final PetCareService petCareService;

    @PostMapping(
            value = "/diagnosis",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Object> requestDiagnosis(

            // JSON 데이터
            @RequestPart("data")
            PetCareReqDto reqDto,

            // 파일 리스트
            @RequestPart(value = "fileList", required = false)
            List<MultipartFile> fileList,

            // 로그인 사용자
            @AuthenticationPrincipal String username

    ) throws IOException {

        log.info("컨트롤러 진입 성공");

        petCareService.requestDiagnosis(reqDto, fileList, username);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }
}