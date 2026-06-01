package com.kh.app.store.repository;

import com.kh.app.store.dto.response.StoreProductAdminListResDto;
import com.kh.app.store.entity.StoreProductCategory;
import com.kh.app.store.entity.StoreProductEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface StoreProductRepositoryCustom {

    Page<StoreProductAdminListResDto> findAdminProductList(
            Pageable pageable,
            String saleYn,
            String keyword,
            String targetPetType,
            StoreProductCategory category,
            String sort
    );

    List<StoreProductEntity> findUserProductList(
            String targetPetType,
            StoreProductCategory category,
            String keyword,
            Long tagId,
            String tagName,
            String sort
    );
}