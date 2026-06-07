import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css, keyframes } from "styled-components";

import petModelImg from "../../assets/images/homePage/homemodelpets.png";
import reviewVideo from "../../assets/images/homePage/후기영상.mp4";

import card1 from "../../assets/images/homePage/1번카드.png";
import card2 from "../../assets/images/homePage/2번카드.png";
import card3 from "../../assets/images/homePage/3번카드.png";
import card4 from "../../assets/images/homePage/4번카드.png";

import healthcareIntroduction from "../../assets/images/homePage/홈용건강관리.png";
import storeIntroduction from "../../assets/images/homePage/홈용스토어.png";
import insuIntroduction from "../../assets/images/homePage/홈용펫보험.png";
import commuIntroduction from "../../assets/images/homePage/홈용커뮤니티.png";
import careIntroduction from "../../assets/images/homePage/홈용맞춤관리.png";

const HOME_IMAGES = {
  petModel: petModelImg,

  screenHealth: healthcareIntroduction,
  screenStore: storeIntroduction,
  screenInsurance: insuIntroduction,
  screenCommunity: commuIntroduction,
  screenCustom: careIntroduction,

  cardHealth: card1,
  cardCommunity: card2,
  cardStore: card3,
  cardCare: card4,

  ctaPets: petModelImg,
};

const serviceCards = [
  {
    title: "간편하고 정확한 건강 체크",
    desc: "우리 아이의 상태를 빠르게 확인하세요",
    image: HOME_IMAGES.cardHealth,
    icon: "🐾",
  },
  {
    title: "함께하는 정보 공유",
    desc: "경험과 노하우를 나누세요",
    image: HOME_IMAGES.cardCommunity,
    icon: "💚",
  },
  {
    title: "딱 맞는 제품 추천",
    desc: "건강 데이터 기반 맞춤 쇼핑",
    image: HOME_IMAGES.cardStore,
    icon: "🛍️",
  },
  {
    title: "놓치지 않는 건강 관리",
    desc: "일정관리, 알림, 기록까지 자동 관리",
    image: HOME_IMAGES.cardCare,
    icon: "🔔",
  },
];

