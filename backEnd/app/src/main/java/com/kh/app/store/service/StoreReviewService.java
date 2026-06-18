package com.kh.app.store.service;

import com.kh.app.aws.service.S3Service;
import com.kh.app.common.entity.DelYn;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.entity.MemberRole;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.point.service.PointService;
import com.kh.app.store.dto.request.StoreReviewUpdateReqDto;
import com.kh.app.store.dto.request.StoreReviewWriteReqDto;
import com.kh.app.store.dto.response.StoreMyReviewListResDto;
import com.kh.app.store.dto.response.StoreProductReviewResDto;
import com.kh.app.store.dto.response.StoreReviewListResDto;
import com.kh.app.store.dto.response.StoreReviewSummaryResDto;
import com.kh.app.store.entity.StoreOrderItemEntity;
import com.kh.app.store.entity.StoreReviewEntity;
import com.kh.app.store.entity.StoreReviewImageEntity;
import com.kh.app.store.exception.StoreErrorCode;
import com.kh.app.store.exception.StoreException;
import com.kh.app.store.repository.StoreOrderItemRepository;
import com.kh.app.store.repository.StoreProductImageRepository;
import com.kh.app.store.repository.StoreReviewImageRepository;
import com.kh.app.store.repository.StoreReviewRepository;
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
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class StoreReviewService {

    private static final int REVIEW_PAGE_SIZE = 5;
    private static final int MAX_REVIEW_IMAGE_COUNT = 3;
    private static final long MAX_REVIEW_IMAGE_SIZE = 3 * 1024 * 1024L;

    private final StoreReviewRepository storeReviewRepository;
    private final StoreReviewImageRepository storeReviewImageRepository;
    private final StoreOrderItemRepository storeOrderItemRepository;
    private final StoreProductImageRepository storeProductImageRepository;
    private final MemberRepository memberRepository;
    private final S3Service s3Service;
    private final PointService pointService;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

// =====================================================
// 리뷰 작성
// =====================================================

    @Transactional
    public void write(
            StoreReviewWriteReqDto reqDto,
            List<MultipartFile> fileList,
            String username
    ) throws IOException {

        validateLogin(username);
        validateWriteReqDto(reqDto);
        validateFileList(fileList);

        MemberEntity member = getLoginMember(username);
        StoreOrderItemEntity orderItem = getOrderItemEntity(reqDto.getOrderItemId());

        validateOrderItemOwner(orderItem, member);
        validateOrderStatus(orderItem);
        validateDuplicateReview(orderItem);

        StoreReviewEntity review = reqDto.toEntity(orderItem, member);

        storeReviewRepository.save(review);
        saveReviewImages(review, fileList);

        // 회원 + 상품 기준 최초 1회만 리뷰 작성 포인트 지급
        pointService.tryEarnReviewWritePoint(
                member,
                review.getProduct().getProductId()
        );

        log.info(
                "[스토어 리뷰 작성 완료] reviewId={}, orderItemId={}, memberId={}",
                review.getReviewId(),
                orderItem.getOrderItemId(),
                member.getId()
        );
    }

// =====================================================
// 상품별 리뷰 조회
// =====================================================

    public StoreProductReviewResDto getProductReviewList(
            Long productId,
            int page,
            String sort
    ) {
        if (productId == null) {
            throw new StoreException(StoreErrorCode.PRODUCT_ID_REQUIRED);
        }

        int pageNo = Math.max(page, 0);
        Pageable pageable = PageRequest.of(pageNo, REVIEW_PAGE_SIZE);

        StoreReviewSummaryResDto summary = getReviewSummary(productId);
        Page<StoreReviewEntity> reviewEntityPage = findProductReviewPage(productId, sort, pageable);

        Page<StoreReviewListResDto> reviewPage = reviewEntityPage.map(review -> {
            String memberProfileImageUrl = getMemberProfileImageUrl(review);
            List<String> imageUrlList = getReviewImageUrlList(review);

            return StoreReviewListResDto.from(
                    review,
                    memberProfileImageUrl,
                    imageUrlList
            );
        });

        return StoreProductReviewResDto.builder()
                .summary(summary)
                .reviewPage(reviewPage)
                .build();
    }

    private Page<StoreReviewEntity> findProductReviewPage(
            Long productId,
            String sort,
            Pageable pageable
    ) {
        if ("rating".equals(sort)) {
            return storeReviewRepository
                    .findByProduct_ProductIdAndDelYnOrderByReviewRatingDescCreatedAtDesc(
                            productId,
                            DelYn.N,
                            pageable
                    );
        }

        return storeReviewRepository
                .findByProduct_ProductIdAndDelYnOrderByCreatedAtDesc(
                        productId,
                        DelYn.N,
                        pageable
                );
    }

    private StoreReviewSummaryResDto getReviewSummary(Long productId) {
        Long reviewCount = storeReviewRepository.countByProduct_ProductIdAndDelYn(
                productId,
                DelYn.N
        );

        Long rating5Count = storeReviewRepository.countByProduct_ProductIdAndReviewRatingAndDelYn(productId, 5L, DelYn.N);
        Long rating4Count = storeReviewRepository.countByProduct_ProductIdAndReviewRatingAndDelYn(productId, 4L, DelYn.N);
        Long rating3Count = storeReviewRepository.countByProduct_ProductIdAndReviewRatingAndDelYn(productId, 3L, DelYn.N);
        Long rating2Count = storeReviewRepository.countByProduct_ProductIdAndReviewRatingAndDelYn(productId, 2L, DelYn.N);
        Long rating1Count = storeReviewRepository.countByProduct_ProductIdAndReviewRatingAndDelYn(productId, 1L, DelYn.N);

        Double averageRating = storeReviewRepository.getAverageRatingByProductIdAndDelYn(
                productId,
                DelYn.N
        );

        double roundedAverageRating = averageRating == null
                ? 0.0
                : Math.round(averageRating * 10) / 10.0;

        return StoreReviewSummaryResDto.builder()
                .reviewCount(reviewCount)
                .averageRating(roundedAverageRating)
                .rating5Count(rating5Count)
                .rating5Percent(calculatePercent(rating5Count, reviewCount))
                .rating4Count(rating4Count)
                .rating4Percent(calculatePercent(rating4Count, reviewCount))
                .rating3Count(rating3Count)
                .rating3Percent(calculatePercent(rating3Count, reviewCount))
                .rating2Count(rating2Count)
                .rating2Percent(calculatePercent(rating2Count, reviewCount))
                .rating1Count(rating1Count)
                .rating1Percent(calculatePercent(rating1Count, reviewCount))
                .build();
    }

    private Long calculatePercent(Long count, Long total) {
        if (count == null || total == null || total == 0) {
            return 0L;
        }

        return Math.round((count * 100.0) / total);
    }

// =====================================================
// 내 리뷰 조회
// =====================================================

    public Page<StoreMyReviewListResDto> getMyReviewList(
            String username,
            int page,
            String sort
    ) {
        validateLogin(username);

        MemberEntity member = getLoginMember(username);
        int pageNo = Math.max(page, 0);
        Pageable pageable = PageRequest.of(pageNo, REVIEW_PAGE_SIZE);

        Page<StoreReviewEntity> reviewEntityPage;

        if ("oldest".equals(sort)) {
            reviewEntityPage = storeReviewRepository
                    .findByMemberAndDelYnOrderByCreatedAtAsc(
                            member,
                            DelYn.N,
                            pageable
                    );
        } else {
            reviewEntityPage = storeReviewRepository
                    .findByMemberAndDelYnOrderByCreatedAtDesc(
                            member,
                            DelYn.N,
                            pageable
                    );
        }

        return reviewEntityPage.map(review -> {
            String productMainImageUrl = getProductMainImageUrl(review);
            List<String> reviewImageUrlList = getReviewImageUrlList(review);

            return StoreMyReviewListResDto.from(
                    review,
                    productMainImageUrl,
                    reviewImageUrlList
            );
        });
    }

// =====================================================
// 리뷰 수정
// =====================================================

    @Transactional
    public void update(
            Long reviewId,
            StoreReviewUpdateReqDto reqDto,
            List<MultipartFile> fileList,
            String username
    ) throws IOException {

        validateLogin(username);
        validateUpdateReqDto(reqDto);
        validateFileList(fileList);

        MemberEntity member = getLoginMember(username);
        StoreReviewEntity review = getReviewEntity(reviewId);

        if (review.getDelYn() == DelYn.Y) {
            throw new StoreException(StoreErrorCode.REVIEW_DELETED);
        }

        validateReviewOwner(review, member);

        review.update(
                reqDto.getReviewTitle(),
                reqDto.getReviewContent(),
                reqDto.getReviewRating()
        );

        // fileList가 있으면 기존 이미지를 전부 삭제하고 새 이미지로 교체
        // fileList가 없으면 기존 이미지를 유지
        if (fileList != null && !fileList.isEmpty()) {
            storeReviewImageRepository.deleteByReview(review);
            saveReviewImages(review, fileList);
        }

        log.info(
                "[스토어 리뷰 수정 완료] reviewId={}, memberId={}",
                review.getReviewId(),
                member.getId()
        );
    }

// =====================================================
// 리뷰 삭제
// =====================================================

    @Transactional
    public void delete(Long reviewId, String username) {
        validateLogin(username);

        MemberEntity member = getLoginMember(username);
        StoreReviewEntity review = getReviewEntity(reviewId);

        validateDeletePermission(review, member);

        // 물리 삭제이므로 자식 테이블인 리뷰 이미지 먼저 삭제
        storeReviewImageRepository.deleteByReview(review);

        // 부모 테이블인 리뷰 삭제
        storeReviewRepository.delete(review);

        log.info(
                "[스토어 리뷰 물리 삭제 완료] reviewId={}, 요청자 memberId={}, role={}",
                reviewId,
                member.getId(),
                member.getRole()
        );
    }

// =====================================================
// 리뷰 이미지
// =====================================================

    private void saveReviewImages(
            StoreReviewEntity review,
            List<MultipartFile> fileList
    ) throws IOException {

        if (fileList == null || fileList.isEmpty()) {
            return;
        }

        int sortOrder = 0;

        for (MultipartFile file : fileList) {
            if (file == null || file.isEmpty()) {
                continue;
            }

            String changedName = s3Service.upload(file, "review");

            StoreReviewImageEntity imageEntity = StoreReviewImageEntity.from(
                    review,
                    file,
                    changedName,
                    sortOrder
            );

            storeReviewImageRepository.save(imageEntity);

            sortOrder++;
        }
    }

    private List<String> getReviewImageUrlList(StoreReviewEntity review) {
        return storeReviewImageRepository
                .findByReviewOrderByImageSortOrderAsc(review)
                .stream()
                .map(image -> s3Service.getFileUrl(image.getImageChangedName()))
                .toList();
    }

    private String getMemberProfileImageUrl(StoreReviewEntity review) {
        String profileImageUrl = s3Service.getFileUrl(
                review.getMember().getProfileImageUrl()
        );

        if (profileImageUrl == null || profileImageUrl.isBlank()) {
            return "/images/default-profile.png";
        }

        return profileImageUrl;
    }

    private String getProductMainImageUrl(StoreReviewEntity review) {
        return storeProductImageRepository
                .findFirstByProduct_ProductIdAndImageRepresentYnOrderBySortOrderAsc(
                        review.getProduct().getProductId(),
                        "Y"
                )
                .map(image -> makeS3Url(image.getImageChangedName()))
                .orElse("");
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

// =====================================================
// 검증
// =====================================================

    private void validateWriteReqDto(StoreReviewWriteReqDto reqDto) {
        if (reqDto == null) {
            throw new StoreException(StoreErrorCode.REVIEW_DATA_REQUIRED);
        }

        if (reqDto.getOrderItemId() == null) {
            throw new StoreException(StoreErrorCode.REVIEW_ORDER_ITEM_ID_REQUIRED);
        }

        validateReviewTextAndRating(
                reqDto.getReviewTitle(),
                reqDto.getReviewContent(),
                reqDto.getReviewRating()
        );
    }

    private void validateUpdateReqDto(StoreReviewUpdateReqDto reqDto) {
        if (reqDto == null) {
            throw new StoreException(StoreErrorCode.REVIEW_DATA_REQUIRED);
        }

        validateReviewTextAndRating(
                reqDto.getReviewTitle(),
                reqDto.getReviewContent(),
                reqDto.getReviewRating()
        );
    }

    private void validateReviewTextAndRating(
            String title,
            String content,
            Long rating
    ) {
        if (title == null || title.trim().isEmpty()) {
            throw new StoreException(StoreErrorCode.REVIEW_TITLE_REQUIRED);
        }

        if (title.length() > 200) {
            throw new StoreException(StoreErrorCode.REVIEW_TITLE_TOO_LONG);
        }

        if (content == null || content.trim().isEmpty()) {
            throw new StoreException(StoreErrorCode.REVIEW_CONTENT_REQUIRED);
        }

        if (content.length() > 500) {
            throw new StoreException(StoreErrorCode.REVIEW_CONTENT_TOO_LONG);
        }

        if (rating == null) {
            throw new StoreException(StoreErrorCode.REVIEW_RATING_REQUIRED);
        }

        if (rating < 1L || rating > 5L) {
            throw new StoreException(StoreErrorCode.INVALID_REVIEW_RATING);
        }
    }

    private void validateFileList(List<MultipartFile> fileList) {
        if (fileList == null || fileList.isEmpty()) {
            return;
        }

        if (fileList.size() > MAX_REVIEW_IMAGE_COUNT) {
            throw new StoreException(StoreErrorCode.REVIEW_IMAGE_COUNT_EXCEEDED);
        }

        for (MultipartFile file : fileList) {
            if (file == null || file.isEmpty()) {
                continue;
            }

            String contentType = file.getContentType();

            if (contentType == null || !contentType.startsWith("image/")) {
                throw new StoreException(StoreErrorCode.INVALID_REVIEW_IMAGE_TYPE);
            }

            if (file.getSize() > MAX_REVIEW_IMAGE_SIZE) {
                throw new StoreException(StoreErrorCode.REVIEW_IMAGE_SIZE_EXCEEDED);
            }
        }
    }

    private void validateOrderItemOwner(
            StoreOrderItemEntity orderItem,
            MemberEntity member
    ) {
        Long orderMemberId = orderItem.getOrder().getMember().getId();
        Long loginMemberId = member.getId();

        if (!orderMemberId.equals(loginMemberId)) {
            throw new StoreException(StoreErrorCode.REVIEW_ORDER_ACCESS_DENIED);
        }
    }

    private void validateOrderStatus(StoreOrderItemEntity orderItem) {
        if (!orderItem.getOrder().isPaid()) {
            throw new StoreException(StoreErrorCode.REVIEW_ORDER_NOT_PAID);
        }
    }

    private void validateDuplicateReview(StoreOrderItemEntity orderItem) {
        boolean exists = storeReviewRepository.existsByOrderItem(orderItem);

        if (exists) {
            throw new StoreException(StoreErrorCode.REVIEW_ALREADY_WRITTEN);
        }
    }

    private void validateReviewOwner(
            StoreReviewEntity review,
            MemberEntity member
    ) {
        if (!review.getMember().getId().equals(member.getId())) {
            throw new StoreException(StoreErrorCode.REVIEW_ACCESS_DENIED);
        }
    }

    private void validateDeletePermission(
            StoreReviewEntity review,
            MemberEntity member
    ) {
        boolean isOwner = review.getMember().getId().equals(member.getId());
        boolean isAdminOrStore =
                member.getRole() == MemberRole.A || member.getRole() == MemberRole.S;

        if (!isOwner && !isAdminOrStore) {
            throw new StoreException(StoreErrorCode.REVIEW_DELETE_ACCESS_DENIED);
        }
    }

    private void validateLogin(String username) {
        if (isNotLogin(username)) {
            throw new StoreException(StoreErrorCode.REVIEW_LOGIN_REQUIRED);
        }
    }

// =====================================================
// 공통 조회 유틸
// =====================================================

    private MemberEntity getLoginMember(String username) {
        return memberRepository
                .findByUsernameAndDelYn(username, DelYn.N)
                .orElseThrow(() -> new StoreException(StoreErrorCode.REVIEW_MEMBER_NOT_FOUND));
    }

    private StoreOrderItemEntity getOrderItemEntity(Long orderItemId) {
        return storeOrderItemRepository
                .findById(orderItemId)
                .orElseThrow(() -> new StoreException(StoreErrorCode.REVIEW_ORDER_ITEM_NOT_FOUND));
    }

    private StoreReviewEntity getReviewEntity(Long reviewId) {
        return storeReviewRepository
                .findById(reviewId)
                .orElseThrow(() -> new StoreException(StoreErrorCode.REVIEW_NOT_FOUND));
    }

    private boolean isNotLogin(String username) {
        return username == null || username.isBlank() || "anonymousUser".equals(username);
    }


}
