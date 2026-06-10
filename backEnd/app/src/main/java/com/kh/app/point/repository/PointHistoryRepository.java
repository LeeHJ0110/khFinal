package com.kh.app.point.repository;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.point.entity.PointHistoryEntity;
import com.kh.app.point.entity.PointReasonType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface PointHistoryRepository extends JpaRepository<PointHistoryEntity, Long> {

    Page<PointHistoryEntity> findByMemberOrderByCreatedAtDesc(
            MemberEntity member,
            Pageable pageable
    );

    boolean existsByMemberAndPointReasonType(
            MemberEntity member,
            PointReasonType pointReasonType
    );

    boolean existsByMemberAndPointReasonTypeAndCreatedAtBetween(
            MemberEntity member,
            PointReasonType pointReasonType,
            LocalDateTime startDateTime,
            LocalDateTime endDateTime
    );
}