const featureTabs = [
  {
    key: "health",
    label: "건강관리",
    icon: "＋",
    screen: HOME_IMAGES.screenHealth,
  },
  {
    key: "store",
    label: "스토어",
    icon: "▣",
    screen: HOME_IMAGES.screenStore,
  },
  {
    key: "insurance",
    label: "펫보험",
    icon: "♡",
    screen: HOME_IMAGES.screenInsurance,
  },
  {
    key: "community",
    label: "커뮤니티",
    icon: "♣",
    screen: HOME_IMAGES.screenCommunity,
  },
  {
    key: "custom",
    label: "맞춤형관리",
    icon: "♧",
    screen: HOME_IMAGES.screenCustom,
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(featureTabs[0]);

  useEffect(() => {
    featureTabs.forEach((tab) => {
      const image = new Image();
      image.src = tab.screen;
    });
  }, []);

  function handleClickFeature(tab) {
    setActiveFeature(tab);
  }

  function handleMoveHealthCare() {
    navigate("/healthcare");
  }

  function handleMoveCommunity() {
    navigate("/community");
  }

  return (
    <Wrapper>
      <HeroSection>
        <HeroBackdropBlob className="left" />
        <HeroBackdropBlob className="right" />
        <HeroDecorDot className="dot-one" />
        <HeroDecorDot className="dot-two" />
        <HeroDecorDot className="dot-three" />

        <HeroInner>
          <HeroTextBox>
            <HeroBadge>반려동물 통합 건강관리 플랫폼</HeroBadge>

            <HeroLogoText>
              PET & I
              <br />
              for
            </HeroLogoText>

            <HeroDesc>
              우리 아이 건강, 이제 고민하지 마세요
              <br />
              진단부터 맞춤 관리까지 한 번에 해결합니다
            </HeroDesc>

            <HeroButtonGroup>
              <HeroPrimaryButton type="button" onClick={handleMoveHealthCare}>
                건강관리 시작하기
              </HeroPrimaryButton>

              <HeroSecondaryButton type="button" onClick={handleMoveCommunity}>
                커뮤니티 둘러보기
              </HeroSecondaryButton>
            </HeroButtonGroup>
          </HeroTextBox>

          <HeroVisualBox>
            <HeroVisualGlow />
            <HeroVisualPanel />

            <HeroPetModelBox>
              <SafeImage
                src={HOME_IMAGES.petModel}
                alt="강아지와 고양이 모델"
              />
            </HeroPetModelBox>

            <HeroStatChip className="score">
              <span>건강 점수</span>
              <strong>84</strong>
            </HeroStatChip>

            <HeroStatChip className="care">
              <span>오늘의 훈련일기</span>
              <strong>완료</strong>
            </HeroStatChip>
          </HeroVisualBox>
        </HeroInner>
      </HeroSection>

      <IntroSection>
        <IntroTitle>
          <QuoteMark>“</QuoteMark>
          소중한 반려동물,
          <QuoteMark>”</QuoteMark>
          <br />
          건강한 삶을 위한 단 하나의 선택
        </IntroTitle>

        <IntroDesc>
          반려동물과 보호자의 일상을 더 건강하게
          <br />
          데이터 기반으로 정확하게 관리합니다
        </IntroDesc>

        <CardGrid>
          {serviceCards.map((card, index) => (
            <ServiceCard key={card.title} $index={index}>
              <CardImageWrap>
                {card.image ? (
                  <SafeImage src={card.image} alt={card.title} />
                ) : (
                  <CardImageFallback>
                    <CardFallbackIcon>
                      {index === 0
                        ? "✚"
                        : index === 1
                          ? "♣"
                          : index === 2
                            ? "▣"
                            : "⌁"}
                    </CardFallbackIcon>
                    <strong>{card.title}</strong>
                    <span>{card.desc}</span>
                  </CardImageFallback>
                )}
              </CardImageWrap>

              <CardDim />

              <CardOverlay>
                <CardTitleRow>
                  <CardTempIcon>{card.icon}</CardTempIcon>
                  <CardTitle>{card.title}</CardTitle>
                </CardTitleRow>

                <CardDesc>{card.desc}</CardDesc>
              </CardOverlay>
            </ServiceCard>
          ))}
        </CardGrid>
      </IntroSection>

      <FeatureSection>
        <SectionInner>
          <FeatureTitle>
            반려동물 건강관리,
            <br />
            이제 한 곳에서 끝내세요
          </FeatureTitle>

          <FeatureTabList>
            {featureTabs.map((tab) => (
              <FeatureTabButton
                key={tab.key}
                type="button"
                $active={activeFeature.key === tab.key}
                onClick={() => handleClickFeature(tab)}
              >
                <FeatureIcon>{tab.icon}</FeatureIcon>
                <FeatureLabel>{tab.label}</FeatureLabel>
              </FeatureTabButton>
            ))}
          </FeatureTabList>

          <MonitorArea>
            <MonitorFrame>
              <MonitorTopBar>
                <MonitorCamera />
              </MonitorTopBar>

              <MonitorScreen>
                {featureTabs.map((tab) => (
                  <MonitorScreenImage
                    key={tab.key}
                    src={tab.screen}
                    alt={`${tab.label} 화면`}
                    $active={activeFeature.key === tab.key}
                  />
                ))}
              </MonitorScreen>

              <MonitorBottomBar />
            </MonitorFrame>

            <MonitorNeck />
            <MonitorStand />
          </MonitorArea>

          <FeatureDesc>
            반려동물 맞춤형 건강관리를 제공합니다.
            <br />
            정확성을 가진 정보를 확인하세요.
          </FeatureDesc>
        </SectionInner>
      </FeatureSection>

      <ReviewSection>
        <ReviewInner>
          <ReviewMediaArea>
            <ReviewVideo
              src={reviewVideo}
              autoPlay
              muted
              loop
              playsInline
              controls={false}
            />
          </ReviewMediaArea>

          <ReviewTextBox>
            <ReviewMainTitle>
              반려인들을 만족시킨
              <br />
              우리아이 맞춤형 <PointText>진짜 서비스</PointText>
            </ReviewMainTitle>

            <ReviewSubText>
              이미 검증된 서비스입니다.
              <br />
              수많은 반려인들이 직접 경험하고 만족했습니다.
            </ReviewSubText>

            <ReviewSubText>
              정확한 건강진단과 맞춤 관리
              <br />그 변화를 지금 확인해보세요.
            </ReviewSubText>
          </ReviewTextBox>
        </ReviewInner>
      </ReviewSection>

      <CtaSection>
        <CtaInner>
          <CtaIcon>●</CtaIcon>

          <CtaTextBox>
            <CtaTitle>우리 아이 건강관리, 지금 시작해보세요!</CtaTitle>
            <CtaDesc>
              간편한 건강진단부터 맞춤관리까지, PET&I FOR와 함께라면 더
              쉬워집니다.
            </CtaDesc>
          </CtaTextBox>

          <CtaButton type="button" onClick={handleMoveHealthCare}>
            건강관리 시작하기 &gt;
          </CtaButton>

          <CtaPetsBox>
            <SafeImage src={HOME_IMAGES.ctaPets} alt="강아지와 고양이" />
          </CtaPetsBox>
        </CtaInner>
      </CtaSection>
    </Wrapper>
  );
}

function SafeImage({ src, alt }) {
  if (!src) {
    return null;
  }

  return (
    <StyledImage
      src={src}
      alt={alt}
      onError={(evt) => {
        evt.currentTarget.style.display = "none";
      }}
    />
  );
}

/* ================================
   Animation
================================ */

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(36px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(-42px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(42px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
`;
const screenSlide = keyframes`
  0% {
    opacity: 0;
    transform: translateX(72px) scale(1.12);
  }

  60% {
    opacity: 1;
    transform: translateX(-6px) scale(1.12);
  }

  100% {
    opacity: 1;
    transform: translateX(0) scale(1.12);
  }
`;

const floatY = keyframes`
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }

  100% {
    transform: translateY(0);
  }
`;

const cardFloat = keyframes`
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }

  100% {
    transform: translateY(0);
  }
`;

const floatYSlow = keyframes`
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-16px);
  }

  100% {
    transform: translateY(0);
  }
