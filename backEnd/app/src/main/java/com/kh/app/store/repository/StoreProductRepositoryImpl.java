package com.kh.app.store.repository;

import com.kh.app.store.dto.response.StoreProductAdminListResDto;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;

import static com.kh.app.store.entity.QStoreProductEntity.storeProductEntity;
import static com.kh.app.store.entity.QStoreProductTagEntity.storeProductTagEntity;

@RequiredArgsConstructor
public class StoreProductRepositoryImpl implements StoreProductRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<StoreProductAdminListResDto> findAdminProductList(Pageable pageable) {

        List<StoreProductAdminListResDto> content = queryFactory
                .select(Projections.constructor(
                        StoreProductAdminListResDto.class,
                        storeProductEntity.productId,
                        // 아직 이미지 저장 로직 없으므로 null 처리
                        Expressions.nullExpression(String.class),
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
                .join(storeProductEntity.productTag, storeProductTagEntity)
                .orderBy(storeProductEntity.productId.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(storeProductEntity.count())
                .from(storeProductEntity)
                .fetchOne();

        return new PageImpl<>(content, pageable, total == null ? 0 : total);
    }
}