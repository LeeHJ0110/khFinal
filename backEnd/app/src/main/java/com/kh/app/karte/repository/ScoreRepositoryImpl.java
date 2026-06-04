package com.kh.app.karte.repository;

import com.kh.app.karte.dto.request.ScoreAvgReqDto;
import com.kh.app.karte.dto.response.ScoreHisResDto;
import com.kh.app.karte.dto.response.ScoreResDto;
import com.kh.app.karte.entity.QKarteEntity;
import com.kh.app.karte.entity.QScoreEntity;
import com.kh.app.karte.entity.ScoreCategory;
import com.kh.app.karte.entity.ScoreEntity;
import com.kh.app.pet.entity.PetType;
import com.kh.app.pet.entity.QBreedEntity;
import com.kh.app.pet.entity.QPetEntity;
import com.kh.app.petcare.entity.QDiagnosisReqEntity;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.MathExpressions;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

@RequiredArgsConstructor
public class ScoreRepositoryImpl implements ScoreRepositoryCustom{

    private final JPAQueryFactory queryFactory;

    QPetEntity pet = QPetEntity.petEntity;
    QBreedEntity breed = QBreedEntity.breedEntity;
    QKarteEntity karte = QKarteEntity.karteEntity;
    QDiagnosisReqEntity diaReq = QDiagnosisReqEntity.diagnosisReqEntity;
    QScoreEntity score = QScoreEntity.scoreEntity;

    @Override
    public Long getOne(Long petId, ScoreCategory category) {
        Long latestScore = queryFactory
                .select(score.score)
                .from(score)
                .join(score.karte, karte)
                .join(karte.diaReq, diaReq)
                .where(
                        diaReq.petEntity.id.eq(petId), // 펫 ID 조건
                        score.category.eq(category)    // 요청된 카테고리 조건
                )
                .orderBy(karte.id.desc()) // 가장 최근에 생성된 카르테 기준 정렬
                .fetchFirst(); // limit(1).fetchOne()과 동일하게 가장 최신 1건만 가져옴

        // 2. 조회된 결과가 없으면(null) 0L을 반환하도록 예외 처리
        return latestScore != null ? latestScore : 0L;
    }

    @Override
    public List<ScoreHisResDto> getHistory(Long petId) {
        return queryFactory
                .select(Projections.fields(ScoreHisResDto.class,
                        score.score.as("score"),
                        Expressions.dateTemplate(LocalDate.class, "DATE({0})", karte.createdAt).as("createdAt")
                ))
                .from(score)
                .join(score.karte, karte)
                .join(karte.diaReq, diaReq)
                .where(
                        diaReq.petEntity.id.eq(petId),
                        score.category.eq(ScoreCategory.TOTAL)
                )
                .orderBy(karte.id.desc())
                .limit(8)
                .fetch();
    }

    @Override
    public List<ScoreResDto> getAvg(Long breenId, PetType petType) {

        // 1. 조건(BreedId 또는 PetType)에 맞는 대상 펫 ID 목록 조회
        List<Long> targetPetIds = queryFactory
                .select(pet.id)
                .from(pet)
                .leftJoin(pet.breed, breed)
                .where(eqBreedOrPetType(breenId, petType))
                .fetch();

        if (targetPetIds.isEmpty()) {
            return Collections.emptyList();
        }

        // 서브쿼리 내부 충돌 방지용 Q클래스 별칭 생성
        QKarteEntity subKarte = new QKarteEntity("subKarte");
        QDiagnosisReqEntity subDiaReq = new QDiagnosisReqEntity("subDiaReq");

        // 2. 각 펫들의 "가장 최신 Karte ID" 목록 조회
        List<Long> latestKarteIds = queryFactory
                .select(karte.id)
                .from(karte)
                .join(karte.diaReq, diaReq)
                .where(
                        diaReq.petEntity.id.in(targetPetIds),
                        karte.id.eq(
                                JPAExpressions
                                        .select(subKarte.id.max())
                                        .from(subKarte)
                                        .join(subKarte.diaReq, subDiaReq)
                                        .where(subDiaReq.petEntity.id.eq(diaReq.petEntity.id))
                        )
                )
                .fetch();

        if (latestKarteIds.isEmpty()) {
            return Collections.emptyList();
        }

        // 3. 추출된 최신 Karte들을 대상으로 카테고리별 그룹(groupBy)을 지어 평균 점수 계산 후 DTO 바인딩
        // MathExpressions.round()를 통해 DB 단에서 평균값을 반올림 처리하여 Long 타입 필드에 바로 매핑합니다.
        return queryFactory
                .select(Projections.fields(ScoreResDto.class,
                        score.category.as("category"),
                        MathExpressions.round(score.score.avg()).longValue().as("score")
                ))
                .from(score)
                .where(score.karte.id.in(latestKarteIds))
                .groupBy(score.category)
                .fetch();
    }

    private BooleanExpression eqBreedOrPetType(Long breedId, PetType petType) {
        QPetEntity pet = QPetEntity.petEntity;

        if (breedId != null) {
            return pet.breed.id.eq(breedId);
        }
        if (petType != null) {
            return pet.breed.petType.eq(petType);
        }
        return null;
    }

}