`;

const glowPulse = keyframes`
  0% {
    opacity: 0.72;
    transform: translate(-50%, -50%) scale(0.96);
  }

  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.04);
  }

  100% {
    opacity: 0.72;
    transform: translate(-50%, -50%) scale(0.96);
  }
`;

/* ================================
   Common
================================ */

const Wrapper = styled.main`
  width: 100%;
  min-width: var(--layout-width);
  overflow: hidden;
  background-color: var(--color-white);
  color: var(--text-main);
`;

const SectionInner = styled.div`
  width: 1200px;
  margin: 0 auto;
`;

const StyledImage = styled.img`
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center;
`;

/* ================================
   Hero
================================ */

const HeroSection = styled.section`
  position: relative;
  width: 100%;
  height: 560px;
  padding-top: calc(var(--header-height) + -2px);
  overflow: hidden;
  background: linear-gradient(135deg, #06b487 0%, #34c6a3 52%, #68d3bd 100%);

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 96px;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0) 0%,
      var(--color-white) 100%
    );
    pointer-events: none;
  }
`;

const HeroInner = styled.div`
  position: relative;
  z-index: 2;
  width: 1440px;
  height: calc(100% - var(--header-height) - 28px);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeroTextBox = styled.div`
  width: 580px;
  color: var(--color-white);
  animation: ${fadeRight} 0.9s ease forwards;
`;

