import styled from "styled-components";
import usePetStoreWishToggle from "../../features/petStore/hooks/usePetStoreWishToggle";

import usePetStoreProductList from "../../features/petStore/hooks/usePetStoreProductList";
import PetStoreRecentAside from "./PetStoreRecentAside";
import { useNavigate } from "react-router-dom";

import foodBannerImg from "../../assets/images/petStore/사료목록배너.png";
import PetStoreNavGate from "./PetStoreNavGate";

import searchIcon from "../../assets/images/icon/녹색돋보기.png";

const sortOptions = [
  { label: "최신순", value: "latest" },
  { label: "인기순", value: "popular" },
  { label: "낮은가격순", value: "lowPrice" },
  { label: "높은가격순", value: "highPrice" },
];

const tagList = [
  { label: "전체", tagId: "" },
  { label: "성장", tagId: 1 },
  { label: "체중관리", tagId: 2 },
  { label: "피부", tagId: 3 },
  { label: "소화", tagId: 4 },
];

const tagThemeMap = {
  성장: {
    background: "#e8f8f0",
    color: "#00a97b",
    border: "#bfead8",
  },
  체중관리: {
    background: "#fff4e5",
    color: "#d98218",
    border: "#ffddad",
  },
  피부: {
    background: "#eaf3ff",
    color: "#2f74d0",
    border: "#c8defc",
  },
  소화: {
    background: "#f2edff",
    color: "#7b55d9",
    border: "#ddd0ff",
  },
};

function getTempReviewInfo(index) {
  const tempReviewList = [
    { rating: "4.9", count: 128 },
    { rating: "4.8", count: 92 },
    { rating: "4.7", count: 76 },
    { rating: "4.6", count: 54 },
    { rating: "4.5", count: 31 },
  ];

  return tempReviewList[index % tempReviewList.length];
}

function getProductTagLabel(product) {
  return (
    product.tagName ||
    product.productTagName ||
    product.productTag?.tagName ||
    "사료"
  );
}

function getTagTheme(tagLabel) {
  return (
    tagThemeMap[tagLabel] || {
      background: "#e8f8f0",
      color: "var(--color-main)",
      border: "#bfead8",
    }
  );
}

export default function PetStoreCatFoodProductListPage() {
  const navigate = useNavigate();

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
    updateProductWishState,
  } = usePetStoreProductList("C", "FOOD");

  const { wishSubmittingId, handleToggleWishlist } = usePetStoreWishToggle();

  return (
    <>
      <PetStoreNavGate />

      <Wrapper>
        <HeroBanner>
          <HeroBannerImage src={foodBannerImg} alt="고양이 사료 목록 배너" />

          <HeroInner>
            <HeroTextBox>
              <HeroEyebrow>우리 고양이를 위한</HeroEyebrow>

              <HeroTitle>
                프리미엄 <strong>사료</strong>
              </HeroTitle>

              <HeroDesc>
                까다로운 입맛과 균형 잡힌 영양까지 함께 생각한 선택
                <br />
                우리 냥이의 건강한 하루를 챙겨주세요.
              </HeroDesc>
            </HeroTextBox>
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
                    <SearchIcon src={searchIcon} alt="검색" />
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
                    const tagLabel = getProductTagLabel(product);

                    return (
                      <ProductCard
                        key={product.productId}
                        onClick={() =>
                          navigate(`/store/product/${product.productId}`)
                        }
                      >
                        <WishButton
                          type="button"
                          aria-label="관심상품"
                          $active={!!product.wished}
                          disabled={wishSubmittingId === product.productId}
                          onClick={(evt) =>
                            handleToggleWishlist(
                              evt,
                              product,
                              (updatedProduct) => {
                                updateProductWishState(
                                  updatedProduct.productId,
                                  updatedProduct.wished,
                                );
                              },
                            )
                          }
                        >
                          {product.wished ? "♥" : "♡"}
                        </WishButton>

                        <ProductImageBox>
                          <ProductTagBadge $tagLabel={tagLabel}>
                            {tagLabel}
                          </ProductTagBadge>

                          {product.mainImageUrl ? (
                            <ProductImage
                              src={product.mainImageUrl}
                              alt={product.productName}
                            />
                          ) : (
                            <ProductImageText>상품 이미지</ProductImageText>
                          )}
                        </ProductImageBox>

                        <ProductInfoArea>
                          <ProductName>{product.productName}</ProductName>

                          <ProductReviewInfo>
                            <ReviewStar>★</ReviewStar>
                            {tempReview.rating} ({tempReview.count})
                          </ProductReviewInfo>

                          <ProductPrice>
                            {product.productPrice?.toLocaleString()}원
                          </ProductPrice>
                        </ProductInfoArea>
                      </ProductCard>
                    );
                  })}
                </ProductGrid>
              )}
            </ProductSection>

            <RecentAsideStickyBox>
              <PetStoreRecentAside />
            </RecentAsideStickyBox>
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

