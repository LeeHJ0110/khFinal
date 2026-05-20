package com.kh.app.schedule.repository;

import com.kh.app.schedule.entity.QScheduleEntity;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;


@RequiredArgsConstructor
public class ScheduleRepositoryImpl implements ScheduleRepositoryCustom{

    private final QScheduleEntity s = QScheduleEntity.scheduleEntity;
    private final QMemberEntity m = QMemberEntity.memberEntity;
    private final JPAQueryFactory QueryFactory;
}
