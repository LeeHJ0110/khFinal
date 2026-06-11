package com.kh.app.mypage.home.service;

import com.kh.app.common.entity.DelYn;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.message.entity.MessageReadYn;
import com.kh.app.message.repository.MessageRepository;
import com.kh.app.mypage.home.dto.response.MyPageHomeSummaryResDto;
import com.kh.app.petinsurance.entity.PetInsuranceApproveStatus;
import com.kh.app.petinsurance.repository.PetInsuranceApplicationRepository;
import com.kh.app.store.repository.StoreWishRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MyPageHomeService {

    private final MemberRepository memberRepository;
    private final StoreWishRepository storeWishRepository;
    private final MessageRepository messageRepository;
    private final PetInsuranceApplicationRepository petInsuranceApplicationRepository;

    public MyPageHomeSummaryResDto getSummary(String loginKey) {
        MemberEntity member = getLoginMember(loginKey);

        Long wishCount = storeWishRepository.countByMember_Id(
                member.getId()
        );

        Long unreadMessageCount =
                messageRepository.countByReceiver_IdAndReadYnAndDelYn(
                        member.getId(),
                        MessageReadYn.N,
                        DelYn.N
                );

        Long insuranceCount =
                petInsuranceApplicationRepository
                        .countByPet_Member_IdAndApproveStatus(
                                member.getId(),
                                PetInsuranceApproveStatus.APPROVED
                        );

        return MyPageHomeSummaryResDto.of(
                wishCount,
                member.getPoint(),
                unreadMessageCount,
                insuranceCount
        );
    }

    private MemberEntity getLoginMember(String loginKey) {
        return memberRepository.findByUsername(loginKey)
                .or(() -> memberRepository.findBySocialId(loginKey))
                .orElseThrow(() ->
                        new IllegalStateException("회원 정보가 존재하지 않습니다.")
                );
    }
}