package com.kh.app.member.repository;

import com.kh.app.common.entity.DelYn;
import com.kh.app.member.entity.MemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<MemberEntity, Long>, MemberRepositoryCustom {

    boolean existsByMemberUsername(String memberUsername);
    boolean existsByMemberNickname(String memberNickname);

    Optional<MemberEntity> findByMemberUsername(String memberUsername);
    Optional<MemberEntity> findByUsernameAndDelYn(String memberUsername, String delYn);
}