package com.kh.app.mypage.point.service;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.mypage.point.dto.response.PointHistoryListResDto;
import com.kh.app.mypage.point.dto.response.PointSummaryResDto;
import com.kh.app.point.entity.PointHistoryEntity;
import com.kh.app.point.entity.PointReasonType;
import com.kh.app.point.repository.PointHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MyPagePointService {

    private final MemberRepository memberRepository;
    private final PointHistoryRepository pointHistoryRepository;

    public PointSummaryResDto getPointSummary(String loginKey) {
        MemberEntity member = getLoginMember(loginKey);

        LocalDate today = LocalDate.now();

        LocalDateTime todayStart = today.atStartOfDay();
        LocalDateTime tomorrowStart = today.plusDays(1).atStartOfDay();

        LocalDate monday = today.with(DayOfWeek.MONDAY);
        LocalDateTime weekStart = monday.atStartOfDay();
        LocalDateTime nextWeekStart = monday.plusWeeks(1).atStartOfDay();

        boolean attendanceCompleted =
                pointHistoryRepository.existsByMemberAndPointReasonTypeAndCreatedAtBetween(
                        member,
                        PointReasonType.DAILY_ATTENDANCE,
                        todayStart,
                        tomorrowStart
                );

        boolean trainingDiaryCompleted =
                pointHistoryRepository.existsByMemberAndPointReasonTypeAndCreatedAtBetween(
                        member,
                        PointReasonType.WEEKLY_TRAINING_DIARY,
                        weekStart,
                        nextWeekStart
                );

        boolean communityPostCompleted =
                pointHistoryRepository.existsByMemberAndPointReasonTypeAndCreatedAtBetween(
                        member,
                        PointReasonType.WEEKLY_COMMUNITY_POST,
                        weekStart,
                        nextWeekStart
                );

        long reviewWriteCount =
                pointHistoryRepository.countByMemberAndPointReasonType(
                        member,
                        PointReasonType.REVIEW_WRITE
                );

        long eventJoinCount =
                pointHistoryRepository.countByMemberAndPointReasonType(
                        member,
                        PointReasonType.EVENT_JOIN
                );

        return PointSummaryResDto.builder()
                .currentPoint(member.getPoint())
                .attendanceCompleted(attendanceCompleted)
                .trainingDiaryCompleted(trainingDiaryCompleted)
                .communityPostCompleted(communityPostCompleted)
                .reviewWriteCount(reviewWriteCount)
                .eventJoinCount(eventJoinCount)
                .build();
    }

    public Page<PointHistoryListResDto> getPointHistory(
            String loginKey,
            Pageable pageable
    ) {
        MemberEntity member = getLoginMember(loginKey);

        Page<PointHistoryEntity> page =
                pointHistoryRepository.findByMemberOrderByCreatedAtDesc(
                        member,
                        pageable
                );

        return page.map(PointHistoryListResDto::from);
    }

    private MemberEntity getLoginMember(String loginKey) {
        return memberRepository.findByUsername(loginKey)
                .or(() -> memberRepository.findBySocialId(loginKey))
                .orElseThrow(() ->
                        new IllegalStateException("회원 정보가 존재하지 않습니다.")
                );
    }
}