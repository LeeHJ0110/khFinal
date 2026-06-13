import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import usePetStoreReviewList from "../../features/petStore/hooks/usePetStoreReviewList";
import PetStoreNavGate from "./PetStoreNavGate";

function renderStars(rating) {
  const score = Number(rating ?? 0);

  return "★★★★★"
    .split("")
    .map((star, index) => (index < score ? "★" : "☆"))
    .join("");
}

export default function PetStoreMyReviewListPage() {
  const navigate = useNavigate();

  const {
    reviewPage,
    reviewList,
    page,
    sort,
    isLoading,
    handleChangeSort,
    handleMovePage,
    handleDeleteReview,
  } = usePetStoreReviewList();

  const [openedReviewId, setOpenedReviewId] = useState(null);

  function handleSortChange(evt) {
    handleChangeSort(evt.target.value);
    setOpenedReviewId(null);
  }

  function handleClickProduct(productId) {
    navigate(`/store/product/${productId}`);
  }

  function handleToggleReview(reviewId) {
    setOpenedReviewId((prev) => (prev === reviewId ? null : reviewId));
  }

  function handlePrevPage() {
    if (page <= 0) {
      return;
    }

    setOpenedReviewId(null);
    handleMovePage(page - 1);
  }

  function handleNextPage() {
    if (!reviewPage || reviewPage.last) {
      return;
    }

    setOpenedReviewId(null);
    handleMovePage(page + 1);
  }

  function handleClickPage(pageNumber) {
    setOpenedReviewId(null);
    handleMovePage(pageNumber);
  }

  const totalElements = reviewPage?.totalElements ?? 0;
  const totalPages = reviewPage?.totalPages ?? 1;

  const pageNumberList = Array.from(
    { length: Math.min(Math.max(totalPages, 1), 10) },
    (_, index) => index,
  );

  console.log(reviewList);

  return (
    <Wrapper>
      <PetStoreNavGate />

      <Inner>
        <PageHeader>
          <TitleArea>
            <PageTitle>내 리뷰내역</PageTitle>
            <PageDesc>작성한 상품 리뷰를 확인하고 관리할 수 있습니다.</PageDesc>
          </TitleArea>

          <SortBox>
            <SortLabel>정렬</SortLabel>
            <SortSelect value={sort} onChange={handleSortChange}>
              <option value="latest">최신순</option>
              <option value="oldest">오래된순</option>
            </SortSelect>
          </SortBox>
        </PageHeader>

        <SummaryBar>
          <TotalText>
            총 <strong>{Number(totalElements).toLocaleString()}개</strong>
          </TotalText>

          <GuideText>리뷰 카드를 클릭하면 상세 내용이 펼쳐집니다.</GuideText>
        </SummaryBar>

        {isLoading ? (
          <LoadingBox>리뷰 목록을 불러오는 중입니다.</LoadingBox>
        ) : reviewList.length === 0 ? (
          <EmptyBox>
            <EmptyTitle>작성한 리뷰가 없습니다.</EmptyTitle>
            <EmptyDesc>
              구매한 상품의 리뷰를 작성하면 이곳에서 모아볼 수 있습니다.
            </EmptyDesc>
            <ShoppingButton type="button" onClick={() => navigate("/store")}>
              쇼핑하러 가기
            </ShoppingButton>
          </EmptyBox>
        ) : (
          <>
            <ReviewList>
              {reviewList.map((review) => {
                const isOpen = openedReviewId === review.reviewId;

                return (
                  <ReviewCard key={review.reviewId} $open={isOpen}>
                    <ReviewSummary
                      type="button"
                      onClick={() => handleToggleReview(review.reviewId)}
                    >
                      <ProductImageBox>
                        {review.productMainImageUrl ? (
                          <ProductImage
                            src={review.productMainImageUrl}
                            alt={review.productName}
                          />
                        ) : (
                          <NoImage>상품 이미지</NoImage>
                        )}
                      </ProductImageBox>

                      <SummaryContent>
                        <ProductName>{review.productName}</ProductName>

                        <MetaRow>
                          <CreatedAt>{review.createdAt}</CreatedAt>

                          <Dot />

                          <Stars>{renderStars(review.reviewRating)}</Stars>

                          <RatingText>{review.reviewRating}점</RatingText>
                        </MetaRow>
                      </SummaryContent>

                      <ActionArea onClick={(evt) => evt.stopPropagation()}>
                        <ProductLinkButton
                          type="button"
                          onClick={() => handleClickProduct(review.productId)}
                        >
                          상품보기
                        </ProductLinkButton>

                        <EditButton
                          type="button"
                          onClick={() =>
                            navigate(`/store/review/edit/${review.reviewId}`, {
                              state: review,
                            })
                          }
                        >
                          수정
                        </EditButton>

                        <DeleteButton
                          type="button"
                          onClick={() => handleDeleteReview(review.reviewId)}
                        >
                          삭제
                        </DeleteButton>

                        <ToggleIcon $open={isOpen}></ToggleIcon>
                      </ActionArea>
                    </ReviewSummary>

                    <ReviewDetail $open={isOpen}>
                      <DetailInner>
                        <ReviewTitle>{review.reviewTitle}</ReviewTitle>

                        <ReviewContent>{review.reviewContent}</ReviewContent>

                        <ReviewImageSection>
                          {review.reviewImageUrlList?.length > 0 ? (
                            <ReviewImageList>
                              {review.reviewImageUrlList.map((url, index) => (
                                <ReviewImageBox key={`${url}-${index}`}>
                                  <ReviewImage
                                    src={url}
                                    alt={`리뷰 이미지 ${index + 1}`}
                                  />
                                </ReviewImageBox>
                              ))}
                            </ReviewImageList>
                          ) : (
                            <NoReviewImageText>
                              첨부된 리뷰 이미지가 없습니다.
                            </NoReviewImageText>
                          )}
                        </ReviewImageSection>
                      </DetailInner>
                    </ReviewDetail>
                  </ReviewCard>
                );
              })}
            </ReviewList>

            <Pagination>
              <PageArrowButton
                type="button"
                disabled={page <= 0}
                onClick={handlePrevPage}
              >
                ‹
              </PageArrowButton>

              {pageNumberList.map((pageNumber) => (
                <PageButton
                  key={pageNumber}
                  type="button"
                  $active={pageNumber === page}
                  onClick={() => handleClickPage(pageNumber)}
                >
                  {pageNumber + 1}
                </PageButton>
              ))}

              <PageArrowButton
                type="button"
                disabled={!reviewPage || reviewPage.last}
                onClick={handleNextPage}
              >
                ›
              </PageArrowButton>
            </Pagination>
          </>
        )}
      </Inner>
    </Wrapper>
  );
}

