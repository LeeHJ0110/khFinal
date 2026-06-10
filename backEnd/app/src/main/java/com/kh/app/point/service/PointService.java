package com.kh.app.point.service;

import com.kh.app.common.exception.CustomException;
import com.kh.app.common.exception.PointErrorCode;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.point.dto.response.PointHistoryResDto;
import com.kh.app.point.entity.PointHistoryEntity;
import com.kh.app.point.entity.PointHistoryType;
import com.kh.app.point.entity.PointReasonType;
import com.kh.app.point.repository.PointHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.kh.app.point.dto.response.PointAttendanceResDto;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Service
@RequiredArgsConstructor
@Transactional
public class PointService {

    private final PointHistoryRepository pointHistoryRepository;
    private final MemberRepository memberRepository;

    private static final ZoneId KOREA_ZONE = ZoneId.of("Asia/Seoul");


    // 일일 출석체크 (1일 1회 +100P)
    private static final long DAILY_ATTENDANCE_POINT = 100L;

    // 주간 훈련일기 작성 (1주 1회 +500P)
    private static final long WEEKLY_TRAINING_DIARY_POINT = 500L;

    // 주간 커뮤니티 글 작성 (1주 1회 +500P)
    private static final long WEEKLY_COMMUNITY_POST_POINT = 500L;

    // 상품리뷰 작성 (상품 리뷰당 +500P)
    private static final long REVIEW_WRITE_POINT = 500L;

    // 회원가입 감사 이벤트 포인트 지급 (최초 1회 +2000P)
    private static final long EVENT_JOIN_POINT = 2000L;

    // 건강검진 서비스 이용 포인트 차감 (-2000P)
    private static final long HEALTHCARE_USE_POINT = 2000L;

    /**
     * 사용자 : 내 현재 포인트 조회
     */
    @Transactional(readOnly = true)
    public Long getMyPoint(String username) {
        MemberEntity member = getMemberByUsername(username);

        return member.getPoint();
    }

    /**
     * 사용자 : 내 포인트 내역 조회
     */
    @Transactional(readOnly = true)
    public Page<PointHistoryResDto> getMyPointHistory(String username, int page) {
        MemberEntity member = getMemberByUsername(username);

        PageRequest pageRequest = PageRequest.of(page, 10);

        return pointHistoryRepository.findByMemberOrderByCreatedAtDesc(member, pageRequest)
                .map(PointHistoryResDto::from);
    }

    /**
     * 사용자 : 일일 출석체크 포인트 적립
     */
    public PointAttendanceResDto earnDailyAttendancePoint(String username) {
        MemberEntity member = getMemberByUsername(username);

        earnDailyAttendancePoint(member);

        return PointAttendanceResDto.builder()
                .message("일일 출석체크 포인트가 지급되었습니다.")
                .currentPoint(member.getPoint())
                .build();
    }

    /**
     * 내부 공통 적립 메서드
     */
    public void earnPoint(
            MemberEntity member,
            Long amount,
            PointReasonType reasonType,
            String memo
    ) {
        earnPoint(member, amount, reasonType, memo, null);
    }

    /**
     * 내부 공통 적립 메서드 - 주문번호 연결 가능
     */
    public void earnPoint(
            MemberEntity member,
            Long amount,
            PointReasonType reasonType,
            String memo,
            Long relatedOrderId
    ) {
        member.earnPoint(amount);

        PointHistoryEntity history = PointHistoryEntity.builder()
                .member(member)
                .pointHistoryType(PointHistoryType.EARN)
                .pointReasonType(reasonType)
                .pointAmount(amount)
                .pointBalanceAfter(member.getPoint())
                .relatedOrderId(relatedOrderId)
                .pointHistoryMemo(memo)
                .build();

        pointHistoryRepository.save(history);
    }

    /**
     * 내부 공통 사용 메서드
     */
    public void usePoint(
            MemberEntity member,
            Long amount,
            PointReasonType reasonType,
            String memo
    ) {
        usePoint(member, amount, reasonType, memo, null);
    }

