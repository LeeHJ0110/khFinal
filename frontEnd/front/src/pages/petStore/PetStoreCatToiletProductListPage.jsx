import styled from "styled-components";
import PetStoreUserNav from "./PetStoreUserNav";
import usePetStoreProductList from "../../features/petStore/hooks/usePetStoreProductList";
import PetStoreRecentAside from "./PetStoreRecentAside";
import { useNavigate } from "react-router-dom";

const sortOptions = [
  { label: "최신순", value: "latest" },
  { label: "인기순", value: "popular" },
  { label: "낮은가격순", value: "lowPrice" },
  { label: "높은가격순", value: "highPrice" },
];

const tagList = [
  { label: "전체", tagId: "" },
  { label: "탈취", tagId: 13 },
  { label: "흡수", tagId: 14 },
  { label: "위생", tagId: 15 },
  { label: "대용량", tagId: 16 },
];

/*
  임시 리뷰 표시용 데이터입니다.

  나중에 리뷰 기능 완성되면 이 함수는 삭제하고,
  아래 표시 부분을 실제 데이터로 변경하면 됩니다.
*/
function getTempReviewInfo(index) {
  const navigate = useNavigate();
  const tempReviewList = [
    { rating: "4.9", count: 128 },
    { rating: "4.8", count: 92 },
    { rating: "4.7", count: 76 },
    { rating: "4.6", count: 54 },
    { rating: "4.5", count: 31 },
  ];

  return tempReviewList[index % tempReviewList.length];
}