/* ================================
   Layout
================================ */

const Wrapper = styled.main`
  width: 100%;
  min-height: 100vh;
  background-color: var(--color-white);
`;

const Inner = styled.div`
  width: 1532px;
  margin: 0 auto;
  padding: 24px 0 70px;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  margin-bottom: 18px;
`;

const TitleArea = styled.div`
  min-width: 0;
`;

const PageTitle = styled.h1`
  margin: 0 0 8px;

  color: var(--text-main);
  font-size: 34px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -1.2px;
`;

const PageDesc = styled.p`
  margin: 0;

  color: var(--text-sub);
  font-size: 14px;
  font-weight: 500;
`;

const SortBox = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SortLabel = styled.span`
  color: var(--text-main);
  font-size: 14px;
  font-weight: 800;
`;

const SortSelect = styled.select`
  width: 112px;
  height: 36px;

  border: 1px solid #d8d8d8;
  border-radius: 4px;
  background-color: var(--color-white);
  padding: 0 10px;

  color: var(--text-main);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--color-main);
  }
`;

const SummaryBar = styled.div`
  height: 48px;
  padding: 0 20px;
  margin-bottom: 14px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  border: 1px solid #cde8df;
  border-radius: 6px;
  background-color: #e8f8f3;
`;

const TotalText = styled.p`
  margin: 0;

  color: var(--text-main);
  font-size: 15px;
  font-weight: 700;

  strong {
    color: var(--color-main);
    font-weight: 900;
  }
`;

const GuideText = styled.span`
  color: var(--text-sub);
  font-size: 12px;
  font-weight: 600;
`;

/* ================================
   Review List
================================ */

const ReviewList = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ReviewCard = styled.article`
  overflow: hidden;

  border: 1px solid ${({ $open }) => ($open ? "var(--color-main)" : "#dedede")};
  border-radius: 8px;
  background-color: var(--color-white);

  box-shadow: ${({ $open }) =>
    $open ? "0 8px 20px rgba(18, 45, 46, 0.08)" : "none"};

  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;

  &:hover {
    border-color: var(--color-main);
    transform: translateY(-1px);
  }
`;

const ReviewSummary = styled.button`
  box-sizing: border-box;
  width: 100%;
  min-height: 82px;
  padding: 14px 18px;

  display: grid;
  grid-template-columns: 58px minmax(0, 1fr) auto;
  gap: 16px;
  align-items: center;

  border: 0;
  background-color: transparent;
  text-align: left;
  cursor: pointer;
`;

const ProductImageBox = styled.div`
  width: 58px;
  height: 58px;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  border: 1px solid #eeeeee;
  border-radius: 6px;
  background-color: #f8f8f8;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 5px;
`;

const NoImage = styled.div`
  color: var(--text-desc);
  font-size: 10px;
  font-weight: 700;
  text-align: center;
`;

const SummaryContent = styled.div`
  min-width: 0;
`;

