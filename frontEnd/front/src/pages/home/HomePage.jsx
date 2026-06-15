import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css, keyframes } from "styled-components";

import petModelImg from "../../assets/images/homePage/homemodelpets.png";
import reviewVideo from "../../assets/images/homePage/후기영상.mp4";

import card1 from "../../assets/images/homePage/1번카드.png";
import card2 from "../../assets/images/homePage/2번카드.png";
import card3 from "../../assets/images/homePage/3번카드.png";
import card4 from "../../assets/images/homePage/4번카드.png";
import heroBgImg from "../../assets/images/homePage/배경후보1.png";

import healthcareIntroduction from "../../assets/images/homePage/홈용건강관리.png";
import storeIntroduction from "../../assets/images/homePage/홈용스토어.png";
import insuIntroduction from "../../assets/images/homePage/홈용펫보험.png";
import commuIntroduction from "../../assets/images/homePage/홈용커뮤니티.png";
import careIntroduction from "../../assets/images/homePage/홈용맞춤관리.png";

const HOME_IMAGES = {
  heroBg: heroBgImg,
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
    title: "건강진단",
    strongTitle: "우리 아이 상태를 점수로 확인",
    desc: "문진과 사진 기반으로 건강 상태를 확인하고, 필요한 관리 방향을 쉽게 파악합니다.",
    image: HOME_IMAGES.cardHealth,
    icon: "✚",
    tags: ["건강점수", "비대면 진단", "맞춤 리포트"],
    path: "/healthcare",
    buttonText: "진단 시작",
  },
  {
    title: "커뮤니티",
    strongTitle: "반려인들의 경험을 한곳에",
    desc: "자유글, 시설후기, 상품후기, 뉴스까지 반려 생활에 필요한 정보를 공유합니다.",
    image: HOME_IMAGES.cardCommunity,
    icon: "💬",
    tags: ["자유", "시설후기", "뉴스"],
    path: "/community",
    buttonText: "둘러보기",
  },
  {
    title: "스토어",
    strongTitle: "건강 데이터 기반 맞춤 쇼핑",
    desc: "사료, 간식, 영양제, 배변용품까지 반려동물에게 필요한 제품을 편하게 찾습니다.",
    image: HOME_IMAGES.cardStore,
    icon: "🛍",
    tags: ["사료", "간식", "영양제", "배변용품"],
    path: "/store",
    buttonText: "스토어 이동",
  },
  {
    title: "맞춤관리",
    strongTitle: "기록과 일정, 포인트까지 관리",
    desc: "훈련일기, 일정관리, 포인트 미션을 통해 보호자의 일상을 더 쉽게 관리합니다.",
    image: HOME_IMAGES.cardCare,
    icon: "✓",
    tags: ["일정관리", "훈련일기", "포인트"],
    path: "/healthcare",
    buttonText: "관리 시작",
  },
];

