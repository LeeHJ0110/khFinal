package com.kh.app.delivery.service;

import com.kh.app.delivery.dto.request.DeliveryAddressCreateReqDto;
import com.kh.app.delivery.dto.request.DeliveryAddressUpdateReqDto;
import com.kh.app.delivery.dto.response.DeliveryAddressListResDto;
import com.kh.app.delivery.entity.DeliveryAddressEntity;
import com.kh.app.delivery.entity.DeliveryDefaultYn;
import com.kh.app.delivery.repository.DeliveryAddressRepository;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DeliveryAddressService {

    private final DeliveryAddressRepository deliveryAddressRepository;
    private final MemberRepository memberRepository;

    // 배송지 목록 조회
    @Transactional(readOnly = true)
    public List<DeliveryAddressListResDto> getMyDeliveryAddressList(
            String loginKey
    ) {
        MemberEntity member = getLoginMember(loginKey);

        return deliveryAddressRepository
                .findAllByMemberOrderByDefaultYnDescCreatedAtDesc(member)
                .stream()
                .map(DeliveryAddressListResDto::from)
                .toList();
    }

    // 배송지 추가
    public Long create(
            String loginKey,
            DeliveryAddressCreateReqDto request
    ) {
        MemberEntity member = getLoginMember(loginKey);

        long count = deliveryAddressRepository.countByMember(member);

        DeliveryAddressEntity deliveryAddress =
                DeliveryAddressEntity.builder()
                        .member(member)
                        .name(request.getName())
                        .receiverName(request.getReceiverName())
                        .phone(request.getPhone())
                        .zipCode(request.getZipCode())
                        .address(request.getAddress())
                        .addressDetail(request.getAddressDetail())
                        .defaultYn(
                                count == 0
                                        ? DeliveryDefaultYn.Y
                                        : DeliveryDefaultYn.N
                        )
                        .build();

        DeliveryAddressEntity saved =
                deliveryAddressRepository.save(deliveryAddress);

        return saved.getId();
    }

    // 배송지 수정
    public void update(
            String loginKey,
            Long deliveryAddressId,
            DeliveryAddressUpdateReqDto request
    ) {
        MemberEntity member = getLoginMember(loginKey);

        DeliveryAddressEntity deliveryAddress =
                getMyDeliveryAddress(deliveryAddressId, member);

        deliveryAddress.update(
                request.getName(),
                request.getReceiverName(),
                request.getPhone(),
                request.getZipCode(),
                request.getAddress(),
                request.getAddressDetail()
        );
    }

    // 배송지 삭제
    public void delete(
            String loginKey,
            Long deliveryAddressId
    ) {
        MemberEntity member = getLoginMember(loginKey);

        DeliveryAddressEntity deliveryAddress =
                getMyDeliveryAddress(deliveryAddressId, member);

        boolean wasDefault =
                deliveryAddress.getDefaultYn() == DeliveryDefaultYn.Y;

        deliveryAddressRepository.delete(deliveryAddress);

        // 대표 배송지를 삭제했다면 남은 배송지 중 첫 번째를 대표로 변경
        if (wasDefault) {
            deliveryAddressRepository
                    .findAllByMemberOrderByDefaultYnDescCreatedAtDesc(member)
                    .stream()
                    .findFirst()
                    .ifPresent(address ->
                            address.changeDefaultYn(DeliveryDefaultYn.Y)
                    );
        }
    }

    // 대표 배송지 변경
    public void changeDefault(
            String loginKey,
            Long deliveryAddressId
    ) {
        MemberEntity member = getLoginMember(loginKey);

        DeliveryAddressEntity target =
                getMyDeliveryAddress(deliveryAddressId, member);

        List<DeliveryAddressEntity> list =
                deliveryAddressRepository
                        .findAllByMemberOrderByDefaultYnDescCreatedAtDesc(member);

        for (DeliveryAddressEntity address : list) {
            address.changeDefaultYn(DeliveryDefaultYn.N);
        }

        target.changeDefaultYn(DeliveryDefaultYn.Y);
    }

    // 회원가입 시 기본 배송지 생성
    public void createDefaultDeliveryAddress(
            MemberEntity member,
            String zipCode
    ) {
        if (member.getAddress() == null || member.getAddress().isBlank()) {
            return;
        }

        DeliveryAddressEntity deliveryAddress =
                DeliveryAddressEntity.builder()
                        .member(member)
                        .name("집")
                        .receiverName(member.getNickname())
                        .phone(member.getPhone())
                        .zipCode(zipCode)
                        .address(member.getAddress())
                        .addressDetail(member.getAddressDetail())
                        .defaultYn(DeliveryDefaultYn.Y)
                        .build();

        deliveryAddressRepository.save(deliveryAddress);
    }

    private MemberEntity getLoginMember(String loginKey) {
        return memberRepository.findByUsername(loginKey)
                .or(() -> memberRepository.findBySocialId(loginKey))
                .orElseThrow(() ->
                        new IllegalStateException("회원 정보가 존재하지 않습니다.")
                );
    }

    private DeliveryAddressEntity getMyDeliveryAddress(
            Long deliveryAddressId,
            MemberEntity member
    ) {
        return deliveryAddressRepository
                .findByIdAndMember(deliveryAddressId, member)
                .orElseThrow(() ->
                        new IllegalStateException("배송지 정보가 존재하지 않습니다.")
                );
    }
}