package com.kh.app.pet.service;

import com.kh.app.common.entity.DelYn;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.pet.dto.request.PetCreateReqDto;
import com.kh.app.pet.dto.response.PetMyPageResDto;
import com.kh.app.pet.entity.BreedEntity;
import com.kh.app.pet.entity.PetEntity;
import com.kh.app.pet.repository.BreedRepository;
import com.kh.app.pet.repository.PetRepository;
import jakarta.transaction.Transactional;
import lombok.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PetService {

    private final PetRepository petRepository;
    private final MemberRepository memberRepository;
    private final BreedRepository breedRepository;

    public Long create(PetCreateReqDto dto, String username) {

        MemberEntity member = memberRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("회원 정보를 찾을 수 없습니다."));

        BreedEntity breed = breedRepository.findById(dto.getBreedId())
                .orElseThrow(() -> new IllegalArgumentException("품종 정보를 찾을 수 없습니다."));

        PetEntity pet = dto.toEntity(member, breed);

        return petRepository.save(pet).getId();
    }

    public List<PetMyPageResDto> getMyPets(String username) {

        List<PetEntity> petList = petRepository
                .findAllByMember_UsernameAndDelYn(username, DelYn.N);

        return petList.stream()
                .map(PetMyPageResDto::from)
                .toList();
    }
}