const featureTabs = [
  {
    key: "health",
    label: "건강관리",
    icon: "＋",
    screen: HOME_IMAGES.screenHealth,
    desc: "건강 상태를 확인하고 기록을 쌓아보세요.",
  },
  {
    key: "store",
    label: "스토어",
    icon: "▣",
    screen: HOME_IMAGES.screenStore,
    desc: "필요한 제품을 카테고리별로 쉽게 탐색합니다.",
  },
  {
    key: "insurance",
    label: "펫보험",
    icon: "♡",
    screen: HOME_IMAGES.screenInsurance,
    desc: "우리 아이에게 맞는 보험 정보를 비교해보세요.",
  },
  {
    key: "community",
    label: "커뮤니티",
    icon: "♣",
    screen: HOME_IMAGES.screenCommunity,
    desc: "반려인들과 정보와 경험을 자유롭게 공유합니다.",
  },
  {
    key: "custom",
    label: "맞춤형관리",
    icon: "♧",
    screen: HOME_IMAGES.screenCustom,
    desc: "일정, 기록, 포인트까지 한 흐름으로 관리합니다.",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(featureTabs[0]);

  useEffect(() => {
    const heroImage = new Image();
    heroImage.src = HOME_IMAGES.heroBg;

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

  function handleMoveService(path) {
    navigate(path);
  }

  return (
    <Wrapper>
      <HeroSection>
        <HeroBackgroundImage src={HOME_IMAGES.heroBg} alt="" />
        <HeroLeftDim />
        <HeroBottomDim />

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
        </HeroInner>
      </HeroSection>

      <IntroSection>
        <IntroGlow className="left" />
        <IntroGlow className="right" />

        <IntroHeader>
          <IntroKicker>PET & I FOR SERVICE</IntroKicker>

          <IntroTitle>
            <QuoteMark>“</QuoteMark>
            소중한<QuoteMark>”</QuoteMark> 반려동물
            <br />
            건강한 삶을 위한 단 하나의 선택!
          </IntroTitle>

          <IntroDesc>
            건강진단부터 커뮤니티, 스토어, 포인트 관리까지
            <br />
            반려동물과 보호자의 일상을 더 건강하게 연결합니다
          </IntroDesc>
        </IntroHeader>

        <ServiceGrid>
          {serviceCards.map((card, index) => (
            <ServiceCard
              key={card.title}
              type="button"
              $index={index}
              onClick={() => handleMoveService(card.path)}
            >
              <ServiceImageWrap>
                <SafeImage src={card.image} alt={card.title} />
              </ServiceImageWrap>

              <ServiceDim />
              <ServiceBorder />

              <ServiceTop>
                <ServiceIcon>{card.icon}</ServiceIcon>
                <ServiceLabel>{card.title}</ServiceLabel>
              </ServiceTop>

              <ServiceInfoPanel>
                <ServiceTitle>{card.strongTitle}</ServiceTitle>
                <ServiceDesc>{card.desc}</ServiceDesc>

                <ServiceBottomRow>
                  <ServiceTagList>
                    {card.tags.map((tag) => (
                      <ServiceTag key={tag}>{tag}</ServiceTag>
                    ))}
                  </ServiceTagList>

                  <ServiceButton>
                    {card.buttonText}
                    <span>→</span>
                  </ServiceButton>
                </ServiceBottomRow>
              </ServiceInfoPanel>
            </ServiceCard>
          ))}
        </ServiceGrid>
      </IntroSection>

      <FeatureSection>
        <SectionInner>
          <FeatureHeader>
            <FeatureKicker>SMART PREVIEW</FeatureKicker>

            <FeatureTitle>
              반려동물 건강관리,
              <br />
              이제 한 곳에서 끝내세요
            </FeatureTitle>

            <FeatureLead>
              우리 아이에게 딱 맞는 서비스를
              <br />
              펫앤아이포에서 한번에 이용하세요.
            </FeatureLead>
          </FeatureHeader>

          <FeatureShowcase>
            <FeatureMenuCard>
              {featureTabs.map((tab) => (
                <FeatureMenuButton
                  key={tab.key}
                  type="button"
                  $active={activeFeature.key === tab.key}
                  onClick={() => handleClickFeature(tab)}
                >
                  <FeatureMenuIcon>{tab.icon}</FeatureMenuIcon>

                  <FeatureMenuTextBox>
                    <FeatureMenuTitle>{tab.label}</FeatureMenuTitle>
                    <FeatureMenuDesc>{tab.desc}</FeatureMenuDesc>
                  </FeatureMenuTextBox>

                  <FeatureMenuArrow>→</FeatureMenuArrow>
                </FeatureMenuButton>
              ))}
            </FeatureMenuCard>

            <PreviewStage>
              <PreviewGlow className="glow1" />
              <PreviewGlow className="glow2" />

              <PreviewBrowserCard>
                <PreviewBrowserTop>
                  <PreviewDots>
                    <span />
                    <span />
                    <span />
                  </PreviewDots>

                  <PreviewTopPill>{activeFeature.label}</PreviewTopPill>
                </PreviewBrowserTop>

                <PreviewScreenArea>
                  {featureTabs.map((tab) => (
                    <PreviewScreenImage
                      key={tab.key}
                      src={tab.screen}
                      alt={`${tab.label} 화면`}
                      $active={activeFeature.key === tab.key}
                    />
                  ))}
                </PreviewScreenArea>
              </PreviewBrowserCard>

              <PreviewSummaryBar>
                <PreviewSummaryItem>
                  <PreviewSummaryIcon>{activeFeature.icon}</PreviewSummaryIcon>

                  <PreviewSummaryTextBox>
                    <PreviewSummaryLabel>
                      현재 선택된 서비스
                    </PreviewSummaryLabel>
                    <PreviewSummaryTitle>
                      {activeFeature.label}
                    </PreviewSummaryTitle>
                  </PreviewSummaryTextBox>
                </PreviewSummaryItem>

                <PreviewSummaryDivider />

                <PreviewSummaryItem className="wide">
                  <PreviewSummaryTextBox>
                    <PreviewSummaryLabel>서비스 소개</PreviewSummaryLabel>
                    <PreviewSummaryDesc>
                      {activeFeature.desc}
                    </PreviewSummaryDesc>
                  </PreviewSummaryTextBox>
                </PreviewSummaryItem>
              </PreviewSummaryBar>
            </PreviewStage>
          </FeatureShowcase>
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

const screenSlide = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px) scale(1.02);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
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
  height: 700px;
  padding-top: var(--header-height);
  overflow: hidden;
  background-color: #e9fff6;
`;

const HeroBackgroundImage = styled.img`
  position: absolute;
  inset: 0;
  z-index: 1;

  width: 100%;
  height: 100%;
  display: block;

  object-fit: cover;
  object-position: center 30%;

  pointer-events: none;
  user-select: none;
`;

const HeroLeftDim = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;

  background:
    linear-gradient(
      90deg,
      rgba(0, 150, 110, 0.78) 0%,
      rgba(0, 150, 110, 0.56) 22%,
      rgba(0, 150, 110, 0.22) 43%,
      rgba(0, 150, 110, 0) 66%
    ),
    linear-gradient(
      180deg,
      rgba(0, 169, 123, 0.1) 0%,
      rgba(0, 169, 123, 0) 100%
    );

  pointer-events: none;
`;

const HeroBottomDim = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: -10px;
  z-index: 3;
  height: 250px;

  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.72) 56%,
    var(--color-white) 100%
  );

  pointer-events: none;
`;

const HeroInner = styled.div`
  position: relative;
  z-index: 4;

  width: 1440px;
  height: calc(100% - var(--header-height));
  margin: 0 auto;

  display: flex;
  align-items: center;
`;

const HeroTextBox = styled.div`
  width: 580px;
  margin-top: -120px;
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
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.34);
  color: var(--color-white);

  font-size: 15px;
  font-weight: 700;

  backdrop-filter: blur(10px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.22),
    0 12px 28px rgba(0, 110, 83, 0.16);
`;

const HeroLogoText = styled.h1`
  margin: 26px 0 0;

  color: var(--color-white);
  font-size: 96px;
  line-height: 0.9;
  font-weight: 900;
  letter-spacing: -4px;

  text-shadow: 0 8px 26px rgba(0, 95, 75, 0.2);
`;

const HeroDesc = styled.p`
  margin: 28px 0 0;

  color: rgba(255, 255, 255, 0.96);
  font-size: 23px;
  line-height: 1.55;
  font-weight: 600;
  letter-spacing: -0.8px;

  text-shadow: 0 6px 18px rgba(0, 95, 75, 0.22);
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
  font-weight: 800;

  box-shadow: 0 16px 32px rgba(0, 90, 70, 0.18);
  cursor: pointer;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 20px 36px rgba(0, 90, 70, 0.22);
  }
