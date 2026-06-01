import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import PetStoreUserNav from "./PetStoreUserNav";
import usePetStoreBestProductList from "../../features/petStore/hooks/usePetStoreBestProductList";

const categoryList = [
  {
    id: "feed",
    title: "사료",
    desc: "건강한 식습관의 시작",
    imageText: "사료 이미지",
    path: "/store/cat/food",
  },

  {
    id: "snack",
    title: "간식",
    desc: "맛과 건강 둘 다 챙긴 우리아이 간식",
    imageText: "간식 이미지",
    path: "/store/cat/snack",
  },
  {
    id: "supplement",
    title: "영양제",
    desc: "맞춤형 건강 케어",
    imageText: "영양제 이미지",
    path: "/store/cat/supplement",
  },
  {
    id: "toilet",
    title: "배변용품",
    desc: "위생적인 생활 필수품",
    imageText: "모래 이미지",
    path: "/store/cat/toilet",
  },
];

/*
  임시 리뷰 표시용 데이터입니다.

  나중에 리뷰 기능 완성되면 이 함수는 삭제하고,
  아래 표시 부분을 실제 데이터로 변경하면 됩니다.
*/
function getTempReviewInfo(index) {
  const tempReviewList = [
    { rating: "4.9", count: 128 },
    { rating: "4.7", count: 76 },
    { rating: "4.6", count: 32 },
    { rating: "4.5", count: 21 },
    { rating: "4.3", count: 17 },
  ];

  return tempReviewList[index] ?? { rating: "0.0", count: 0 };
}

export default function PetStoreCatHomePage() {
  const navigate = useNavigate();

  // 고양이 상품 중 베스트 상품만 조회
  const { bestProductList, isBestLoading } = usePetStoreBestProductList("C");

  return (
    <>
      <PetStoreUserNav />

      <Wrapper>
        <HeroBanner>
          <HeroArrowButton type="button" aria-label="이전 배너">
            ‹
          </HeroArrowButton>

          <HeroInner>
            <HeroTextBox>
              <HeroEyebrow>우리 고양이를 위한 모든 것</HeroEyebrow>
              <HeroTitle>
                행복한 고양이의
                <br />
                <strong>건강한 일상</strong>
              </HeroTitle>
              <HeroDesc>좋은 제품이 건강한 습관을 만듭니다.</HeroDesc>

              <HeroIconRow>
                <HeroIconItem>
                  <HeroIconCircle>🌿</HeroIconCircle>
                  <HeroIconText>꼼꼼한 성분체크</HeroIconText>
                </HeroIconItem>

                <HeroIconItem>
                  <HeroIconCircle>🛡</HeroIconCircle>
                  <HeroIconText>안심할 수 있는 품질</HeroIconText>
                </HeroIconItem>

                <HeroIconItem>
                  <HeroIconCircle>🚚</HeroIconCircle>
                  <HeroIconText>빠르고 안전한 배송</HeroIconText>
                </HeroIconItem>
              </HeroIconRow>
            </HeroTextBox>

            <HeroVisualBox>
              <HeroVisualText>고양이 메인 배너 이미지 영역</HeroVisualText>
            </HeroVisualBox>
          </HeroInner>

          <HeroArrowButton type="button" aria-label="다음 배너" $right>
            ›
          </HeroArrowButton>

          <HeroDotBox>
            <HeroDot $active />
            <HeroDot />
            <HeroDot />
          </HeroDotBox>
        </HeroBanner>

        <ContentInner>
          <CategoryGrid>
            {categoryList.map((category) => (
              <CategoryCard
                key={category.id}
                type="button"
                onClick={() => navigate(category.path)}
              >
                <CategoryTextBox>
                  <CategoryTitle>{category.title}</CategoryTitle>
                  <CategoryDesc>{category.desc}</CategoryDesc>
                  <CategoryMoveButton type="button">→</CategoryMoveButton>
                </CategoryTextBox>

                <CategoryImageBox>
                  <CategoryImageText>{category.imageText}</CategoryImageText>
                </CategoryImageBox>

                <CategoryBgPaw>●</CategoryBgPaw>
              </CategoryCard>
            ))}
          </CategoryGrid>

          <SectionTitleArea>
            <SectionTitle>베스트 상품</SectionTitle>
            <SectionSubTitle>많은 보호자님들이 선택한 인기상품</SectionSubTitle>
          </SectionTitleArea>

          <BestSectionBox>
            <BestProductGrid>
              {isBestLoading ? (
                <BestProductEmpty>
                  베스트 상품을 불러오는 중입니다...
                </BestProductEmpty>
              ) : bestProductList.length === 0 ? (
                <BestProductEmpty>베스트 상품이 없습니다.</BestProductEmpty>
              ) : (
                bestProductList.map((product, index) => {
                  const tempReview = getTempReviewInfo(index);

                  return (
                    <BestProductCard key={product.productId}>
                      <ProductRank>{index + 1}</ProductRank>

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

                      <ProductCategoryBadge>
                        {getCategoryLabel(product.productCategory)}
                      </ProductCategoryBadge>

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
                    </BestProductCard>
                  );
                })
              )}
            </BestProductGrid>
          </BestSectionBox>
        </ContentInner>
      </Wrapper>
    </>
  );
}

function getCategoryLabel(category) {
  const categoryMap = {
    FEED: "사료",
    FOOD: "사료",
    SNACK: "간식",
    SUPPLEMENT: "영양제",
    TOILET: "모래",
  };

  return categoryMap[category] ?? "상품";
}

const Wrapper = styled.main`
  width: 100%;
  background-color: var(--color-white);
`;

