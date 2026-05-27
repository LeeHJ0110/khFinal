import styled from "styled-components";
import PetStoreUserNav from "./PetStoreUserNav";
import RoundedButton from "../../shared/components/button/RoundedButton";

const bestProducts = [
  {
    id: 1,
    rank: "BEST 1",
    name: "캣챠 5kg 전연령 고양이사료",
    price: "19,700원",
    rating: "4.9",
    reviewCount: "128",
    imageText: "상품 이미지",
  },
  {
    id: 2,
    rank: "BEST 2",
    name: "탐사 강아지 고구마말랭이 간식",
    price: "9,890원",
    rating: "4.7",
    reviewCount: "56",
    imageText: "상품 이미지",
  },
  {
    id: 3,
    rank: "BEST 3",
    name: "탐사 고양이 두부모래 7L",
    price: "26,990원",
    rating: "4.6",
    reviewCount: "37",
    imageText: "상품 이미지",
  },
  {
    id: 4,
    rank: "BEST 4",
    name: "탐사 강아지 트릿 영양제",
    price: "10,370원",
    rating: "4.5",
    reviewCount: "21",
    imageText: "상품 이미지",
  },
];

export default function PetStoreHomePage() {
  return (
    <>
      <PetStoreUserNav />

      <Wrapper>
        <HeroBanner>
          <h1>스토어 메인 배너 이미지 영역</h1>
        </HeroBanner>

        <ContentInner>
          <StoreShortcutGrid>
            <StoreShortcutCard>
              <StoreShortcutText>
                <StoreShortcutEyebrow>
                  건강한 반려 생활의 시작
                </StoreShortcutEyebrow>
                <StoreShortcutTitle>강아지 스토어</StoreShortcutTitle>
                <StoreShortcutDesc>
                  사료부터 영양제까지 강아지에게 필요한 모든 것
                </StoreShortcutDesc>

                <RoundedButton
                  width="164px"
                  height="28px"
                  fontSize="12px"
                  fontWeight="500"
                  gap="14px"
                  rightIcon="→"
                >
                  강아지 스토어 바로가기
                </RoundedButton>
              </StoreShortcutText>

              <StoreImagePlaceholder>
                강아지 카드 이미지 영역
              </StoreImagePlaceholder>
            </StoreShortcutCard>

            <StoreShortcutCard>
              <StoreShortcutText>
                <StoreShortcutEyebrow>
                  건강한 반려 생활의 시작
                </StoreShortcutEyebrow>
                <StoreShortcutTitle>고양이 스토어</StoreShortcutTitle>
                <StoreShortcutDesc>
                  사료부터 영양제까지 고양이에게 필요한 모든 것
                </StoreShortcutDesc>

                <RoundedButton
                  width="164px"
                  height="28px"
                  fontSize="12px"
                  fontWeight="500"
                  gap="14px"
                  rightIcon="→"
                >
                  고양이 스토어 바로가기
                </RoundedButton>
              </StoreShortcutText>

              <StoreImagePlaceholder>
                고양이 카드 이미지 영역
              </StoreImagePlaceholder>
            </StoreShortcutCard>
          </StoreShortcutGrid>

          <SectionTitleArea>
            <SectionTitle>베스트 상품</SectionTitle>
            <SectionSubTitle>많은 집사님들이 선택한 인기상품</SectionSubTitle>
          </SectionTitleArea>

          <BestProductGrid>
            {bestProducts.map((product) => (
              <BestProductCard key={product.id}>
                <BestBadge>{product.rank}</BestBadge>

                <ProductImageBox>
                  <ProductImageText>{product.imageText}</ProductImageText>
                </ProductImageBox>

                <ProductInfo>
                  <ProductName>{product.name}</ProductName>
                  <ProductPrice>{product.price}</ProductPrice>

                  <ProductMeta>
                    <ProductRating>
                      <span>★</span> {product.rating} ({product.reviewCount})
                    </ProductRating>

                    <CartButton type="button">🛒</CartButton>
                  </ProductMeta>
                </ProductInfo>
              </BestProductCard>
            ))}
          </BestProductGrid>

          <HealthBanner>
            <HealthTextBox>
              <HealthTitle>
                우리 아이 건강관리, <strong>지금 시작해보세요!</strong>
              </HealthTitle>
              <HealthDesc>
                간편한 건강진단부터 맞춤관리까지, PET&I FOR와 함께라면 더
                쉬워집니다.
              </HealthDesc>
            </HealthTextBox>

            <RoundedButton
              width="194px"
              height="43px"
              fontSize="15px"
              fontWeight="800"
              rightIcon="→"
            >
              건강관리 시작하기
            </RoundedButton>

            <HealthImagePlaceholder>
              건강관리 배너 이미지 영역
            </HealthImagePlaceholder>
          </HealthBanner>
        </ContentInner>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.main`
  width: 100%;
  background-color: var(--color-white);
`;

/* Main Banner */
const HeroBanner = styled.section`
  width: 100%;
  height: 310px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: #eefaf4;
`;

const ImageSlotText = styled.p`
  margin: 0;

  color: var(--text-desc);
  font-size: 16px;
  font-weight: 700;
`;

/* Content Layout */
const ContentInner = styled.div`
  width: 1300px;
  margin: 0 auto;
  padding: 16px 0 14px;
`;

/* Store Shortcut */
const StoreShortcutGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 34px;
`;

const StoreShortcutCard = styled.article`
  position: relative;
  overflow: hidden;

  height: 172px;
  padding: 28px 38px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  border-radius: 16px;
  background-color: #e9f3ed;
`;

const StoreShortcutText = styled.div`
  position: relative;
  z-index: 2;
`;

const StoreShortcutEyebrow = styled.p`
  margin: 0 0 6px;

  color: var(--color-main);
  font-size: 17px;
  font-weight: 800;
`;

const StoreShortcutTitle = styled.h2`
  margin: 0 0 12px;

  color: var(--text-main);
  font-size: 35px;
  font-weight: 800;
  letter-spacing: -1.2px;
`;

const StoreShortcutDesc = styled.p`
  margin: 0 0 19px;

  color: var(--text-desc);
  font-size: 13px;
  font-weight: 400;
`;

const StoreImagePlaceholder = styled.div`
  width: 250px;
  height: 120px;
  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 14px;
  background-color: rgba(255, 255, 255, 0.45);
  color: var(--text-desc);

  font-size: 12px;
  font-weight: 700;
`;

/* Section Title */
const SectionTitleArea = styled.section`
  height: 48px;
  padding: 10px 8px 0;

  display: flex;
  align-items: flex-start;
  gap: 14px;
`;

const SectionTitle = styled.h2`
  margin: 0;

  color: var(--text-main);
  font-size: 22px;
  font-weight: 900;
  letter-spacing: -0.5px;
`;

const SectionSubTitle = styled.p`
  margin: 6px 0 0;

  color: var(--text-sub);
  font-size: 13px;
  font-weight: 600;
`;

/* Best Product */
const BestProductGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 34px;
`;

const BestProductCard = styled.article`
  position: relative;

  height: 130px;
  padding: 20px 22px 16px 58px;

  display: grid;
  grid-template-columns: 96px 1fr;
  align-items: center;
  gap: 14px;

  border-radius: 12px;
  background-color: var(--color-white);
  box-shadow: 0 2px 12px rgba(18, 45, 46, 0.18);
`;

const BestBadge = styled.div`
  position: absolute;
  left: 13px;
  top: 10px;

  min-width: 44px;
  height: 17px;
  padding: 0 7px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 4px;
  background-color: var(--color-main);
  color: var(--color-white);

  font-size: 9px;
  font-weight: 900;
`;

const ProductImageBox = styled.div`
  width: 92px;
  height: 92px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 8px;
  background-color: #f1f6f3;
`;

const ProductImageText = styled.span`
  color: var(--text-desc);
  font-size: 11px;
  font-weight: 700;
`;

const ProductInfo = styled.div`
  min-width: 0;
`;

const ProductName = styled.h3`
  min-height: 36px;
  margin: 0 0 8px;

  color: var(--text-main);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.35;

  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ProductPrice = styled.p`
  margin: 0 0 15px;

  color: var(--text-main);
  font-size: 22px;
  font-weight: 900;
  letter-spacing: -0.5px;
`;

const ProductMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ProductRating = styled.div`
  color: var(--text-sub);
  font-size: 13px;
  font-weight: 500;

  span {
    color: #ffc400;
  }
`;

/* Health Banner */
const HealthBanner = styled.section`
  position: relative;
  overflow: hidden;

  height: 155px;
  margin-top: 14px;
  padding: 0 38px;

  display: flex;
  align-items: center;

  border-radius: 16px;
  background-color: #dff2e7;
`;

const HealthTextBox = styled.div`
  position: relative;
  z-index: 2;
`;

const HealthTitle = styled.h2`
  margin: 0 0 12px;

  color: var(--color-main);
  font-size: 30px;
  font-weight: 900;
  letter-spacing: -1px;

  strong {
    color: var(--text-main);
  }
`;

const HealthDesc = styled.p`
  margin: 0;

  color: var(--text-sub);
  font-size: 13px;
  font-weight: 600;
`;

const HealthButton = styled.button`
  width: 194px;
  height: 43px;
  margin-left: 70px;

  border: 0;
  border-radius: 999px;
  background-color: var(--color-main);
  color: var(--color-white);

  font-size: 15px;
  font-weight: 800;
`;

const HealthImagePlaceholder = styled.div`
  position: absolute;
  right: 38px;
  bottom: 18px;

  width: 300px;
  height: 115px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 14px;
  background-color: rgba(255, 255, 255, 0.45);
  color: var(--text-desc);

  font-size: 12px;
  font-weight: 700;
`;

/* Temporary Common Button */
const PillButton = styled.button`
  width: 164px;
  height: 28px;
  padding: 0 16px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 14px;

  border: 0;
  border-radius: 999px;
  background-color: var(--color-main);
  color: var(--color-white);

  font-size: 12px;
  font-weight: 800;

  span {
    font-size: 15px;
    line-height: 1;
  }
`;

const CartButton = styled.button`
  width: 24px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 0;
  border-radius: 50%;
  background-color: #e9f3ed;

  font-size: 13px;
`;
