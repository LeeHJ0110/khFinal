package com.kh.app.petcare.controller;

import com.kh.app.pet.entity.PetType;
import com.kh.app.petcare.service.PetCareService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
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

    @PostMapping("/diagnosis")
    public ResponseEntity<Object> requestDiagnosis(
//            @RequestParam("petId")
//            Long petId,

            //프론트가 보낸 JSON 데이터 받기(내용 같은 데이터)
            @RequestPart("data")
            String data,

            //이미지 파일 받기
            @RequestPart(value = "eyeFiles")
            List<MultipartFile> eyeFiles,

            @RequestPart("skinFiles")
            List<MultipartFile> skinFiles,

            @RequestPart("teethFiles")
            List<MultipartFile> teethFiles,

            //현재 로그인한 사용자 정보 가져오기
            @AuthenticationPrincipal String username

    ) throws IOException {

        petCareService.requestDiagnosis(
                data,
                eyeFiles,
                skinFiles,
                teethFiles,
                username);

        //요청 성공 응답
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }
    // 문진 질문 보여주기
    @GetMapping("/diagnosis/questions")
    public ResponseEntity<Object> getQuestionList(
            @RequestParam PetType petType
    ) {
        return ResponseEntity.ok(
                petCareService.getQuestionList(petType)
        );
    }
//페이징 목록조회
    @GetMapping("/diagnosis/list")
    public ResponseEntity<Object> requestDiagnosisList(
            @RequestParam(defaultValue = "0") int pno
    ) {

        return ResponseEntity.ok(
                petCareService.requestDiagnosisList(pno)
        );
    }

    //상세보기
    @GetMapping("/diagnosis/{diagnosisReqId}")
    public ResponseEntity<Object> getDiagnosisDetail(
            @PathVariable Long diagnosisReqId
    ) {
        return ResponseEntity.ok(
                petCareService.getDiagnosisDetail(diagnosisReqId)
        );
    }
}
