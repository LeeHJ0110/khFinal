package com.kh.app.petcare.controller;

import com.kh.app.pet.entity.PetType;
import com.kh.app.petcare.service.PetCareService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
    // 건강진단 신청 화면용 내 반려동물 목록 조회
    @GetMapping("/diagnosis/pets")
    public ResponseEntity<Object> getMyPetListForDiagnosis(
            @AuthenticationPrincipal String username
    ) {
        return ResponseEntity.ok(
                petCareService.getMyPetListForDiagnosis(username)
        );
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
        @RequestParam(defaultValue = "0") int pno,
        @RequestParam(defaultValue = "ALL") String petType
) {
    return ResponseEntity.ok(
            petCareService.requestDiagnosisList(pno, petType)
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
    // 건강진단 완료 처리
    @PatchMapping("/diagnosis/{diagnosisReqId}/complete")
    public ResponseEntity<Object> completeDiagnosis(
            @PathVariable Long diagnosisReqId
    ) {

        petCareService.completeDiagnosis(diagnosisReqId);

        return ResponseEntity.ok().build();
    }
    // =========================================================
// =========================================================
// 건강진단 신청 반려
//
// 제출 이미지가 부적절하거나 자료가 부족한 경우
// 진행 상태를 해제하여 사용자가 다시 신청할 수 있도록 처리
// =========================================================
    @PatchMapping("/diagnosis/{id}/reject")
    public ResponseEntity<Void> rejectDiagnosis(
            @PathVariable Long id,
            Authentication authentication
    ) {
        petCareService.rejectDiagnosis(
                id,
                authentication.getName()
        );

        return ResponseEntity
                .noContent()
                .build();
    }
}
