import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import PetStoreUserNav from "./PetStoreUserNav";
import RoundedButton from "../../shared/components/button/RoundedButton";
import usePetStoreBestProductList from "../../features/petStore/hooks/usePetStoreBestProductList";

import petStoreHomeBanner from "../../assets/images/petStore/스토어홈배너2.png";
import dogStoreCard from "../../assets/images/petStore/강아지스토어카드.png";
import catStoreCard from "../../assets/images/petStore/고양이스토어카드.png";
import storeHealthCareCard from "../../assets/images/petStore/스토어건강관리카드.png";

const shortcutList = [
  {
    id: "dog",
    title: "강아지 스토어",
    desc: "사료부터 영양제까지 강아지에게 필요한 모든 것",
    buttonText: "강아지 스토어 바로가기",
    path: "/store/dog",
    image: dogStoreCard,
  },
  {
    id: "cat",
    title: "고양이 스토어",
    desc: "사료부터 영양제까지 고양이에게 필요한 모든 것",
    buttonText: "고양이 스토어 바로가기",
    path: "/store/cat",
    image: catStoreCard,
  },
];

function getTempReviewInfo(index) {
  const tempReviewList = [
    { rating: "4.9", count: 128 },
    { rating: "4.7", count: 56 },
    { rating: "4.6", count: 37 },
    { rating: "4.5", count: 21 },
  ];

  return tempReviewList[index] ?? { rating: "0.0", count: 0 };
}

export default function PetStoreHomePage() {
  const navigate = useNavigate();
  const { bestProductList, isBestLoading } = usePetStoreBestProductList();

  return (
    <>
      <PetStoreUserNav />

      <Wrapper>
        <HeroBanner $bannerImage={petStoreHomeBanner}>
          <HeroTextBox>
            <HeroTitle>
              PET CARE
              <br />
              PREMIUM STORE
            </HeroTitle>

            <HeroDesc>
              For Better Pet Life
              <br />
              우리 아이의 건강한 선택
            </HeroDesc>
          </HeroTextBox>
        </HeroBanner>

        <ContentInner>
          <StoreShortcutGrid>
            {shortcutList.map((shortcut) => (
              <StoreShortcutCard
                key={shortcut.id}
                $cardImage={shortcut.image}
                onClick={() => navigate(shortcut.path)}
              >
                <StoreShortcutText>
                  <StoreShortcutEyebrow>
                    건강한 반려 생활의 시작
                  </StoreShortcutEyebrow>

                  <StoreShortcutTitle>{shortcut.title}</StoreShortcutTitle>

                  <StoreShortcutDesc>{shortcut.desc}</StoreShortcutDesc>

                  <RoundedButton
                    width="158px"
                    height="29px"
                    fontSize="12px"
                    fontWeight="700"
                    gap="10px"
                    rightIcon="→"
                    onClick={(evt) => {
                      evt.stopPropagation();
                      navigate(shortcut.path);
                    }}
                  >
                    {shortcut.buttonText}
                  </RoundedButton>
                </StoreShortcutText>

                <ShortcutArrowButton
                  type="button"
                  aria-label={`${shortcut.title} 이동`}
                  onClick={(evt) => {
                    evt.stopPropagation();
                    navigate(shortcut.path);
                  }}
                >
                  ›
                </ShortcutArrowButton>
              </StoreShortcutCard>
            ))}
          </StoreShortcutGrid>

          <SectionTitleArea>
            <SectionTitle>베스트 상품</SectionTitle>
            <SectionSubTitle>많은 집사님들이 선택한 인기상품</SectionSubTitle>
          </SectionTitleArea>

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
                  <BestProductCard
                    key={product.productId}
                    onClick={() =>
                      navigate(`/store/product/${product.productId}`)
                    }
                  >
                    <ProductVisualBox>
                      <BestBadge>BEST {index + 1}</BestBadge>

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
                    </ProductVisualBox>

                    <ProductInfo>
                      <ProductName>{product.productName}</ProductName>

                      <ProductPrice>
                        {product.productPrice?.toLocaleString()}원
                      </ProductPrice>

                      <ProductReviewInfo>
                        <ReviewStar>★</ReviewStar>
                        {tempReview.rating} ({tempReview.count})
                      </ProductReviewInfo>
                    </ProductInfo>
                  </BestProductCard>
                );
              })
            )}
          </BestProductGrid>

          <HealthBanner $cardImage={storeHealthCareCard}>
            <HealthTextBox>
              <HealthTitle>
                우리 아이 건강관리, <strong>지금 시작해보세요!</strong>
              </HealthTitle>

              <HealthDesc>
                간편한 건강진단부터 맞춤관리까지, PET&I FOR와 함께라면 더
                쉬워집니다.
              </HealthDesc>
            </HealthTextBox>

            <HealthButtonWrap>
              <RoundedButton
                width="190px"
                height="42px"
                fontSize="14px"
                fontWeight="700"
                rightIcon=">"
                onClick={() => navigate("/healthcare/requesthome")}
              >
                건강관리 시작하기
              </RoundedButton>
            </HealthButtonWrap>
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

