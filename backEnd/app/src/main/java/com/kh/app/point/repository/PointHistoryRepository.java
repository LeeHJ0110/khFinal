package com.kh.app.point.repository;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.point.entity.PointHistoryEntity;
import com.kh.app.point.entity.PointReasonType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

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

    boolean existsByMemberAndPointReasonTypeAndRelatedOrderId(
            MemberEntity member,
            PointReasonType pointReasonType,
            Long relatedOrderId
    );

    long countByMemberAndPointReasonType(
            MemberEntity member,
            PointReasonType pointReasonType
    );

    boolean existsByMemberAndPointReasonTypeAndCreatedAtBetween(
            MemberEntity member,
            PointReasonType pointReasonType,
            LocalDateTime start,
            LocalDateTime end
    );

    @Query("""
            select count(ph) > 0
            from PointHistoryEntity ph
            where ph.member = :member
              and ph.pointReasonType = :pointReasonType
              and ph.createdAt >= :startDateTime
              and ph.createdAt < :endDateTime
            """)
    boolean existsPointHistoryInPeriod(
            MemberEntity member,
            PointReasonType pointReasonType,
            LocalDateTime startDateTime,
            LocalDateTime endDateTime
    );
}