`;

const HeroSecondaryButton = styled.button`
  min-width: 164px;
  height: 52px;
  padding: 0 26px;

  border: 1px solid rgba(255, 255, 255, 0.76);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  color: var(--color-white);

  font-size: 16px;
  font-weight: 700;

  backdrop-filter: blur(10px);
  cursor: pointer;

  transition:
    transform 0.2s ease,
    background 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    background: rgba(255, 255, 255, 0.2);
  }
`;

/* ================================
   Intro / Service Cards
================================ */

const IntroSection = styled.section`
  position: relative;
  width: 100%;
  padding: 90px 0 120px;
  overflow: hidden;

  background:
    radial-gradient(
      circle at 12% 24%,
      rgba(94, 200, 167, 0.15) 0%,
      rgba(94, 200, 167, 0) 34%
    ),
    radial-gradient(
      circle at 88% 64%,
      rgba(0, 169, 123, 0.1) 0%,
      rgba(0, 169, 123, 0) 34%
    ),
    linear-gradient(180deg, #ffffff 0%, #f4fffa 100%);
`;

const IntroGlow = styled.div`
  position: absolute;
  border-radius: 50%;
  pointer-events: none;

  &.left {
    left: -140px;
    top: 220px;
    width: 340px;
    height: 340px;
    background: rgba(0, 169, 123, 0.07);
    filter: blur(8px);
  }

  &.right {
    right: -150px;
    bottom: 120px;
    width: 360px;
    height: 360px;
    background: rgba(94, 200, 167, 0.11);
    filter: blur(10px);
  }
`;

const IntroHeader = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
`;

const IntroKicker = styled.div`
  width: fit-content;
  height: 34px;
  margin: 0 auto 20px;
  padding: 0 18px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 999px;
  background: rgba(0, 169, 123, 0.08);
  border: 1px solid rgba(0, 169, 123, 0.18);
  color: var(--color-main-dark);

  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.8px;
`;

const IntroTitle = styled.h2`
  margin: 0;
  text-align: center;
  color: var(--text-main);
  font-size: 40px;
  line-height: 1.48;
  font-weight: 800;
  letter-spacing: -1.8px;
  animation: ${fadeUp} 0.8s ease both;
`;

const QuoteMark = styled.span`
  margin: 0 10px;
  color: var(--text-main);
  font-size: 36px;
  font-weight: 900;
`;

const IntroDesc = styled.p`
  margin: 24px 0 0;
  text-align: center;
  color: var(--text-sub);
  font-size: 16px;
  line-height: 1.85;
  font-weight: 500;
  animation: ${fadeUp} 0.8s ease 0.15s both;
`;

const ServiceGrid = styled.div`
  position: relative;
  z-index: 2;

  width: 1180px;
  margin: 72px auto 0;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 34px;
`;

const ServiceCard = styled.button`
  position: relative;
  width: 100%;
  height: 360px;
  padding: 0;

  border: none;
  border-radius: 34px;
  overflow: hidden;
  text-align: left;
  background: #eafff7;

  box-shadow:
    0 26px 54px rgba(18, 45, 46, 0.12),
    0 8px 18px rgba(18, 45, 46, 0.08);

  cursor: pointer;
  animation: ${fadeUp} 0.75s ease ${({ $index }) => 0.18 + $index * 0.1}s both;

  transition:
    transform 0.26s ease,
    box-shadow 0.26s ease;

  &:nth-child(2),
  &:nth-child(4) {
    transform: translateY(36px);
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow:
      0 34px 68px rgba(18, 45, 46, 0.17),
      0 12px 26px rgba(18, 45, 46, 0.1);
  }

  &:nth-child(2):hover,
  &:nth-child(4):hover {
    transform: translateY(26px);
  }

  &:hover img {
    transform: scale(1.04);
  }
`;

const ServiceImageWrap = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: transform 0.65s ease;
  }
