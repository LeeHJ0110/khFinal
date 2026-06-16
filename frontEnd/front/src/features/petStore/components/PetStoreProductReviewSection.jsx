import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styled, { keyframes } from "styled-components";
import usePetStoreProductReviewList from "../hooks/usePetStoreProductReviewList";
import noImgIcon from "../../../assets/images/icon/녹색발바닥아이콘.png";

function renderStars(rating) {
  const score = Math.round(Number(rating ?? 0));

  return "★★★★★"
    .split("")
    .map((star, index) => (index < score ? "★" : "☆"))
    .join("");
}

function getRatingPercent(summary, rating) {
  const total = Number(summary?.reviewCount ?? 0);

  if (total <= 0) {
    return 0;
  }

  const countMap = {
    5: summary?.rating5Count,
    4: summary?.rating4Count,
    3: summary?.rating3Count,
    2: summary?.rating2Count,
    1: summary?.rating1Count,
  };

  return Math.round((Number(countMap[rating] ?? 0) / total) * 100);
}

function getReviewImageUrlList(review) {
  return review?.reviewImageUrlList ?? review?.imageUrlList ?? [];
}

export default function PetStoreProductReviewSection({ productId }) {
  const {
    summary,
    reviewPage,
    reviewList,
    galleryImageList,
    previewImageList,
    page,
    sort,
    isLoading,
    handleChangeSort,
    handleMovePage,
  } = usePetStoreProductReviewList(productId);

  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(-1);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [failedProfileImageMap, setFailedProfileImageMap] = useState({});

  const modalImageList = galleryImageList
    .map((image) => image.url)
    .filter(Boolean);

  const isAnyModalOpen = isImageModalOpen || isGalleryModalOpen;
  const canMoveImage = modalImageList.length > 1 && selectedImageIndex >= 0;

  const totalReviews = reviewPage?.totalElements ?? summary?.reviewCount ?? 0;
  const averageRating = Number(summary?.averageRating ?? 0).toFixed(1);

  function handleOpenImage(url) {
    const foundIndex = modalImageList.findIndex((imageUrl) => imageUrl === url);

    setSelectedImageUrl(url);
    setSelectedImageIndex(foundIndex);
    setIsImageModalOpen(true);
  }

  function handleCloseImageModal() {
    setIsImageModalOpen(false);
    setSelectedImageUrl("");
    setSelectedImageIndex(-1);
  }

  function handlePrevModalImage() {
    if (!canMoveImage) {
      return;
    }

    const nextIndex =
      selectedImageIndex <= 0
        ? modalImageList.length - 1
        : selectedImageIndex - 1;

    setSelectedImageIndex(nextIndex);
    setSelectedImageUrl(modalImageList[nextIndex]);
  }

  function handleNextModalImage() {
    if (!canMoveImage) {
      return;
    }

    const nextIndex =
      selectedImageIndex >= modalImageList.length - 1
        ? 0
        : selectedImageIndex + 1;

    setSelectedImageIndex(nextIndex);
    setSelectedImageUrl(modalImageList[nextIndex]);
  }

  function handlePrevPage() {
    if (page <= 0) {
      return;
    }

    handleMovePage(page - 1);
  }

  function handleNextPage() {
    if (!reviewPage || reviewPage.last) {
      return;
    }

    handleMovePage(page + 1);
  }

  function handleSortClick(nextSort) {
    if (sort === nextSort) {
      return;
    }

    handleChangeSort(nextSort);
  }

  function handleProfileImageError(reviewId) {
    setFailedProfileImageMap((prev) => ({
      ...prev,
      [reviewId]: true,
    }));
  }

  useEffect(() => {
    if (!isAnyModalOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isAnyModalOpen]);

  useEffect(() => {
    function handleKeyDown(evt) {
      if (evt.key === "Escape") {
        if (isImageModalOpen) {
          handleCloseImageModal();
          return;
        }

        if (isGalleryModalOpen) {
          setIsGalleryModalOpen(false);
        }

        return;
      }

      if (!isImageModalOpen) {
        return;
      }

      if (evt.key === "ArrowLeft") {
        handlePrevModalImage();
      }

      if (evt.key === "ArrowRight") {
        handleNextModalImage();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isImageModalOpen,
    isGalleryModalOpen,
    selectedImageIndex,
    modalImageList.length,
  ]);

  return (
    <ReviewSection>
      <SectionHeader>
        <SectionTitle>구매자 리뷰</SectionTitle>
        <SectionDesc>
          실제 구매자들이 남긴 사진과 후기를 확인해보세요.
        </SectionDesc>
      </SectionHeader>

      <SummaryCard>
        <AverageBox>
          <AverageLabel>평균 평점</AverageLabel>
          <AverageScore>{averageRating}</AverageScore>
          <AverageStars>{renderStars(averageRating)}</AverageStars>
          <AverageDesc>
            총 {Number(totalReviews).toLocaleString()}개의 리뷰 기준
          </AverageDesc>
        </AverageBox>

        <RatingBars>
          {[5, 4, 3, 2, 1].map((rating) => {
            const percent = getRatingPercent(summary, rating);

            return (
              <RatingRow key={rating}>
                <RatingLabel>{rating}점</RatingLabel>
                <RatingBarTrack>
                  <RatingBarFill style={{ width: `${percent}%` }} />
                </RatingBarTrack>
                <RatingPercent>{percent}%</RatingPercent>
              </RatingRow>
            );
          })}
        </RatingBars>
      </SummaryCard>

      <GalleryPreviewArea>
        <GalleryHeader>
          <GalleryTitle>리뷰 포토</GalleryTitle>
          <GalleryDesc>사진을 클릭하면 크게 볼 수 있습니다.</GalleryDesc>
        </GalleryHeader>

        {previewImageList.length > 0 ? (
          <GalleryPreviewList>
            {previewImageList.map((image, index) => {
              const isMoreCard =
                index === 5 &&
                galleryImageList.length > previewImageList.length;

              if (isMoreCard) {
                return (
                  <GalleryMoreButton
                    key={`${image.url}-${index}`}
                    type="button"
                    onClick={() => setIsGalleryModalOpen(true)}
                  >
                    <GalleryThumb src={image.url} alt="리뷰 이미지 더보기" />

                    <MoreOverlay>
                      <span>전체보기</span>
                      <strong>+{galleryImageList.length - 5}</strong>
                    </MoreOverlay>
                  </GalleryMoreButton>
                );
              }

              return (
                <GalleryImageButton
                  key={`${image.url}-${index}`}
                  type="button"
                  onClick={() => handleOpenImage(image.url)}
                >
                  <GalleryThumb
                    src={image.url}
                    alt={`리뷰 이미지 ${index + 1}`}
                  />
                  <ZoomIcon>⌕</ZoomIcon>
                </GalleryImageButton>
              );
            })}
          </GalleryPreviewList>
        ) : (
          <NoGalleryText>등록된 리뷰 이미지가 없습니다.</NoGalleryText>
        )}
      </GalleryPreviewArea>

      <ReviewToolbar>
        <TotalCount>
          전체 <strong>{Number(totalReviews).toLocaleString()}건</strong>
        </TotalCount>

        <SortButtonGroup>
          <SortButton
            type="button"
            $active={sort === "latest"}
            onClick={() => handleSortClick("latest")}
          >
            최신순
          </SortButton>

          <SortButton
            type="button"
            $active={sort === "rating"}
            onClick={() => handleSortClick("rating")}
          >
            별점순
          </SortButton>
        </SortButtonGroup>
      </ReviewToolbar>

      {isLoading ? (
        <LoadingBox>리뷰를 불러오는 중입니다.</LoadingBox>
      ) : reviewList.length === 0 ? (
        <EmptyBox>아직 등록된 리뷰가 없습니다.</EmptyBox>
      ) : (
        <ReviewList>
          {reviewList.map((review) => {
            const reviewImageUrlList = getReviewImageUrlList(review);

            return (
              <ReviewCard key={review.reviewId}>
                <ReviewerArea>
                  <ProfileImageBox>
                    {review.memberProfileImageUrl &&
                    !failedProfileImageMap[review.reviewId] ? (
                      <ProfileImage
                        src={review.memberProfileImageUrl}
                        alt={review.memberNickname ?? "리뷰 작성자"}
                        onError={() => handleProfileImageError(review.reviewId)}
                      />
                    ) : (
                      <ProfilePlaceholder aria-label="기본 프로필">
                        <ProfilePlaceholderIcon
                          src={noImgIcon}
                          alt=""
                          aria-hidden="true"
                        />
                      </ProfilePlaceholder>
                    )}
                  </ProfileImageBox>

                  <ReviewerInfo>
                    <ReviewerName>
                      {review.memberNickname ?? review.nickname ?? "구매자"}
                    </ReviewerName>

                    <ReviewerMeta>{review.createdAt}</ReviewerMeta>
                  </ReviewerInfo>
                </ReviewerArea>

                <ReviewContentArea>
                  <ReviewStarRow>
                    <ReviewStars>
                      {renderStars(review.reviewRating)}
                    </ReviewStars>
                    <ReviewRating>{review.reviewRating}</ReviewRating>
                  </ReviewStarRow>

                  <ReviewTitle>{review.reviewTitle}</ReviewTitle>
                  <ReviewContent>{review.reviewContent}</ReviewContent>
                </ReviewContentArea>

                <ReviewDate aria-hidden="true" />

                <ReviewImages>
                  {reviewImageUrlList.slice(0, 3).map((url, index) => (
                    <ReviewImageButton
                      key={`${review.reviewId}-${url}-${index}`}
                      type="button"
                      onClick={() => handleOpenImage(url)}
                    >
                      <ReviewImage
                        src={url}
                        alt={`리뷰 첨부 이미지 ${index + 1}`}
                      />
                      <SmallZoomIcon>⌕</SmallZoomIcon>
                    </ReviewImageButton>
                  ))}
                </ReviewImages>
              </ReviewCard>
            );
          })}
        </ReviewList>
      )}

      {reviewPage && reviewPage.totalPages > 1 && (
        <Pagination>
          <PageButton
            type="button"
            disabled={page <= 0}
            onClick={handlePrevPage}
          >
            이전
          </PageButton>

          <PageInfo>
            {page + 1} / {reviewPage.totalPages}
          </PageInfo>

          <PageButton
            type="button"
            disabled={reviewPage.last}
            onClick={handleNextPage}
          >
            다음
          </PageButton>
        </Pagination>
      )}

      {isGalleryModalOpen &&
        createPortal(
          <ModalOverlay
            $zIndex={99999}
            onClick={() => setIsGalleryModalOpen(false)}
          >
            <GalleryModalBox onClick={(evt) => evt.stopPropagation()}>
              <GalleryModalHeader>
                <GalleryModalTitleBox>
                  <GalleryModalEyebrow>REVIEW PHOTO</GalleryModalEyebrow>
                  <GalleryModalTitle>갤러리</GalleryModalTitle>
                  <GalleryModalDesc>
                    실제 구매자들이 등록한 리뷰 이미지를 한눈에 모아볼 수
                    있습니다.
                  </GalleryModalDesc>
                </GalleryModalTitleBox>

                <ModalCloseButton
                  type="button"
                  onClick={() => setIsGalleryModalOpen(false)}
                  aria-label="갤러리 닫기"
                >
                  ×
                </ModalCloseButton>
              </GalleryModalHeader>

              <GalleryModalSubTitle>
                이미지 <strong>{galleryImageList.length}</strong>
              </GalleryModalSubTitle>

              <GalleryGrid>
                {galleryImageList.map((image, index) => (
                  <GalleryGridButton
                    key={`${image.url}-${index}`}
                    type="button"
                    onClick={() => handleOpenImage(image.url)}
                  >
                    <GalleryGridImage
                      src={image.url}
                      alt={`전체 리뷰 이미지 ${index + 1}`}
                    />
                    <GalleryGridHover>
                      <span>크게보기</span>
                    </GalleryGridHover>
                  </GalleryGridButton>
                ))}
              </GalleryGrid>
            </GalleryModalBox>
          </ModalOverlay>,
          document.body,
        )}

      {isImageModalOpen &&
        createPortal(
          <ModalOverlay $zIndex={100000} onClick={handleCloseImageModal}>
            <ImageModalBox onClick={(evt) => evt.stopPropagation()}>
              {canMoveImage && (
                <>
                  <ImageMoveButton
                    type="button"
                    $left
                    onClick={handlePrevModalImage}
                    aria-label="이전 이미지"
                  >
                    ‹
                  </ImageMoveButton>

                  <ImageMoveButton
                    type="button"
                    $right
                    onClick={handleNextModalImage}
                    aria-label="다음 이미지"
                  >
                    ›
                  </ImageMoveButton>
                </>
              )}

              <ImageModalCloseButton
                type="button"
                onClick={handleCloseImageModal}
                aria-label="이미지 닫기"
              >
                ×
              </ImageModalCloseButton>

              <ImageCounter>
                {selectedImageIndex >= 0 ? selectedImageIndex + 1 : 1}
                <span>/</span>
                {modalImageList.length || 1}
              </ImageCounter>

              <LargeImage
                key={selectedImageUrl}
                src={selectedImageUrl}
                alt="리뷰 이미지 크게 보기"
              />
            </ImageModalBox>
          </ModalOverlay>,
          document.body,
        )}
    </ReviewSection>
  );
}

/* ================================
   Animations
================================ */

const overlayFadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const modalPopIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.97);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const imageZoomIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.965);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const cardFloatIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

/* ================================
   Layout
================================ */

const ReviewSection = styled.section`
  width: 100%;
  padding: 30px 0 42px;
`;

const SectionHeader = styled.div`
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  margin: 0 0 8px;

  color: var(--text-main);
  font-size: 25px;
  font-weight: 700;
  letter-spacing: -0.8px;
`;

const SectionDesc = styled.p`
  margin: 0;

  color: var(--text-sub);
  font-size: 13px;
  font-weight: 600;
`;

const SummaryCard = styled.div`
  min-height: 190px;
  padding: 30px 44px;

  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 46px;
  align-items: center;

  border: 1px solid rgba(0, 174, 142, 0.14);
  border-radius: 22px;
  background:
    radial-gradient(
      circle at top left,
      rgba(0, 174, 142, 0.12),
      transparent 34%
    ),
    linear-gradient(135deg, #ffffff 0%, #f8fffc 100%);
  box-shadow: 0 18px 42px rgba(18, 45, 46, 0.08);
`;

const AverageBox = styled.div`
  text-align: center;
`;

const AverageLabel = styled.p`
  margin: 0 0 9px;
  color: var(--text-sub);
  font-size: 13px;
  font-weight: 800;
`;

const AverageScore = styled.strong`
  display: block;
  color: var(--text-main);
  font-size: 52px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -1.5px;
`;

const AverageStars = styled.div`
  margin-top: 12px;
  color: #ffb400;
  font-size: 22px;
  letter-spacing: 1.2px;
  text-shadow: 0 4px 12px rgba(255, 180, 0, 0.24);
`;

const AverageDesc = styled.p`
  margin: 11px 0 0;
  color: var(--text-sub);
  font-size: 12px;
  font-weight: 700;
`;

const RatingBars = styled.div`
  display: flex;
  flex-direction: column;
  gap: 13px;
`;

const RatingRow = styled.div`
  display: grid;
  grid-template-columns: 44px 1fr 48px;
  gap: 13px;
  align-items: center;
`;

const RatingLabel = styled.span`
  color: var(--text-main);
  font-size: 13px;
  font-weight: 800;
`;

const RatingBarTrack = styled.div`
  height: 11px;
  overflow: hidden;

  border-radius: 999px;
  background-color: #e6f1ed;
`;

const RatingBarFill = styled.div`
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--color-main), #74dec8);
  box-shadow: 0 0 14px rgba(0, 174, 142, 0.25);
  transition: width 0.35s ease;
`;

const RatingPercent = styled.span`
  color: var(--text-sub);
  font-size: 12px;
  font-weight: 800;
  text-align: right;
`;

/* ================================
   Gallery Preview
================================ */

const GalleryPreviewArea = styled.div`
  margin-top: 30px;
`;

const GalleryHeader = styled.div`
  margin-bottom: 12px;

  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const GalleryTitle = styled.h3`
  margin: 0;

  color: var(--text-main);
  font-size: 18px;
  font-weight: 900;
  letter-spacing: -0.4px;
`;

const GalleryDesc = styled.p`
  margin: 0;

  color: var(--text-sub);
  font-size: 12px;
  font-weight: 700;
`;

const GalleryPreviewList = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
`;

const GalleryImageButton = styled.button`
  position: relative;

  height: 150px;
  overflow: hidden;

  border: 0;
  border-radius: 14px;
  background-color: #f4f4f4;
  padding: 0;
  cursor: pointer;

  box-shadow: 0 10px 24px rgba(18, 45, 46, 0.08);

  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;

  &::after {
    content: "";
    position: absolute;
    inset: 0;

    background: linear-gradient(
      180deg,
      transparent 42%,
      rgba(0, 0, 0, 0.28) 100%
    );

    opacity: 0;
    transition: opacity 0.16s ease;
  }

  &:hover {
    transform: translateY(-5px) scale(1.015);
    box-shadow: 0 18px 34px rgba(18, 45, 46, 0.15);
  }

  &:hover::after {
    opacity: 1;
  }

  &:hover img {
    transform: scale(1.07);
  }
`;

const GalleryMoreButton = styled(GalleryImageButton)``;

const GalleryThumb = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;

  transition: transform 0.22s ease;
`;

const ZoomIcon = styled.span`
  position: absolute;
  right: 12px;
  bottom: 12px;
  z-index: 2;

  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 12px;
  background-color: rgba(0, 174, 142, 0.9);
  color: #ffffff;
  font-size: 19px;
  font-weight: 900;

  box-shadow: 0 8px 18px rgba(0, 174, 142, 0.28);
`;

const MoreOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 3;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background:
    linear-gradient(135deg, rgba(0, 174, 142, 0.82), rgba(18, 45, 46, 0.7)),
    rgba(0, 0, 0, 0.45);
  color: #ffffff;

  span {
    font-size: 15px;
    font-weight: 900;
    letter-spacing: -0.2px;
  }

  strong {
    margin-top: 6px;
    font-size: 30px;
    font-weight: 950;
    line-height: 1;
  }
`;

const NoGalleryText = styled.div`
  height: 110px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px dashed #cfe5de;
  border-radius: 16px;
  background-color: #fbfffd;

  color: var(--text-sub);
  font-size: 14px;
  font-weight: 800;
`;

/* ================================
   Toolbar
================================ */

const ReviewToolbar = styled.div`
  height: 48px;
  margin-top: 32px;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TotalCount = styled.p`
  margin: 0;
  color: var(--text-main);
  font-size: 14px;
  font-weight: 800;

  strong {
    color: var(--color-main);
    font-weight: 950;
  }
`;

const SortButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const SortButton = styled.button`
  height: 34px;
  padding: 0 16px;

  border: 1px solid
    ${({ $active }) => ($active ? "var(--color-main)" : "#dce7e2")};
  border-radius: 999px;
  background-color: ${({ $active }) =>
    $active ? "var(--color-main)" : "var(--color-white)"};

  color: ${({ $active }) => ($active ? "#ffffff" : "var(--text-main)")};
  font-size: 12px;
  font-weight: 900;
  cursor: pointer;

  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease,
    background-color 0.16s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ $active }) =>
      $active ? "0 8px 18px rgba(0, 174, 142, 0.22)" : "none"};
  }
