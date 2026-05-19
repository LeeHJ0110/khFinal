package com.kh.app.schedule.repository;

import com.kh.app.schedule.entity.ScheduleEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.query.JpaQueryMethodFactory;
import org.springframework.stereotype.Repository;
import com.querydsl.jpa.impl.JPAQueryFactory;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ScheduleRepositoryImpl implements ScheduleRepositoryCustom{


    @Override
    public Optional<ScheduleEntity> selectList(Long memberId) {
        return Optional.empty();
    }
}