const HeroBanner = styled.section`
  position: relative;
  width: 100%;
  height: 320px;
  overflow: hidden;

  display: flex;
  align-items: flex-start;
  justify-content: center;

  background: #eef8f2;

  &::before {
    content: "";
    position: absolute;
    inset: 0;

    background-image: url(${({ $bannerImage }) => $bannerImage});
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;

    transform: scale(1);
    transition:
      transform 0.9s ease,
      filter 0.9s ease;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;

    background:
      radial-gradient(
        circle at 50% 42%,
        rgba(255, 255, 255, 0.08),
        transparent 34%
      ),
      linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.06) 0%,
        rgba(236, 253, 246, 0.05) 100%
      );

    pointer-events: none;
  }

  &:hover::before {
    transform: scale(1.026);
    filter: saturate(1.035) brightness(1.01);
  }
`;

const HeroTextBox = styled.div`
  position: relative;
  z-index: 2;

  width: 100%;
  padding-top: 68px;

  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;
  pointer-events: none;
`;

const HeroTitle = styled.h1`
  margin: 0;

  color: #242424;
  font-size: 54px;
  font-weight: 800;
  line-height: 0.94;
  letter-spacing: -2.7px;

  text-shadow: 0 2px 10px rgba(255, 255, 255, 0.32);
`;

const HeroDesc = styled.p`
  margin: 40px 0 0;

  color: #505a57;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: -0.55px;
`;

const ContentInner = styled.div`
  width: 1300px;
  margin: 0 auto;
  padding: 14px 0 14px;
`;

const StoreShortcutGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 34px;
`;

const StoreShortcutCard = styled.article`
  position: relative;
  overflow: hidden;

  height: 158px;
  padding: 25px 36px;

  display: flex;
  align-items: center;

  border-radius: 18px;
  background-color: #e8f2ed;
  background-image: url(${({ $cardImage }) => $cardImage});
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;

  cursor: pointer;

  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    filter 0.22s ease;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.04) 45%,
      rgba(255, 255, 255, 0) 100%
    );
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 26px rgba(18, 45, 46, 0.13);
    filter: saturate(1.035);
  }
`;

const StoreShortcutText = styled.div`
  position: relative;
  z-index: 3;
  transform: translateY(-1px);
`;

const StoreShortcutEyebrow = styled.p`
  margin: 0 0 7px;

  color: var(--color-main);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.35px;
`;

const StoreShortcutTitle = styled.h2`
  margin: 0 0 12px;

  color: #202423;
  font-size: 32px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -1.3px;
`;

const StoreShortcutDesc = styled.p`
  margin: 0 0 16px;

  color: #7b8582;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: -0.2px;
