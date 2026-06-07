import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import PetStoreUserNav from "./PetStoreUserNav";
import usePetStoreBestProductList from "../../features/petStore/hooks/usePetStoreBestProductList";

import dogStoreBanner from "../../assets/images/petStore/강아지홈배너.png";
import foodCard from "../../assets/images/petStore/사료카드.png";
import snackCard from "../../assets/images/petStore/간식카드.png";
import suppleCard from "../../assets/images/petStore/영양제카드.png";
import dogToiletCard from "../../assets/images/petStore/배변패드카드.png";

import securityIcon from "../../assets/images/icon/보안.png";
import truckIcon from "../../assets/images/icon/트럭.png";
import materialIcon from "../../assets/images/icon/원료.png";

const categoryList = [
  {
    id: "food",
    title: "사료",
    desc: "건강한 식습관의 시작",
    image: foodCard,
    path: "/store/dog/food",
  },

  {
    id: "snack",
    title: "간식",
    desc: "맛과 건강 둘 다 챙긴 우리아이 간식",
    image: snackCard,
    path: "/store/dog/snack",
  },
  {
    id: "supplement",
    title: "영양제",
    desc: "맞춤형 건강 케어",
    image: suppleCard,
    path: "/store/dog/supplement",
  },
  {
    id: "toilet",
    title: "배변패드",
    desc: "위생적인 생활 필수품",
    image: dogToiletCard,
    path: "/store/dog/toilet",
  },
];

const heroIconList = [
  {
    id: "material",
    label: "꼼꼼한 성분체크",
    icon: materialIcon,
  },
  {
    id: "security",
    label: "안심할 수 있는 품질",
    icon: securityIcon,
  },
  {
    id: "delivery",
    label: "빠르고 안전한 배송",
    icon: truckIcon,
  },
];

function getTempReviewInfo(index) {
  const tempReviewList = [
    { rating: "4.9", count: 128 },
    { rating: "4.7", count: 76 },
    { rating: "4.6", count: 32 },
    { rating: "4.5", count: 21 },
  ];

  return tempReviewList[index] ?? { rating: "0.0", count: 0 };
}

function getCategoryLabel(category) {
  const categoryMap = {
    FEED: "사료",
    FOOD: "사료",
    SNACK: "간식",
    SUPPLEMENT: "영양제",
    TOILET: "배변패드",
  };

  return categoryMap[category] ?? "상품";
}

