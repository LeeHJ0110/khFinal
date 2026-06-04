package com.kh.app.karte.repository;

import com.kh.app.karte.dto.request.ScoreAvgReqDto;
import com.kh.app.karte.dto.request.ScoreReqDto;
import com.kh.app.karte.dto.response.ScoreHisResDto;
import com.kh.app.karte.dto.response.ScoreResDto;
import com.kh.app.karte.entity.ScoreCategory;
import com.kh.app.karte.entity.ScoreEntity;
import com.kh.app.pet.entity.PetType;

import java.util.List;

public interface ScoreRepositoryCustom {

    List<ScoreHisResDto> getHistory(Long petId);

    Long getOne(Long petId, ScoreCategory category);

    List<ScoreResDto> getAvg(Long breenId, PetType petType);
}
