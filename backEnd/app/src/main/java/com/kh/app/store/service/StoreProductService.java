package com.kh.app.store.service;

import com.kh.app.aws.service.S3Service;
import com.kh.app.common.entity.DelYn;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.pet.entity.PetEntity;
import com.kh.app.pet.entity.PetType;
import com.kh.app.pet.repository.PetRepository;
import com.kh.app.store.dto.request.StoreFeedingGuideInsertReqDto;
import com.kh.app.store.dto.request.StoreInsertReqDto;
import com.kh.app.store.dto.request.StoreNutritionInsertReqDto;
import com.kh.app.store.dto.request.StoreUpdateReqDto;
import com.kh.app.store.dto.response.*;
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


import java.math.BigDecimal;
import java.util.Comparator;

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
    private final MemberRepository memberRepository;
    private final PetRepository petRepository;

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
    public StoreProductDetailResDto getProductDetail(Long productId, String username) {

        StoreProductEntity productEntity = storeProductRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다."));

        if (!productEntity.isOnSale()) {
            throw new IllegalStateException("판매중지된 상품입니다.");
        }

        // 조회수 증가
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

        applyFeedingRecommend(result, productEntity, feedingGuideList, username);

        return result;
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

        validateFeedingGuideList(feedingGuideList);

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

    private void validateFeedingGuideList(List<StoreFeedingGuideInsertReqDto> feedingGuideList) {
        if (feedingGuideList == null || feedingGuideList.isEmpty()) {
            return;
        }

        if (feedingGuideList.size() != 3) {
            throw new IllegalArgumentException("급여기준은 3개를 입력해야 합니다.");
        }

        for (StoreFeedingGuideInsertReqDto guideDto : feedingGuideList) {
            Long minWeight = guideDto.getFeedingMinWeight();
            Long maxWeight = guideDto.getFeedingMaxWeight();

            if (guideDto.getFeedingDailyAmount() == null || guideDto.getFeedingDailyAmount() <= 0) {
                throw new IllegalArgumentException("1일 급여량은 0보다 커야 합니다.");
            }

            if (minWeight != null && minWeight < 0) {
                throw new IllegalArgumentException("최소 체중은 0 이상이어야 합니다.");
            }

            if (maxWeight != null && maxWeight <= 0) {
                throw new IllegalArgumentException("최대 체중은 0보다 커야 합니다.");
            }

            if (minWeight != null && maxWeight != null && minWeight >= maxWeight) {
                throw new IllegalArgumentException("최소 체중은 최대 체중보다 작아야 합니다.");
            }
        }

        StoreFeedingGuideInsertReqDto first = feedingGuideList.get(0);
        StoreFeedingGuideInsertReqDto second = feedingGuideList.get(1);
        StoreFeedingGuideInsertReqDto third = feedingGuideList.get(2);

        if (first.getFeedingMinWeight() != null) {
            throw new IllegalArgumentException("1번 급여기준의 최소 체중은 비워야 합니다.");
        }

        if (first.getFeedingMaxWeight() == null) {
            throw new IllegalArgumentException("1번 급여기준의 최대 체중은 필수입니다.");
        }

        if (second.getFeedingMinWeight() == null || second.getFeedingMaxWeight() == null) {
            throw new IllegalArgumentException("2번 급여기준은 최소/최대 체중이 모두 필요합니다.");
        }

        if (third.getFeedingMinWeight() == null) {
            throw new IllegalArgumentException("3번 급여기준의 최소 체중은 필수입니다.");
        }

        if (third.getFeedingMaxWeight() != null) {
            throw new IllegalArgumentException("3번 급여기준의 최대 체중은 비워야 합니다.");
        }

        if (!first.getFeedingMaxWeight().equals(second.getFeedingMinWeight())) {
            throw new IllegalArgumentException("1번 최대 체중과 2번 최소 체중이 같아야 합니다.");
        }

        if (!second.getFeedingMaxWeight().equals(third.getFeedingMinWeight())) {
            throw new IllegalArgumentException("2번 최대 체중과 3번 최소 체중이 같아야 합니다.");
        }
    }

    private void applyFeedingRecommend(
            StoreProductDetailResDto result,
            StoreProductEntity productEntity,
            List<StoreProductFeedingGuideEntity> feedingGuideList,
            String username
    ) {
        // 1. 비로그인
        if (username == null || username.isBlank() || "anonymousUser".equals(username)) {
            result.setFeedingRecommendStatus("NEED_LOGIN");
            result.setFeedingRecommendMessage("로그인 후 맞춤 급여 정보를 확인할 수 있습니다.");
            result.setRecommendPetList(List.of());
            return;
        }

        // 2. 로그인 회원 조회
        // 상품 상세는 공개 페이지이므로 회원 조회 실패 시 상세 전체를 터뜨리지 않음
        MemberEntity memberEntity = memberRepository
                .findByUsernameAndDelYn(username, DelYn.N)
                .orElse(null);

        if (memberEntity == null) {
            result.setFeedingRecommendStatus("NEED_LOGIN");
            result.setFeedingRecommendMessage("로그인 후 맞춤 급여 정보를 확인할 수 있습니다.");
            result.setRecommendPetList(List.of());
            return;
        }

        // 3. 회원의 반려동물 전체 조회
        List<PetEntity> allPetList =
                petRepository.findAllByMember_IdAndDelYn(memberEntity.getId(), DelYn.N);

        // 4. 등록된 반려동물이 아예 없는 경우
        if (allPetList.isEmpty()) {
            result.setFeedingRecommendStatus("NEED_PET_REGISTER");
            result.setFeedingRecommendMessage("등록된 반려동물이 없습니다. 반려동물을 등록하고 맞춤 급여량을 확인해보세요.");
            result.setRecommendPetList(List.of());
            return;
        }

        // 5. 상품 대상동물 타입을 PetType으로 변환
        PetType targetPetType = convertToPetType(productEntity.getProductTargetPetType());

        // 6. 상품 대상동물과 같은 반려동물만 필터링
        //    최신순은 id가 큰 순서로 처리
        List<PetEntity> matchedPetList = allPetList.stream()
                .filter(pet -> pet.getBreed() != null)
                .filter(pet -> pet.getBreed().getPetType() == targetPetType)
                .sorted(Comparator.comparing(PetEntity::getId).reversed())
                .toList();

        // 7. 반려동물은 있지만 이 상품 타입에 맞는 동물이 없는 경우
        if (matchedPetList.isEmpty()) {
            result.setFeedingRecommendStatus("NO_MATCHED_PET");
            result.setFeedingRecommendMessage("이 상품에 맞는 반려동물이 등록되어 있지 않습니다.");
            result.setRecommendPetList(List.of());
            return;
        }

        // 8. 반려동물별 추천 급여량 만들기
        List<StorePetFeedingRecommendResDto> recommendPetList = matchedPetList.stream()
                .map(pet -> toPetFeedingRecommendDto(pet, feedingGuideList))
                .toList();

        result.setFeedingRecommendStatus("SUCCESS");
        result.setFeedingRecommendMessage("맞춤 급여량 조회 성공");
        result.setRecommendPetList(recommendPetList);
    }

    private PetType convertToPetType(String productTargetPetType) {
        if (productTargetPetType == null || productTargetPetType.isBlank()) {
            throw new IllegalArgumentException("상품 대상동물 타입이 없습니다.");
        }

        return PetType.valueOf(productTargetPetType.trim().toUpperCase());
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

                // 현재 PetEntity에는 이미지 필드가 없으므로 일단 null
                // 나중에 펫 담당자가 이미지 URL을 만들면 여기만 수정하면 됨
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

            boolean minOk = true;
            boolean maxOk = true;

            if (minWeight != null) {
                minOk = petWeight.compareTo(BigDecimal.valueOf(minWeight)) >= 0;
            }

            if (maxWeight != null) {
                maxOk = petWeight.compareTo(BigDecimal.valueOf(maxWeight)) < 0;
            }

            if (minOk && maxOk) {
                return guide;
            }
        }

        return null;
    }
}