`;

/* ================================
   Review List
================================ */

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const ReviewCard = styled.article`
  min-height: 112px;
  padding: 22px 24px;

  display: grid;
  grid-template-columns: 170px 1fr 92px 220px;
  gap: 22px;
  align-items: center;

  border: 1px solid rgba(0, 174, 142, 0.1);
  border-radius: 18px;
  background-color: var(--color-white);
  box-shadow: 0 12px 28px rgba(18, 45, 46, 0.055);

  animation: ${cardFloatIn} 0.28s ease both;

  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(0, 174, 142, 0.25);
    box-shadow: 0 18px 34px rgba(18, 45, 46, 0.09);
  }
`;

const ReviewerArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProfileImageBox = styled.div`
  width: 50px;
  height: 50px;
  overflow: hidden;
  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(0, 174, 142, 0.28);
  border-radius: 50%;
  background: radial-gradient(
    circle at 35% 25%,
    #ffffff 0%,
    #f7fffc 38%,
    #e8fbf5 100%
  );

  box-shadow:
    0 8px 20px rgba(18, 45, 46, 0.08),
    inset 0 0 0 3px rgba(255, 255, 255, 0.82);
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfilePlaceholder = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  background:
    radial-gradient(
      circle at 35% 24%,
      rgba(255, 255, 255, 0.95),
      transparent 38%
    ),
    linear-gradient(135deg, #f4fffb 0%, #e0f8f0 100%);
`;

const ProfilePlaceholderIcon = styled.img`
  width: 31px;
  height: 31px;
  object-fit: contain;
  display: block;

  opacity: 0.96;
  transform: translateY(1px);
  filter: drop-shadow(0 4px 7px rgba(0, 174, 142, 0.2));

  user-select: none;
  pointer-events: none;
`;

const ReviewerInfo = styled.div`
  min-width: 0;
`;

const ReviewerName = styled.strong`
  display: block;
  color: var(--text-main);
  font-size: 13px;
  font-weight: 950;
`;

const ReviewerMeta = styled.span`
  display: block;
  margin-top: 4px;
  color: var(--text-sub);
  font-size: 11px;
  font-weight: 700;
`;

const ReviewContentArea = styled.div`
  min-width: 0;
`;

const ReviewStarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  margin-bottom: 6px;
`;

const ReviewStars = styled.span`
  color: #ffb400;
  font-size: 15px;
  letter-spacing: 0.5px;
`;

const ReviewRating = styled.strong`
  color: var(--text-main);
  font-size: 12px;
  font-weight: 950;
`;

const ReviewTitle = styled.h3`
  margin: 0 0 6px;

  color: var(--text-main);
  font-size: 15px;
  font-weight: 800;
`;

const ReviewContent = styled.p`
  margin: 0;

  color: var(--text-main);
  font-size: 12px;
  font-weight: 600;
  line-height: 1.55;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ReviewDate = styled.span`
  min-height: 1px;
`;

const ReviewImages = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const ReviewImageButton = styled.button`
  position: relative;

  width: 66px;
  height: 66px;
  overflow: hidden;

  border: 0;
  border-radius: 12px;
  background-color: #eeeeee;
  padding: 0;
  cursor: pointer;

  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 22px rgba(18, 45, 46, 0.16);
  }

  &:hover img {
    transform: scale(1.08);
  }
