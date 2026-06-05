package com.kh.app.admin.service;

import com.kh.app.admin.dto.request.AdminMemberRoleUpdateReqDto;
import com.kh.app.admin.dto.request.AdminMemberSearchReqDto;
import com.kh.app.admin.dto.request.AdminMemberStatusUpdateReqDto;
import com.kh.app.admin.dto.response.AdminMemberDetailResDto;
import com.kh.app.admin.dto.response.AdminMemberListResDto;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminMemberService {

    private final MemberRepository memberRepository;

    public Page<AdminMemberListResDto> searchMembers(AdminMemberSearchReqDto reqDto, Pageable pageable) {
        return memberRepository.searchMembers(reqDto, pageable);
    }

    public AdminMemberDetailResDto getMemberDetail(Long memberId) {
        MemberEntity member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalStateException("회원 정보를 찾을 수 없습니다."));

        return AdminMemberDetailResDto.from(member);
    }
    @Transactional
    public void updateMemberStatus(
            Long memberId,
            AdminMemberStatusUpdateReqDto reqDto
    ) {

        MemberEntity member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalStateException("회원 정보를 찾을 수 없습니다."));

        member.changeStatus(reqDto.getStatus());
    }

    @Transactional
    public void updateMemberRole(
            Long memberId,
            AdminMemberRoleUpdateReqDto reqDto
    ) {

        MemberEntity member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalStateException("회원 정보를 찾을 수 없습니다."));

        member.changeRole(reqDto.getRole());
    }
    @Transactional
    public String cleanMemberNickname(Long memberId) {
        MemberEntity member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalStateException("회원 정보를 찾을 수 없습니다."));

        String newNickname;

        do {
            int randomNumber = ThreadLocalRandom.current().nextInt(1000, 10000);
            newNickname = "건전한닉네임" + randomNumber;
        } while (memberRepository.existsByNickname(newNickname));

        member.changeNickname(newNickname);

        return newNickname;
    }



}