const HeroBanner = styled.section`
  position: relative;
  width: 100%;
  height: 310px;

  display: flex;
  align-items: center;
  justify-content: center;

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
  margin: 0 0 20px;

  color: var(--text-main);
  font-size: 17px;
  font-weight: 800;
`;

const HeroTitle = styled.h1`
  margin: 0 0 24px;

  color: var(--text-main);
  font-size: 40px;
  font-weight: 900;
  line-height: 1.22;
  letter-spacing: -1.6px;

  strong {
    color: var(--color-main);
  }
`;

const HeroDesc = styled.p`
  margin: 0 0 24px;

  color: var(--text-sub);
  font-size: 15px;
  font-weight: 700;
`;

const HeroIconRow = styled.div`
  display: flex;
  gap: 46px;
`;

const HeroIconItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 9px;
`;

const HeroIconCircle = styled.div`
  width: 64px;
  height: 64px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  background-color: var(--color-white);
  color: var(--color-main);
  box-shadow: 0 4px 10px rgba(18, 45, 46, 0.08);

  font-size: 30px;
`;

const HeroIconText = styled.span`
  color: var(--text-sub);
  font-size: 12px;
  font-weight: 700;
`;

const HeroVisualBox = styled.div`
  position: relative;
  width: 710px;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeroVisualText = styled.div`
  width: 100%;
  height: 86%;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 24px;
  background-color: rgba(255, 255, 255, 0.35);
  color: rgba(0, 0, 0, 0.25);

  font-size: 16px;
  font-weight: 800;
`;

const HeroArrowButton = styled.button`
  position: absolute;
  left: ${(props) => (props.$right ? "auto" : "22px")};
  right: ${(props) => (props.$right ? "22px" : "auto")};
  top: 50%;
  z-index: 5;
  transform: translateY(-50%);

  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 0;
  border-radius: 50%;
  background-color: var(--color-white);
  color: var(--text-main);
  box-shadow: 0 3px 10px rgba(18, 45, 46, 0.12);

  font-size: 42px;
  font-weight: 300;
  line-height: 1;
  cursor: pointer;
`;

const HeroDotBox = styled.div`
  position: absolute;
  left: 50%;
  bottom: 16px;
  transform: translateX(-50%);

  display: flex;
  gap: 14px;
`;

const HeroDot = styled.span`
  width: 12px;
  height: 12px;

  border-radius: 50%;
  background-color: ${(props) =>
    props.$active ? "var(--color-main)" : "#8c918e"};
`;

const ContentInner = styled.div`
  width: 1300px;
  margin: 0 auto;
  padding: 14px 0 12px;
`;

const CategoryGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
`;

const CategoryCard = styled.button`
  position: relative;
  overflow: hidden;

  height: 170px;
  padding: 22px 24px;

  display: flex;
  justify-content: space-between;

  border: 0;
  border-radius: 16px;
  background-color: #edf5f1;
  text-align: left;
  cursor: pointer;

  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 14px rgba(18, 45, 46, 0.12);
  }
`;

const CategoryTextBox = styled.div`
  position: relative;
  z-index: 2;
`;

const CategoryTitle = styled.h2`
  margin: 0 0 9px;

  color: var(--text-main);
  font-size: 26px;
  font-weight: 900;
  letter-spacing: -1px;
`;

const CategoryDesc = styled.p`
  margin: 0 0 24px;

  color: var(--text-sub);
  font-size: 12px;
  font-weight: 700;
`;

const CategoryMoveButton = styled.button`
  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 0;
  border-radius: 50%;
  background-color: var(--color-white);
  color: #333;

  font-size: 24px;
  font-weight: 800;
  cursor: pointer;
`;

const CategoryImageBox = styled.div`
  position: absolute;
  right: 16px;
  bottom: 12px;

  width: 155px;
  height: 105px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--text-desc);
  font-size: 12px;
  font-weight: 800;
`;

const CategoryImageText = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 14px;
  background-color: rgba(255, 255, 255, 0.42);
`;

const CategoryBgPaw = styled.span`
  position: absolute;
  right: 20px;
  top: 15px;

  color: rgba(0, 118, 83, 0.08);
  font-size: 90px;
  line-height: 1;
`;

const SectionTitleArea = styled.section`
  height: 42px;
  padding: 11px 0 0;

  display: flex;
  align-items: flex-start;
  gap: 14px;
`;

const SectionTitle = styled.h2`
  margin: 0;

  color: var(--text-main);
  font-size: 22px;
  font-weight: 900;
  letter-spacing: -0.7px;
`;

const SectionSubTitle = styled.p`
  margin: 6px 0 0;

  color: var(--text-sub);
  font-size: 13px;
  font-weight: 700;
`;

const BestSectionBox = styled.section`
  padding: 28px 34px;

  border-radius: 16px;
  background-color: #edf5f1;
`;

const BestProductGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 34px;
`;

const BestProductCard = styled.article`
  position: relative;

  height: 260px;
  padding: 22px 20px 18px;

  display: flex;
  flex-direction: column;

  border-radius: 14px;
  background-color: var(--color-white);
  box-shadow: 0 3px 12px rgba(18, 45, 46, 0.12);

  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(18, 45, 46, 0.16);
  }
`;

const ProductRank = styled.div`
  position: absolute;
  left: 14px;
  top: 14px;
  z-index: 2;

  width: 24px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  background-color: var(--color-main);
  color: var(--color-white);

  font-size: 12px;
  font-weight: 900;
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
  font-size: 21px;
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

const BestProductEmpty = styled.div`
  grid-column: 1 / -1;
  height: 220px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 14px;
  background-color: var(--color-white);
  color: var(--text-sub);

  font-size: 14px;
  font-weight: 800;
`;
