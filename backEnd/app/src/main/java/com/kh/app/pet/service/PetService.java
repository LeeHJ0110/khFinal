package com.kh.app.pet.service;

import com.kh.app.common.entity.DelYn;
import com.kh.app.pet.dto.request.PetUpdateReqDto;
import com.kh.app.pet.dto.response.BreedListResDto;
import com.kh.app.pet.entity.BreedEntity;
import com.kh.app.pet.entity.PetRepresentYn;
import com.kh.app.pet.entity.PetType;
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

        return petRepository.findAllByMember_IdAndDelYn(member.getId(), DelYn.N)
                .stream()
                .map(PetMyPageResDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BreedListResDto> getBreedList(String petType) {

        PetType type = PetType.valueOf(petType);

        return breedRepository.findAllByPetType(type)
                .stream()
                .map(BreedListResDto::from)
                .toList();
    }
    @Transactional
    public void update(Long petId, PetUpdateReqDto request, String loginKey) {

        MemberEntity member = memberRepository.findByUsername(loginKey)
                .or(() -> memberRepository.findBySocialId(loginKey))
                .orElseThrow(() ->
                        new IllegalStateException("회원 정보가 존재하지 않습니다.")
                );

        PetEntity pet = petRepository.findById(petId)
                .orElseThrow(() ->
                        new IllegalStateException("펫 정보가 존재하지 않습니다.")
                );

        if (!pet.getMember().getId().equals(member.getId())) {
            throw new IllegalStateException("본인 펫만 수정 가능합니다.");
        }

        PetType petType = PetType.valueOf(request.getPetType());

        BreedEntity breed = breedRepository
                .findByNameAndPetType(request.getBreedName(), petType)
                .orElseThrow(() ->
                        new IllegalStateException("품종 정보가 존재하지 않습니다.")
                );

        pet.update(
                breed,
                request.getName(),
                request.getGender(),
                request.getBirthDate(),
                request.getWeight(),
                request.getRepresentYn()
        );
    }

    @Transactional
    public void delete(Long petId, String loginKey) {

        MemberEntity member = memberRepository.findByUsername(loginKey)
                .or(() -> memberRepository.findBySocialId(loginKey))
                .orElseThrow(() ->
                        new IllegalStateException("회원 정보가 존재하지 않습니다.")
                );

        PetEntity pet = petRepository.findById(petId)
                .orElseThrow(() ->
                        new IllegalStateException("펫 정보가 존재하지 않습니다.")
                );

        if (!pet.getMember().getId().equals(member.getId())) {
            throw new IllegalStateException("본인 펫만 삭제 가능합니다.");
        }

        pet.delete();
    }
    @Transactional
    public void changeRepresentPet(Long petId, String loginKey) {

        MemberEntity member = memberRepository.findByUsername(loginKey)
                .or(() -> memberRepository.findBySocialId(loginKey))
                .orElseThrow(() ->
                        new IllegalStateException("회원 정보가 존재하지 않습니다.")
                );

        PetEntity targetPet = petRepository.findById(petId)
                .orElseThrow(() ->
                        new IllegalStateException("펫 정보가 존재하지 않습니다.")
                );

        if (!targetPet.getMember().getId().equals(member.getId())) {
            throw new IllegalStateException("본인 펫만 대표동물로 설정할 수 있습니다.");
        }

        List<PetEntity> petList = petRepository.findAllByMember_Id(member.getId());

        for (PetEntity pet : petList) {
            pet.changeRepresentYn(PetRepresentYn.N);
        }

        targetPet.changeRepresentYn(PetRepresentYn.Y);
    }
}