`;

const ReviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;

  transition: transform 0.22s ease;
`;

const SmallZoomIcon = styled.span`
  position: absolute;
  right: 5px;
  bottom: 5px;

  width: 21px;
  height: 21px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 7px;
  background-color: rgba(0, 174, 142, 0.92);
  color: #ffffff;
  font-size: 12px;
  font-weight: 900;
`;

const LoadingBox = styled.div`
  padding: 64px 0;
  text-align: center;
  color: var(--text-sub);
  font-size: 14px;
  font-weight: 800;
`;

const EmptyBox = styled(LoadingBox)``;

/* ================================
   Pagination
================================ */

const Pagination = styled.div`
  margin-top: 30px;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const PageButton = styled.button`
  height: 36px;
  padding: 0 16px;

  border: 1px solid #d8e9e3;
  border-radius: 999px;
  background-color: var(--color-white);

  color: var(--text-main);
  font-size: 12px;
  font-weight: 900;
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  min-width: 70px;
  text-align: center;
  color: var(--text-main);
  font-size: 13px;
  font-weight: 900;
`;

/* ================================
   Modal
================================ */

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${({ $zIndex }) => $zIndex ?? 99999};

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 24px;

  background:
    radial-gradient(circle at center, rgba(0, 174, 142, 0.1), transparent 48%),
    rgba(4, 12, 12, 0.72);

  animation: ${overlayFadeIn} 0.12s ease-out both;
`;