`;

const ServiceDim = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;

  background:
    linear-gradient(
      180deg,
      rgba(7, 31, 30, 0.04) 0%,
      rgba(7, 31, 30, 0.14) 42%,
      rgba(7, 31, 30, 0.44) 100%
    ),
    linear-gradient(
      90deg,
      rgba(0, 120, 92, 0.1) 0%,
      rgba(0, 120, 92, 0.02) 58%,
      rgba(0, 0, 0, 0.06) 100%
    );

  pointer-events: none;
`;

const ServiceBorder = styled.div`
  position: absolute;
  inset: 1px;
  z-index: 3;
  border-radius: 33px;
  border: 1px solid rgba(255, 255, 255, 0.42);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.22),
    inset 0 -1px 0 rgba(0, 80, 64, 0.18);
  pointer-events: none;
`;

const ServiceTop = styled.div`
  position: absolute;
  left: 28px;
  top: 28px;
  right: 28px;
  z-index: 4;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ServiceIcon = styled.div`
  width: 58px;
  height: 58px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 20px;
  background: linear-gradient(
    135deg,
    rgba(0, 169, 123, 0.98),
    rgba(94, 200, 167, 0.95)
  );

  color: #ffffff;
  font-size: 28px;
  font-weight: 900;

  box-shadow:
    0 14px 28px rgba(0, 110, 83, 0.26),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