const ProductName = styled.div`
  max-width: 780px;
  margin-bottom: 8px;

  color: var(--text-main);
  font-size: 17px;
  font-weight: 900;
  line-height: 1.35;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  min-width: 0;
`;

const CreatedAt = styled.span`
  color: var(--text-sub);
  font-size: 13px;
  font-weight: 600;
`;

const Dot = styled.span`
  width: 3px;
  height: 3px;

  border-radius: 999px;
  background-color: #c7c7c7;
`;

const Stars = styled.span`
  color: #ffb800;
  font-size: 16px;
  font-weight: 900;
  letter-spacing: 0.5px;
`;

const RatingText = styled.span`
  color: var(--text-main);
  font-size: 13px;
  font-weight: 800;
`;

const ActionArea = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProductLinkButton = styled.button`
  width: 74px;
  height: 32px;

  border: 1px solid #d8d8d8;
  border-radius: 4px;
  background-color: var(--color-white);

  color: var(--text-main);
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    border-color: var(--color-main);
    color: var(--color-main);
  }
`;

const EditButton = styled(ProductLinkButton)``;

const DeleteButton = styled.button`
  width: 62px;
  height: 32px;

  border: 0;
  border-radius: 4px;
  background-color: var(--color-main);

  color: var(--color-white);
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    background-color: var(--color-main-dark);
  }
`;

const ToggleIcon = styled.span`
  width: 28px;
  height: 28px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  color: var(--text-sub);
  font-size: 22px;
  font-weight: 800;

  transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0deg)")};
  transition: transform 0.22s ease;
`;

/* ================================
   Accordion Detail
================================ */

const ReviewDetail = styled.div`
  max-height: ${({ $open }) => ($open ? "360px" : "0")};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transform: translateY(${({ $open }) => ($open ? "0" : "-6px")});

  overflow: hidden;

  transition:
    max-height 0.28s ease,
    opacity 0.22s ease,
    transform 0.22s ease;
`;

const DetailInner = styled.div`
  padding: 0 18px 18px 92px;

  border-top: 1px solid #eeeeee;
`;

const ReviewTitle = styled.h3`
  margin: 16px 0 7px;

  color: var(--text-main);
  font-size: 17px;
  font-weight: 900;
  line-height: 1.35;
`;

const ReviewContent = styled.p`
  margin: 0;

  color: var(--text-sub);
  font-size: 14px;
  font-weight: 500;
  line-height: 1.65;
`;

const ReviewImageSection = styled.div`
  margin-top: 12px;
`;

const ReviewImageList = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ReviewImageBox = styled.div`
  width: 74px;
  height: 74px;

  border: 1px solid #eeeeee;
  border-radius: 6px;
  background-color: #f8f8f8;
  overflow: hidden;
`;

const ReviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const NoReviewImageText = styled.p`
  margin: 0;

  color: var(--text-desc);
  font-size: 13px;
  font-weight: 600;
`;

/* ================================
   Pagination
================================ */

const Pagination = styled.div`
  margin-top: 30px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
`;

const PageButton = styled.button`
  width: 24px;
  height: 24px;

  border: 0;
  border-radius: 4px;
  background-color: ${({ $active }) =>
    $active ? "var(--color-white)" : "transparent"};
  color: ${({ $active }) =>
    $active ? "var(--color-main)" : "var(--text-main)"};

  box-shadow: ${({ $active }) =>
    $active ? "0 4px 10px rgba(18, 45, 46, 0.14)" : "none"};

  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 900 : 500)};
  cursor: pointer;

  &:hover {
    color: var(--color-main);
  }
`;

const PageArrowButton = styled.button`
  width: 30px;
  height: 30px;

  border: 0;
  background-color: transparent;

  color: var(--text-main);
  font-size: 34px;
  font-weight: 200;
  line-height: 1;
  cursor: pointer;

  &:hover {
    color: var(--color-main);
  }

  &:disabled {
    color: #cccccc;
    cursor: not-allowed;
  }
`;

/* ================================
   Empty / Loading
================================ */

const LoadingBox = styled.div`
  height: 320px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #d8d8d8;
  border-radius: 8px;

  color: var(--text-sub);
  font-size: 15px;
  font-weight: 700;
`;

const EmptyBox = styled.div`
  height: 360px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  border: 1px solid #d8d8d8;
  border-radius: 8px;
`;

const EmptyTitle = styled.div`
  margin-bottom: 8px;

  color: var(--text-main);
  font-size: 24px;
  font-weight: 900;
`;

const EmptyDesc = styled.div`
  margin-bottom: 24px;

  color: var(--text-sub);
  font-size: 15px;
  font-weight: 500;
`;

const ShoppingButton = styled.button`
  width: 180px;
  height: 42px;

  border: 0;
  border-radius: 6px;
  background-color: var(--color-main);

  color: var(--color-white);
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    background-color: var(--color-main-dark);
  }
`;
