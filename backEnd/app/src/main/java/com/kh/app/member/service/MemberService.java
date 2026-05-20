package com.kh.app.member.service;

import com.kh.app.common.exception.CustomException;
import com.kh.app.member.dto.request.MemberJoinReqDto;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.exception.MemberErrorCode;
import com.kh.app.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void join(MemberJoinReqDto dto) {
        if (memberRepository.existsByMemberUsername(dto.getMemberUsername())) {
            throw new CustomException(MemberErrorCode.DUPLICATE_USERNAME);
        }

        if (memberRepository.existsByMemberNickname(dto.getMemberNickname())) {
            throw new CustomException(MemberErrorCode.DUPLICATE_NICKNAME);
        }

        String encodedPassword = passwordEncoder.encode(dto.getMemberPassword());
        MemberEntity entity = dto.toEntity(encodedPassword);
        memberRepository.save(entity);
        log.info("[회원가입 완료] username : {}", dto.getMemberUsername());
    }

}