package com.kh.app.store.repository;


import com.kh.app.store.dto.response.StoreProductListResDto;
import com.kh.app.store.entity.StoreProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface StoreProductRepository extends JpaRepository<StoreProductEntity, Long> {

    @Query("""
            SELECT new com.kh.app.store.dto.response.StoreProductListResDto(
                p.productId,
                p.productName,
                p.productCategory,
                p.productTargetPetType,
                p.productPrice,
                p.productSaleYn,
                p.productViewCount,
                t.tagName
            )
            FROM StoreProductEntity p
            JOIN p.productTag t
            ORDER BY p.productId DESC
            """)
    List<StoreProductListResDto> findStoreProductList();

}