const HeroBadge = styled.div`
  width: fit-content;
  height: 45px;
  padding: 0 30px;
  display: flex;
  align-items: center;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: var(--color-white);
  font-size: 15px;
  font-weight: 00;
  backdrop-filter: blur(10px);
`;

const HeroLogoText = styled.h1`
  margin: 26px 0 0;
  color: var(--color-white);
  font-size: 96px;
  line-height: 0.9;
  font-weight: 900;
  letter-spacing: -4px;
`;

const HeroDesc = styled.p`
  margin: 28px 0 0;
  color: rgba(255, 255, 255, 0.95);
  font-size: 23px;
  line-height: 1.55;
  font-weight: 500;
  letter-spacing: -0.8px;
`;

const HeroButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 34px;
`;

const HeroPrimaryButton = styled.button`
  min-width: 176px;
  height: 52px;
  padding: 0 26px;
  border: none;
  border-radius: 999px;
  background-color: var(--color-white);
  color: var(--color-main-dark);
  font-size: 16px;
  font-weight: 700;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.14);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 20px 36px rgba(0, 0, 0, 0.16);
  }
`;

const HeroSecondaryButton = styled.button`
  min-width: 164px;
  height: 52px;
  padding: 0 26px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: var(--color-white);
  font-size: 16px;
  font-weight: 600;
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    background: rgba(255, 255, 255, 0.16);
  }
`;

const HeroVisualBox = styled.div`
  position: relative;
  width: 700px;
  height: 420px;
  animation: ${fadeLeft} 1s ease 0.2s both;
`;

const HeroVisualGlow = styled.div`
  position: absolute;
  left: 56%;
  top: 58%;
  width: 540px;
  height: 260px;
  border-radius: 999px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.45) 0%,
    rgba(255, 255, 255, 0.18) 45%,
    rgba(255, 255, 255, 0) 76%
  );
  filter: blur(10px);
  transform: translate(-50%, -50%);
  animation: ${glowPulse} 4s ease-in-out infinite;
`;

const HeroVisualPanel = styled.div`
  position: absolute;
  right: 32px;
  bottom: 34px;
  width: 500px;
  height: 288px;
  border-radius: 34px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.2),
    rgba(255, 255, 255, 0.08)
  );
  border: 1px solid rgba(255, 255, 255, 0.26);
  backdrop-filter: blur(14px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    0 18px 40px rgba(0, 0, 0, 0.08);
`;

const HeroPetModelBox = styled.div`
  position: absolute;
  right: 12px;
  bottom: -6px;
  width: 610px;
  height: 360px;
  z-index: 3;
  animation: ${floatYSlow} 4.8s ease-in-out infinite;

  img {
    object-fit: contain;
    object-position: center bottom;
    filter: drop-shadow(0 26px 34px rgba(0, 0, 0, 0.18));
  }
`;

const HeroStatChip = styled.div`
  position: absolute;
  z-index: 4;
  min-width: 138px;
  min-height: 88px;
  padding: 16px 18px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.12);
  animation: ${floatY} 3.6s ease-in-out infinite;

  span {
    display: block;
    color: var(--text-sub);
    font-size: 13px;
    font-weight: 800;
  }

  strong {
    display: block;
    margin-top: 8px;
    color: var(--color-main);
    font-size: 26px;
    line-height: 1;
    font-weight: 900;
    letter-spacing: -0.5px;
  }

  &.score {
    left: 44px;
    top: 56px;
    animation-delay: 0.2s;
  }

  &.care {
    right: 16px;
    bottom: 52px;
    animation-delay: 0.8s;
  }
