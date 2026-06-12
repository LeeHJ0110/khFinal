import { useState } from "react";
import styled from "styled-components";
import usePetStoreProductReviewList from "../hooks/usePetStoreProductReviewList";

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
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

  const totalReviews = reviewPage?.totalElements ?? summary?.reviewCount ?? 0;
  const averageRating = Number(summary?.averageRating ?? 0).toFixed(1);

  function handleOpenImage(url) {
    setSelectedImageUrl(url);
    setIsImageModalOpen(true);
  }

  function handleCloseImageModal() {
    setIsImageModalOpen(false);
    setSelectedImageUrl("");
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

  return (
    <ReviewSection>
      <SectionTitle>구매자 리뷰</SectionTitle>

      <SummaryCard>
        <AverageBox>
          <AverageLabel>평균 평점</AverageLabel>
          <AverageScore>{averageRating}</AverageScore>
          <AverageStars>{renderStars(averageRating)}</AverageStars>
          <AverageDesc>펫앤포가 드리는 솔직한 리뷰</AverageDesc>
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
        {previewImageList.length > 0 ? (
          <>
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
                        <span>더보기</span>
                        <strong>+ {galleryImageList.length - 5}</strong>
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
          </>
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
          {reviewList.map((review) => (
            <ReviewCard key={review.reviewId}>
              <ReviewerArea>
                <ProfileImageBox>
                  {review.memberProfileImageUrl ? (
                    <ProfileImage
                      src={review.memberProfileImageUrl}
                      alt={review.memberNickname ?? "리뷰 작성자"}
                    />
                  ) : (
                    <ProfilePlaceholder />
                  )}
                </ProfileImageBox>

                <ReviewerInfo>
                  <ReviewerName>
                    {review.memberNickname ?? review.nickname ?? "구매자"}
                  </ReviewerName>

                  <ReviewerMeta>
                    {review.petInfo ??
                      review.productOptionText ??
                      "구매자 리뷰"}
                  </ReviewerMeta>
                </ReviewerInfo>
              </ReviewerArea>

              <ReviewContentArea>
                <ReviewStarRow>
                  <ReviewStars>{renderStars(review.reviewRating)}</ReviewStars>
                  <ReviewRating>{review.reviewRating}</ReviewRating>
                </ReviewStarRow>

                <ReviewTitle>{review.reviewTitle}</ReviewTitle>
                <ReviewContent>{review.reviewContent}</ReviewContent>
              </ReviewContentArea>

              <ReviewDate>{review.createdAt}</ReviewDate>

              <ReviewImages>
                {(review.reviewImageUrlList ?? review.imageUrlList ?? [])
                  .slice(0, 3)
                  .map((url, index) => (
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
          ))}
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

      {isImageModalOpen && (
        <ModalOverlay onClick={handleCloseImageModal}>
          <ImageModalBox onClick={(evt) => evt.stopPropagation()}>
            <ModalCloseButton type="button" onClick={handleCloseImageModal}>
              ×
            </ModalCloseButton>

            <LargeImage src={selectedImageUrl} alt="리뷰 이미지 크게 보기" />
          </ImageModalBox>
        </ModalOverlay>
      )}

      {isGalleryModalOpen && (
        <ModalOverlay onClick={() => setIsGalleryModalOpen(false)}>
          <GalleryModalBox onClick={(evt) => evt.stopPropagation()}>
            <GalleryModalHeader>
              <GalleryModalTitle>갤러리</GalleryModalTitle>
              <GalleryModalDesc>
                실제 구매자들이 등록한 리뷰 이미지를 모아볼 수 있습니다.
              </GalleryModalDesc>

              <ModalCloseButton
                type="button"
                onClick={() => setIsGalleryModalOpen(false)}
              >
                ×
              </ModalCloseButton>
            </GalleryModalHeader>

            <GalleryModalSubTitle>
              이미지 {galleryImageList.length}
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
                </GalleryGridButton>
              ))}
            </GalleryGrid>
          </GalleryModalBox>
        </ModalOverlay>
      )}
    </ReviewSection>
  );
}

/* ================================
   Layout
================================ */

const ReviewSection = styled.section`
  width: 100%;
  padding: 30px 0 70px;
`;

const SectionTitle = styled.h2`
  margin: 0 0 14px;

  color: var(--text-main);
  font-size: 22px;
  font-weight: 900;
  letter-spacing: -0.6px;
`;

const SummaryCard = styled.div`
  min-height: 180px;
  padding: 28px 42px;

  display: grid;
  grid-template-columns: 230px 1fr;
  gap: 44px;
  align-items: center;

  border: 1px solid #e3eee9;
  border-radius: 16px;
  background-color: var(--color-white);
`;

const AverageBox = styled.div`
  text-align: center;
`;

const AverageLabel = styled.p`
  margin: 0 0 8px;
  color: var(--text-sub);
  font-size: 13px;
  font-weight: 700;
`;

const AverageScore = styled.strong`
  display: block;
  color: var(--text-main);
  font-size: 44px;
  font-weight: 900;
  line-height: 1;
`;

const AverageStars = styled.div`
  margin-top: 10px;
  color: #ffb400;
  font-size: 20px;
  letter-spacing: 1px;
`;

const AverageDesc = styled.p`
  margin: 10px 0 0;
  color: var(--text-sub);
  font-size: 12px;
  font-weight: 600;
`;

const RatingBars = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RatingRow = styled.div`
  display: grid;
  grid-template-columns: 44px 1fr 46px;
  gap: 12px;
  align-items: center;
`;

const RatingLabel = styled.span`
  color: var(--text-main);
  font-size: 13px;
  font-weight: 700;
`;

const RatingBarTrack = styled.div`
  height: 10px;
  overflow: hidden;

  border-radius: 999px;
  background-color: #e8f0ec;
`;

const RatingBarFill = styled.div`
  height: 100%;
  border-radius: 999px;
  background-color: var(--color-main);
`;

const RatingPercent = styled.span`
  color: var(--text-sub);
  font-size: 12px;
  font-weight: 700;
  text-align: right;
`;

/* ================================
   Gallery Preview
================================ */

const GalleryPreviewArea = styled.div`
  margin-top: 24px;
`;

const GalleryPreviewList = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
`;

const GalleryImageButton = styled.button`
  position: relative;

  height: 142px;
  overflow: hidden;

  border: 0;
  border-radius: 4px;
  background-color: #f4f4f4;
  padding: 0;
  cursor: pointer;
`;

const GalleryMoreButton = styled(GalleryImageButton)``;

const GalleryThumb = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ZoomIcon = styled.span`
  position: absolute;
  right: 12px;
  bottom: 12px;

  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.58);
  color: #ffffff;
  font-size: 20px;
  font-weight: 900;
`;

const MoreOverlay = styled.div`
  position: absolute;
  inset: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: rgba(0, 0, 0, 0.55);
  color: #ffffff;

  span {
    font-size: 15px;
    font-weight: 800;
  }

  strong {
    margin-top: 4px;
    font-size: 22px;
    font-weight: 900;
  }
`;

const NoGalleryText = styled.div`
  height: 90px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px dashed #d5d5d5;
  border-radius: 10px;

  color: var(--text-sub);
  font-size: 14px;
  font-weight: 700;
`;

/* ================================
   Toolbar
================================ */

const ReviewToolbar = styled.div`
  height: 44px;
  margin-top: 28px;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TotalCount = styled.p`
  margin: 0;
  color: var(--text-main);
  font-size: 14px;
  font-weight: 700;

  strong {
    color: var(--color-main);
    font-weight: 900;
  }
`;

const SortButtonGroup = styled.div`
  display: flex;
  gap: 6px;
`;

const SortButton = styled.button`
  height: 30px;
  padding: 0 14px;

  border: 1px solid
    ${({ $active }) => ($active ? "var(--color-main)" : "#dddddd")};
  border-radius: 4px;
  background-color: ${({ $active }) =>
    $active ? "var(--color-main)" : "var(--color-white)"};

  color: ${({ $active }) => ($active ? "#ffffff" : "var(--text-main)")};
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
`;

/* ================================
   Review List
================================ */

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ReviewCard = styled.article`
  min-height: 104px;
  padding: 20px 22px;

  display: grid;
  grid-template-columns: 160px 1fr 90px 210px;
  gap: 20px;
  align-items: center;

  border: 1px solid #e5e5e5;
  border-radius: 14px;
  background-color: var(--color-white);
`;

const ReviewerArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProfileImageBox = styled.div`
  width: 38px;
  height: 38px;
  overflow: hidden;

  border-radius: 50%;
  background-color: #f0f0f0;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfilePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background-color: #e5e5e5;
`;

const ReviewerInfo = styled.div`
  min-width: 0;
`;

const ReviewerName = styled.strong`
  display: block;
  color: var(--text-main);
  font-size: 13px;
  font-weight: 900;
`;

const ReviewerMeta = styled.span`
  display: block;
  margin-top: 4px;
  color: var(--text-sub);
  font-size: 11px;
  font-weight: 600;
`;

const ReviewContentArea = styled.div`
  min-width: 0;
`;

const ReviewStarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  margin-bottom: 5px;
`;

const ReviewStars = styled.span`
  color: #ffb400;
  font-size: 14px;
  letter-spacing: 0.5px;
`;

const ReviewRating = styled.strong`
  color: var(--text-main);
  font-size: 12px;
  font-weight: 900;
`;

const ReviewTitle = styled.h3`
  margin: 0 0 5px;

  color: var(--text-main);
  font-size: 14px;
  font-weight: 900;
`;

const ReviewContent = styled.p`
  margin: 0;

  color: var(--text-main);
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ReviewDate = styled.span`
  color: var(--text-sub);
  font-size: 11px;
  font-weight: 600;
  text-align: right;
`;

const ReviewImages = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const ReviewImageButton = styled.button`
  position: relative;

  width: 62px;
  height: 62px;
  overflow: hidden;

  border: 0;
  border-radius: 6px;
  background-color: #eeeeee;
  padding: 0;
  cursor: pointer;
`;

const ReviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const SmallZoomIcon = styled.span`
  position: absolute;
  right: 4px;
  bottom: 4px;

  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 3px;
  background-color: rgba(0, 0, 0, 0.58);
  color: #ffffff;
  font-size: 12px;
  font-weight: 900;
`;

const LoadingBox = styled.div`
  padding: 60px 0;
  text-align: center;
  color: var(--text-sub);
  font-size: 14px;
  font-weight: 700;
`;

const EmptyBox = styled(LoadingBox)``;

/* ================================
   Pagination
================================ */

const Pagination = styled.div`
  margin-top: 26px;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const PageButton = styled.button`
  height: 34px;
  padding: 0 14px;

  border: 1px solid #d8d8d8;
  border-radius: 4px;
  background-color: var(--color-white);

  color: var(--text-main);
  font-size: 12px;
  font-weight: 800;
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
  font-weight: 800;
`;

/* ================================
   Modal
================================ */

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgba(0, 0, 0, 0.72);
`;

const ImageModalBox = styled.div`
  position: relative;

  max-width: 860px;
  max-height: 82vh;

  border-radius: 10px;
  background-color: #ffffff;
  padding: 24px;
`;

const LargeImage = styled.img`
  max-width: 100%;
  max-height: 76vh;
  object-fit: contain;
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: 14px;
  right: 16px;

  width: 34px;
  height: 34px;

  border: 0;
  background: transparent;

  color: #333333;
  font-size: 30px;
  line-height: 1;
  cursor: pointer;
`;

const GalleryModalBox = styled.div`
  position: relative;

  width: 760px;
  max-height: 86vh;
  overflow-y: auto;

  border-radius: 8px;
  background-color: #ffffff;
  padding: 36px 42px 42px;
`;

const GalleryModalHeader = styled.div`
  position: relative;

  padding-bottom: 20px;
  border-bottom: 1px solid #dddddd;
`;

const GalleryModalTitle = styled.h3`
  margin: 0;
  color: var(--text-main);
  font-size: 30px;
  font-weight: 500;
`;

const GalleryModalDesc = styled.p`
  margin: 8px 0 0;
  color: var(--text-sub);
  font-size: 12px;
  font-weight: 500;
`;

const GalleryModalSubTitle = styled.p`
  margin: 28px 0 14px;
  color: var(--text-main);
  font-size: 15px;
  font-weight: 800;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
`;

const GalleryGridButton = styled.button`
  width: 100%;
  aspect-ratio: 1 / 1;

  overflow: hidden;
  border: 0;
  background-color: #f2f2f2;
  padding: 0;
  cursor: pointer;
`;

const GalleryGridImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
