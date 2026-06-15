package com.kh.app.store.repository;

import com.kh.app.store.dto.response.StoreProductAdminListResDto;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import static com.kh.app.store.entity.QStoreProductEntity.storeProductEntity;
import static com.kh.app.store.entity.QStoreProductImageEntity.storeProductImageEntity;
import static com.kh.app.store.entity.QStoreProductTagEntity.storeProductTagEntity;
import static com.kh.app.store.entity.QStoreReviewEntity.storeReviewEntity;
import com.kh.app.store.entity.StoreProductCategory;
import com.kh.app.store.entity.StoreProductEntity;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.OrderSpecifier;
import org.springframework.data.support.PageableExecutionUtils;

@RequiredArgsConstructor
public class StoreProductRepositoryImpl implements StoreProductRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<StoreProductAdminListResDto> findAdminProductList(
            Pageable pageable,
            String saleYn,
            String keyword,
            String targetPetType,
            StoreProductCategory category,
            String sort
    ) {
        BooleanBuilder builder = new BooleanBuilder();

        // 판매상태 조건
        if (saleYn != null) {
            builder.and(storeProductEntity.productSaleYn.eq(saleYn));
        }

        // 상품명 검색
        if (keyword != null) {
            builder.and(storeProductEntity.productName.containsIgnoreCase(keyword));
        }

        // 대상동물 조건
        if (targetPetType != null) {
            builder.and(storeProductEntity.productTargetPetType.eq(targetPetType));
        }

        // 카테고리 조건
        if (category != null) {
            builder.and(storeProductEntity.productCategory.eq(category));
        }

        List<StoreProductAdminListResDto> content = queryFactory
                .select(Projections.constructor(
                        StoreProductAdminListResDto.class,
                        storeProductEntity.productId,
                        storeProductImageEntity.imageChangedName,
                        storeProductEntity.productName,
                        storeProductEntity.productCategory,
                        storeProductEntity.productTargetPetType,
                        storeProductEntity.productPrice,
                        storeProductEntity.productSaleYn,
                        storeProductEntity.productViewCount,
                        storeProductTagEntity.tagName,
                        storeProductEntity.createdAt
                ))
                .from(storeProductEntity)
                .leftJoin(storeProductEntity.productTag, storeProductTagEntity)
                .leftJoin(storeProductImageEntity)
                .on(
                        storeProductImageEntity.product.eq(storeProductEntity),
                        storeProductImageEntity.imageRepresentYn.eq("Y")
                )
                .where(builder)
                .orderBy(getAdminProductOrders(sort))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(storeProductEntity.count())
                .from(storeProductEntity)
                .leftJoin(storeProductEntity.productTag, storeProductTagEntity)
                .where(builder)
                .fetchOne();

        return PageableExecutionUtils.getPage(
                content,
                pageable,
                () -> total == null ? 0 : total
        );
    }

    private OrderSpecifier<?>[] getAdminProductOrders(String sort) {
        if ("oldest".equals(sort)) {
            return new OrderSpecifier<?>[]{
                    storeProductEntity.createdAt.asc(),
                    storeProductEntity.productId.asc()
            };
        }

        return new OrderSpecifier<?>[]{
                storeProductEntity.createdAt.desc(),
                storeProductEntity.productId.desc()
        };
    }

    @Override
    public List<StoreProductEntity> findUserProductList(
            String targetPetType,
            StoreProductCategory category,
            String keyword,
            Long tagId,
            String tagName,
            String sort
    ) {
        BooleanBuilder builder = new BooleanBuilder();

        // 판매중 상품만
        builder.and(storeProductEntity.productSaleYn.eq("Y"));

        // 대상동물 조건
        if (targetPetType != null && !targetPetType.isBlank()) {
            builder.and(storeProductEntity.productTargetPetType.eq(targetPetType));
        }

        // 카테고리 조건
        if (category != null) {
            builder.and(storeProductEntity.productCategory.eq(category));
        }

        // 상품명 검색
        if (keyword != null && !keyword.isBlank()) {
            builder.and(storeProductEntity.productName.containsIgnoreCase(keyword));
        }

        // 태그 ID 조건
        if (tagId != null) {
            builder.and(storeProductTagEntity.tagId.eq(tagId));
        }

        // 태그 이름 조건
        if (tagName != null && !tagName.isBlank()) {
            builder.and(storeProductTagEntity.tagName.eq(tagName));
        }

        // 인기순: 리뷰 개수 많은 순
        if ("popular".equals(sort)) {
            return queryFactory
                    .selectFrom(storeProductEntity)
                    .join(storeProductEntity.productTag, storeProductTagEntity)
                    .leftJoin(storeReviewEntity)
                    .on(storeReviewEntity.product.eq(storeProductEntity))
                    .where(builder)
                    .groupBy(storeProductEntity)
                    .orderBy(
                            storeReviewEntity.reviewId.count().desc(),
                            storeProductEntity.createdAt.desc(),
                            storeProductEntity.productId.desc()
                    )
                    .fetch();
        }

        // 인기순이 아닌 경우: 기존 방식 유지
        return queryFactory
                .selectFrom(storeProductEntity)
                .join(storeProductEntity.productTag, storeProductTagEntity)
                .where(builder)
                .orderBy(getUserProductOrders(sort))
                .fetch();
    }

    private OrderSpecifier<?>[] getUserProductOrders(String sort) {
        if ("lowPrice".equals(sort)) {
            return new OrderSpecifier<?>[]{
                    storeProductEntity.productPrice.asc(),
                    storeProductEntity.createdAt.desc(),
                    storeProductEntity.productId.desc()
            };
        }

        if ("highPrice".equals(sort)) {
            return new OrderSpecifier<?>[]{
                    storeProductEntity.productPrice.desc(),
                    storeProductEntity.createdAt.desc(),
                    storeProductEntity.productId.desc()
            };
        }

        // latest 기본값
        return new OrderSpecifier<?>[]{
                storeProductEntity.createdAt.desc(),
                storeProductEntity.productId.desc()
        };
    }
}