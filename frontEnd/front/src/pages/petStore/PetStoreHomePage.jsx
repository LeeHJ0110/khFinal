import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import RoundedButton from "../../shared/components/button/RoundedButton";
import usePetStoreBestProductList from "../../features/petStore/hooks/usePetStoreBestProductList";

import petStoreHomeBanner from "../../assets/images/petStore/스토어메인배너.png";
import dogStoreCard from "../../assets/images/petStore/강아지스토어카드.png";
import catStoreCard from "../../assets/images/petStore/고양이스토어카드.png";
import storeHealthCareCard from "../../assets/images/petStore/스토어건강관리카드.png";
import PetStoreNavGate from "./PetStoreNavGate";

const shortcutList = [
  {
    id: "dog",
    number: "01",
    label: "DOG COLLECTION",
    title: "강아지 스토어",
    desc: "사료부터 영양제까지 강아지에게 필요한 모든 것",
    buttonText: "강아지 스토어 바로가기",
    path: "/store/dog",
    image: dogStoreCard,
  },
  {
    id: "cat",
    number: "02",
    label: "CAT COLLECTION",
    title: "고양이 스토어",
    desc: "사료부터 영양제까지 고양이에게 필요한 모든 것",
    buttonText: "고양이 스토어 바로가기",
    path: "/store/cat",
    image: catStoreCard,
  },
];

function formatReviewRating(value) {
  const rating = Number(value ?? 0);

  if (Number.isNaN(rating) || rating <= 0) {
    return "0.0";
  }

  return rating.toFixed(1);
}

function formatReviewCount(value) {
  const count = Number(value ?? 0);

  if (Number.isNaN(count) || count <= 0) {
    return 0;
  }

  return count;
}

