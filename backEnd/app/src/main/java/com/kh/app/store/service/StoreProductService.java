package com.kh.app.store.service;

import com.kh.app.store.dto.request.StoreInsertReqDto;
import com.kh.app.store.dto.response.StoreProductListResDto;
import com.kh.app.store.entity.StoreProductEntity;
import com.kh.app.store.entity.StoreProductTagEntity;
import com.kh.app.store.repository.StoreProductRepository;
import com.kh.app.store.repository.StoreProductTagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StoreProductService {

    private final StoreProductRepository storeProductRepository;
    private final StoreProductTagRepository storeProductTagRepository;

    @Transactional
    public void insert(StoreInsertReqDto reqDto,
                       MultipartFile mainImage,
                       List<MultipartFile> subImages) {

        StoreProductTagEntity tagEntity = storeProductTagRepository.findById(reqDto.getTagId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품 태그입니다."));

        StoreProductEntity storeProductEntity = reqDto.toEntity(tagEntity);

        storeProductRepository.save(storeProductEntity);

        log.info("[상품 등록 완료] 상품명 : {} , 가격 : {}" , storeProductEntity.getProductName() , storeProductEntity.getProductPrice());
    }

    public List<StoreProductListResDto> getStoreProductList() {
        return storeProductRepository.findStoreProductList();
    }
}