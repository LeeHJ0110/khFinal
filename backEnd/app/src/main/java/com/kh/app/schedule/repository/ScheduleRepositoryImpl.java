package com.kh.app.schedule.repository;

import com.kh.app.member.entity.QMemberEntity;
import com.kh.app.schedule.dto.response.EventResDto;
import com.kh.app.schedule.entity.QScheduleEntity;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.util.List;


@RequiredArgsConstructor
public class ScheduleRepositoryImpl implements ScheduleRepositoryCustom{
    private final QScheduleEntity s = QScheduleEntity.scheduleEntity;
    private final QMemberEntity m = QMemberEntity.memberEntity;
    private final JPAQueryFactory queryFactory;


    @Override
    public List<EventResDto> findTodaySchedule(String username) {
        LocalDate today = LocalDate.now();

        // 쿼리 결과에서 바로 DTO로 프로젝션하여 조회
        return queryFactory
                .select(Projections.fields(EventResDto.class,
                        s.id,
                        s.title,
                        s.content,
                        s.at,
                        s.startDate,
                        s.endDate,
                        s.color.as("backgroundColor") // 엔티티의 color 필드를 DTO의 backgroundColor 필드명과 매핑
                ))
                .from(s)
                .join(s.member, m) // Schedule과 Member 연관관계 조인
                .where(
                        m.username.eq(username),          // 1. 해당 유저의 일정인지 확인
                        s.startDate.loe(today),          // 2. 시작일이 오늘보다 작거나 같은지 (StartDate <= Today)
                        s.endDate.goe(today)             // 3. 종료일이 오늘보다 크거나 같은지 (EndDate >= Today)
                )
                .orderBy(s.at.asc()) // 시간 순 정렬 (선택 사항)
                .fetch();
    }

}
