package com.kh.app.store.service;

import com.kh.app.aws.service.S3Service;
import com.kh.app.common.entity.DelYn;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.pet.entity.PetEntity;
import com.kh.app.pet.entity.PetType;
import com.kh.app.pet.repository.PetRepository;
import com.kh.app.store.dto.request.*;
import com.kh.app.store.dto.response.*;
import com.kh.app.store.entity.*;
import com.kh.app.store.exception.StoreErrorCode;
import com.kh.app.store.exception.StoreException;
import com.kh.app.store.repository.*;
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
import java.math.BigDecimal;
import java.util.Comparator;
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
    private final MemberRepository memberRepository;
    private final PetRepository petRepository;
    private final StoreWishRepository storeWishRepository;
    private final StoreReviewRepository storeReviewRepository;

    private final S3Service s3Service;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    // =====================================================
    // 관리자 상품 기능
    // =====================================================

    @Transactional
    public void insert(
            StoreInsertReqDto reqDto,
            MultipartFile mainImage,
            List<MultipartFile> subImages
    ) throws IOException {

        StoreProductTagEntity tagEntity = storeProductTagRepository.findById(reqDto.getTagId())
                .orElseThrow(() -> new StoreException(StoreErrorCode.PRODUCT_TAG_NOT_FOUND));

        StoreProductEntity productEntity = reqDto.toEntity(tagEntity);

        storeProductRepository.save(productEntity);

        saveNutrition(productEntity, reqDto.getNutrition());
        saveFeedingGuides(productEntity, reqDto.getFeedingGuideList());
        saveImages(productEntity, mainImage, subImages);

        log.info(
                "[상품 등록 완료] 상품ID={}, 상품명={}, 가격={}",
                productEntity.getProductId(),
                productEntity.getProductName(),
                productEntity.getProductPrice()
        );
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

    public StoreProductAdminDetailResDto getAdminProductDetail(Long productId) {
        StoreProductEntity productEntity = getProductEntity(productId);

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
    public void update(
            Long productId,
            StoreUpdateReqDto reqDto,
            MultipartFile mainImage,
            List<MultipartFile> subImages
    ) throws IOException {

        StoreProductEntity productEntity = getProductEntity(productId);

        StoreProductTagEntity tagEntity = storeProductTagRepository.findById(reqDto.getTagId())
                .orElseThrow(() -> new StoreException(StoreErrorCode.PRODUCT_TAG_NOT_FOUND));

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

        log.info("[상품 수정 완료] 상품ID={}, 상품명={}", productId, productEntity.getProductName());
    }

    @Transactional
    public void stopSelling(Long productId) {
        StoreProductEntity productEntity = getProductEntity(productId);

        productEntity.stopSelling();

        log.info("[상품 판매중지] 상품ID={}", productId);
    }

    @Transactional
    public void resumeSelling(Long productId) {
        StoreProductEntity productEntity = getProductEntity(productId);

        productEntity.resumeSelling();

        log.info("[상품 판매재개] 상품ID={}", productId);
    }

    // =====================================================
    // 사용자 상품 기능
    // =====================================================

    public List<StoreProductListResDto> getProductList(
            String targetPetType,
            StoreProductCategory category,
            String keyword,
            Long tagId,
            String tagName,
            String sort,
            String username
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

        MemberEntity loginMember = getNullableLoginMember(username);

        return productList.stream()
                .map(product -> toStoreProductListResDto(product, loginMember))
                .toList();
    }

    public List<StoreProductListResDto> getBestProductList(
            String targetPetType,
            String username
    ) {
        List<StoreProductEntity> productList;

        if (targetPetType == null || targetPetType.isBlank()) {
            productList =
                    storeProductRepository.findBestProductsByReviewCount(
                            "Y",
                            DelYn.N,
                            PageRequest.of(0, 4)
                    );
        } else {
            String petType = targetPetType.trim().toUpperCase();

            if (!petType.equals("D") && !petType.equals("C")) {
                throw new StoreException(StoreErrorCode.INVALID_TARGET_PET_TYPE);
            }

            productList =
                    storeProductRepository.findBestProductsByReviewCountAndTargetPetType(
                            "Y",
                            petType,
                            DelYn.N,
                            PageRequest.of(0, 4)
                    );
        }

        MemberEntity loginMember = getNullableLoginMember(username);

        return productList.stream()
                .map(product -> toStoreProductListResDto(product, loginMember))
                .toList();
    }

    @Transactional
    public StoreProductDetailResDto getProductDetail(Long productId, String username) {
        StoreProductEntity productEntity = getProductEntity(productId);

        // 사용자 상세 화면에서는 판매중지 상품도 없는 상품처럼 404 처리
        if (!productEntity.isOnSale()) {
            throw new StoreException(StoreErrorCode.PRODUCT_NOT_ON_SALE);
        }

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

        StoreProductDetailResDto result = StoreProductDetailResDto.from(
                productEntity,
                nutritionEntity,
                feedingGuideList,
                mainImageUrl,
                subImageUrls
        );

        applyWishInfo(result, productEntity, username);
        applyFeedingRecommend(result, productEntity, feedingGuideList, username);

        return result;
    }

    // =====================================================
    // 관심상품 기능
    // =====================================================

    @Transactional
    public void wishInsert(StoreWishInsertReqDto reqDto, String username) {
        if (isNotLogin(username)) {
            throw new StoreException(StoreErrorCode.WISH_LOGIN_REQUIRED);
        }

        if (reqDto == null || reqDto.getProductId() == null) {
            throw new StoreException(StoreErrorCode.PRODUCT_ID_REQUIRED);
        }

        MemberEntity member = getLoginMember(username);
        StoreProductEntity product = getProductEntity(reqDto.getProductId());

        if (!product.isOnSale()) {
            throw new StoreException(StoreErrorCode.PRODUCT_NOT_ON_SALE);
        }

        boolean alreadyExists = storeWishRepository.existsByMember_IdAndProduct_ProductId(
                member.getId(),
                product.getProductId()
        );

        if (alreadyExists) {
            throw new StoreException(StoreErrorCode.ALREADY_WISHED_PRODUCT);
        }

        StoreWishEntity newWish = StoreWishEntity.builder()
                .member(member)
                .product(product)
                .build();

        storeWishRepository.save(newWish);

        log.info(
                "[관심상품 등록] memberId={}, username={}, productId={}",
                member.getId(),
                member.getUsername(),
                product.getProductId()
        );
    }

    public Page<StoreWishListResDto> getWishList(
            String username,
            int page,
            StoreProductCategory category
    ) {
        if (isNotLogin(username)) {
            throw new StoreException(StoreErrorCode.WISH_LOGIN_REQUIRED);
        }

        MemberEntity member = getLoginMember(username);

        int pageNo = Math.max(page, 0);
        Pageable pageable = PageRequest.of(pageNo, 10);

        Page<StoreWishEntity> wishPage;

        if (category == null) {
            wishPage = storeWishRepository.findByMemberOrderByWishlistIdDesc(member, pageable);
        } else {
            wishPage = storeWishRepository.findByMemberAndProduct_ProductCategoryOrderByWishlistIdDesc(
                    member,
                    category,
                    pageable
            );
        }

        return wishPage.map(wishItem -> {
            String mainImageUrl = getMainImageUrlByProductId(
                    wishItem.getProduct().getProductId()
            );

            return StoreWishListResDto.from(wishItem, mainImageUrl);
        });
    }

    @Transactional
    public void wishDelete(Long wishlistId, String username) {
        if (isNotLogin(username)) {
            throw new StoreException(StoreErrorCode.WISH_LOGIN_REQUIRED);
        }

        if (wishlistId == null) {
            throw new StoreException(StoreErrorCode.WISHLIST_ID_REQUIRED);
        }

        MemberEntity member = getLoginMember(username);

        StoreWishEntity wish = storeWishRepository.findByWishlistIdAndMember(wishlistId, member)
                .orElseThrow(() -> new StoreException(StoreErrorCode.WISH_NOT_FOUND));

        storeWishRepository.delete(wish);

        log.info(
                "[관심상품 삭제] memberId={}, username={}, wishlistId={}, productId={}",
                member.getId(),
                member.getUsername(),
                wish.getWishlistId(),
                wish.getProduct().getProductId()
        );
    }

    @Transactional
    public void wishDeleteByProductId(Long productId, String username) {
        if (isNotLogin(username)) {
            throw new StoreException(StoreErrorCode.WISH_LOGIN_REQUIRED);
        }

        if (productId == null) {
            throw new StoreException(StoreErrorCode.PRODUCT_ID_REQUIRED);
        }

        MemberEntity member = getLoginMember(username);

        StoreWishEntity wish = storeWishRepository
                .findByMember_IdAndProduct_ProductId(member.getId(), productId)
                .orElseThrow(() -> new StoreException(StoreErrorCode.WISH_NOT_FOUND));

        storeWishRepository.delete(wish);

        log.info(
                "[관심상품 상품ID 기준 삭제] memberId={}, username={}, wishlistId={}, productId={}",
                member.getId(),
                member.getUsername(),
                wish.getWishlistId(),
                productId
        );
    }

    // =====================================================
    // DTO 변환
    // =====================================================

    private StoreProductListResDto toStoreProductListResDto(
            StoreProductEntity product,
            MemberEntity member
    ) {
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

        Boolean wished = false;
        Long wishlistId = null;

        if (member != null) {
            StoreWishEntity wish = storeWishRepository
                    .findByMember_IdAndProduct_ProductId(
                            member.getId(),
                            product.getProductId()
                    )
                    .orElse(null);

            if (wish != null) {
                wished = true;
                wishlistId = wish.getWishlistId();
            }
        }

        Double averageRating =
                storeReviewRepository.getAverageRatingByProductIdAndDelYn(
                        product.getProductId(),
                        DelYn.N
                );

        Long reviewCount =
                storeReviewRepository.countByProduct_ProductIdAndDelYn(
                        product.getProductId(),
                        DelYn.N
                );

        return StoreProductListResDto.from(
                product,
                mainImageUrl,
                wished,
                wishlistId,
                averageRating,
                reviewCount
        );
    }

    // =====================================================
    // 이미지 / S3 처리
    // =====================================================

    private void saveImages(
            StoreProductEntity productEntity,
            MultipartFile mainImage,
            List<MultipartFile> subImages
    ) throws IOException {
        saveMainImage(productEntity, mainImage);
        saveSubImages(productEntity, subImages);
    }

    private void updateImages(
            StoreProductEntity productEntity,
            MultipartFile mainImage,
            List<MultipartFile> subImages
    ) throws IOException {

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

    private void saveMainImage(
            StoreProductEntity productEntity,
            MultipartFile mainImage
    ) throws IOException {

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

    private void saveSubImages(
            StoreProductEntity productEntity,
            List<MultipartFile> subImages
    ) throws IOException {

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

    private String getMainImageUrlByProductId(Long productId) {
        StoreProductImageEntity mainImage =
                storeProductImageRepository
                        .findFirstByProduct_ProductIdAndImageRepresentYnOrderBySortOrderAsc(
                                productId,
                                "Y"
                        )
                        .orElse(null);

        if (mainImage == null) {
            return null;
        }

        return makeS3Url(mainImage.getImageChangedName());
    }

    // =====================================================
    // 영양성분 / 급여기준
    // =====================================================

    private void saveNutrition(
            StoreProductEntity productEntity,
            StoreNutritionInsertReqDto nutritionDto
    ) {
        if (nutritionDto == null) {
            return;
        }

        StoreProductNutritionEntity nutritionEntity = nutritionDto.toEntity(productEntity);
        storeProductNutritionRepository.save(nutritionEntity);
    }

    private void updateNutrition(
            StoreProductEntity productEntity,
            StoreNutritionInsertReqDto nutritionDto
    ) {
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

    private void saveFeedingGuides(
            StoreProductEntity productEntity,
            List<StoreFeedingGuideInsertReqDto> feedingGuideList
    ) {
        if (feedingGuideList == null || feedingGuideList.isEmpty()) {
            return;
        }

        validateFeedingGuideList(feedingGuideList);

        for (StoreFeedingGuideInsertReqDto guideDto : feedingGuideList) {
            StoreProductFeedingGuideEntity guideEntity = guideDto.toEntity(productEntity);
            storeProductFeedingGuideRepository.save(guideEntity);
        }
    }

    private void updateFeedingGuides(
            StoreProductEntity productEntity,
            List<StoreFeedingGuideInsertReqDto> feedingGuideList
    ) {
        if (feedingGuideList == null) {
            return;
        }

        if (!feedingGuideList.isEmpty()) {
            validateFeedingGuideList(feedingGuideList);
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

    private void validateFeedingGuideList(List<StoreFeedingGuideInsertReqDto> feedingGuideList) {
        if (feedingGuideList == null || feedingGuideList.isEmpty()) {
            return;
        }

        if (feedingGuideList.size() != 3) {
            throw new StoreException(StoreErrorCode.INVALID_FEEDING_GUIDE);
        }

        for (StoreFeedingGuideInsertReqDto guideDto : feedingGuideList) {
            Long minWeight = guideDto.getFeedingMinWeight();
            Long maxWeight = guideDto.getFeedingMaxWeight();

            if (guideDto.getFeedingDailyAmount() == null || guideDto.getFeedingDailyAmount() <= 0) {
                throw new StoreException(StoreErrorCode.INVALID_FEEDING_GUIDE);
            }

            if (minWeight != null && minWeight < 0) {
                throw new StoreException(StoreErrorCode.INVALID_FEEDING_GUIDE);
            }

            if (maxWeight != null && maxWeight <= 0) {
                throw new StoreException(StoreErrorCode.INVALID_FEEDING_GUIDE);
            }

            if (minWeight != null && maxWeight != null && minWeight >= maxWeight) {
                throw new StoreException(StoreErrorCode.INVALID_FEEDING_GUIDE);
            }
        }

        StoreFeedingGuideInsertReqDto first = feedingGuideList.get(0);
        StoreFeedingGuideInsertReqDto second = feedingGuideList.get(1);
        StoreFeedingGuideInsertReqDto third = feedingGuideList.get(2);

        if (first.getFeedingMinWeight() != null) {
            throw new StoreException(StoreErrorCode.INVALID_FEEDING_GUIDE);
        }

        if (first.getFeedingMaxWeight() == null) {
            throw new StoreException(StoreErrorCode.INVALID_FEEDING_GUIDE);
        }

        if (second.getFeedingMinWeight() == null || second.getFeedingMaxWeight() == null) {
            throw new StoreException(StoreErrorCode.INVALID_FEEDING_GUIDE);
        }

        if (third.getFeedingMinWeight() == null) {
            throw new StoreException(StoreErrorCode.INVALID_FEEDING_GUIDE);
        }

        if (third.getFeedingMaxWeight() != null) {
            throw new StoreException(StoreErrorCode.INVALID_FEEDING_GUIDE);
        }

        if (!first.getFeedingMaxWeight().equals(second.getFeedingMinWeight())) {
            throw new StoreException(StoreErrorCode.INVALID_FEEDING_GUIDE);
        }

        if (!second.getFeedingMaxWeight().equals(third.getFeedingMinWeight())) {
            throw new StoreException(StoreErrorCode.INVALID_FEEDING_GUIDE);
        }
    }

    // =====================================================
    // 맞춤 급여 추천
    // =====================================================

    private void applyFeedingRecommend(
            StoreProductDetailResDto result,
            StoreProductEntity productEntity,
            List<StoreProductFeedingGuideEntity> feedingGuideList,
            String username
    ) {
        if (isNotLogin(username)) {
            result.setFeedingRecommendStatus("NEED_LOGIN");
            result.setFeedingRecommendMessage("로그인 후 맞춤 급여 정보를 확인할 수 있습니다.");
            result.setRecommendPetList(List.of());
            return;
        }

        // 상품 상세는 공개 페이지이므로 회원 조회 실패 시 상세 전체를 터뜨리지 않음
        MemberEntity memberEntity = getNullableLoginMember(username);

        if (memberEntity == null) {
            result.setFeedingRecommendStatus("NEED_LOGIN");
            result.setFeedingRecommendMessage("로그인 후 맞춤 급여 정보를 확인할 수 있습니다.");
            result.setRecommendPetList(List.of());
            return;
        }

        List<PetEntity> allPetList =
                petRepository.findAllByMember_IdAndDelYn(memberEntity.getId(), DelYn.N);

        if (allPetList.isEmpty()) {
            result.setFeedingRecommendStatus("NEED_PET_REGISTER");
            result.setFeedingRecommendMessage("등록된 반려동물이 없습니다. 반려동물을 등록하고 맞춤 급여량을 확인해보세요.");
            result.setRecommendPetList(List.of());
            return;
        }

        PetType targetPetType = convertToPetType(productEntity.getProductTargetPetType());

        List<PetEntity> matchedPetList = allPetList.stream()
                .filter(pet -> pet.getBreed() != null)
                .filter(pet -> pet.getBreed().getPetType() == targetPetType)
                .sorted(Comparator.comparing(PetEntity::getId).reversed())
                .toList();

        if (matchedPetList.isEmpty()) {
            result.setFeedingRecommendStatus("NO_MATCHED_PET");
            result.setFeedingRecommendMessage("이 상품에 맞는 반려동물이 등록되어 있지 않습니다.");
            result.setRecommendPetList(List.of());
            return;
        }

        List<StorePetFeedingRecommendResDto> recommendPetList = matchedPetList.stream()
                .map(pet -> toPetFeedingRecommendDto(pet, feedingGuideList))
                .toList();

        result.setFeedingRecommendStatus("SUCCESS");
        result.setFeedingRecommendMessage("맞춤 급여량 조회 성공");
        result.setRecommendPetList(recommendPetList);
    }

    private StorePetFeedingRecommendResDto toPetFeedingRecommendDto(
            PetEntity pet,
            List<StoreProductFeedingGuideEntity> feedingGuideList
    ) {
        StoreProductFeedingGuideEntity matchedGuide =
                findMatchedGuide(pet.getWeight(), feedingGuideList);

        StoreFeedingGuideResDto matchedGuideDto =
                matchedGuide == null ? null : StoreFeedingGuideResDto.from(matchedGuide);

        String dailyAmountText = null;

        if (matchedGuide != null) {
            String unit = matchedGuide.getFeedingUnit() == null
                    ? "g"
                    : matchedGuide.getFeedingUnit();

            dailyAmountText = "1일 " + matchedGuide.getFeedingDailyAmount() + unit;
        }

        return StorePetFeedingRecommendResDto.builder()
                .petId(pet.getId())
                .petName(pet.getName())
                .petType(
                        pet.getBreed() == null || pet.getBreed().getPetType() == null
                                ? null
                                : pet.getBreed().getPetType().name()
                )
                .breedName(
                        pet.getBreed() == null
                                ? null
                                : pet.getBreed().getName()
                )
                .petWeight(pet.getWeight())

                // 현재 PetEntity에는 이미지 필드가 없으므로 null 처리
                // 추후 반려동물 이미지 필드가 추가되면 여기만 변경
                .petImageUrl(null)

                .matchedFeedingGuide(matchedGuideDto)
                .dailyAmountText(dailyAmountText)
                .build();
    }

    private StoreProductFeedingGuideEntity findMatchedGuide(
            BigDecimal petWeight,
            List<StoreProductFeedingGuideEntity> feedingGuideList
    ) {
        if (petWeight == null || feedingGuideList == null || feedingGuideList.isEmpty()) {
            return null;
        }

        for (StoreProductFeedingGuideEntity guide : feedingGuideList) {
            Long minWeight = guide.getFeedingMinWeight();
            Long maxWeight = guide.getFeedingMaxWeight();

            boolean minOk = minWeight == null ||
                    petWeight.compareTo(BigDecimal.valueOf(minWeight)) >= 0;

            boolean maxOk = maxWeight == null ||
                    petWeight.compareTo(BigDecimal.valueOf(maxWeight)) < 0;

            if (minOk && maxOk) {
                return guide;
            }
        }

        return null;
    }

    // =====================================================
    // 관심상품 표시 정보
    // =====================================================

    private void applyWishInfo(
            StoreProductDetailResDto result,
            StoreProductEntity productEntity,
            String username
    ) {
        if (isNotLogin(username)) {
            result.setWished(false);
            result.setWishlistId(null);
            return;
        }

        // 상품 상세는 공개 페이지이므로 회원 조회 실패 시 상세 전체를 터뜨리지 않음
        MemberEntity member = getNullableLoginMember(username);

        if (member == null) {
            result.setWished(false);
            result.setWishlistId(null);
            return;
        }

        StoreWishEntity wish = storeWishRepository
                .findByMember_IdAndProduct_ProductId(
                        member.getId(),
                        productEntity.getProductId()
                )
                .orElse(null);

        if (wish == null) {
            result.setWished(false);
            result.setWishlistId(null);
            return;
        }

        result.setWished(true);
        result.setWishlistId(wish.getWishlistId());
    }

    // =====================================================
    // 공통 조회 / 검증 유틸
    // =====================================================

    private StoreProductEntity getProductEntity(Long productId) {
        return storeProductRepository.findById(productId)
                .orElseThrow(() -> new StoreException(StoreErrorCode.PRODUCT_NOT_FOUND));
    }

    private MemberEntity getLoginMember(String username) {
        return memberRepository
                .findByUsernameAndDelYn(username, DelYn.N)
                .orElseThrow(() -> new StoreException(StoreErrorCode.LOGIN_MEMBER_NOT_FOUND));
    }

    private MemberEntity getNullableLoginMember(String username) {
        if (isNotLogin(username)) {
            return null;
        }

        return memberRepository
                .findByUsernameAndDelYn(username, DelYn.N)
                .orElse(null);
    }

    private boolean isNotLogin(String username) {
        return username == null || username.isBlank() || "anonymousUser".equals(username);
    }

    private String normalizeTargetPetType(String targetPetType) {
        if (targetPetType == null || targetPetType.isBlank()) {
            return null;
        }

        String petType = targetPetType.trim().toUpperCase();

        if (!petType.equals("D") && !petType.equals("C")) {
            throw new StoreException(StoreErrorCode.INVALID_TARGET_PET_TYPE);
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
            throw new StoreException(StoreErrorCode.INVALID_PRODUCT_SORT);
        }

        return sortType;
    }

    private String normalizeSaleYn(String saleYn) {
        if (saleYn == null || saleYn.isBlank()) {
            return null;
        }

        String saleYnValue = saleYn.trim().toUpperCase();

        if (!saleYnValue.equals("Y") && !saleYnValue.equals("N")) {
            throw new StoreException(StoreErrorCode.INVALID_PRODUCT_SALE_YN);
        }

        return saleYnValue;
    }

    private String normalizeAdminSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return "latest";
        }

        String sortValue = sort.trim();

        if (!sortValue.equals("latest") && !sortValue.equals("oldest")) {
            throw new StoreException(StoreErrorCode.INVALID_ADMIN_PRODUCT_SORT);
        }

        return sortValue;
    }

    private PetType convertToPetType(String productTargetPetType) {
        if (productTargetPetType == null || productTargetPetType.isBlank()) {
            throw new StoreException(StoreErrorCode.PRODUCT_TARGET_PET_TYPE_REQUIRED);
        }

        return PetType.valueOf(productTargetPetType.trim().toUpperCase());
    }
}