const GalleryModalBox = styled.div`
  position: relative;

  width: min(95vw, 1120px);
  max-height: 90vh;
  overflow-y: auto;

  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 28px;
  background:
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.99),
      rgba(244, 255, 251, 0.99)
    ),
    #ffffff;
  padding: 42px 52px 52px;

  box-shadow:
    0 38px 100px rgba(0, 0, 0, 0.38),
    0 0 0 1px rgba(0, 174, 142, 0.08);

  animation: ${modalPopIn} 0.18s ease-out both;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-thumb {
    border: 3px solid #ffffff;
    border-radius: 999px;
    background-color: #b7dcd2;
  }
`;

const GalleryModalHeader = styled.div`
  position: relative;

  padding-bottom: 24px;
  border-bottom: 1px solid #dceee8;
`;

const GalleryModalTitleBox = styled.div`
  padding-right: 58px;
`;

const GalleryModalEyebrow = styled.p`
  margin: 0 0 8px;

  color: var(--color-main);
  font-size: 11px;
  font-weight: 950;
  letter-spacing: 1.8px;
`;

const GalleryModalTitle = styled.h3`
  margin: 0;

  color: var(--text-main);
  font-size: 36px;
  font-weight: 950;
  line-height: 1;
  letter-spacing: -1.3px;
`;

