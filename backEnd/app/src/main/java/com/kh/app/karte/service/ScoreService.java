package com.kh.app.karte.service;

import com.kh.app.karte.dto.request.ScoreAvgReqDto;
import com.kh.app.karte.dto.request.ScoreReqDto;
import com.kh.app.karte.dto.response.ScoreAvgCominedResDto;
import com.kh.app.karte.dto.response.ScoreHisResDto;
import com.kh.app.karte.dto.response.ScoreResDto;
import com.kh.app.karte.entity.ScoreCategory;
import com.kh.app.karte.entity.ScoreEntity;
import com.kh.app.karte.repository.ScoreRepository;
import com.kh.app.pet.entity.PetEntity;
import com.kh.app.pet.entity.PetType;
import com.kh.app.pet.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class ScoreService {
    private final ScoreRepository scoreRepository;
    private final PetRepository petRepository;

    public ScoreAvgCominedResDto getAvg(Long petId) {
        PetEntity pet = petRepository.findById(petId)
                .orElseThrow(() -> new IllegalArgumentException("펫 없음"));;

        List<ScoreResDto> breedAvg = scoreRepository.getAvg(pet.getBreed().getId(), pet.getBreed().getPetType());
        List<ScoreResDto> petTypeAvg = scoreRepository.getAvg(null, pet.getBreed().getPetType());

        return ScoreAvgCominedResDto.builder()
                .breedAvgList(breedAvg)
                .petTypeAvgList(petTypeAvg)
                .build();
    }

    public List<ScoreHisResDto> getHistory(Long petId) {
        return scoreRepository.getHistory(petId);
    }

    public Long getOne(Long petId, ScoreCategory category) {
        return scoreRepository.getOne(petId, category);
    }
}