    /**
     * 내부 공통 사용 메서드 - 주문번호 연결 가능
     */
    public void usePoint(
            MemberEntity member,
            Long amount,
            PointReasonType reasonType,
            String memo,
            Long relatedOrderId
    ) {
        member.usePoint(amount);

        PointHistoryEntity history = PointHistoryEntity.builder()
                .member(member)
                .pointHistoryType(PointHistoryType.USE)
                .pointReasonType(reasonType)
                .pointAmount(-amount)
                .pointBalanceAfter(member.getPoint())
                .relatedOrderId(relatedOrderId)
                .pointHistoryMemo(memo)
                .build();

        pointHistoryRepository.save(history);
    }

    /**
     * 일일 출석체크 포인트 적립
     * 매일 00:00 기준 초기화
     */
    public void earnDailyAttendancePoint(MemberEntity member) {
        LocalDate today = LocalDate.now(KOREA_ZONE);

        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        boolean alreadyEarned = pointHistoryRepository.existsPointHistoryInPeriod(
                member,
                PointReasonType.DAILY_ATTENDANCE,
                start,
                end
        );

        if (alreadyEarned) {
            throw new CustomException(PointErrorCode.ALREADY_DAILY_ATTENDANCE);
        }

        earnPoint(
                member,
                DAILY_ATTENDANCE_POINT,
                PointReasonType.DAILY_ATTENDANCE,
                "일일 출석체크 포인트 지급"
        );
    }

    /**
     * 주간 훈련일기 작성 포인트 적립
     * 매주 월요일 00:00 기준 초기화
     */
    public void earnWeeklyTrainingDiaryPoint(MemberEntity member) {
        LocalDate today = LocalDate.now(KOREA_ZONE);

        LocalDate monday = today.with(DayOfWeek.MONDAY);
        LocalDate nextMonday = monday.plusWeeks(1);

        LocalDateTime start = monday.atStartOfDay();
        LocalDateTime end = nextMonday.atStartOfDay();

        boolean alreadyEarned = pointHistoryRepository.existsPointHistoryInPeriod(
                member,
                PointReasonType.WEEKLY_TRAINING_DIARY,
                start,
                end
        );

        if (alreadyEarned) {
            throw new CustomException(PointErrorCode.ALREADY_WEEKLY_TRAINING_DIARY);
        }

        earnPoint(
                member,
                WEEKLY_TRAINING_DIARY_POINT,
                PointReasonType.WEEKLY_TRAINING_DIARY,
                "주간 훈련일기 작성 포인트 지급"
        );
    }

    /**
     * 주간 커뮤니티 게시글 작성 포인트 적립
     * 매주 월요일 00:00 기준 초기화
     */
    public void earnWeeklyCommunityPostPoint(MemberEntity member) {
        LocalDate today = LocalDate.now(KOREA_ZONE);

        LocalDate monday = today.with(DayOfWeek.MONDAY);
        LocalDate nextMonday = monday.plusWeeks(1);

        LocalDateTime start = monday.atStartOfDay();
        LocalDateTime end = nextMonday.atStartOfDay();

        boolean alreadyEarned = pointHistoryRepository.existsPointHistoryInPeriod(
                member,
                PointReasonType.WEEKLY_COMMUNITY_POST,
                start,
                end
        );

        if (alreadyEarned) {
            throw new CustomException(PointErrorCode.ALREADY_WEEKLY_COMMUNITY_POST);
        }

        earnPoint(
                member,
                WEEKLY_COMMUNITY_POST_POINT,
                PointReasonType.WEEKLY_COMMUNITY_POST,
                "주간 게시글 작성 포인트 지급"
        );
    }

    /**
     * 상품 리뷰 작성 포인트 적립
     * 리뷰 자체가 구매상품당 1회 작성 제한이면 여기서는 그대로 지급
     */
    public void earnReviewWritePoint(MemberEntity member) {
        earnPoint(
                member,
                REVIEW_WRITE_POINT,
                PointReasonType.REVIEW_WRITE,
                "상품 리뷰 작성 포인트 지급"
        );
    }

    /**
     * 이벤트 참여 포인트 적립
     * 최초 1회 제한
     */
    public void earnEventJoinPoint(MemberEntity member) {
        boolean alreadyEarned = pointHistoryRepository.existsByMemberAndPointReasonType(
                member,
                PointReasonType.EVENT_JOIN
        );

        if (alreadyEarned) {
            throw new CustomException(PointErrorCode.ALREADY_EVENT_JOIN);
        }

        earnPoint(
                member,
                EVENT_JOIN_POINT,
                PointReasonType.EVENT_JOIN,
                "이벤트 참여 포인트 지급"
        );
    }

