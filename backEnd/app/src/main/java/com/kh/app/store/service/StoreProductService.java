package com.kh.app.store.service;

import com.kh.app.aws.service.S3Service;
import com.kh.app.store.dto.request.StoreFeedingGuideInsertReqDto;
import com.kh.app.store.dto.request.StoreInsertReqDto;
import com.kh.app.store.dto.request.StoreNutritionInsertReqDto;
import com.kh.app.store.dto.request.StoreUpdateReqDto;
import com.kh.app.store.dto.response.StoreProductAdminDetailResDto;
import com.kh.app.store.dto.response.StoreProductAdminListResDto;
import com.kh.app.store.dto.response.StoreProductDetailResDto;
import com.kh.app.store.dto.response.StoreProductListResDto;
import com.kh.app.store.entity.*;
import com.kh.app.store.repository.StoreProductFeedingGuideRepository;
import com.kh.app.store.repository.StoreProductImageRepository;
import com.kh.app.store.repository.StoreProductNutritionRepository;
import com.kh.app.store.repository.StoreProductRepository;
import com.kh.app.store.repository.StoreProductTagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StoreProductService {

    private final StoreProductRepository storeProductRepository;
    private final StoreProductTagRepository storeProductTagRepository;
    private final StoreProductNutritionRepository storeProductNutritionRepository;
    private final StoreProductFeedingGuideRepository storeProductFeedingGuideRepository;
    private final StoreProductImageRepository storeProductImageRepository;

    private final S3Service s3Service;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    @Transactional
    public void insert(StoreInsertReqDto reqDto,
                       MultipartFile mainImage,
                       List<MultipartFile> subImages) throws IOException {

        StoreProductTagEntity tagEntity = storeProductTagRepository.findById(reqDto.getTagId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품 태그입니다."));

        StoreProductEntity productEntity = reqDto.toEntity(tagEntity);

        storeProductRepository.save(productEntity);

        saveNutrition(productEntity, reqDto.getNutrition());
        saveFeedingGuides(productEntity, reqDto.getFeedingGuideList());
        saveImages(productEntity, mainImage, subImages);

        log.info("[상품 등록 완료] 상품ID : {}, 상품명 : {}, 가격 : {}",
                productEntity.getProductId(),
                productEntity.getProductName(),
                productEntity.getProductPrice());
    }

    public Page<StoreProductAdminListResDto> getAdminProductList(
            int page,
            String saleYn,
            String keyword,
            String targetPetType,
            StoreProductCategory category,
            String sort
    ) {
        int pageNo = Math.max(page, 0);

        String saleYnValue = normalizeSaleYn(saleYn);
        String keywordValue = normalizeKeyword(keyword);
        String targetPetTypeValue = normalizeTargetPetType(targetPetType);
        String sortValue = normalizeAdminSort(sort);

        Pageable pageable = PageRequest.of(pageNo, 10);

        return storeProductRepository.findAdminProductList(
                pageable,
                saleYnValue,
                keywordValue,
                targetPetTypeValue,
                category,
                sortValue
        ).map(dto -> new StoreProductAdminListResDto(
                dto.getProductId(),
                makeS3Url(dto.getThumbnailUrl()),
                dto.getProductName(),
                dto.getProductCategory(),
                dto.getProductTargetPetType(),
                dto.getProductPrice(),
                dto.getProductSaleYn(),
                dto.getProductViewCount(),
                dto.getTagName(),
                dto.getCreatedAt()
        ));
    }

    //검색 및 필터링 목록조회
    public List<StoreProductListResDto> getProductList(
            String targetPetType,
            StoreProductCategory category,
            String keyword,
            Long tagId,
            String tagName,
            String sort
    ) {
        String petType = normalizeTargetPetType(targetPetType);
        String keywordText = normalizeKeyword(keyword);
        String tagNameText = normalizeKeyword(tagName);
        String sortType = normalizeSort(sort);

        List<StoreProductEntity> productList =
                storeProductRepository.findUserProductList(
                        petType,
                        category,
                        keywordText,
                        tagId,
                        tagNameText,
                        sortType
                );

        return productList.stream()
                .map(this::toStoreProductListResDto)
                .toList();
    }

    public List<StoreProductListResDto> getBestProductList(String targetPetType) {

        List<StoreProductEntity> productList;

        if (targetPetType == null || targetPetType.isBlank()) {
            productList =
                    storeProductRepository.findTop4ByProductSaleYnOrderByProductViewCountDescProductIdDesc(
                            "Y"
                    );
        } else {
            String petType = targetPetType.trim().toUpperCase();

            if (!petType.equals("D") && !petType.equals("C")) {
                throw new IllegalArgumentException("대상동물 타입은 D 또는 C만 가능합니다.");
            }

            productList =
                    storeProductRepository.findTop4ByProductSaleYnAndProductTargetPetTypeOrderByProductViewCountDescProductIdDesc(
                            "Y",
                            petType
                    );
        }

        return productList.stream()
                .map(this::toStoreProductListResDto)
                .toList();
    }

    private StoreProductListResDto toStoreProductListResDto(StoreProductEntity product) {

        StoreProductImageEntity mainImage =
                storeProductImageRepository
                        .findFirstByProduct_ProductIdAndImageRepresentYnOrderBySortOrderAsc(
                                product.getProductId(),
                                "Y"
                        )
                        .orElse(null);

        String mainImageUrl = mainImage == null
                ? null
                : makeS3Url(mainImage.getImageChangedName());

        return StoreProductListResDto.from(product, mainImageUrl);
    }

    //이거 안쓸듯?
    public StoreProductAdminDetailResDto getAdminProductDetail(Long productId) {
        StoreProductEntity productEntity = storeProductRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다."));

        StoreProductNutritionEntity nutritionEntity =
                storeProductNutritionRepository.findByProduct_ProductId(productId)
                        .orElse(null);

        List<StoreProductFeedingGuideEntity> feedingGuideList =
                storeProductFeedingGuideRepository.findByProduct_ProductIdOrderByFeedingGuideIdAsc(productId);

        List<StoreProductImageEntity> imageList =
                storeProductImageRepository.findByProduct_ProductIdOrderBySortOrderAsc(productId);

        return StoreProductAdminDetailResDto.from(
                productEntity,
                nutritionEntity,
                feedingGuideList,
                imageList
        );
    }

    @Transactional
    public StoreProductDetailResDto getProductDetail(Long productId) {

        StoreProductEntity productEntity = storeProductRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다."));

        if (!productEntity.isOnSale()) {
            throw new IllegalStateException("판매중지된 상품입니다.");
        }

        //조회수 증가
        productEntity.increaseViewCount();

        StoreProductNutritionEntity nutritionEntity =
                storeProductNutritionRepository.findByProduct_ProductId(productId)
                        .orElse(null);

        List<StoreProductFeedingGuideEntity> feedingGuideList =
                storeProductFeedingGuideRepository.findByProduct_ProductIdOrderByFeedingGuideIdAsc(productId);

        List<StoreProductImageEntity> imageList =
                storeProductImageRepository.findByProduct_ProductIdOrderBySortOrderAsc(productId);

        String mainImageUrl = getMainImageUrl(imageList);
        List<String> subImageUrls = getSubImageUrls(imageList);

        return StoreProductDetailResDto.from(
                productEntity,
                nutritionEntity,
                feedingGuideList,
                mainImageUrl,
                subImageUrls
        );
    }

    @Transactional
    public void update(Long productId,
                       StoreUpdateReqDto reqDto,
                       MultipartFile mainImage,
                       List<MultipartFile> subImages) throws IOException {

        StoreProductEntity productEntity = storeProductRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다."));

        StoreProductTagEntity tagEntity = storeProductTagRepository.findById(reqDto.getTagId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품 태그입니다."));

        productEntity.update(
                reqDto.getProductCategory(),
                tagEntity,
                reqDto.getProductName(),
                reqDto.getProductTargetPetType(),
                reqDto.getProductPrice()
        );

        updateNutrition(productEntity, reqDto.getNutrition());
        updateFeedingGuides(productEntity, reqDto.getFeedingGuideList());
        updateImages(productEntity, mainImage, subImages);

        log.info("[상품 수정 완료] 상품ID : {}, 상품명 : {}",
                productId,
                productEntity.getProductName());
    }

    private void saveNutrition(StoreProductEntity productEntity,
                               StoreNutritionInsertReqDto nutritionDto) {

        if (nutritionDto == null) {
            return;
        }

        StoreProductNutritionEntity nutritionEntity = nutritionDto.toEntity(productEntity);
        storeProductNutritionRepository.save(nutritionEntity);
    }

    private void updateNutrition(StoreProductEntity productEntity,
                                 StoreNutritionInsertReqDto nutritionDto) {

        if (nutritionDto == null) {
            return;
        }

        StoreProductNutritionEntity nutritionEntity =
                storeProductNutritionRepository.findByProduct_ProductId(productEntity.getProductId())
                        .orElse(null);

        if (nutritionEntity == null) {
            StoreProductNutritionEntity newNutrition = nutritionDto.toEntity(productEntity);
            storeProductNutritionRepository.save(newNutrition);
            return;
        }

        nutritionEntity.update(
                nutritionDto.getNutritionCalorie(),
                nutritionDto.getNutritionProtein(),
                nutritionDto.getNutritionFat(),
                nutritionDto.getNutritionFiber(),
                nutritionDto.getNutritionMoisture(),
                nutritionDto.getNutritionCalcium(),
                nutritionDto.getNutritionPhosphorus()
        );
    }

    private void saveFeedingGuides(StoreProductEntity productEntity,
                                   List<StoreFeedingGuideInsertReqDto> feedingGuideList) {

        if (feedingGuideList == null || feedingGuideList.isEmpty()) {
            return;
        }

        for (StoreFeedingGuideInsertReqDto guideDto : feedingGuideList) {
            StoreProductFeedingGuideEntity guideEntity = guideDto.toEntity(productEntity);
            storeProductFeedingGuideRepository.save(guideEntity);
        }
    }

    private void updateFeedingGuides(StoreProductEntity productEntity,
                                     List<StoreFeedingGuideInsertReqDto> feedingGuideList) {

        if (feedingGuideList == null) {
            return;
        }

        storeProductFeedingGuideRepository.deleteByProduct_ProductId(productEntity.getProductId());

        if (feedingGuideList.isEmpty()) {
            return;
        }

        for (StoreFeedingGuideInsertReqDto guideDto : feedingGuideList) {
            StoreProductFeedingGuideEntity guideEntity = guideDto.toEntity(productEntity);
            storeProductFeedingGuideRepository.save(guideEntity);
        }
    }

    private void saveImages(StoreProductEntity productEntity,
                            MultipartFile mainImage,
                            List<MultipartFile> subImages) throws IOException {

        saveMainImage(productEntity, mainImage);
        saveSubImages(productEntity, subImages);
    }

    private void updateImages(StoreProductEntity productEntity,
                              MultipartFile mainImage,
                              List<MultipartFile> subImages) throws IOException {

        if (mainImage != null && !mainImage.isEmpty()) {
            storeProductImageRepository.deleteByProduct_ProductIdAndImageRepresentYn(
                    productEntity.getProductId(),
                    "Y"
            );

            saveMainImage(productEntity, mainImage);
        }

        if (subImages != null && !subImages.isEmpty()) {
            storeProductImageRepository.deleteByProduct_ProductIdAndImageRepresentYn(
                    productEntity.getProductId(),
                    "N"
            );

            saveSubImages(productEntity, subImages);
        }
    }

    private void saveMainImage(StoreProductEntity productEntity,
                               MultipartFile mainImage) throws IOException {

        if (mainImage == null || mainImage.isEmpty()) {
            return;
        }

        String changedName = uploadProductImage(mainImage);

        StoreProductImageEntity imageEntity = StoreProductImageEntity.from(
                productEntity,
                mainImage,
                changedName,
                1L,
                "Y"
        );

        storeProductImageRepository.save(imageEntity);
    }

    private void saveSubImages(StoreProductEntity productEntity,
                               List<MultipartFile> subImages) throws IOException {

        if (subImages == null || subImages.isEmpty()) {
            return;
        }

        long sortOrder = 2L;

        for (MultipartFile subImage : subImages) {
            if (subImage == null || subImage.isEmpty()) {
                continue;
            }

            String changedName = uploadProductImage(subImage);

            StoreProductImageEntity imageEntity = StoreProductImageEntity.from(
                    productEntity,
                    subImage,
                    changedName,
                    sortOrder,
                    "N"
            );

            storeProductImageRepository.save(imageEntity);
            sortOrder++;
        }
    }

    private String uploadProductImage(MultipartFile file) throws IOException {
        return s3Service.upload(file, "store/product");
    }

    private String makeS3Url(String changedName) {
        if (changedName == null || changedName.isBlank()) {
            return null;
        }

        if (changedName.startsWith("http://") || changedName.startsWith("https://")) {
            return changedName;
        }

        String keyPath = changedName.startsWith("store/product/")
                ? changedName
                : "store/product/" + changedName;

        return "https://" + bucketName + ".s3.ap-northeast-2.amazonaws.com/" + keyPath;
    }

    @Transactional
    public void stopSelling(Long productId) {
        StoreProductEntity storeProductEntity = storeProductRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다."));

        storeProductEntity.stopSelling();
    }

    @Transactional
    public void resumeSelling(Long productId) {
        StoreProductEntity storeProductEntity = storeProductRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다."));

        storeProductEntity.resumeSelling();
    }

    //검색 및 필터링을 위한 메서드
    private String normalizeTargetPetType(String targetPetType) {
        if (targetPetType == null || targetPetType.isBlank()) {
            return null;
        }

        String petType = targetPetType.trim().toUpperCase();

        if (!petType.equals("D") && !petType.equals("C")) {
            throw new IllegalArgumentException("대상동물 타입은 D 또는 C만 가능합니다.");
        }

        return petType;
    }

    private String normalizeKeyword(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return null;
        }

        return keyword.trim();
    }

    private String normalizeSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return "latest";
        }

        String sortType = sort.trim();

        if (
                !sortType.equals("latest") &&
                        !sortType.equals("popular") &&
                        !sortType.equals("lowPrice") &&
                        !sortType.equals("highPrice")
        ) {
            throw new IllegalArgumentException("지원하지 않는 정렬 조건입니다.");
        }

        return sortType;
    }
    private String getMainImageUrl(List<StoreProductImageEntity> imageList) {
        if (imageList == null || imageList.isEmpty()) {
            return null;
        }

        return imageList.stream()
                .filter(image -> "Y".equals(image.getImageRepresentYn()))
                .findFirst()
                .map(StoreProductImageEntity::getImageChangedName)
                .map(this::makeS3Url)
                .orElse(null);
    }

    private List<String> getSubImageUrls(List<StoreProductImageEntity> imageList) {
        if (imageList == null || imageList.isEmpty()) {
            return List.of();
        }

        return imageList.stream()
                .filter(image -> "N".equals(image.getImageRepresentYn()))
                .map(StoreProductImageEntity::getImageChangedName)
                .map(this::makeS3Url)
                .toList();
    }

    private String normalizeSaleYn(String saleYn) {
        if (saleYn == null || saleYn.isBlank()) {
            return null;
        }

        String saleYnValue = saleYn.trim().toUpperCase();

        if (!saleYnValue.equals("Y") && !saleYnValue.equals("N")) {
            throw new IllegalArgumentException("판매상태는 Y 또는 N만 가능합니다.");
        }

        return saleYnValue;
    }

    private String normalizeAdminSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return "latest";
        }

        String sortValue = sort.trim();

        if (!sortValue.equals("latest") && !sortValue.equals("oldest")) {
            throw new IllegalArgumentException("관리자 상품 목록 정렬 조건은 latest 또는 oldest만 가능합니다.");
        }

        return sortValue;
    }

}