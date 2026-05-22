package com.kh.app.pet.controller;

import com.kh.app.pet.dto.request.PetCreateReqDto;
import com.kh.app.pet.service.PetService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "펫" , description = "펫 관련 API")
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
        String username = authentication.getName();

        Long petId = petService.create(request, username);

        return ResponseEntity.ok(petId);
    }
}