const GalleryModalDesc = styled.p`
  margin: 12px 0 0;
  color: var(--text-sub);
  font-size: 13px;
  font-weight: 700;
`;

const GalleryModalSubTitle = styled.p`
  margin: 30px 0 18px;
  color: var(--text-main);
  font-size: 15px;
  font-weight: 900;

  strong {
    color: var(--color-main);
    font-weight: 950;
  }
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(136px, 1fr));
  gap: 14px;
`;

const GalleryGridButton = styled.button`
  position: relative;

  width: 100%;
  aspect-ratio: 1 / 1;

  overflow: hidden;
  border: 0;
  border-radius: 18px;
  background-color: #f2f2f2;
  padding: 0;
  cursor: pointer;

  box-shadow: 0 10px 24px rgba(18, 45, 46, 0.08);

  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease;

  &:hover {
    transform: translateY(-4px) scale(1.015);
    box-shadow: 0 20px 38px rgba(18, 45, 46, 0.16);
  }

  &:hover img {
    transform: scale(1.08);
  }

  &:hover div {
    opacity: 1;
  }
`;

const GalleryGridImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;

  transition: transform 0.2s ease;
`;

const GalleryGridHover = styled.div`
  position: absolute;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(
    135deg,
    rgba(0, 174, 142, 0.72),
    rgba(18, 45, 46, 0.58)
  );
  opacity: 0;

  transition: opacity 0.14s ease;

  span {
    padding: 8px 13px;
    border-radius: 999px;
    background-color: rgba(255, 255, 255, 0.95);
    color: var(--color-main);
    font-size: 12px;
    font-weight: 950;
  }
