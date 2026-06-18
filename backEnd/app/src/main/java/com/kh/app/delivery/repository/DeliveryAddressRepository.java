package com.kh.app.delivery.repository;

import com.kh.app.common.entity.DelYn;
import com.kh.app.delivery.entity.DeliveryAddressEntity;
import com.kh.app.delivery.entity.DeliveryDefaultYn;
import com.kh.app.member.entity.MemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DeliveryAddressRepository extends JpaRepository<DeliveryAddressEntity, Long> {

    // 로그인 회원의 배송지 목록
    List<DeliveryAddressEntity> findAllByMemberOrderByDefaultYnDescCreatedAtDesc(
            MemberEntity member
    );

    // 로그인 회원의 특정 배송지
    Optional<DeliveryAddressEntity> findByIdAndMember(
            Long id,
            MemberEntity member
    );

    // 대표 배송지 조회
    Optional<DeliveryAddressEntity> findByMemberAndDefaultYn(
            MemberEntity member,
            DeliveryDefaultYn defaultYn
    );

    // 회원의 배송지 개수 확인
    long countByMemberAndDelYn(MemberEntity member, DelYn delYn);
}