/* ================================
   Banner
================================ */

const HeroBanner = styled.section`
  position: relative;
  width: 100%;
  height: 320px;
  overflow: hidden;
  background-color: #edf8f2;
`;

const HeroBannerImage = styled.img`
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  display: block;
  object-fit: cover;
  object-position: center 80%;
`;

const HeroInner = styled.div`
  position: relative;
  z-index: 2;

  width: 1300px;
  height: 100%;
  margin: 0 auto;

  display: flex;
  align-items: center;
`;

const HeroTextBox = styled.div`
  width: 520px;
  transform: translateY(-2px);
`;

const HeroEyebrow = styled.p`
  margin: 0 0 12px;

  color: #202423;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.45px;
`;

const HeroTitle = styled.h1`
  margin: 0 0 18px;

  color: #151918;
  font-size: 52px;
  font-weight: 900;
  line-height: 1.14;
  letter-spacing: -2.1px;

  strong {
    color: var(--color-main);
    font-weight: 900;
  }
`;

const HeroDesc = styled.p`
  margin: 0;

  color: #4f5b58;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.7;
  letter-spacing: -0.3px;
`;

/* ================================
   Layout
================================ */

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

  color: #202423;
  font-size: 23px;
  font-weight: 800;
  letter-spacing: -0.75px;
  white-space: nowrap;
`;

const ProductCount = styled.span`
  color: #58625f;
  font-size: 12px;
  font-weight: 500;
`;

const ControlBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

/* ================================
   Search / Sort
================================ */

const SearchBox = styled.div`
  width: 230px;
  height: 29px;
  padding: 0 8px 0 12px;

  display: flex;
  align-items: center;

  border: 1px solid #d5e2dc;
  border-radius: 999px;
  background-color: var(--color-white);

  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  &:focus-within {
    border-color: var(--color-main);
    box-shadow: 0 0 0 3px rgba(0, 169, 123, 0.1);
  }
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 0;

  border: 0;
  outline: none;
  background-color: transparent;

  color: #202423;
  font-size: 12px;
  font-weight: 500;

  &::placeholder {
    color: #9ba9a4;
  }
`;

const SearchButton = styled.button`
  width: 24px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 0;
  padding: 0;
  background-color: transparent;

  cursor: pointer;

  transition: transform 0.18s ease;

  &:hover {
    transform: scale(1.08);
  }
`;

const SearchIcon = styled.img`
  width: 15px;
  height: 15px;
  display: block;
  object-fit: contain;
`;

const SortSelect = styled.select`
  width: 96px;
  height: 30px;
  padding: 0 8px;

  border: 1px solid #d5e2dc;
  border-radius: 8px;
  outline: none;
  background-color: var(--color-white);

  color: #202423;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  &:focus {
    border-color: var(--color-main);
    box-shadow: 0 0 0 3px rgba(0, 169, 123, 0.1);
  }
`;

/* ================================
   Body
================================ */

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

  color: #202423;
  font-size: 15px;
  font-weight: 800;
`;

