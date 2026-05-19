package com.kh.app.schedule.repository;

import com.kh.app.schedule.entity.QScheduleEntity;
import com.kh.app.schedule.entity.ScheduleEntity;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ScheduleRepositoryImpl implements ScheduleRepositoryCustom{

    private final QScheduleEntity s = QScheduleEntity.scheduleEntity;
    private final QMemberEntity m = QMemberEntity.memberEntity;
    private final JPAQueryFactory QueryFactory;
}