export default function PetStoreHomePage() {
  const navigate = useNavigate();
  const { bestProductList, isBestLoading } = usePetStoreBestProductList();

  return (
    <>
      <PetStoreNavGate />

      <Wrapper>
        <StoreAura />
        <FloatingPaw $top="120px" $left="7%" $delay="0s">
          🐾
        </FloatingPaw>
        <FloatingPaw $top="240px" $left="86%" $delay="1.2s">
          ✦
        </FloatingPaw>
        <FloatingPaw $top="500px" $left="4%" $delay="2.1s">
          ✧
        </FloatingPaw>

        <HeroBanner $bannerImage={petStoreHomeBanner}>
          <HeroGradient />
          <HeroShine />
          <HeroScanLine />
          <HeroDecorCircle />
          <HeroSparkle $top="56px" $left="58%" $delay="0s" />
          <HeroSparkle $top="118px" $left="48%" $delay="1s" />
          <HeroSparkle $top="244px" $left="67%" $delay="1.7s" />

          <HeroTextBox>
            <HeroBadge>PET&I FOR STORE</HeroBadge>

            <HeroTitle>
              PET CARE
              <br />
              PREMIUM STORE
            </HeroTitle>

            <HeroDesc>
              우리 아이를 위한 건강한 쇼핑,
              <br />
              사료부터 케어용품까지 한 번에 만나보세요.
            </HeroDesc>
          </HeroTextBox>
        </HeroBanner>

        <ContentInner>
          <StoreShortcutGrid>
            {shortcutList.map((shortcut, index) => (
              <StoreShortcutCard
                key={shortcut.id}
                $delay={`${index * 0.12}s`}
                onClick={() => navigate(shortcut.path)}
              >
                <CardLight />

                <ShortcutInfoArea>
                  <ShortcutTopLine>
                    <ShortcutLabel>{shortcut.label}</ShortcutLabel>
                  </ShortcutTopLine>

                  <ShortcutTitle>{shortcut.title}</ShortcutTitle>
                  <ShortcutDesc>{shortcut.desc}</ShortcutDesc>

                  <ShortcutButton
                    type="button"
                    onClick={(evt) => {
                      evt.stopPropagation();
                      navigate(shortcut.path);
                    }}
                  >
                    {shortcut.buttonText}
                    <span>→</span>
                  </ShortcutButton>
                </ShortcutInfoArea>

                <ShortcutImageArea
                  $cardImage={shortcut.image}
                  $type={shortcut.id}
                >
                  <ShortcutImageGlow />
                </ShortcutImageArea>

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

          <BestSection>
            <SectionTitleArea>
              <SectionTitleBox>
                <SectionLabel>BEST SELLER</SectionLabel>
                <SectionTitle>베스트 상품</SectionTitle>
              </SectionTitleBox>

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
                  const averageRating = formatReviewRating(
                    product.averageRating,
                  );
                  const reviewCount = formatReviewCount(product.reviewCount);

                  return (
                    <BestProductCard
                      key={product.productId}
                      $delay={`${index * 0.1}s`}
                      onClick={() =>
                        navigate(`/store/product/${product.productId}`)
                      }
                    >
                      <BestBadge>BEST {index + 1}</BestBadge>
                      <ProductCardShine />

                      <ProductImageArea>
                        {product.mainImageUrl ? (
                          <ProductImage
                            src={product.mainImageUrl}
                            alt={product.productName}
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <ProductImageText>상품 이미지</ProductImageText>
                        )}
                      </ProductImageArea>

                      <ProductInfo>
                        <ProductName>{product.productName}</ProductName>

                        <ProductMetaRow>
                          <ProductPrice>
                            {product.productPrice?.toLocaleString()}원
                          </ProductPrice>

                          <ProductReviewInfo>
                            <ReviewStar>★</ReviewStar>
                            <span>
                              {averageRating} ({reviewCount})
                            </span>
                          </ProductReviewInfo>
                        </ProductMetaRow>
                      </ProductInfo>
                    </BestProductCard>
                  );
                })
              )}
            </BestProductGrid>
          </BestSection>

          <HealthBanner
            $cardImage={storeHealthCareCard}
            onClick={() => navigate("/healthcare/requesthome")}
          >
            <HealthLight />
            <HealthTextBox>
              <HealthLabel>HEALTH CARE</HealthLabel>

              <HealthTitle>
                우리 아이 건강관리,
                <strong> 지금 시작해보세요!</strong>
              </HealthTitle>

              <HealthDesc>
                간편한 건강진단부터 맞춤관리까지 한 번에 이어집니다.
              </HealthDesc>
            </HealthTextBox>

            <HealthButtonWrap>
              <RoundedButton
                width="178px"
                height="38px"
                fontSize="13px"
                fontWeight="800"
                rightIcon=">"
                onClick={(evt) => {
                  evt.stopPropagation();
                  navigate("/healthcare/requesthome");
                }}
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

const pageEnter = keyframes`
  0% {
    opacity: 0;
    transform: translateY(22px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const heroZoom = keyframes`
  0% {
    transform: scale(1.055);
  }

  100% {
    transform: scale(1.018);
  }
`;

const textReveal = keyframes`
  0% {
    opacity: 0;
    transform: translateY(18px);
    filter: blur(8px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
`;

const shineMove = keyframes`
  0% {
    transform: translateX(-45%) skewX(-18deg);
    opacity: 0;
  }

  20% {
    opacity: 0.36;
  }

  54% {
    opacity: 0.18;
  }

  100% {
    transform: translateX(135%) skewX(-18deg);
    opacity: 0;
  }
`;

const softFloat = keyframes`
  0% {
    transform: translate3d(0, 0, 0);
  }

  50% {
    transform: translate3d(0, -10px, 0);
  }

  100% {
    transform: translate3d(0, 0, 0);
  }
`;

const sparkleBlink = keyframes`
  0%, 100% {
    opacity: 0.22;
    transform: scale(0.74) rotate(0deg);
  }

  50% {
    opacity: 0.95;
    transform: scale(1.16) rotate(45deg);
  }
`;

const pawDrift = keyframes`
  0%, 100% {
    transform: translate3d(0, 0, 0) rotate(-6deg);
    opacity: 0.26;
  }

  50% {
    transform: translate3d(12px, -18px, 0) rotate(8deg);
    opacity: 0.48;
  }
`;

const scanLine = keyframes`
  0% {
    transform: translateY(-120%);
    opacity: 0;
  }

  18% {
    opacity: 0.16;
  }

  100% {
    transform: translateY(120%);
    opacity: 0;
  }
`;

const Wrapper = styled.main`
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;

  background:
    radial-gradient(
      circle at 4% 22%,
      rgba(94, 200, 167, 0.12),
      transparent 28%
    ),
    radial-gradient(
      circle at 94% 58%,
      rgba(0, 169, 123, 0.08),
      transparent 30%
    ),
    linear-gradient(180deg, #ffffff 0%, #fbfffd 48%, #f3faf6 100%);
`;

const StoreAura = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;

  background:
    linear-gradient(
      120deg,
      rgba(0, 169, 123, 0.045),
      transparent,
      rgba(94, 200, 167, 0.06)
    ),
    radial-gradient(
      circle at 72% 16%,
      rgba(255, 255, 255, 0.68),
      transparent 26%
    );
`;

const FloatingPaw = styled.span`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  z-index: 1;

  color: rgba(0, 128, 96, 0.24);
  font-size: 28px;
  font-weight: 900;

  pointer-events: none;
  animation: ${pawDrift} 5.4s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay};
`;

const HeroBanner = styled.section`
  position: relative;
  z-index: 2;
  width: 100%;
  height: 390px;
  overflow: hidden;

  display: flex;
  align-items: center;

  background-color: #ecfdf6;
  background-image: url(${({ $bannerImage }) => $bannerImage});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;

  isolation: isolate;

  &::before {
    content: "";
    position: absolute;
    inset: -12px;
    z-index: -1;

    background-image: url(${({ $bannerImage }) => $bannerImage});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;

    transform: scale(1.018);
    filter: saturate(1.08) contrast(1.03);
    animation: ${heroZoom} 1.2s ease both;

    transition:
      transform 0.9s ease,
      filter 0.9s ease;
  }

  &:hover::before {
    transform: scale(1.045);
    filter: saturate(1.18) contrast(1.05);
  }

  @media (max-width: 1024px) {
    height: 340px;
  }
`;

const HeroGradient = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;

  background:
    linear-gradient(
      90deg,
      rgba(236, 253, 246, 0.88) 0%,
      rgba(236, 253, 246, 0.66) 27%,
      rgba(236, 253, 246, 0.12) 57%,
      rgba(18, 45, 46, 0.12) 100%
    ),
    radial-gradient(
      circle at 21% 48%,
      rgba(255, 255, 255, 0.76),
      transparent 26%
    ),
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.08) 0%,
      rgba(255, 255, 255, 0) 64%,
      rgba(18, 45, 46, 0.08) 100%
    );

  pointer-events: none;
`;

const HeroShine = styled.div`
  position: absolute;
  top: -20%;
  left: 0;
  z-index: 2;

  width: 26%;
  height: 150%;

  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.38) 45%,
    transparent 100%
  );

  animation: ${shineMove} 5.6s ease-in-out infinite;
  pointer-events: none;