`;

const ServiceLabel = styled.div`
  height: 34px;
  padding: 0 16px;

  display: flex;
  align-items: center;

  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.96);

  font-size: 13px;
  font-weight: 900;
  letter-spacing: -0.2px;

  backdrop-filter: blur(10px);
`;

const ServiceInfoPanel = styled.div`
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 20px;
  z-index: 4;

  padding: 20px 22px 18px;

  border-radius: 24px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.54);

  backdrop-filter: blur(14px);

  box-shadow:
    0 16px 28px rgba(0, 80, 64, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.45);
`;

const ServiceTitle = styled.h3`
  margin: 0;
  color: #123f3a;
  font-size: 22px;
  line-height: 1.22;
  font-weight: 900;
  letter-spacing: -1px;
`;

const ServiceDesc = styled.p`
  width: 100%;
  margin: 9px 0 0;

  color: rgba(18, 45, 46, 0.72);
  font-size: 13px;
  line-height: 1.55;
  font-weight: 600;
  letter-spacing: -0.3px;
`;

const ServiceBottomRow = styled.div`
  margin-top: 16px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const ServiceTagList = styled.div`
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
`;

const ServiceTag = styled.span`
  height: 26px;
  padding: 0 11px;

  display: inline-flex;
  align-items: center;

  border-radius: 999px;
  background: rgba(0, 169, 123, 0.08);
  color: var(--color-main-dark);

  font-size: 11px;
  font-weight: 800;
  letter-spacing: -0.2px;
`;

const ServiceButton = styled.div`
  flex: 0 0 auto;
  height: 38px;
  padding: 0 15px 0 17px;

  display: inline-flex;
  align-items: center;
  gap: 8px;

  border-radius: 999px;
  background: var(--color-main);
  color: var(--color-white);

  font-size: 13px;
  font-weight: 900;

  box-shadow: 0 10px 20px rgba(0, 169, 123, 0.24);

  span {
    font-size: 15px;
    line-height: 1;
  }
`;

/* ================================
   Feature Section - Rebuilt
================================ */

const FeatureSection = styled.section`
  width: 100%;
  padding: 100px 0 110px;
  background: linear-gradient(180deg, #eef9f3 0%, #e4f5eb 100%);
`;

const FeatureHeader = styled.div`
  text-align: center;
`;