export default function PetStoreCatToiletProductListPage() {
  const {
    productList,
    isLoading,

    keyword,
    setKeyword,

    sort,
    tagId,

    handleSearch,
    handleChangeSort,
    handleChangeTagId,
  } = usePetStoreProductList("C", "TOILET");

  return (
    <>
      <PetStoreUserNav />

      <Wrapper>
        <HeroBanner>
          <HeroInner>
            <HeroTextBox>
              <HeroEyebrow>우리 고양이를 위한</HeroEyebrow>
              <HeroTitle>
                깔끔한 <strong>배변용품</strong>
              </HeroTitle>
              <HeroDesc>
                탈취, 흡수, 위생까지 매일 쓰는 용품일수록 더 꼼꼼하게
                <br />
                보호자와 반려묘 모두 편안한 생활을 만들어보세요.
              </HeroDesc>
            </HeroTextBox>

            <HeroImageBox>
              <HeroImageText>고양이 배변용품 배너 이미지 영역</HeroImageText>
            </HeroImageBox>
          </HeroInner>
        </HeroBanner>

        <ContentInner>
          <PageHeader>
            <PageTitleBox>
              <PageTitle>전체상품</PageTitle>
            </PageTitleBox>

            <ProductTopBar>
              <ProductCount>총 {productList.length}개 상품</ProductCount>

              <ControlBox>
                <SearchBox>
                  <SearchInput
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    placeholder="제품명을 입력하세요."
                  />
                  <SearchButton type="button" onClick={handleSearch}>
                    🔍
                  </SearchButton>
                </SearchBox>

                <SortSelect
                  value={sort}
                  onChange={(e) => handleChangeSort(e.target.value)}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </SortSelect>
              </ControlBox>
            </ProductTopBar>

            <HeaderBlank />
          </PageHeader>

          <BodyLayout>
            <FilterAside>
              <FilterTitle>태그</FilterTitle>

              <TagList>
                {tagList.map((tag) => (
                  <TagButton
                    key={tag.label}
                    type="button"
                    $active={String(tagId) === String(tag.tagId)}
                    onClick={() => handleChangeTagId(tag.tagId)}
                  >
                    {tag.label}
                  </TagButton>
                ))}
              </TagList>
            </FilterAside>

            <ProductSection>
              {isLoading ? (
                <EmptyBox>상품 목록을 불러오는 중입니다...</EmptyBox>
              ) : productList.length === 0 ? (
                <EmptyBox>조건에 맞는 상품이 없습니다.</EmptyBox>
              ) : (
                <ProductGrid>
                  {productList.map((product, index) => {
                    const tempReview = getTempReviewInfo(index);

                    return (
                      <ProductCard
                        key={product.productId}
                        onClick={() =>
                          navigate(`/store/product/${product.productId}`)
                        }
                      >
                        <WishButton type="button" aria-label="관심상품">
                          ♡
                        </WishButton>

                        <ProductImageBox>
                          {product.mainImageUrl ? (
                            <ProductImage
                              src={product.mainImageUrl}
                              alt={product.productName}
                            />
                          ) : (
                            <ProductImageText>상품 이미지</ProductImageText>
                          )}
                        </ProductImageBox>

                        <ProductCategoryBadge>배변용품</ProductCategoryBadge>

                        <ProductName>{product.productName}</ProductName>

                        <ProductReviewInfo>
                          <ReviewStar>★</ReviewStar>
                          {tempReview.rating} ({tempReview.count})
                        </ProductReviewInfo>

                        <ProductBottom>
                          <ProductPrice>
                            {product.productPrice?.toLocaleString()}원
                          </ProductPrice>

                          <CartButton
                            type="button"
                            aria-label={`${product.productName} 장바구니 담기`}
                          >
                            🛒
                          </CartButton>
                        </ProductBottom>
                      </ProductCard>
                    );
                  })}
                </ProductGrid>
              )}
            </ProductSection>

            {/* 최근 조회 사이드바 */}
            <PetStoreRecentAside />
          </BodyLayout>
        </ContentInner>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.main`
  width: 100%;
  background-color: var(--color-white);
`;

const HeroBanner = styled.section`
  width: 100%;
  height: 240px;

  display: flex;
  align-items: center;

  overflow: hidden;
  background: linear-gradient(90deg, #dff2e9 0%, #eefaf4 48%, #dff2e9 100%);
`;

const HeroInner = styled.div`
  width: 1300px;
  height: 100%;
  margin: 0 auto;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeroTextBox = styled.div`
  position: relative;
  z-index: 2;
  width: 430px;
`;

const HeroEyebrow = styled.p`
  margin: 0 0 10px;

  color: var(--text-main);
  font-size: 17px;
  font-weight: 800;
`;

const HeroTitle = styled.h1`
  margin: 0 0 15px;

  color: var(--text-main);
  font-size: 39px;
  font-weight: 900;
  line-height: 1.2;
  letter-spacing: -1.7px;

  strong {
    color: var(--color-main);
  }
`;

const HeroDesc = styled.p`
  margin: 0;

  color: var(--text-sub);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.65;
`;

const HeroImageBox = styled.div`
  width: 700px;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeroImageText = styled.div`
  width: 100%;
  height: 82%;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 24px;
  background-color: rgba(255, 255, 255, 0.34);
  color: rgba(0, 0, 0, 0.24);

  font-size: 15px;
  font-weight: 800;
`;

const ContentInner = styled.div`
  width: 1300px;
  margin: 0 auto;
  padding: 14px 0 20px;
`;

const PageHeader = styled.section`
  height: 42px;

  display: grid;
  grid-template-columns: 86px minmax(0, 1fr) 162px;
  column-gap: 28px;
  align-items: center;
`;

const PageTitleBox = styled.div`
  grid-column: 1 / 2;

  display: flex;
  align-items: center;
`;

const ProductTopBar = styled.div`
  grid-column: 2 / 3;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderBlank = styled.div`
  grid-column: 3 / 4;
`;

const PageTitle = styled.h2`
  margin: 0;

  color: var(--text-main);
  font-size: 22px;
  font-weight: 900;
  letter-spacing: -0.7px;
  white-space: nowrap;
`;

const ProductCount = styled.span`
  color: var(--text-sub);
  font-size: 12px;
  font-weight: 700;
`;

const ControlBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SearchBox = styled.div`
  width: 220px;
  height: 28px;
  padding: 0 8px 0 12px;

  display: flex;
  align-items: center;

  border: 1px solid #d5e2dc;
  border-radius: 999px;
  background-color: var(--color-white);
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 0;

  border: 0;
  outline: none;
  background-color: transparent;

  color: var(--text-main);
  font-size: 12px;
  font-weight: 600;

  &::placeholder {
    color: #9ba9a4;
  }
`;

const SearchButton = styled.button`
  border: 0;
  background-color: transparent;
  color: var(--color-main);

  font-size: 13px;
  cursor: pointer;
`;

const SortSelect = styled.select`
  width: 92px;
  height: 30px;
  padding: 0 8px;

  border: 1px solid #d5e2dc;
  border-radius: 8px;
  background-color: var(--color-white);

  color: var(--text-main);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
`;

const BodyLayout = styled.section`
  margin-top: 6px;

  display: grid;
  grid-template-columns: 86px minmax(0, 1fr) 162px;
  column-gap: 28px;
  align-items: start;
`;

const FilterAside = styled.aside`
  padding-top: 6px;
`;

const FilterTitle = styled.h3`
  margin: 0 0 14px;

  color: var(--text-main);
  font-size: 15px;
  font-weight: 900;
`;

const TagList = styled.div`
  padding-top: 12px;

  display: flex;
  flex-direction: column;
  gap: 13px;

  border-top: 1px solid #cfdcd6;
`;

const TagButton = styled.button`
  border: 0;
  background-color: transparent;
  text-align: left;

  color: ${(props) =>
    props.$active ? "var(--color-main)" : "var(--text-sub)"};
  font-size: 12px;
  font-weight: ${(props) => (props.$active ? 900 : 700)};

  cursor: pointer;
`;

const ProductSection = styled.section`
  min-height: 720px;
  padding: 30px 38px 34px;

  border-radius: 4px;
  background-color: #edf5f1;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 34px 30px;
`;

const ProductCard = styled.article`
  position: relative;

  height: 260px;
  padding: 22px 20px 18px;

  display: flex;
  flex-direction: column;

  border-radius: 10px;
  background-color: var(--color-white);
  box-shadow: 0 2px 8px rgba(18, 45, 46, 0.08);

  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(18, 45, 46, 0.12);
  }
`;

const WishButton = styled.button`
  position: absolute;
  right: 13px;
  top: 12px;
  z-index: 2;

  border: 0;
  background-color: transparent;
  color: #111;

  font-size: 28px;
  line-height: 1;
  cursor: pointer;
`;

const ProductImageBox = styled.div`
  width: 100%;
  height: 118px;
  margin-bottom: 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;
  border-radius: 12px;
  background-color: #f6faf8;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  padding: 8px;
  object-fit: contain;
`;

const ProductImageText = styled.span`
  color: var(--text-desc);
  font-size: 12px;
  font-weight: 800;
`;

const ProductCategoryBadge = styled.span`
  width: fit-content;
  height: 18px;
  padding: 0 8px;
  margin-bottom: 7px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border-radius: 3px;
  background-color: #c9f0dd;
  color: var(--color-main);

  font-size: 10px;
  font-weight: 900;
`;

const ProductName = styled.h3`
  min-height: 35px;
  margin: 0 0 4px;

  color: var(--text-main);
  font-size: 13px;
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: -0.2px;

  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ProductReviewInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  margin-bottom: 8px;

  color: var(--text-sub);
  font-size: 12px;
  font-weight: 700;
`;

const ReviewStar = styled.span`
  color: #ffc400;
  font-size: 13px;
  line-height: 1;
`;

const ProductBottom = styled.div`
  margin-top: auto;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ProductPrice = styled.p`
  margin: 0;

  color: var(--text-main);
  font-size: 20px;
  font-weight: 900;
  letter-spacing: -0.8px;
`;

const CartButton = styled.button`
  width: 24px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 0;
  border-radius: 50%;
  background-color: var(--color-main);
  color: var(--color-white);

  font-size: 12px;
  cursor: pointer;
`;

const EmptyBox = styled.div`
  min-height: 300px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--text-sub);
  font-size: 14px;
  font-weight: 800;
`;