`;

const HeroBackdropBlob = styled.div`
  position: absolute;
  border-radius: 50%;
  pointer-events: none;

  &.left {
    left: -120px;
    top: 104px;
    width: 280px;
    height: 280px;
    border: 44px solid rgba(255, 255, 255, 0.08);
  }

  &.right {
    right: 140px;
    top: 8px;
    width: 280px;
    height: 280px;
    background: rgba(255, 255, 255, 0.08);
  }
`;

const HeroDecorDot = styled.div`
  position: absolute;
  z-index: 1;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.26);
  pointer-events: none;
  animation: ${floatY} 4.4s ease-in-out infinite;

  &.dot-one {
    left: 860px;
    top: 160px;
    width: 28px;
    height: 28px;
  }

  &.dot-two {
    right: 170px;
    top: 110px;
    width: 34px;
    height: 34px;
    animation-delay: 0.8s;
  }

  &.dot-three {
    right: 310px;
    top: 250px;
    width: 18px;
    height: 18px;
    animation-delay: 1.2s;
  }
`;

/* ================================
   Intro
================================ */

const IntroSection = styled.section`
  position: relative;
  width: 100%;
  padding: 76px 0 100px;
  background-color: var(--color-white);
`;

const IntroTitle = styled.h2`
  margin: 0;
  text-align: center;
  color: var(--text-main);
  font-size: 38px;
  line-height: 1.55;
  font-weight: 900;
  letter-spacing: -1.6px;
  animation: ${fadeUp} 0.8s ease both;
`;

const QuoteMark = styled.span`
  margin: 0 10px;
  color: var(--text-main);
  font-size: 34px;
  font-weight: 900;
`;

const IntroDesc = styled.p`
  margin: 26px 0 0;
  text-align: center;
  color: var(--text-sub);
  font-size: 15px;
  line-height: 1.8;
  font-weight: 500;
  animation: ${fadeUp} 0.8s ease 0.15s both;
`;

const CardGrid = styled.div`
  width: 900px;
  margin: 75px auto 0;
  display: grid;
  grid-template-columns: repeat(2, 405px);
  column-gap: 86px;
  row-gap: 42px;
  align-items: start;
`;
const ServiceCard = styled.article`
  position: relative;
  width: 405px;
  height: 320px;
  border-radius: 22px;
  overflow: hidden;
  background-color: #f5fffb;
  box-shadow: 0 18px 36px rgba(18, 45, 46, 0.14);

  animation:
    ${fadeUp} 0.8s ease ${({ $index }) => 0.2 + $index * 0.12}s both,
    ${cardFloat} 4.6s ease-in-out ${({ $index }) => $index * 0.45}s infinite;

  transition:
    transform 0.24s ease,
    box-shadow 0.24s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 24px 44px rgba(18, 45, 46, 0.18);
  }

  &:nth-child(2) {
    margin-top: 34px;
  }

  &:nth-child(3) {
    margin-top: -4px;
  }

  &:nth-child(4) {
    margin-top: 30px;
  }

  img {
    transition: transform 0.45s ease;
  }

  &:hover img {
    transform: scale(1.045);
  }
`;

const CardImageWrap = styled.div`
  position: absolute;
  inset: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CardDim = styled.div`
  position: absolute;
  inset: 0;
  z-index: 3;

  background:
    linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.42) 0%,
      rgba(0, 0, 0, 0.2) 42%,
      rgba(0, 0, 0, 0.08) 100%
    ),
    linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.28) 0%,
      rgba(0, 0, 0, 0.08) 52%,
      rgba(0, 0, 0, 0.04) 100%
    );

  pointer-events: none;
`;

const CardOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 4;
  padding: 34px 34px;
`;

const CardTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CardTempIcon = styled.div`
  width: 54px;
  height: 54px;

  flex: 0 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 16px;
  background-color: rgba(0, 169, 123, 0.92);
  color: #ffffff;

  font-size: 29px;
  line-height: 1;

  box-shadow: 0 10px 18px rgba(0, 169, 123, 0.24);