const FeatureKicker = styled.div`
  width: fit-content;
  height: 34px;
  margin: 0 auto 20px;
  padding: 0 18px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 999px;
  background: rgba(0, 169, 123, 0.08);
  border: 1px solid rgba(0, 169, 123, 0.16);
  color: var(--color-main-dark);

  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.8px;
`;

const FeatureTitle = styled.h2`
  margin: 0;
  text-align: center;
  color: var(--text-main);
  font-size: 38px;
  line-height: 1.45;
  font-weight: 900;
  letter-spacing: -1.6px;
`;

const FeatureLead = styled.p`
  margin: 22px 0 0;
  text-align: center;
  color: var(--text-sub);
  font-size: 16px;
  line-height: 1.85;
  font-weight: 500;
`;

const FeatureShowcase = styled.div`
  margin-top: 66px;

  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 34px;
  align-items: stretch;
`;

const FeatureMenuCard = styled.div`
  padding: 18px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(12px);

  box-shadow:
    0 24px 48px rgba(18, 45, 46, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);

  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const FeatureMenuButton = styled.button`
  width: 100%;
  padding: 18px 18px;
  border: none;
  border-radius: 22px;
  background: ${({ $active }) =>
    $active ? "rgba(0, 169, 123, 0.10)" : "rgba(255, 255, 255, 0.72)"};
  border: 1px solid
    ${({ $active }) =>
      $active ? "rgba(0, 169, 123, 0.24)" : "rgba(18, 45, 46, 0.06)"};

  display: flex;
  align-items: center;
  gap: 14px;
  text-align: left;
  cursor: pointer;

  box-shadow: ${({ $active }) =>
    $active
      ? "0 14px 28px rgba(0, 169, 123, 0.10)"
      : "0 6px 16px rgba(18, 45, 46, 0.04)"};

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 28px rgba(18, 45, 46, 0.08);
  }
`;

const FeatureMenuIcon = styled.div`
  width: 52px;
  height: 52px;
  flex: 0 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 18px;
  background: linear-gradient(135deg, #00a97b 0%, #5ec8a7 100%);
  color: #ffffff;
  font-size: 26px;
  font-weight: 900;
`;

const FeatureMenuTextBox = styled.div`
  flex: 1;
  min-width: 0;
`;

const FeatureMenuTitle = styled.div`
  color: #1f3d3c;
  font-size: 18px;
  font-weight: 900;
  letter-spacing: -0.6px;
`;

const FeatureMenuDesc = styled.div`
  margin-top: 6px;
  color: #6b7a78;
  font-size: 13px;
  line-height: 1.55;
  font-weight: 500;
`;

const FeatureMenuArrow = styled.div`
  flex: 0 0 auto;
  color: var(--color-main-dark);
  font-size: 18px;
  font-weight: 900;
`;

const PreviewStage = styled.div`
  position: relative;
  min-height: 640px;
  padding: 26px;

  border-radius: 34px;
  background:
    radial-gradient(
      circle at 18% 18%,
      rgba(94, 200, 167, 0.22) 0%,
      transparent 28%
    ),
    radial-gradient(
      circle at 84% 12%,
      rgba(0, 169, 123, 0.16) 0%,
      transparent 24%
    ),
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.82) 0%,
      rgba(244, 255, 250, 0.86) 100%
    );

  border: 1px solid rgba(255, 255, 255, 0.74);
  box-shadow:
    0 30px 60px rgba(18, 45, 46, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.55);

  overflow: hidden;
`;

const PreviewGlow = styled.div`
  position: absolute;
  border-radius: 50%;
  pointer-events: none;

  &.glow1 {
    left: -40px;
    top: 120px;
    width: 180px;
    height: 180px;
    background: rgba(94, 200, 167, 0.18);
    filter: blur(20px);
  }

  &.glow2 {
    right: -30px;
    bottom: 80px;
    width: 160px;
    height: 160px;
    background: rgba(0, 169, 123, 0.14);
    filter: blur(22px);
  }
