package com.kh.app.pet.service;

import com.kh.app.pet.dto.response.BreedListResDto;
import com.kh.app.pet.entity.BreedEntity;
import com.kh.app.pet.repository.BreedRepository;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.pet.dto.request.PetCreateReqDto;
import com.kh.app.pet.dto.response.PetMyPageResDto;
import com.kh.app.pet.entity.PetEntity;
import com.kh.app.pet.repository.BreedRepository;
import com.kh.app.pet.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PetService {

    private final PetRepository petRepository;
    private final MemberRepository memberRepository;
    private final BreedRepository breedRepository;

    public Long create(PetCreateReqDto request, String loginKey) {

        MemberEntity member = memberRepository.findByUsername(loginKey)
                .or(() -> memberRepository.findBySocialId(loginKey))
                .orElseThrow(() ->
                        new IllegalStateException("회원 정보가 존재하지 않습니다.")
                );

        BreedEntity breed = breedRepository.findByName(request.getBreedName())
                .orElseThrow(() ->
                        new IllegalStateException("존재하지 않는 품종입니다.")
                );

        PetEntity pet = request.toEntity(member, breed);

        PetEntity savedPet = petRepository.save(pet);

        return savedPet.getId();
    }

    @Transactional(readOnly = true)
    public List<PetMyPageResDto> getMyPets(String loginKey) {

        MemberEntity member = memberRepository.findByUsername(loginKey)
                .or(() -> memberRepository.findBySocialId(loginKey))
                .orElseThrow(() ->
                        new IllegalStateException("회원 정보가 존재하지 않습니다.")
                );

        return petRepository.findAllByMember_Id(member.getId())
                .stream()
                .map(PetMyPageResDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BreedListResDto> getBreedList(String petType) {

        return breedRepository.findAllByPetType(petType)
                .stream()
                .map(BreedListResDto::from)
                .toList();
    }
}