`;

const HeroScanLine = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;

  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(255, 255, 255, 0.22) 49%,
    transparent 100%
  );

  animation: ${scanLine} 4.8s ease-in-out infinite;
  pointer-events: none;
`;

const HeroDecorCircle = styled.div`
  position: absolute;
  left: 42%;
  bottom: 34px;
  z-index: 2;

  width: 68px;
  height: 68px;

  border-radius: 50%;
  border: 1px solid rgba(0, 169, 123, 0.2);
  background:
    radial-gradient(
      circle at 35% 30%,
      rgba(255, 255, 255, 0.9),
      transparent 34%
    ),
    rgba(94, 200, 167, 0.18);

  box-shadow:
    0 18px 36px rgba(18, 45, 46, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);

  animation: ${softFloat} 3.8s ease-in-out infinite;
  pointer-events: none;

  @media (max-width: 980px) {
    display: none;
  }
`;

const HeroSparkle = styled.span`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  z-index: 3;

  width: 12px;
  height: 12px;

  border-radius: 2px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow:
    0 0 16px rgba(255, 255, 255, 0.9),
    0 0 28px rgba(0, 169, 123, 0.24);

  transform: rotate(45deg);
  animation: ${sparkleBlink} 2.8s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay};
  pointer-events: none;
`;

