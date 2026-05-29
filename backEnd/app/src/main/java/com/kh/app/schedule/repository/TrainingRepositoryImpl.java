package com.kh.app.schedule.repository;

import com.kh.app.member.entity.QMemberEntity;
import com.kh.app.schedule.entity.QScheduleEntity;
import com.kh.app.schedule.entity.QTrainingDiaryEntity;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@RequiredArgsConstructor
public class TrainingRepositoryImpl implements TrainingRepositoryCustom{
    private final QTrainingDiaryEntity t = QTrainingDiaryEntity.trainingDiaryEntity;
    private final JPAQueryFactory QueryFactory;

    @Override
    public boolean existsByDate(LocalDateTime start, LocalDateTime end) {

        Integer result = QueryFactory
                .selectOne()
                .from(t)
                .where(
                        t.createdAt.goe(start),
                        t.createdAt.lt(end)
                )
                .fetchFirst();

        return result != null;
    }
}