`;

const ShortcutArrowButton = styled.button`
  position: absolute;
  right: 38px;
  top: 50%;
  z-index: 4;
  transform: translateY(-50%);

  width: 58px;
  height: 58px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1.4px solid rgba(30, 42, 40, 0.58);
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.12);
  color: #252b29;

  font-size: 56px;
  font-weight: 200;
  line-height: 0.7;
  cursor: pointer;

  transition:
    background-color 0.18s ease,
    color 0.18s ease,
    border-color 0.18s ease,
    transform 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-50%) scale(1.045);
    border-color: var(--color-main);
    color: var(--color-main);
    background-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 8px 18px rgba(0, 169, 123, 0.14);
  }
`;

const SectionTitleArea = styled.section`
  height: 43px;
  padding: 12px 8px 0;

  display: flex;
  align-items: flex-start;
  gap: 14px;
`;

const SectionTitle = styled.h2`
  margin: 0;

  color: #202423;
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.75px;
`;

const SectionSubTitle = styled.p`
  margin: 6px 0 0;

  color: #5d6764;
  font-size: 12px;
  font-weight: 500;
`;

const BestProductGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 34px;
`;

const BestProductCard = styled.article`
  position: relative;

  height: 126px;
  padding: 15px 18px;

  display: grid;
  grid-template-columns: 102px minmax(0, 1fr);
  align-items: center;
  gap: 16px;

  border: 1px solid rgba(18, 45, 46, 0.055);
  border-radius: 16px;
  background-color: var(--color-white);
  box-shadow: 0 4px 15px rgba(18, 45, 46, 0.13);

  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(0, 169, 123, 0.16);
    box-shadow: 0 9px 22px rgba(18, 45, 46, 0.16);
  }
`;

const ProductVisualBox = styled.div`
  position: relative;

  width: 102px;
  height: 98px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const BestBadge = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;

  min-width: 48px;
  height: 20px;
  padding: 0 7px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 5px;
  background-color: var(--color-main);
  color: var(--color-white);

  font-size: 8px;
  font-weight: 800;
  letter-spacing: -0.15px;
`;

const ProductImageBox = styled.div`
  width: 90px;
  height: 90px;

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

  transition: transform 0.18s ease;

  ${BestProductCard}:hover & {
    transform: scale(1.035);
  }
`;

const ProductImageText = styled.span`
  color: var(--text-desc);
  font-size: 11px;
  font-weight: 500;
`;

const ProductInfo = styled.div`
  min-width: 0;
  height: 90px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ProductName = styled.h3`
  min-height: 35px;
  margin: 0;

  color: #222827;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.32;
  letter-spacing: -0.25px;

  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ProductPrice = styled.p`
  margin: 0;

  color: #202423;
  font-size: 20px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.6px;
`;

const ProductReviewInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  color: #555f5c;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
`;

const ReviewStar = styled.span`
  color: #ffc400;
  font-size: 14px;
  line-height: 1;
`;

const HealthBanner = styled.section`
  position: relative;
  overflow: hidden;

  height: 146px;
  margin-top: 16px;
  padding: 0 34px;

  display: flex;
  align-items: center;

  border-radius: 18px;
  background-color: #dff2e7;
  background-image: url(${({ $cardImage }) => $cardImage});
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;

  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    filter 0.22s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(18, 45, 46, 0.11);
    filter: saturate(1.025);
  }
`;

const HealthTextBox = styled.div`
  position: relative;
  z-index: 2;
  flex-shrink: 0;

  margin-left: 104px;
`;

const HealthTitle = styled.h2`
  margin: 0 0 9px;

  color: var(--color-main);
  font-size: 27px;
  font-weight: 800;
  letter-spacing: -1px;

  strong {
    color: #202423;
    font-weight: 800;
  }
`;

const HealthDesc = styled.p`
  margin: 0;

  color: #4e5a57;
  font-size: 13px;
  font-weight: 500;
`;

const HealthButtonWrap = styled.div`
  margin-left: 64px;
  position: relative;
  z-index: 3;
`;

const BestProductEmpty = styled.div`
  grid-column: 1 / -1;
  height: 126px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 14px;
  background-color: #f7faf8;
  color: var(--text-sub);

  font-size: 14px;
  font-weight: 600;
`;
