package com.kh.app.karte.repository;

import com.kh.app.board.dto.response.BoardListResDto;
import com.kh.app.board.entity.QBoardEntity;
import com.kh.app.karte.dto.response.KarteListResDto;
import com.kh.app.karte.entity.QKarteEntity;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.entity.QMemberEntity;
import com.kh.app.pet.entity.QPetEntity;
import com.kh.app.petcare.entity.QDiagnosisReqEntity;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;

@RequiredArgsConstructor
public class KarteRepositoryImpl implements KarteRepositoryCustom{
    private final JPAQueryFactory queryFactory;
    private final QMemberEntity qMemberEntity = QMemberEntity.memberEntity;
    private final QDiagnosisReqEntity qDiagnosisReqEntity = QDiagnosisReqEntity.diagnosisReqEntity;
    private final QKarteEntity qKarteEntity = QKarteEntity.karteEntity;
    private final QPetEntity qPetEntity = QPetEntity.petEntity;

    @Override
    public Page<KarteListResDto> findKarteList(PageRequest pageRequest, MemberEntity member) {
        List<KarteListResDto> karteList = queryFactory
                .select(Projections.constructor(KarteListResDto.class,
                        qKarteEntity.id,
                        qPetEntity.name,
                        qMemberEntity.nickname,
                        qKarteEntity.createdAt,
                        qKarteEntity.visitedYn
                ))
                .from(qKarteEntity)
                .join(qKarteEntity.member, qMemberEntity)
                .join(qKarteEntity.diaReq, qDiagnosisReqEntity)
                .join(qDiagnosisReqEntity.petEntity, qPetEntity)
                .where(
                    eqMember(member)
                )
                .orderBy(
                    qKarteEntity.visitedYn.asc(),
                    qKarteEntity.id.desc()
                )
                .offset(pageRequest.getOffset())
                .limit(pageRequest.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(qKarteEntity.count())
                .from(qKarteEntity)
                .join(qKarteEntity.diaReq, qDiagnosisReqEntity)
                .join(qDiagnosisReqEntity.petEntity, qPetEntity)
                .where(eqMember(member))
                .fetchOne();

        return new PageImpl<>(karteList, pageRequest, total);
    }
    private BooleanExpression eqMember(MemberEntity member) {
        return member != null
                ? qPetEntity.member.eq(member)
                : null;
    }
}
