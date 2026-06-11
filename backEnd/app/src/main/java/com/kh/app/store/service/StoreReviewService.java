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
import com.kh.app.store.entity.StoreOrderItemEntity;
import com.kh.app.store.entity.StoreReviewEntity;
import com.kh.app.store.entity.StoreReviewImageEntity;
import com.kh.app.store.repository.StoreOrderItemRepository;
import com.kh.app.store.repository.StoreProductImageRepository;
import com.kh.app.store.repository.StoreReviewImageRepository;
import com.kh.app.store.repository.StoreReviewRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.kh.app.store.dto.response.StoreProductReviewResDto;
import com.kh.app.store.dto.response.StoreReviewListResDto;
import com.kh.app.store.dto.response.StoreReviewSummaryResDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.io.IOException;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class StoreReviewService {

    private final StoreReviewRepository storeReviewRepository;
    private final StoreReviewImageRepository storeReviewImageRepository;
    private final StoreOrderItemRepository storeOrderItemRepository;
    private final MemberRepository memberRepository;
    private final StoreProductImageRepository storeProductImageRepository;

    private final S3Service s3Service;

    //포인트 관련
    private final PointService pointService;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    @Transactional
    public void write(
            StoreReviewWriteReqDto reqDto,
            List<MultipartFile> fileList,
            String username
    ) throws IOException {

        if (username == null || username.isBlank()) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }

        validateReqDto(reqDto);
        validateFileList(fileList);

        MemberEntity member = memberRepository
                .findByUsernameAndDelYn(username, DelYn.N)
                .orElseThrow(() -> new EntityNotFoundException("MEMBER NOT FOUND ........"));

        StoreOrderItemEntity orderItem = storeOrderItemRepository
                .findById(reqDto.getOrderItemId())
                .orElseThrow(() -> new EntityNotFoundException("ORDER ITEM NOT FOUND ........"));

        validateOrderItemOwner(orderItem, member);
        validateOrderStatus(orderItem);
        validateDuplicateReview(orderItem);

        StoreReviewEntity review = reqDto.toEntity(orderItem, member);
        storeReviewRepository.save(review);

        saveReviewImages(review, fileList);

        //리뷰 작성 포인트 지급
        //회원 + 상품 기준 최초 1회만 지급
        pointService.tryEarnReviewWritePoint(
                member,
                review.getProduct().getProductId()
        );


        log.info("[스토어 리뷰 작성 완료] reviewId : {}, orderItemId : {}, memberId : {}",
                review.getReviewId(),
                orderItem.getOrderItemId(),
                member.getId()
        );
    }

    private void validateReqDto(StoreReviewWriteReqDto reqDto) {
        if (reqDto == null) {
            throw new IllegalArgumentException("리뷰 작성 데이터가 없습니다.");
        }

        if (reqDto.getOrderItemId() == null) {
            throw new IllegalArgumentException("주문상품 ID는 필수입니다.");
        }

        if (reqDto.getReviewTitle() == null || reqDto.getReviewTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("리뷰 제목은 필수입니다.");
        }

        if (reqDto.getReviewTitle().length() > 200) {
            throw new IllegalArgumentException("리뷰 제목은 200자 이하로 입력해주세요.");
        }

        if (reqDto.getReviewContent() == null || reqDto.getReviewContent().trim().isEmpty()) {
            throw new IllegalArgumentException("리뷰 내용은 필수입니다.");
        }

        if (reqDto.getReviewContent().length() > 500) {
            throw new IllegalArgumentException("리뷰 내용은 500자 이하로 입력해주세요.");
        }

        if (reqDto.getReviewRating() == null) {
            throw new IllegalArgumentException("별점은 필수입니다.");
        }

        if (reqDto.getReviewRating() < 1L || reqDto.getReviewRating() > 5L) {
            throw new IllegalArgumentException("별점은 1점부터 5점까지 입력 가능합니다.");
        }
    }

    private void validateFileList(List<MultipartFile> fileList) {
        if (fileList == null || fileList.isEmpty()) {
            return;
        }

        if (fileList.size() > 3) {
            throw new IllegalArgumentException("리뷰 이미지는 최대 3장까지 첨부 가능합니다.");
        }

        for (MultipartFile file : fileList) {
            if (file == null || file.isEmpty()) {
                continue;
            }

            String contentType = file.getContentType();

            if (contentType == null || !contentType.startsWith("image/")) {
                throw new IllegalArgumentException("이미지 파일만 업로드할 수 있습니다.");
            }

            if (file.getSize() > 3 * 1024 * 1024) {
                throw new IllegalArgumentException("리뷰 이미지는 파일당 최대 3MB까지 업로드할 수 있습니다.");
            }
        }
    }

    private void validateOrderItemOwner(StoreOrderItemEntity orderItem, MemberEntity member) {
        Long orderMemberId = orderItem.getOrder().getMember().getId();
        Long loginMemberId = member.getId();

        if (!orderMemberId.equals(loginMemberId)) {
            throw new IllegalStateException("본인이 구매한 상품에만 리뷰를 작성할 수 있습니다.");
        }
    }

    private void validateOrderStatus(StoreOrderItemEntity orderItem) {
        if (!orderItem.getOrder().isPaid()) {
            throw new IllegalStateException("결제 완료된 주문만 리뷰를 작성할 수 있습니다.");
        }
    }

    private void validateDuplicateReview(StoreOrderItemEntity orderItem) {
        boolean exists = storeReviewRepository.existsByOrderItem(orderItem);

        if (exists) {
            throw new IllegalStateException("이미 리뷰를 작성한 주문상품입니다.");
        }
    }

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

    public StoreProductReviewResDto getProductReviewList(
            Long productId,
            int page,
            String sort
    ) {
        Pageable pageable = PageRequest.of(page, 5);

        StoreReviewSummaryResDto summary = getReviewSummary(productId);

        Page<StoreReviewEntity> reviewEntityPage;

        if ("rating".equals(sort)) {
            reviewEntityPage = storeReviewRepository
                    .findByProduct_ProductIdAndDelYnOrderByReviewRatingDescCreatedAtDesc(
                            productId,
                            DelYn.N,
                            pageable
                    );
        } else {
            reviewEntityPage = storeReviewRepository
                    .findByProduct_ProductIdAndDelYnOrderByCreatedAtDesc(
                            productId,
                            DelYn.N,
                            pageable
                    );
        }

        Page<StoreReviewListResDto> reviewPage = reviewEntityPage.map(review -> {
            String memberProfileImageUrl = s3Service.getFileUrl(
                    review.getMember().getProfileImageUrl()
            );

            if (memberProfileImageUrl == null || memberProfileImageUrl.isBlank()) {
                memberProfileImageUrl = "/images/default-profile.png";
            }

            List<String> imageUrlList = storeReviewImageRepository
                    .findByReviewOrderByImageSortOrderAsc(review)
                    .stream()
                    .map(image -> s3Service.getFileUrl(image.getImageChangedName()))
                    .toList();

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

        averageRating = Math.round(averageRating * 10) / 10.0;

        return StoreReviewSummaryResDto.builder()
                .reviewCount(reviewCount)
                .averageRating(averageRating)
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
        if (total == null || total == 0) {
            return 0L;
        }

        return Math.round((count * 100.0) / total);
    }

    public Page<StoreMyReviewListResDto> getMyReviewList(
            String username,
            int page,
            String sort
    ) {
        if (username == null || username.isBlank()) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }

        MemberEntity member = memberRepository
                .findByUsernameAndDelYn(username, DelYn.N)
                .orElseThrow(() -> new EntityNotFoundException("MEMBER NOT FOUND ........"));

        Pageable pageable = PageRequest.of(page, 5);

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

            List<String> reviewImageUrlList = storeReviewImageRepository
                    .findByReviewOrderByImageSortOrderAsc(review)
                    .stream()
                    .map(image -> s3Service.getFileUrl(image.getImageChangedName()))
                    .toList();

            return StoreMyReviewListResDto.from(
                    review,
                    productMainImageUrl,
                    reviewImageUrlList
            );
        });
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

    @Transactional
    public void update(
            Long reviewId,
            StoreReviewUpdateReqDto reqDto,
            List<MultipartFile> fileList,
            String username
    ) throws IOException {

        if (username == null || username.isBlank()) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }

        validateUpdateReqDto(reqDto);
        validateFileList(fileList);

        StoreReviewEntity review = storeReviewRepository.findById(reviewId)
                .orElseThrow(() -> new EntityNotFoundException("Review NOT FOUND"));

        if (review.getDelYn() == DelYn.Y) {
            throw new IllegalStateException("삭제된 리뷰는 수정할 수 없습니다.");
        }

        MemberEntity member = memberRepository.findByUsernameAndDelYn(username, DelYn.N)
                .orElseThrow(() -> new EntityNotFoundException("Member NOT FOUND"));

        validateReviewOwner(review, member);

        review.update(
                reqDto.getReviewTitle(),
                reqDto.getReviewContent(),
                reqDto.getReviewRating()
        );

        // fileList가 오면 기존 이미지 전부 교체
        // fileList가 없으면 기존 이미지 유지
        if (fileList != null && !fileList.isEmpty()) {
            storeReviewImageRepository.deleteByReview(review);
            saveReviewImages(review, fileList);
        }

        log.info("[스토어 리뷰 수정 완료] reviewId : {}, memberId : {}",
                review.getReviewId(),
                member.getId()
        );

    }

    private void validateUpdateReqDto(StoreReviewUpdateReqDto reqDto) {
        if (reqDto == null) {
            throw new IllegalArgumentException("리뷰 수정 데이터가 없습니다.");
        }

        if (reqDto.getReviewTitle() == null || reqDto.getReviewTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("리뷰 제목은 필수입니다.");
        }

        if (reqDto.getReviewTitle().length() > 200) {
            throw new IllegalArgumentException("리뷰 제목은 200자 이하로 입력해주세요.");
        }

        if (reqDto.getReviewContent() == null || reqDto.getReviewContent().trim().isEmpty()) {
            throw new IllegalArgumentException("리뷰 내용은 필수입니다.");
        }

        if (reqDto.getReviewContent().length() > 500) {
            throw new IllegalArgumentException("리뷰 내용은 500자 이하로 입력해주세요.");
        }

        if (reqDto.getReviewRating() == null) {
            throw new IllegalArgumentException("별점은 필수입니다.");
        }

        if (reqDto.getReviewRating() < 1L || reqDto.getReviewRating() > 5L) {
            throw new IllegalArgumentException("별점은 1점부터 5점까지 입력 가능합니다.");
        }
    }

    private void validateReviewOwner(StoreReviewEntity review, MemberEntity member) {
        if (!review.getMember().getId().equals(member.getId())) {
            throw new IllegalStateException("본인이 작성한 리뷰만 수정할 수 있습니다.");
        }
    }

    @Transactional
    public void delete(Long reviewId, String username) {
        if (username == null || username.isBlank()) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }

        StoreReviewEntity review = storeReviewRepository.findById(reviewId)
                .orElseThrow(() -> new EntityNotFoundException("Review NOT FOUND"));

        MemberEntity member = memberRepository.findByUsernameAndDelYn(username, DelYn.N)
                .orElseThrow(() -> new EntityNotFoundException("Member NOT FOUND"));

        validateDeletePermission(review, member);

        // 1. 자식 테이블인 리뷰 이미지 먼저 삭제
        storeReviewImageRepository.deleteByReview(review);

        // 2. 부모 테이블인 리뷰 삭제
        storeReviewRepository.delete(review);

        log.info("[스토어 리뷰 물리 삭제 완료] reviewId : {}, 요청자 memberId : {}, role : {}",
                reviewId,
                member.getId(),
                member.getRole()
        );
    }

    private void validateDeletePermission(StoreReviewEntity review, MemberEntity member) {
        boolean isOwner = review.getMember().getId().equals(member.getId());
        boolean isAdminOrStore =
                member.getRole() == MemberRole.A || member.getRole() == MemberRole.S;

        if (!isOwner && !isAdminOrStore) {
            throw new IllegalStateException("리뷰 삭제 권한이 없습니다.");
        }
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
}