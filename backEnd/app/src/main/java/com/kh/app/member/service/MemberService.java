package com.kh.app.member.service;

import com.kh.app.common.exception.CustomException;
import com.kh.app.delivery.service.DeliveryAddressService;
import com.kh.app.member.dto.request.MemberJoinReqDto;
import com.kh.app.member.dto.request.MemberKakaoJoinReqDto;
import com.kh.app.member.dto.request.MemberKakaoLoginReqDto;
import com.kh.app.member.dto.request.MemberUpdateReqDto;
import com.kh.app.member.dto.response.MemberKakaoLoginRespDto;
import com.kh.app.member.dto.response.MemberMyPageResDto;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.entity.MemberMarketingAgreeYn;
import com.kh.app.member.entity.MemberRole;
import com.kh.app.member.entity.MemberStatus;
import com.kh.app.member.exception.MemberErrorCode;
import com.kh.app.member.kakao.KakaoClient;
import com.kh.app.member.kakao.KakaoUserInfo;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.security.jwt.JwtUtil;
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
    private final KakaoClient kakaoClient;
    private final JwtUtil jwtUtil;
    private final DeliveryAddressService deliveryAddressService;

    @Transactional
    public void join(MemberJoinReqDto dto) {
        if (memberRepository.existsByUsername(dto.getUsername())) {
            throw new CustomException(MemberErrorCode.DUPLICATE_USERNAME);
        }

        if (memberRepository.existsByNickname(dto.getNickname())) {
            throw new CustomException(MemberErrorCode.DUPLICATE_NICKNAME);
        }

        String encodedPassword = passwordEncoder.encode(dto.getPassword());

        MemberEntity entity = dto.toEntity(encodedPassword);

        MemberEntity savedMember =
                memberRepository.save(entity);

        deliveryAddressService.createDefaultDeliveryAddress(
                savedMember
        );

        log.info("[회원가입 완료] username : {}", dto.getUsername());
    }

    @Transactional
    public void kakaoJoin(MemberKakaoJoinReqDto dto) {
        log.info(
                "[카카오 회원가입 socialId] {}",
                dto.getSocialId()
        );

        if (memberRepository.existsBySocialId(dto.getSocialId())) {
            throw new IllegalStateException("이미 가입된 카카오 회원입니다.");
        }

        if (memberRepository.existsByNickname(dto.getNickname())) {
            throw new CustomException(MemberErrorCode.DUPLICATE_NICKNAME);
        }

        MemberEntity entity = MemberEntity.builder()
                .socialId(dto.getSocialId())
                .nickname(dto.getNickname())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .addressDetail(dto.getAddressDetail())
                .memberMarketingAgreeYn(
                        MemberMarketingAgreeYn.valueOf(
                                dto.getMemberMarketingAgreeYn()
                        )
                )
                .role(MemberRole.U)
                .status(MemberStatus.A)
                .build();

        MemberEntity savedMember =
                memberRepository.save(entity);

        deliveryAddressService.createDefaultDeliveryAddress(
                savedMember
        );

        log.info("[카카오 회원가입 완료] socialId : {}", dto.getSocialId());
    }

    public boolean checkUsername(String username) {
        return !memberRepository.existsByUsername(username);
    }

    public boolean checkNickname(String nickname) {
        return !memberRepository.existsByNickname(nickname);
    }

    public MemberKakaoLoginRespDto kakaoLogin(MemberKakaoLoginReqDto dto) {
        String accessToken = kakaoClient.getAccessToken(dto.getCode());

        KakaoUserInfo kakaoUserInfo = kakaoClient.getUserInfo(accessToken);

        log.info(
                "[카카오 로그인 socialId] {}",
                kakaoUserInfo.getSocialId()
        );

        return memberRepository.findBySocialId(
                kakaoUserInfo.getSocialId()
        ).map(member -> {
            String token = jwtUtil.createJwt(
                    member.getSocialId(),
                    member.getNickname(),
                    member.getRole().name()
            );

            return MemberKakaoLoginRespDto.builder()
                    .result("LOGIN")
                    .token(token)
                    .build();
        }).orElseGet(() -> MemberKakaoLoginRespDto.builder()
                .result("NEED_JOIN")
                .socialId(kakaoUserInfo.getSocialId())
                .email(kakaoUserInfo.getEmail())
                .nickname(kakaoUserInfo.getNickname())
                .build());
    }

    public MemberMyPageResDto getMyInfo(String loginKey) {
        MemberEntity member = getLoginMember(loginKey);

        return MemberMyPageResDto.from(member);
    }

    @Transactional
    public void updateMyInfo(
            String loginKey,
            MemberUpdateReqDto request
    ) {
        MemberEntity member = getLoginMember(loginKey);

        member.updateMyInfo(
                request.getNickname(),
                request.getEmail(),
                request.getPhone(),
                request.getAddress(),
                request.getAddressDetail()
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