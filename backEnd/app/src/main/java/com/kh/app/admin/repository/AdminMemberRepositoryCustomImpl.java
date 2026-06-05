package com.kh.app.admin.repository;

import com.kh.app.admin.dto.request.AdminMemberSearchReqDto;
import com.kh.app.admin.dto.response.AdminMemberListResDto;
import com.kh.app.member.entity.MemberMarketingAgreeYn;
import com.kh.app.member.entity.MemberRole;
import com.kh.app.member.entity.QMemberEntity;
import com.kh.app.pet.entity.PetType;
import com.kh.app.pet.entity.QPetEntity;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class AdminMemberRepositoryCustomImpl implements AdminMemberRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<AdminMemberListResDto> searchMembers(
            AdminMemberSearchReqDto reqDto,
            Pageable pageable
    ) {
        QMemberEntity member = QMemberEntity.memberEntity;
        QPetEntity pet = QPetEntity.petEntity;
        QPetEntity dogPet = new QPetEntity("dogPet");
        QPetEntity catPet = new QPetEntity("catPet");

        BooleanBuilder builder = createSearchBuilder(reqDto, member, pet);

        List<AdminMemberListResDto> content = queryFactory
                .select(Projections.constructor(
                        AdminMemberListResDto.class,
                        member.id,
                        member.username,
                        member.nickname,
                        member.email,
                        member.phone,
                        dogPet.id.max().isNotNull(),
                        catPet.id.max().isNotNull(),
                        member.memberMarketingAgreeYn.stringValue(),
                        member.status.stringValue(),
                        member.role.stringValue(),
                        member.createdAt
                ))
                .from(member)
                .leftJoin(pet).on(pet.member.eq(member))
                .leftJoin(dogPet).on(
                        dogPet.member.eq(member)
                                .and(dogPet.breed.petType.eq(PetType.D))
                )
                .leftJoin(catPet).on(
                        catPet.member.eq(member)
                                .and(catPet.breed.petType.eq(PetType.C))
                )
                .where(builder)
                .groupBy(
                        member.id,
                        member.username,
                        member.nickname,
                        member.email,
                        member.phone,
                        member.memberMarketingAgreeYn,
                        member.status,
                        member.role,
                        member.createdAt
                )
                .orderBy(member.id.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(member.id.countDistinct())
                .from(member)
                .leftJoin(pet).on(pet.member.eq(member))
                .where(builder)
                .fetchOne();

        return new PageImpl<>(content, pageable, total == null ? 0 : total);
    }

    @Override
    public List<Long> findMemberIdsForMessage(
            AdminMemberSearchReqDto reqDto
    ) {
        QMemberEntity member = QMemberEntity.memberEntity;
        QPetEntity pet = QPetEntity.petEntity;

        BooleanBuilder builder = createSearchBuilder(reqDto, member, pet);

        return queryFactory
                .select(member.id)
                .from(member)
                .leftJoin(pet).on(pet.member.eq(member))
                .where(builder)
                .distinct()
                .fetch();
    }

    private BooleanBuilder createSearchBuilder(
            AdminMemberSearchReqDto reqDto,
            QMemberEntity member,
            QPetEntity pet
    ) {
        BooleanBuilder builder = new BooleanBuilder();

        if (StringUtils.hasText(reqDto.getKeyword())) {
            String keyword = reqDto.getKeyword();
            String searchType = reqDto.getSearchType();

            if ("username".equals(searchType)) {
                builder.and(member.username.containsIgnoreCase(keyword));
            } else if ("nickname".equals(searchType)) {
                builder.and(member.nickname.containsIgnoreCase(keyword));
            } else if ("email".equals(searchType)) {
                builder.and(member.email.containsIgnoreCase(keyword));
            } else if ("phone".equals(searchType)) {
                builder.and(member.phone.containsIgnoreCase(keyword));
            } else {
                builder.and(
                        member.username.containsIgnoreCase(keyword)
                                .or(member.nickname.containsIgnoreCase(keyword))
                                .or(member.email.containsIgnoreCase(keyword))
                                .or(member.phone.containsIgnoreCase(keyword))
                );
            }
        }

        if (reqDto.getPetType() != null) {
            builder.and(pet.breed.petType.eq(reqDto.getPetType()));
        }

        if (StringUtils.hasText(reqDto.getMarketingAgreeYn())) {
            builder.and(member.memberMarketingAgreeYn.eq(MemberMarketingAgreeYn.Y));
        }

        if (reqDto.getStatus() != null) {
            builder.and(member.status.eq(reqDto.getStatus()));
        }

        if (Boolean.TRUE.equals(reqDto.getAdminOnly())) {
            builder.and(member.role.in(
                    MemberRole.A,
                    MemberRole.D,
                    MemberRole.S,
                    MemberRole.B
            ));
        }

        if (reqDto.getRole() != null) {
            builder.and(member.role.eq(reqDto.getRole()));
        }

        return builder;
    }
}