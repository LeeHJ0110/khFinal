import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import PetStoreUserNav from "./PetStoreUserNav";
import RoundedButton from "../../shared/components/button/RoundedButton";
import usePetStoreBestProductList from "../../features/petStore/hooks/usePetStoreBestProductList";

//!! 리뷰 기능 완성되면!!
// // 1. 이 함수 삭제
// function getTempReviewInfo(index) { ... }

// // 2. 이 부분 변경
// {tempReview.rating} ({tempReview.count})

// // 실제 리뷰 데이터로 변경
// {product.reviewRatingAvg?.toFixed(1) ?? "0.0"} ({product.reviewCount ?? 0})

const shortcutList = [
  {
    id: "dog",
    title: "강아지 스토어",
    desc: "사료부터 영양제까지 강아지에게 필요한 모든 것",
    buttonText: "강아지 스토어 바로가기",
    imageText: "강아지 카드 이미지 영역",
    path: "/store/dog",
  },
  {
    id: "cat",
    title: "고양이 스토어",
    desc: "사료부터 영양제까지 고양이에게 필요한 모든 것",
    buttonText: "고양이 스토어 바로가기",
    imageText: "고양이 카드 이미지 영역",
    path: "/store/cat",
  },
];

/*
  임시 리뷰 표시용 데이터.
*/
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
        <HeroBanner>
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

          <HeroImageText>스토어 메인 배너 이미지 영역</HeroImageText>
        </HeroBanner>

        <ContentInner>
          <StoreShortcutGrid>
            {shortcutList.map((shortcut) => (
              <StoreShortcutCard key={shortcut.id}>
                <StoreShortcutText>
                  <StoreShortcutEyebrow>
                    건강한 반려 생활의 시작
                  </StoreShortcutEyebrow>

                  <StoreShortcutTitle>{shortcut.title}</StoreShortcutTitle>
                  <StoreShortcutDesc>{shortcut.desc}</StoreShortcutDesc>

                  <RoundedButton
                    width="154px"
                    height="28px"
                    fontSize="12px"
                    fontWeight="700"
                    gap="12px"
                    rightIcon="→"
                    onClick={() => navigate(shortcut.path)}
                  >
                    {shortcut.buttonText}
                  </RoundedButton>
                </StoreShortcutText>

                <ShortcutPaw>●</ShortcutPaw>

                <ShortcutArrowButton
                  type="button"
                  aria-label={`${shortcut.title} 이동`}
                  onClick={() => navigate(shortcut.path)}
                >
                  ›
                </ShortcutArrowButton>

                <ShortcutImageBox>
                  <VisualPlaceholder>{shortcut.imageText}</VisualPlaceholder>
                </ShortcutImageBox>
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

                      <ProductBottom>
                        <ProductReviewInfo>
                          <ReviewStar>★</ReviewStar>
                          {tempReview.rating} ({tempReview.count})
                        </ProductReviewInfo>
                      </ProductBottom>
                    </ProductInfo>
                  </BestProductCard>
                );
              })
            )}
          </BestProductGrid>

          <HealthBanner>
            <HealthIconCircle>🐾</HealthIconCircle>

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
                width="194px"
                height="43px"
                fontSize="15px"
                fontWeight="800"
                rightIcon=">"
              >
                건강관리 시작하기
              </RoundedButton>
            </HealthButtonWrap>

            <HealthImageBox>
              <VisualPlaceholder>건강관리 배너 이미지 영역</VisualPlaceholder>
            </HealthImageBox>
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
  height: 310px;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;
  background: linear-gradient(90deg, #dff2e9 0%, #eefaf4 48%, #dff2e9 100%);
`;

const HeroTextBox = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
`;

const HeroTitle = styled.h1`
  margin: 0 0 30px;

  color: #232323;
  font-size: 50px;
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -2px;
`;

const HeroDesc = styled.p`
  margin: 0;

  color: #4f5756;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.55;
`;

const HeroImageText = styled.div`
  position: absolute;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  color: rgba(0, 0, 0, 0.28);
  font-size: 18px;
  font-weight: 800;
  pointer-events: none;
`;

const ContentInner = styled.div`
  width: 1300px;
  margin: 0 auto;
  padding: 14px 0 12px;
`;

const StoreShortcutGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 34px;
`;

const StoreShortcutCard = styled.article`
  position: relative;
  overflow: hidden;

  height: 150px;
  padding: 24px 34px;

  display: flex;
  align-items: center;

  border-radius: 16px;
  background-color: #e8f2ed;
`;

const StoreShortcutText = styled.div`
  position: relative;
  z-index: 3;
`;

const StoreShortcutEyebrow = styled.p`
  margin: 0 0 5px;

  color: var(--color-main);
  font-size: 16px;
  font-weight: 900;
  letter-spacing: -0.4px;
`;

const StoreShortcutTitle = styled.h2`
  margin: 0 0 10px;

  color: var(--text-main);
  font-size: 32px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -1.4px;
`;

const StoreShortcutDesc = styled.p`
  margin: 0 0 16px;

  color: var(--text-desc);
  font-size: 13px;
  font-weight: 500;
`;

const ShortcutImageBox = styled.div`
  position: absolute;
  right: 95px;
  bottom: 0;

  width: 190px;
  height: 135px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const ShortcutPaw = styled.div`
  position: absolute;
  right: 230px;
  bottom: 22px;

  color: var(--color-main);
  font-size: 54px;
  line-height: 1;
  opacity: 0.9;
`;

const ShortcutArrowButton = styled.button`
  position: absolute;
  right: 38px;
  top: 50%;
  transform: translateY(-50%);

  width: 58px;
  height: 58px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1.5px solid rgba(30, 42, 40, 0.75);
  border-radius: 50%;
  background-color: transparent;
  color: #222;

  font-size: 58px;
  font-weight: 200;
  line-height: 0.7;
  cursor: pointer;
`;

const SectionTitleArea = styled.section`
  height: 42px;
  padding: 11px 8px 0;

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

const BestProductGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 34px;
`;

const BestProductCard = styled.article`
  position: relative;

  height: 126px;
  padding: 16px 18px;

  display: grid;
  grid-template-columns: 104px minmax(0, 1fr);
  align-items: center;
  gap: 20px;

  border-radius: 16px;
  background-color: var(--color-white);
  box-shadow: 0 3px 14px rgba(18, 45, 46, 0.18);

  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(18, 45, 46, 0.2);
  }
`;

const ProductVisualBox = styled.div`
  position: relative;

  width: 104px;
  height: 96px;

  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const BestBadge = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;

  min-width: 48px;
  height: 20px;
  padding: 0 8px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 5px;
  background-color: var(--color-main);
  color: var(--color-white);

  font-size: 9px;
  font-weight: 900;
  letter-spacing: -0.2px;
`;

const ProductImageBox = styled.div`
  width: 88px;
  height: 88px;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;
  border-radius: 10px;
  background-color: #f1f6f3;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  padding: 4px;
  object-fit: contain;
`;

const ProductImageText = styled.span`
  color: var(--text-desc);
  font-size: 11px;
  font-weight: 700;
`;

const ProductInfo = styled.div`
  min-width: 0;
  height: 92px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ProductName = styled.h3`
  min-height: 34px;
  margin: 0;

  color: var(--text-main);
  font-size: 14px;
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: -0.2px;

  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ProductPrice = styled.p`
  margin: 0;

  color: var(--text-main);
  font-size: 21px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.7px;
`;

const ProductBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ProductReviewInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  color: var(--text-sub);
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
`;

const ReviewStar = styled.span`
  color: #ffc400;
  font-size: 15px;
  line-height: 1;
`;

const HealthBanner = styled.section`
  position: relative;
  overflow: hidden;

  height: 145px;
  margin-top: 14px;
  padding: 0 34px;

  display: flex;
  align-items: center;

  border-radius: 16px;
  background-color: #dff2e7;
`;

const HealthIconCircle = styled.div`
  width: 62px;
  height: 62px;
  margin-right: 28px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  background-color: #075348;
  color: #33d6a0;

  font-size: 28px;
  flex-shrink: 0;
`;

const HealthTextBox = styled.div`
  position: relative;
  z-index: 2;
  flex-shrink: 0;
`;

const HealthTitle = styled.h2`
  margin: 0 0 10px;

  color: var(--color-main);
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -1.1px;

  strong {
    color: var(--text-main);
  }
`;

const HealthDesc = styled.p`
  margin: 0;

  color: var(--text-sub);
  font-size: 13px;
  font-weight: 700;
`;

const HealthButtonWrap = styled.div`
  margin-left: 58px;
  position: relative;
  z-index: 3;
`;

const HealthImageBox = styled.div`
  position: absolute;
  right: 36px;
  bottom: 0;

  width: 300px;
  height: 130px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const VisualPlaceholder = styled.div`
  width: 100%;
  height: 86%;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.45);
  color: var(--text-desc);

  font-size: 12px;
  font-weight: 700;
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
  font-weight: 800;
`;