`;

const CardTitle = styled.h3`
  margin: 0;

  color: var(--color-white);
  font-size: 24px;
  line-height: 1.18;
  font-weight: 700;
  letter-spacing: -1px;

  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.28);
`;

const CardDesc = styled.p`
  margin: 0px 0 0 66px;

  color: rgba(255, 255, 255, 0.96);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.2px;

  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

/* ================================
   Feature
================================ */

const FeatureSection = styled.section`
  width: 100%;
  padding: 64px 0 90px;
  background-color: #dff3ea;
`;

const FeatureTitle = styled.h2`
  margin: 0;
  text-align: center;
  color: var(--text-main);
  font-size: 36px;
  line-height: 1.45;
  font-weight: 900;
  letter-spacing: -1.4px;
`;

const FeatureTabList = styled.div`
  width: 650px;
  margin: 42px auto 54px;

  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const FeatureTabButton = styled.button`
  position: relative;
  width: 100px;
  border: none;
  background: transparent;
  padding: 0 0 15px;
  color: ${({ $active }) =>
    $active ? "var(--color-main)" : "var(--text-sub)"};
  cursor: pointer;

  transition:
    color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    color: var(--color-main);
    transform: translateY(-3px);
  }

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: 0;
    width: ${({ $active }) => ($active ? "72px" : "0")};
    height: 5px;
    border-radius: 99px;
    background-color: var(--color-main);
    transform: translateX(-50%);
    transition: width 0.25s ease;
  }
`;

const FeatureIcon = styled.div`
  font-size: 36px;
  line-height: 1;
  font-weight: 900;
`;

const FeatureLabel = styled.div`
  margin-top: 8px;
  font-size: 19px;
  font-weight: 900;
  letter-spacing: -0.8px;
`;

const MonitorArea = styled.div`
  position: relative;
  width: 720px;
  height: 600px;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MonitorFrame = styled.div`
  position: relative;
  width: 720px;
  height: 455px;
  margin: 0 auto;

  border-radius: 16px 16px 12px 12px;
  background-color: #1f1f1f;
  box-shadow:
    0 28px 50px rgba(18, 45, 46, 0.18),
    0 8px 18px rgba(18, 45, 46, 0.12);
  overflow: hidden;
`;

const MonitorTopBar = styled.div`
  height: 18px;
  background: linear-gradient(180deg, #252525 0%, #151515 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MonitorCamera = styled.span`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #545454;
`;

const MonitorScreen = styled.div`
  position: relative;
  width: 672px;
  height: 382px;
  margin: 0 auto;

  overflow: hidden;
  background-color: #ffffff;
`;
const MonitorScreenImage = styled.img`
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;
  display: block;

  object-fit: cover;
  object-position: top center;

  opacity: ${({ $active }) => ($active ? 1 : 0)};
  z-index: ${({ $active }) => ($active ? 2 : 1)};
  pointer-events: none;

  transform: ${({ $active }) =>
    $active ? "translateX(0) scale(1.12)" : "translateX(72px) scale(1.12)"};

  transition: opacity 0.22s ease;
  will-change: opacity, transform;

  ${({ $active }) =>
    $active &&
    css`
      animation: ${screenSlide} 0.54s cubic-bezier(0.18, 0.89, 0.32, 1.04) both;
    `}
