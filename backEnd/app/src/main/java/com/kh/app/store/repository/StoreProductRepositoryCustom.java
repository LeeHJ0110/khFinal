package com.kh.app.store.repository;

import com.kh.app.store.dto.response.StoreProductAdminListResDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StoreProductRepositoryCustom {

    Page<StoreProductAdminListResDto> findAdminProductList(Pageable pageable);
}