    /**
     * 건강관리 서비스 이용 포인트 차감
     * 2000P 필요
     */
    public void useHealthcarePoint(MemberEntity member, String serviceName) {
        String memo = serviceName + " 서비스 이용";

        usePoint(
                member,
                HEALTHCARE_USE_POINT,
                PointReasonType.HEALTHCARE_USE,
                memo
        );
    }

    /**
     * 주문 시 포인트 사용
     */
    public void useOrderPoint(MemberEntity member, Long usedPoint, Long orderId) {
        if (usedPoint == null || usedPoint <= 0) {
            return;
        }

        usePoint(
                member,
                usedPoint,
                PointReasonType.ORDER_USE,
                orderId + "번 주문 포인트 사용",
                orderId
        );
    }

    /**
     * 주문 취소 시 사용 포인트 환불
     */
    public void refundOrderUsedPoint(MemberEntity member, Long usedPoint, Long orderId) {
        if (usedPoint == null || usedPoint <= 0) {
            return;
        }

        earnPoint(
                member,
                usedPoint,
                PointReasonType.ORDER_CANCEL_REFUND,
                orderId + "번 주문 취소 포인트 환불",
                orderId
        );
    }

    /**
     * 로그인 username으로 회원 조회
     */
    private MemberEntity getMemberByUsername(String username) {
        if (username == null || username.isBlank() || "anonymousUser".equals(username)) {
            throw new CustomException(PointErrorCode.LOGIN_REQUIRED);
        }

        return memberRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(PointErrorCode.MEMBER_NOT_FOUND));
    }

    /**
     * 주간 훈련일기 작성 포인트 적립 시도
     * 이미 이번 주에 받았으면 예외 없이 지급하지 않음
     *
     * return true  = 포인트 지급됨
     * return false = 이미 지급받아서 이번에는 미지급
     */
    public boolean tryEarnWeeklyTrainingDiaryPoint(MemberEntity member) {
        LocalDate today = LocalDate.now(KOREA_ZONE);

        LocalDate monday = today.with(DayOfWeek.MONDAY);
        LocalDate nextMonday = monday.plusWeeks(1);

        LocalDateTime start = monday.atStartOfDay();
        LocalDateTime end = nextMonday.atStartOfDay();

        boolean alreadyEarned = pointHistoryRepository.existsPointHistoryInPeriod(
                member,
                PointReasonType.WEEKLY_TRAINING_DIARY,
                start,
                end
        );

        if (alreadyEarned) {
            return false;
        }

        earnPoint(
                member,
                WEEKLY_TRAINING_DIARY_POINT,
                PointReasonType.WEEKLY_TRAINING_DIARY,
                "주간 훈련일기 작성 포인트 지급"
        );

        return true;
    }

    /**
     * 주간 커뮤니티 게시글 작성 포인트 적립 시도
     * 자유게시판 / 상품후기게시판 / 시설후기게시판 통합 주 1회
     *
     * return true  = 포인트 지급됨
     * return false = 이미 지급받아서 이번에는 미지급
     */
    public boolean tryEarnWeeklyCommunityPostPoint(MemberEntity member) {
        LocalDate today = LocalDate.now(KOREA_ZONE);

        LocalDate monday = today.with(DayOfWeek.MONDAY);
        LocalDate nextMonday = monday.plusWeeks(1);

        LocalDateTime start = monday.atStartOfDay();
        LocalDateTime end = nextMonday.atStartOfDay();

        boolean alreadyEarned = pointHistoryRepository.existsPointHistoryInPeriod(
                member,
                PointReasonType.WEEKLY_COMMUNITY_POST,
                start,
                end
        );

        if (alreadyEarned) {
            return false;
        }

        earnPoint(
                member,
                WEEKLY_COMMUNITY_POST_POINT,
                PointReasonType.WEEKLY_COMMUNITY_POST,
                "주간 게시글 작성 포인트 지급"
        );

        return true;
    }

}