`;

const MonitorBottomBar = styled.div`
  height: 55px;
  background: linear-gradient(180deg, #222222 0%, #111111 100%);
`;

const MonitorNeck = styled.div`
  width: 190px;
  height: 44px;
  margin: 0 auto;
  background: linear-gradient(180deg, #d7d7d7 0%, #bfbfbf 100%);
`;

const MonitorStand = styled.div`
  width: 360px;
  height: 54px;
  margin: 0 auto;
  border-radius: 8px 8px 0 0;
  background: linear-gradient(180deg, #d8d8d8 0%, #c7c7c7 100%);
  box-shadow: 0 18px 24px rgba(18, 45, 46, 0.12);
`;

const FeatureDesc = styled.p`
  margin: -28px 0 0;
  text-align: center;
  color: var(--text-sub);
  font-size: 19px;
  line-height: 1.6;
  font-weight: 800;
  letter-spacing: -0.5px;
`;
/* ================================
   Review
================================ */

const ReviewSection = styled.section`
  width: 100%;
  padding: 10px 0 20px;
  background-color: var(--color-bg-light);
`;

const ReviewInner = styled.div`
  width: 1220px;
  margin: 0 auto;

  display: grid;
  grid-template-columns: 560px 1fr;
  align-items: center;
  column-gap: 88px;
`;

const ReviewMediaArea = styled.div`
  width: 560px;

  /*
    영상 자체 배경을 피그마 배경색과 맞춰 만들었다고 했으니
    여기서는 박스, 테두리, 그림자, 둥근모서리 전부 제거합니다.
    그래야 '영역 안에 갇힌 영상'이 아니라
    섹션에 자연스럽게 붙은 것처럼 보입니다.
  */
  background: transparent;
  border: 0;
  border-radius: 0;
  box-shadow: none;
  overflow: visible;
`;

const ReviewVideo = styled.video`
  width: 100%;
  height: auto;

  display: block;

  /*
    cover 금지.
    cover를 쓰면 영상이 박스에 맞춰 확대되면서 위아래가 잘립니다.
    contain/auto 느낌으로 원본 비율 그대로 보여줘야 합니다.
  */
  object-fit: contain;
  object-position: center;

  background: transparent;
  border: 0;
  outline: 0;
`;

const ReviewTextBox = styled.div`
  min-width: 0;
  padding-top: 4px;
`;

const ReviewMainTitle = styled.h2`
  margin: 0;

  color: #000000;
  font-size: 42px;
  line-height: 1.2;
  font-weight: 900;
  letter-spacing: -2px;
`;

const PointText = styled.span`
  color: var(--color-main);
`;

const ReviewSubText = styled.p`
  margin: 34px 0 0;

  color: #666666;
  font-size: 24px;
  line-height: 1.55;
  font-weight: 500;
  letter-spacing: -1px;
`;
/* ================================
   CTA
================================ */

const CtaSection = styled.section`
  width: 100%;
  padding: 12px 0 28px;
  background-color: var(--color-bg-light);
`;

const CtaInner = styled.div`
  position: relative;
  width: 1100px;
  height: 142px;
  margin: 0 auto;
  padding: 0 36px;

  display: flex;
  align-items: center;

  border-radius: 18px;
  background-color: #d7f1e5;
  overflow: hidden;
`;

const CtaIcon = styled.div`
  width: 70px;
  height: 70px;
  margin-right: 22px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  color: var(--color-white);
  background-color: var(--color-main-dark);

  font-size: 34px;
`;

const CtaTextBox = styled.div`
  position: relative;
  z-index: 2;
`;

const CtaTitle = styled.h3`
  margin: 0;
  color: var(--color-main-dark);
  font-size: 26px;
  font-weight: 900;
  letter-spacing: -0.8px;
`;

const CtaDesc = styled.p`
  margin: 9px 0 0;
  color: var(--text-sub);
  font-size: 16px;
  font-weight: 600;
`;

const CtaButton = styled.button`
  position: absolute;
  right: 345px;
  top: 50%;
  z-index: 2;

  width: 165px;
  height: 42px;

  border: none;
  border-radius: 999px;
  background-color: var(--color-main);
  color: var(--color-white);

  font-size: 14px;
  font-weight: 800;

  transform: translateY(-50%);
  cursor: pointer;
`;

const CtaPetsBox = styled.div`
  position: absolute;
  right: 22px;
  bottom: 0;
  width: 250px;
  height: 128px;

  img {
    object-fit: contain;
    object-position: center bottom;
  }
`;