const TagList = styled.div`
  padding-top: 12px;

  display: flex;
  flex-direction: column;
  gap: 13px;

  border-top: 1px solid #cfdcd6;
`;

const TagButton = styled.button`
  width: fit-content;

  border: 0;
  outline: none;
  background-color: transparent;
  text-align: left;

  color: ${(props) =>
    props.$active ? "var(--color-main)" : "var(--text-sub)"};
  font-size: 12px;
  font-weight: ${(props) => (props.$active ? 800 : 500)};

  cursor: pointer;

  transition:
    color 0.18s ease,
    transform 0.18s ease;

  &:hover,
  &:focus {
    color: var(--color-main);
    transform: translateX(2px);
  }
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

const RecentAsideStickyBox = styled.aside`
  position: sticky;
  top: 92px;
  align-self: start;
  height: fit-content;
  z-index: 3;
`;

/* ================================
   Product Card
================================ */

const ProductCard = styled.article`
  position: relative;

  height: 276px;
  padding: 20px 18px 20px;

  display: flex;
  flex-direction: column;

  border-radius: 11px;
  background-color: var(--color-white);
  box-shadow: 0 2px 8px rgba(18, 45, 46, 0.08);

  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 18px rgba(18, 45, 46, 0.12);
  }

  &:hover img {
    transform: scale(1.045);
  }
`;

const WishButton = styled.button`
  position: absolute;
  right: 13px;
  top: 12px;
  z-index: 3;

  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 0;
  border-radius: 50%;
  background-color: transparent;
  color: ${({ $active }) => ($active ? "var(--color-main)" : "#151918")};

  font-size: ${({ $active }) => ($active ? "27px" : "29px")};
  font-weight: ${({ $active }) => ($active ? "800" : "300")};
  line-height: 1;
  cursor: pointer;

  transition:
    color 0.18s ease,
    transform 0.18s ease,
    background-color 0.18s ease;

  &:hover {
    color: var(--color-main);
    transform: scale(1.09);
    background-color: rgba(236, 253, 246, 0.72);
  }

  &:active {
    transform: scale(0.94);
  }

  &:disabled {
    opacity: 0.55;
    cursor: wait;
  }
`;

const ProductImageBox = styled.div`
  position: relative;

  width: 100%;
  height: 132px;
  margin-bottom: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: visible;
  border-radius: 0;
  background-color: transparent;
`;

const ProductTagBadge = styled.span`
  position: absolute;
  left: 2px;
  top: 0;
  z-index: 2;

  width: fit-content;
  min-width: 40px;
  height: 21px;
  padding: 0 9px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border: 1px solid ${({ $tagLabel }) => getTagTheme($tagLabel).border};
  border-radius: 999px;
  background-color: ${({ $tagLabel }) => getTagTheme($tagLabel).background};
  color: ${({ $tagLabel }) => getTagTheme($tagLabel).color};

  font-size: 11px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.2px;
  white-space: nowrap;

  box-shadow: 0 2px 6px rgba(18, 45, 46, 0.06);
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  padding: 0;
  object-fit: contain;

  transition: transform 0.2s ease;
`;

const ProductImageText = styled.span`
  color: var(--text-desc);
  font-size: 12px;
  font-weight: 600;
`;

const ProductInfoArea = styled.div`
  flex: 1;
  min-height: 0;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ProductName = styled.h3`
  min-height: 35px;
  margin: 0 0 6px;

  color: #202423;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.38;
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

  margin-bottom: 9px;

  color: #555f5c;
  font-size: 11px;
  font-weight: 500;
`;

const ReviewStar = styled.span`
  color: #ffc400;
  font-size: 13px;
  line-height: 1;
`;

const ProductPrice = styled.p`
  margin: auto 0 0;

  color: #151918;
  font-size: 20px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.65px;
`;

const EmptyBox = styled.div`
  min-height: 300px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--text-sub);
  font-size: 14px;
  font-weight: 600;
`;