`;

const ImageModalBox = styled.div`
  position: relative;

  width: fit-content;
  max-width: min(82vw, 860px);
  max-height: 86vh;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 22px;
  background:
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.98),
      rgba(247, 255, 252, 0.96)
    ),
    #ffffff;
  padding: 14px;

  box-shadow:
    0 34px 90px rgba(0, 0, 0, 0.42),
    0 0 0 1px rgba(255, 255, 255, 0.9);

  animation: ${imageZoomIn} 0.14s ease-out both;
`;

const LargeImage = styled.img`
  display: block;

  max-width: min(78vw, 760px);
  max-height: calc(86vh - 28px);

  border-radius: 16px;
  object-fit: contain;

  box-shadow: 0 12px 30px rgba(18, 45, 46, 0.16);
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: 22px;
  right: 24px;
  z-index: 5;

  width: 40px;
  height: 40px;

  border: 1px solid rgba(0, 174, 142, 0.18);
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.94);

  color: #2b3835;
  font-size: 25px;
  font-weight: 300;
  line-height: 1;
  cursor: pointer;

  box-shadow: 0 8px 20px rgba(18, 45, 46, 0.12);

  transition:
    transform 0.14s ease,
    background-color 0.14s ease,
    color 0.14s ease;

  &:hover {
    transform: rotate(90deg) scale(1.06);
    background-color: var(--color-main);
    color: #ffffff;
  }