`;

const PreviewBrowserCard = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  height: 455px;

  border-radius: 28px;
  background: #ffffff;
  box-shadow:
    0 26px 54px rgba(18, 45, 46, 0.14),
    0 8px 18px rgba(18, 45, 46, 0.08);

  overflow: hidden;
`;

const PreviewBrowserTop = styled.div`
  height: 54px;
  padding: 0 18px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background: linear-gradient(180deg, #f9fbfa 0%, #eef5f2 100%);
  border-bottom: 1px solid rgba(18, 45, 46, 0.08);
`;

const PreviewDots = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;

  span {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #cfd9d5;

    &:nth-child(1) {
      background: #ffb8b8;
    }

    &:nth-child(2) {
      background: #ffe0a3;
    }

    &:nth-child(3) {
      background: #b8eccf;
    }
  }
`;

const PreviewTopPill = styled.div`
  height: 32px;
  padding: 0 16px;

  display: flex;
  align-items: center;

  border-radius: 999px;
  background: rgba(0, 169, 123, 0.1);
  color: var(--color-main-dark);

  font-size: 13px;
  font-weight: 900;
`;

const PreviewScreenArea = styled.div`
  position: relative;
  width: 100%;
  height: calc(100% - 54px);
  background: #ffffff;
  overflow: hidden;
`;

const PreviewScreenImage = styled.img`
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;
  display: block;

  object-fit: cover;
  object-position: top center;

  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transform: ${({ $active }) =>
    $active ? "translateY(0) scale(1)" : "translateY(18px) scale(1.01)"};

  pointer-events: none;
  transition:
    opacity 0.28s ease,
    transform 0.28s ease;

  ${({ $active }) =>
    $active &&
    css`
      animation: ${screenSlide} 0.45s ease both;
    `}
`;

const PreviewSummaryBar = styled.div`
  position: absolute;
  left: 40px;
  right: 40px;
  bottom: 38px;
  z-index: 3;

  min-height: 96px;
  padding: 18px 22px;

  display: grid;
  grid-template-columns: 240px 1px 1fr 122px;
  align-items: center;
  column-gap: 22px;

  border-radius: 28px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.72);

  backdrop-filter: blur(18px);

  box-shadow:
    0 22px 42px rgba(18, 45, 46, 0.1),
    0 8px 18px rgba(18, 45, 46, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.62);
`;

const PreviewSummaryItem = styled.div`
  min-width: 0;

  display: flex;
  align-items: center;
  gap: 15px;

  &.wide {
    align-items: flex-start;
  }
`;

const PreviewSummaryIcon = styled.div`
  width: 58px;
  height: 58px;
  flex: 0 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 20px;
  background: linear-gradient(135deg, #00a97b 0%, #5ec8a7 100%);
  color: #ffffff;

  font-size: 29px;
  line-height: 1;
  font-weight: 900;

  box-shadow:
    0 14px 28px rgba(0, 169, 123, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.28);
`;

const PreviewSummaryTextBox = styled.div`
  min-width: 0;
`;

const PreviewSummaryLabel = styled.div`
  color: #7b8c88;
  font-size: 12px;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.1px;
`;

const PreviewSummaryTitle = styled.div`
  margin-top: 8px;

  color: #123f3a;
  font-size: 25px;
  line-height: 1.12;
  font-weight: 900;
  letter-spacing: -1px;
`;

const PreviewSummaryDesc = styled.div`
  margin-top: 8px;

  color: #405f5b;
  font-size: 14px;
  line-height: 1.62;
  font-weight: 700;
  letter-spacing: -0.45px;
`;

const PreviewSummaryDivider = styled.div`
  width: 1px;
  height: 56px;
  background: linear-gradient(
    180deg,
    rgba(0, 169, 123, 0) 0%,
    rgba(0, 169, 123, 0.2) 50%,
    rgba(0, 169, 123, 0) 100%
  );
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
  right: 250px;
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