export default function PetStoreDogHomePage() {
  const navigate = useNavigate();
  const { bestProductList, isBestLoading } = usePetStoreBestProductList("D");

  const [wishlistMap, setWishlistMap] = useState({});

  function handleToggleWishlist(evt, productId) {
    evt.stopPropagation();

    setWishlistMap((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  }
  return (
    <>
      <PetStoreUserNav />

      <Wrapper>
        <HeroBanner>
          <HeroBannerImage src={dogStoreBanner} alt="강아지 스토어 배너" />

          <HeroArrowButton type="button" aria-label="이전 배너">
            ‹
          </HeroArrowButton>

          <HeroInner>
            <HeroTextBox>
              <HeroEyebrow>우리 강아지를 위한 모든 것</HeroEyebrow>

              <HeroTitle>
                건강한 강아지의
                <br />
                <strong>행복한 일상</strong>
              </HeroTitle>

              <HeroDesc>좋은 제품이 건강한 습관을 만듭니다.</HeroDesc>

              <HeroIconRow>
                {heroIconList.map((item) => (
                  <HeroIconItem key={item.id}>
                    <HeroIconCircle>
                      <HeroIconImage src={item.icon} alt={item.label} />
                    </HeroIconCircle>
                    <HeroIconText>{item.label}</HeroIconText>
                  </HeroIconItem>
                ))}
              </HeroIconRow>
            </HeroTextBox>
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
                role="button"
                tabIndex={0}
                $cardImage={category.image}
                onClick={() => navigate(category.path)}
                onKeyDown={(evt) => {
                  if (evt.key === "Enter") {
                    navigate(category.path);
                  }
                }}
              >
                <CategoryTextBox>
                  <CategoryTitle>{category.title}</CategoryTitle>
                  <CategoryDesc>{category.desc}</CategoryDesc>
                  <CategoryMoveIcon>→</CategoryMoveIcon>
                </CategoryTextBox>
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
                bestProductList.slice(0, 4).map((product, index) => {
                  const tempReview = getTempReviewInfo(index);

                  return (
                    <BestProductCard
                      key={product.productId}
                      onClick={() =>
                        navigate(`/store/product/${product.productId}`)
                      }
                    >
                      <ProductRank>{index + 1}</ProductRank>

                      <WishButton
                        type="button"
                        aria-label="관심상품"
                        $active={!!wishlistMap[product.productId]}
                        onClick={(evt) =>
                          handleToggleWishlist(evt, product.productId)
                        }
                      >
                        {wishlistMap[product.productId] ? "♥" : "♡"}
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

                      <ProductInfoArea>
                        <ProductCategoryBadge>
                          {getCategoryLabel(product.productCategory)}
                        </ProductCategoryBadge>

                        <ProductName>{product.productName}</ProductName>

                        <ProductReviewInfo>
                          <ReviewStar>★</ReviewStar>
                          {tempReview.rating} ({tempReview.count})
                        </ProductReviewInfo>

                        <ProductPrice>
                          {product.productPrice?.toLocaleString()}원
                        </ProductPrice>
                      </ProductInfoArea>
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

const Wrapper = styled.main`
  width: 100%;
  background-color: var(--color-white);
`;

/* ================================
   Hero Banner
================================ */

const HeroBanner = styled.section`
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: #edf8f2;
`;

const HeroBannerImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
`;

const HeroInner = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;

  width: 1300px;
  height: 100%;
  margin: 0 auto;
  left: 0;
  right: 0;

  display: flex;
  align-items: center;
`;

const HeroTextBox = styled.div`
  width: 470px;
  transform: translateY(-2px);
`;

const HeroEyebrow = styled.p`
  margin: 0 0 18px;

  color: #202423;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.35px;
`;

const HeroTitle = styled.h1`
  margin: 0 0 32px;

  color: #151918;
  font-size: 44px;
  font-weight: 800;
  line-height: 1.13;
  letter-spacing: -1.8px;

  strong {
    color: var(--color-main);
    font-weight: 800;
  }
`;

const HeroDesc = styled.p`
  margin: 0 0 34px;

  color: #4f5b58;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.25px;
`;

const HeroIconRow = styled.div`
  display: flex;
  gap: 64px;
`;

const HeroIconItem = styled.div`
  width: 94px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 11px;

  cursor: default;

  &:hover div {
    transform: translateY(-5px) scale(1.06);
    box-shadow: 0 13px 26px rgba(0, 169, 123, 0.17);
    background-color: #ffffff;
  }

  &:hover img {
    transform: scale(1.1);
  }

  &:hover span {
    color: var(--color-main);
    font-weight: 600;
  }
`;

const HeroIconCircle = styled.div`
  width: 74px;
  height: 74px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.96);
  box-shadow: 0 5px 14px rgba(18, 45, 46, 0.08);

  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    background-color 0.22s ease;
`;

const HeroIconImage = styled.img`
  width: 37px;
  height: 37px;
  object-fit: contain;

  transition: transform 0.22s ease;
`;

const HeroIconText = styled.span`
  width: 100%;

  color: #555f5c;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: -0.25px;
  text-align: center;
  white-space: nowrap;

  transition:
    color 0.18s ease,
    font-weight 0.18s ease;
`;

const HeroArrowButton = styled.button`
  position: absolute;
  left: ${(props) => (props.$right ? "auto" : "22px")};
  right: ${(props) => (props.$right ? "22px" : "auto")};
  top: 50%;
  z-index: 5;
  transform: translateY(-50%);

  width: 50px;
  height: 50px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 0;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.95);
  color: #202423;
  box-shadow: 0 5px 16px rgba(18, 45, 46, 0.12);

  font-size: 43px;
  font-weight: 200;
  line-height: 1;
  cursor: pointer;

  transition:
    transform 0.18s ease,
    color 0.18s ease,
    box-shadow 0.18s ease,
    background-color 0.18s ease;

  &:hover {
    transform: translateY(-50%) scale(1.06);
    color: var(--color-main);
    background-color: #ffffff;
    box-shadow: 0 8px 22px rgba(18, 45, 46, 0.16);
  }
`;

const HeroDotBox = styled.div`
  position: absolute;
  left: 50%;
  bottom: 24px;
  z-index: 5;
  transform: translateX(-50%);

  display: flex;
  gap: 14px;
`;

const HeroDot = styled.span`
  width: 13px;
  height: 13px;

  border-radius: 50%;
  background-color: ${(props) =>
    props.$active ? "var(--color-main)" : "rgba(32, 36, 35, 0.42)"};

  transition:
    transform 0.18s ease,
    background-color 0.18s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

/* ================================
   Content
================================ */

const ContentInner = styled.div`
  width: 1300px;
  margin: 0 auto;
  padding: 16px 0 12px;
`;

/* ================================
   Category
================================ */

const CategoryGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
`;

const CategoryCard = styled.article`
  position: relative;
  overflow: hidden;

  height: 176px;
  padding: 25px 24px;

  border-radius: 17px;
  background-color: #edf5f1;
  background-image: url(${({ $cardImage }) => $cardImage});
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;

  text-align: left;
  cursor: pointer;

  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    filter 0.22s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 24px rgba(18, 45, 46, 0.13);
    filter: saturate(1.035) brightness(1.01);
  }
`;

const CategoryTextBox = styled.div`
  position: relative;
  z-index: 2;
`;

const CategoryTitle = styled.h2`
  margin: 0 0 10px;

  color: #202423;
  font-size: 27px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -1.05px;

  transition:
    color 0.18s ease,
    transform 0.18s ease;

  ${CategoryCard}:hover & {
    color: var(--color-main);
    transform: translateX(2px);
  }
`;

const CategoryDesc = styled.p`
  width: 164px;
  min-height: 34px;
  margin: 0 0 24px;

  color: #596461;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.42;
  letter-spacing: -0.25px;
`;

const CategoryMoveIcon = styled.div`
  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.96);
  color: #303635;

  font-size: 22px;
  font-weight: 700;

  transition:
    color 0.18s ease,
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background-color 0.18s ease;

  ${CategoryCard}:hover & {
    color: var(--color-main);
    transform: translateX(3px);
    background-color: #ffffff;
    box-shadow: 0 6px 14px rgba(18, 45, 46, 0.1);
  }
`;

/* ================================
   Section Title
================================ */

const SectionTitleArea = styled.section`
  height: 43px;
  padding: 12px 0 0;

  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const SectionTitle = styled.h2`
  margin: 0;

  color: #202423;
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.7px;
`;

const SectionSubTitle = styled.p`
  margin: 6px 0 0;

  color: #58625f;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: -0.25px;
`;

/* ================================
   Best Product
================================ */

const BestSectionBox = styled.section`
  padding: 30px 34px 34px;

  border-radius: 17px;
  background-color: #eef6f2;
`;

const BestProductGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 34px;
`;

const BestProductCard = styled.article`
  position: relative;

  height: 338px;
  padding: 22px 20px 24px;

  display: flex;
  flex-direction: column;

  border-radius: 16px;
  background-color: var(--color-white);
  box-shadow: 0 4px 14px rgba(18, 45, 46, 0.1);

  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 26px rgba(18, 45, 46, 0.15);
  }

  &:hover img {
    transform: scale(1.045);
  }
`;

const ProductRank = styled.div`
  position: absolute;
  left: 16px;
  top: 15px;
  z-index: 2;

  width: 25px;
  height: 25px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  background-color: var(--color-main);
  color: var(--color-white);

  font-size: 11px;
  font-weight: 800;
`;

const WishButton = styled.button`
  position: absolute;
  right: 17px;
  top: 14px;
  z-index: 2;

  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 0;
  border-radius: 50%;
  background-color: transparent;
  color: ${({ $active }) => ($active ? "var(--color-main)" : "#191f1d")};

  font-size: ${({ $active }) => ($active ? "28px" : "30px")};
  font-weight: ${({ $active }) => ($active ? "800" : "300")};
  line-height: 1;
  cursor: pointer;

  transition:
    color 0.18s ease,
    transform 0.18s ease,
    background-color 0.18s ease;

  &:hover {
    color: var(--color-main);
    transform: scale(1.1);
    background-color: rgba(236, 253, 246, 0.72);
  }

  &:active {
    transform: scale(0.94);
  }
`;

const ProductImageBox = styled.div`
  width: 100%;
  height: 162px;
  margin-bottom: 15px;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: visible;
  border-radius: 0;
  background: transparent;
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
  font-size: 11px;
  font-weight: 500;
`;

const ProductInfoArea = styled.div`
  flex: 1;
  min-height: 0;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ProductCategoryBadge = styled.span`
  width: fit-content;
  height: 19px;
  padding: 0 9px;
  margin-bottom: 9px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border-radius: 4px;
  background-color: #c9f0dd;
  color: var(--color-main);

  font-size: 9px;
  font-weight: 700;
`;

const ProductName = styled.h3`
  min-height: 38px;
  margin: 0 0 8px;

  color: #242827;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.22px;

  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ProductReviewInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  margin-bottom: 13px;

  color: #555f5c;
  font-size: 12px;
  font-weight: 500;
`;

const ReviewStar = styled.span`
  color: #ffc400;
  font-size: 14px;
  line-height: 1;
`;

const ProductPrice = styled.p`
  margin: auto 0 0;

  color: #202423;
  font-size: 24px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.75px;
`;

const BestProductEmpty = styled.div`
  grid-column: 1 / -1;
  height: 260px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 14px;
  background-color: var(--color-white);
  color: var(--text-sub);

  font-size: 14px;
  font-weight: 500;
`;