`;

const ImageModalCloseButton = styled(ModalCloseButton)`
  position: fixed;
  top: 42px;
  right: 48px;
  z-index: 100002;

  width: 38px;
  height: 38px;

  border-color: rgba(255, 255, 255, 0.6);
  background-color: rgba(255, 255, 255, 0.94);
`;

const ImageMoveButton = styled.button`
  position: fixed;
  top: 50%;
  ${({ $left }) => ($left ? "left: -80px;" : "right: -80px;")}
  z-index: 100002;

  width: 54px;
  height: 54px;

  display: flex;
  align-items: center;
  justify-content: center;

  transform: translateY(-50%);

  border: 1px solid rgba(0, 174, 142, 0.24);
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.94);

  color: var(--color-main);
  font-size: 42px;
  font-weight: 300;
  line-height: 1;
  cursor: pointer;

  box-shadow: 0 14px 34px rgba(18, 45, 46, 0.2);

  transition:
    transform 0.13s ease,
    background-color 0.13s ease,
    color 0.13s ease,
    box-shadow 0.13s ease;

  &:hover {
    transform: translateY(-50%) scale(1.08);
    background-color: var(--color-main);
    color: #ffffff;
    box-shadow: 0 18px 40px rgba(0, 174, 142, 0.26);
  }
`;

const ImageCounter = styled.div`
  position: fixed;
  left: 48px;
  top: 42px;
  z-index: 100002;

  height: 34px;
  padding: 0 14px;

  display: flex;
  align-items: center;
  gap: 6px;

  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.94);
  color: var(--text-main);

  font-size: 13px;
  font-weight: 900;

  box-shadow: 0 8px 20px rgba(18, 45, 46, 0.14);

  span {
    color: var(--text-sub);
    font-weight: 700;
  }
`;