const HeroTextBox = styled.div`
  position: relative;
  z-index: 3;

  width: 1280px;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 1340px) {
    width: calc(100% - 72px);
  }

  @media (max-width: 768px) {
    width: calc(100% - 32px);
  }
`;

const HeroBadge = styled.p`
  width: fit-content;
  margin: 0 0 13px;
  padding: 6px 12px;

  border: 1px solid rgba(18, 45, 46, 0.16);
  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.44);
  color: #007f62;

  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.9px;

  box-shadow:
    0 8px 22px rgba(18, 45, 46, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);

  backdrop-filter: blur(8px);
  animation: ${textReveal} 0.72s 0.05s ease both;
`;

const HeroTitle = styled.h1`
  margin: 0;

  color: #122d2e;
  font-size: 58px;
  font-weight: 950;
  line-height: 0.92;
  letter-spacing: -3px;

  text-shadow:
    0 2px 0 rgba(255, 255, 255, 0.78),
    0 12px 26px rgba(255, 255, 255, 0.9),
    0 18px 44px rgba(18, 45, 46, 0.1);

  animation: ${textReveal} 0.78s 0.15s ease both;

  @media (max-width: 768px) {
    font-size: 42px;
    letter-spacing: -2px;
  }
`;

const HeroDesc = styled.p`
  margin: 18px 0 0;

  color: #33413e;
  font-size: 17px;
  font-weight: 750;
  line-height: 1.55;
  letter-spacing: -0.5px;

  text-shadow:
    0 1px 0 rgba(255, 255, 255, 0.82),
    0 10px 22px rgba(255, 255, 255, 0.78);

  animation: ${textReveal} 0.78s 0.28s ease both;
`;

const ContentInner = styled.div`
  position: relative;
  z-index: 2;

  width: 1280px;
  margin: 0 auto;
  padding: 34px 0 56px;

  @media (max-width: 1340px) {
    width: calc(100% - 72px);
  }

  @media (max-width: 768px) {
    width: calc(100% - 32px);
    padding-top: 28px;
  }
`;

const StoreShortcutGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;

  @media (max-width: 940px) {
    grid-template-columns: 1fr;
  }
`;

const StoreShortcutCard = styled.article`
  position: relative;
  overflow: hidden;

  height: 188px;

  display: grid;
  grid-template-columns: 48% 52%;

  border: 1px solid rgba(18, 45, 46, 0.08);
  border-radius: 28px;
  background:
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.96) 0%,
      rgba(236, 253, 246, 0.96) 100%
    ),
    radial-gradient(circle at 80% 20%, rgba(0, 169, 123, 0.14), transparent 32%);

  cursor: pointer;
  box-shadow:
    0 16px 38px rgba(18, 45, 46, 0.09),
    inset 0 1px 0 rgba(255, 255, 255, 0.96);

  backdrop-filter: blur(10px);

  animation: ${pageEnter} 0.68s ease both;
  animation-delay: ${({ $delay }) => $delay};

  transition:
    transform 0.24s ease,
    box-shadow 0.24s ease,
    border-color 0.24s ease,
    filter 0.24s ease;

  &::after {
    content: "";
    position: absolute;
    left: 42%;
    top: -20%;

    width: 170px;
    height: 150%;

    background: rgba(94, 200, 167, 0.16);
    transform: rotate(12deg);
    pointer-events: none;
    transition: transform 0.24s ease;
  }

  &:hover {
    transform: translateY(-7px) scale(1.01);
    border-color: rgba(0, 169, 123, 0.24);
    filter: saturate(1.03);
    box-shadow:
      0 28px 64px rgba(18, 45, 46, 0.16),
      inset 0 1px 0 rgba(255, 255, 255, 0.98);
  }

  &:hover::after {
    transform: rotate(12deg) translateX(20px);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    height: 260px;
  }
