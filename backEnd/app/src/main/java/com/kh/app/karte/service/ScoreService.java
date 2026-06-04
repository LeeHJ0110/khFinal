package com.kh.app.karte.service;

import com.kh.app.karte.dto.request.ScoreAvgReqDto;
import com.kh.app.karte.dto.request.ScoreReqDto;
import com.kh.app.karte.dto.response.ScoreAvgCominedResDto;
import com.kh.app.karte.dto.response.ScoreHisResDto;
import com.kh.app.karte.dto.response.ScoreResDto;
import com.kh.app.karte.entity.ScoreCategory;
import com.kh.app.karte.entity.ScoreEntity;
import com.kh.app.karte.repository.ScoreRepository;
import com.kh.app.pet.entity.PetType;
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

    public ScoreAvgCominedResDto getAvg(Long breedId, PetType petType) {
        List<ScoreResDto> breedAvg = scoreRepository.getAvg(breedId, petType);
        List<ScoreResDto> petTypeAvg = scoreRepository.getAvg(null, petType);

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
