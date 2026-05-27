package com.kh.app.pet.controller;

import com.kh.app.pet.dto.request.PetCreateReqDto;
import com.kh.app.pet.dto.request.PetUpdateReqDto;
import com.kh.app.pet.dto.response.BreedListResDto;
import com.kh.app.pet.dto.response.PetMyPageResDto;
import com.kh.app.pet.service.PetService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "펫", description = "펫 관련 API")
@RestController
@RequestMapping("/api/pet")
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;

    @PostMapping
    public ResponseEntity<Long> create(
            @RequestBody PetCreateReqDto request,
            Authentication authentication
    ) {
        String loginKey = authentication.getName();

        Long petId = petService.create(request, loginKey);

        return ResponseEntity.ok(petId);
    }

    @GetMapping("/me")
    public ResponseEntity<List<PetMyPageResDto>> getMyPets(
            Authentication authentication
    ) {
        String loginKey = authentication.getName();

        List<PetMyPageResDto> result = petService.getMyPets(loginKey);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/breed")
    public ResponseEntity<List<BreedListResDto>> getBreedList(
            @RequestParam String petType
    ) {

        List<BreedListResDto> result =
                petService.getBreedList(petType);

        return ResponseEntity.ok(result);
    }

    @PutMapping("/{petId}")
    public ResponseEntity<Void> update(
            @PathVariable Long petId,
            @RequestBody PetUpdateReqDto request,
            Authentication authentication
    ) {
        String loginKey = authentication.getName();

        petService.update(petId, request, loginKey);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{petId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long petId,
            Authentication authentication
    ) {
        String loginKey = authentication.getName();

        petService.delete(petId, loginKey);

        return ResponseEntity.ok().build();
    }
}