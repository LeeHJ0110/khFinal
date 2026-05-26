package com.kh.app.member.repository;

import com.kh.app.common.entity.DelYn;
import com.kh.app.member.entity.MemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<MemberEntity, Long>, MemberRepositoryCustom {

    boolean existsByUsername(String username);
    boolean existsByNickname(String nickname);
    boolean existsBySocialId(String socialId);

    Optional<MemberEntity> findBySocialId(String socialId);

    Optional<MemberEntity> findByUsername(String username);
    Optional<MemberEntity> findByUsernameAndDelYn(String username, DelYn delYn);
}