`;

const CardLight = styled.div`
  position: absolute;
  inset: 0;
  z-index: 4;

  background: linear-gradient(
    120deg,
    transparent 0%,
    transparent 28%,
    rgba(255, 255, 255, 0.34) 48%,
    transparent 68%,
    transparent 100%
  );

  transform: translateX(-120%);
  pointer-events: none;

  ${StoreShortcutCard}:hover & {
    transform: translateX(120%);
    transition: transform 0.72s ease;
  }
`;

const ShortcutInfoArea = styled.div`
  position: relative;
  z-index: 3;

  padding: 27px 30px 26px;

  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ShortcutTopLine = styled.div`
  margin-bottom: 11px;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ShortcutLabel = styled.span`
  color: #00a97b;
  font-size: 11px;
  font-weight: 950;
  letter-spacing: 0.8px;
`;

const ShortcutTitle = styled.h2`
  margin: 0 0 10px;

  color: #122d2e;
  font-size: 31px;
  font-weight: 950;
  line-height: 1;
  letter-spacing: -1.4px;
`;

const ShortcutDesc = styled.p`
  margin: 0 0 18px;

  color: #5a6663;
  font-size: 13px;
  font-weight: 650;
  line-height: 1.42;
  letter-spacing: -0.3px;
`;

const ShortcutButton = styled.button`
  width: fit-content;
  height: 32px;
  padding: 0 15px;

  display: inline-flex;
  align-items: center;
  gap: 8px;

  border: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, #00a97b 0%, #008060 100%);
  color: #ffffff;

  font-size: 12px;
  font-weight: 700;
  letter-spacing: -0.25px;

  cursor: pointer;
  box-shadow: 0 10px 22px rgba(0, 169, 123, 0.22);

  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    filter 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    filter: saturate(1.1);
    box-shadow: 0 14px 28px rgba(0, 169, 123, 0.3);
  }

  span {
    transition: transform 0.18s ease;
  }

  &:hover span {
    transform: translateX(3px);
  }
`;

const ShortcutImageArea = styled.div`
  position: relative;
  z-index: 2;

  min-width: 0;

  background-image: url(${({ $cardImage }) => $cardImage});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: ${({ $type }) =>
    $type === "dog" ? "72% center" : "68% center"};

  transition:
    transform 0.28s ease,
    filter 0.28s ease;

  ${StoreShortcutCard}:hover & {
    transform: scale(1.045);
    filter: saturate(1.08) contrast(1.03);
  }

  @media (max-width: 640px) {
    min-height: 130px;
  }
`;

const ShortcutImageGlow = styled.div`
  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      90deg,
      rgba(236, 253, 246, 0.72) 0%,
      rgba(236, 253, 246, 0.15) 34%,
      rgba(236, 253, 246, 0) 100%
    ),
    radial-gradient(
      circle at 74% 44%,
      rgba(255, 255, 255, 0.12),
      transparent 38%
    );

  pointer-events: none;
`;

const ShortcutArrowButton = styled.button`
  position: absolute;
  right: 22px;
  bottom: 20px;
  z-index: 5;

  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(18, 45, 46, 0.16);
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.72);
  color: #122d2e;

  font-size: 42px;
  font-weight: 200;
  line-height: 0.6;

  cursor: pointer;
  box-shadow: 0 12px 26px rgba(18, 45, 46, 0.1);
  backdrop-filter: blur(8px);

  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease,
    background-color 0.18s ease;

  &:hover {
    transform: scale(1.08) rotate(6deg);
    border-color: #00a97b;
    color: #00a97b;
    background-color: #ffffff;
  }
`;

const BestSection = styled.section`
  margin-top: 42px;
  animation: ${pageEnter} 0.7s 0.18s ease both;
`;

const SectionTitleArea = styled.div`
  margin-bottom: 18px;
  padding: 0 4px;

  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;

  @media (max-width: 768px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }
`;

const SectionTitleBox = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 13px;
`;

const SectionLabel = styled.span`
  margin-bottom: 3px;

  color: #00a97b;
  font-size: 11px;
  font-weight: 950;
  letter-spacing: 0.8px;
`;

const SectionTitle = styled.h2`
  margin: 0;

  color: #122d2e;
  font-size: 29px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -1.25px;
`;

const SectionSubTitle = styled.p`
  margin: 0 0 2px;

  color: #697471;
  font-size: 13px;
  font-weight: 650;
  letter-spacing: -0.3px;
`;

const BestProductGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 22px;

  @media (max-width: 1160px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

const BestProductCard = styled.article`
  position: relative;
  overflow: hidden;

  height: 252px;
  padding: 16px;

  display: grid;
  grid-template-rows: 122px 1fr;

  border: 1px solid rgba(18, 45, 46, 0.07);
  border-radius: 24px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(251, 255, 253, 0.98) 100%
  );

  box-shadow:
    0 14px 34px rgba(18, 45, 46, 0.085),
    inset 0 1px 0 rgba(255, 255, 255, 0.96);

  cursor: pointer;
  animation: ${pageEnter} 0.62s ease both;
  animation-delay: ${({ $delay }) => $delay};

  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    border-color 0.22s ease,
    filter 0.22s ease;

  &::before {
    content: "";
    position: absolute;
    right: -42px;
    top: -40px;

    width: 116px;
    height: 116px;

    border-radius: 50%;
    background: rgba(94, 200, 167, 0.18);
    pointer-events: none;
    transition: transform 0.22s ease;
  }

  &:hover {
    transform: translateY(-7px) scale(1.012);
    border-color: rgba(0, 169, 123, 0.24);
    filter: saturate(1.02);
    box-shadow:
      0 28px 62px rgba(18, 45, 46, 0.16),
      inset 0 1px 0 rgba(255, 255, 255, 0.98);
  }

  &:hover::before {
    transform: scale(1.22);
  }
`;

const ProductCardShine = styled.div`
  position: absolute;
  inset: 0;
  z-index: 5;

  background: linear-gradient(
    120deg,
    transparent 0%,
    transparent 32%,
    rgba(255, 255, 255, 0.48) 48%,
    transparent 64%,
    transparent 100%
  );

  transform: translateX(-120%);
  pointer-events: none;

  ${BestProductCard}:hover & {
    transform: translateX(120%);
    transition: transform 0.7s ease;
  }
`;

const BestBadge = styled.div`
  position: absolute;
  left: 14px;
  top: 14px;
  z-index: 6;

  height: 25px;
  padding: 0 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 999px;
  background: linear-gradient(135deg, #122d2e 0%, #00a97b 100%);
  color: #ffffff;

  font-size: 10px;
  font-weight: 700;
  letter-spacing: -0.2px;

  box-shadow: 0 8px 18px rgba(0, 169, 123, 0.2);
`;

const ProductImageArea = styled.div`
  position: relative;
  z-index: 2;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 20px;
  background:
    radial-gradient(
      circle at 50% 52%,
      rgba(217, 237, 223, 0.9),
      transparent 62%
    ),
    linear-gradient(
      180deg,
      rgba(236, 253, 246, 0.92) 0%,
      rgba(255, 255, 255, 0.82) 100%
    );

  transition:
    background-color 0.2s ease,
    transform 0.2s ease;

  ${BestProductCard}:hover & {
    transform: translateY(-2px);
  }
`;

const ProductImage = styled.img`
  width: 98px;
  height: 98px;

  object-fit: contain;

  filter: drop-shadow(0 12px 18px rgba(18, 45, 46, 0.12));
  transition:
    transform 0.22s ease,
    filter 0.22s ease;

  ${BestProductCard}:hover & {
    transform: scale(1.085) rotate(-1.5deg);
    filter: drop-shadow(0 18px 22px rgba(18, 45, 46, 0.18));
  }
`;

const ProductImageText = styled.span`
  color: #888888;
  font-size: 12px;
  font-weight: 600;
`;

const ProductInfo = styled.div`
  position: relative;
  z-index: 2;

  min-width: 0;
  padding-top: 13px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ProductName = styled.h3`
  height: 40px;
  margin: 0;

  color: #192422;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.38;
  letter-spacing: -0.34px;

  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ProductMetaRow = styled.div`
  min-width: 0;

  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 5px;
`;

const ProductPrice = styled.p`
  margin: 0;

  color: #111817;
  font-size: 24px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.85px;
  white-space: nowrap;
`;

const ProductReviewInfo = styled.div`
  flex: 0 0 auto;
  margin-bottom: 2px;

  display: flex;
  align-items: center;
  gap: 4px;

  color: #596561;
  font-size: 12px;
  font-weight: 750;
  line-height: 1;
  white-space: nowrap;
`;

const ReviewStar = styled.span`
  color: #ffc400;
  font-size: 15px;
  line-height: 1;
`;

const HealthBanner = styled.section`
  position: relative;
  overflow: hidden;

  height: 132px;
  margin-top: 36px;
  padding: 0 32px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;

  border: 1px solid rgba(18, 45, 46, 0.06);
  border-radius: 24px;

  background-color: #d9eddf;
  background-image:
    linear-gradient(
      90deg,
      rgba(217, 237, 223, 0.96) 0%,
      rgba(217, 237, 223, 0.88) 39%,
      rgba(217, 237, 223, 0.18) 74%
    ),
    url(${({ $cardImage }) => $cardImage});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;

  cursor: pointer;
  box-shadow:
    0 14px 34px rgba(18, 45, 46, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.78);

  animation: ${pageEnter} 0.7s 0.28s ease both;

  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    filter 0.22s ease,
    border-color 0.22s ease;

  &::after {
    content: "";
    position: absolute;
    right: 24%;
    top: 18px;

    width: 36px;
    height: 36px;

    border-radius: 50%;
    background-color: rgba(0, 169, 123, 0.12);
    box-shadow:
      42px 38px 0 rgba(94, 200, 167, 0.13),
      -32px 44px 0 rgba(255, 255, 255, 0.36);

    pointer-events: none;
    animation: ${softFloat} 4.2s ease-in-out infinite;
  }

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(0, 169, 123, 0.22);
    filter: saturate(1.04);
    box-shadow:
      0 24px 54px rgba(18, 45, 46, 0.14),
      inset 0 1px 0 rgba(255, 255, 255, 0.82);
  }

  @media (max-width: 860px) {
    height: auto;
    min-height: 150px;
    align-items: flex-start;
    flex-direction: column;
    padding: 26px;
  }
`;

const HealthLight = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;

  background: linear-gradient(
    120deg,
    transparent 0%,
    transparent 32%,
    rgba(255, 255, 255, 0.42) 50%,
    transparent 68%,
    transparent 100%
  );

  transform: translateX(-120%);
  pointer-events: none;

  ${HealthBanner}:hover & {
    transform: translateX(120%);
    transition: transform 0.78s ease;
  }
`;

const HealthTextBox = styled.div`
  position: relative;
  z-index: 2;
`;

const HealthLabel = styled.p`
  width: fit-content;
  margin: 0 0 8px;
  padding: 5px 10px;

  border-radius: 999px;
  background-color: rgba(18, 45, 46, 0.84);
  color: #ecfdf6;

  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.7px;
`;

const HealthTitle = styled.h2`
  margin: 0 0 7px;

  color: #00a97b;
  font-size: 25px;
  font-weight: 950;
  line-height: 1.1;
  letter-spacing: -1px;

  strong {
    color: #122d2e;
    font-weight: 950;
  }
`;

const HealthDesc = styled.p`
  margin: 0;

  color: #47534f;
  font-size: 13px;
  font-weight: 650;
  letter-spacing: -0.28px;
`;

const HealthButtonWrap = styled.div`
  position: relative;
  z-index: 2;
  flex: 0 0 auto;

  margin-right: 300px;

  @media (max-width: 1120px) {
    margin-right: 0;
  }
`;

const BestProductEmpty = styled.div`
  grid-column: 1 / -1;
  height: 160px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(18, 45, 46, 0.07);
  border-radius: 22px;
  background-color: #ffffff;
  color: #555555;

  font-size: 14px;
  font-weight: 700;
`;
