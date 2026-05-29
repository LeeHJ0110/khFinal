import { useState } from "react";
import styled, { keyframes } from "styled-components";
import petModelImg from "../../assets/images/homePage/homemodelpets.png";

/*
  이미지는 public/images/home/ 하위에 넣으면 됩니다.

  예시:
  public/images/home/hero-pets.png
  public/images/home/card-health.png
  public/images/home/monitor-frame.png

  코드에서는 public을 쓰지 않고 /images/home/... 으로 접근합니다.
*/
const HOME_IMAGES = {
  petModel: petModelImg,

  cardHealth: "/images/home/card-health.png",
  cardCommunity: "/images/home/card-community.png",
  cardStore: "/images/home/card-store.png",
  cardCare: "/images/home/card-care.png",

  monitorFrame: "/images/home/monitor-frame.png",
  screenHealth: "/images/home/screen-health.png",
  screenStore: "/images/home/screen-store.png",
  screenInsurance: "/images/home/screen-insurance.png",
  screenCommunity: "/images/home/screen-community.png",
  screenCustom: "/images/home/screen-custom.png",

  review1: "/images/home/review-1.png",
  review2: "/images/home/review-2.png",
  review3: "/images/home/review-3.png",

  ctaPets: "/images/home/cta-pets.png",
};

const serviceCards = [
  {
    title: "간편하고 정확한 건강 체크",
    desc: "우리 아이의 상태를 빠르게 확인하세요",
    image: HOME_IMAGES.cardHealth,
  },
  {
    title: "함께하는 정보 공유",
    desc: "경험과 노하우를 나누세요",
    image: HOME_IMAGES.cardCommunity,
  },
  {
    title: "딱 맞는 제품 추천",
    desc: "건강 데이터 기반 맞춤 쇼핑",
    image: HOME_IMAGES.cardStore,
  },
  {
    title: "놓치지 않는 건강 관리",
    desc: "일정관리, 알림, 기록까지 한 곳에서",
    image: HOME_IMAGES.cardCare,
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
  const [activeFeature, setActiveFeature] = useState(featureTabs[0]);

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
              <HeroPrimaryButton type="button">
                건강관리 시작하기
              </HeroPrimaryButton>
              <HeroSecondaryButton type="button">
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
                <SafeImage src={card.image} alt={card.title} />
                <CardImageFallback>
                  <strong>{card.title}</strong>
                  <span>이미지 영역</span>
                </CardImageFallback>
              </CardImageWrap>

              <CardOverlay>
                <CardTitle>{card.title}</CardTitle>
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
                onClick={() => setActiveFeature(tab)}
              >
                <FeatureIcon>{tab.icon}</FeatureIcon>
                <FeatureLabel>{tab.label}</FeatureLabel>
              </FeatureTabButton>
            ))}
          </FeatureTabList>

          <MonitorArea>
            <MonitorScreenBox>
              <SafeImage
                key={activeFeature.key}
                src={activeFeature.screen}
                alt={`${activeFeature.label} 화면`}
                screen
              />
              <MonitorScreenFallback>
                <strong>{activeFeature.label}</strong>
                <span>화면 이미지 영역</span>
              </MonitorScreenFallback>
            </MonitorScreenBox>

            <MonitorFrameBox>
              <SafeImage src={HOME_IMAGES.monitorFrame} alt="모니터 프레임" />
              <MonitorFallback>
                <MonitorFallbackScreen>
                  <span>MONITOR</span>
                  <strong>FRAME</strong>
                </MonitorFallbackScreen>
              </MonitorFallback>
            </MonitorFrameBox>
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
          <ReviewList>
            <ReviewCard>
              <ReviewProfileBox>
                <SafeImage src={HOME_IMAGES.review1} alt="리뷰 작성자 1" />
                <ProfileFallback />
              </ReviewProfileBox>

              <ReviewContent>
                <StarText>★★★★★</StarText>
                <ReviewName>by k9e090</ReviewName>
                <ReviewText>
                  기대했던 서비스예요! 건강 리포트 기능이 정말 직관적이라 초보
                  집사도 사용하기 편합니다.
                </ReviewText>
              </ReviewContent>
            </ReviewCard>

            <ReviewCard>
              <ReviewProfileBox>
                <SafeImage src={HOME_IMAGES.review2} alt="리뷰 작성자 2" />
                <ProfileFallback />
              </ReviewProfileBox>

              <ReviewContent>
                <StarText>★★★★★</StarText>
                <ReviewName>by sum8542</ReviewName>
                <ReviewText>
                  반려견 상태를 한눈에 볼 수 있어서 좋아요. 맞춤 추천도
                  유용했습니다.
                </ReviewText>
              </ReviewContent>
            </ReviewCard>

            <ReviewCard>
              <ReviewProfileBox>
                <SafeImage src={HOME_IMAGES.review3} alt="리뷰 작성자 3" />
                <ProfileFallback />
              </ReviewProfileBox>

              <ReviewContent>
                <StarText>★★★★★</StarText>
                <ReviewName>by bou42</ReviewName>
                <ReviewText>
                  기록 관리가 쉬워져서 병원 방문 전에도 도움이 많이 됩니다.
                </ReviewText>
              </ReviewContent>
            </ReviewCard>
          </ReviewList>

          <ReviewTextBox>
            <ReviewMainTitle>
              반려인들을 만족시킨
              <br />
              우리아이 맞춤형 <PointText>진짜 서비스</PointText>
            </ReviewMainTitle>

            <ReviewSubText>
              이미 검증된 서비스입니다
              <br />
              수많은 반려인들이 직접 경험하고 만족했습니다
            </ReviewSubText>

            <ReviewSubText>
              정확한 건강진단과 맞춤 관리
              <br />그 변화를 지금 확인해보세요
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

          <CtaButton type="button">건강관리 시작하기 &gt;</CtaButton>

          <CtaPetsBox>
            <SafeImage src={HOME_IMAGES.ctaPets} alt="강아지와 고양이" />
            <CtaImageFallback>
              <strong>CTA 펫 이미지</strong>
              <span>cta-pets.png</span>
            </CtaImageFallback>
          </CtaPetsBox>
        </CtaInner>
      </CtaSection>
    </Wrapper>
  );
}

function SafeImage({ src, alt, screen = false }) {
  return (
    <StyledImage
      src={src}
      alt={alt}
      $screen={screen}
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
  from {
    opacity: 0;
    transform: translateX(70px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateX(0) scale(1);
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
  animation: ${({ $screen }) => ($screen ? screenSlide : "none")} 0.55s ease
    both;
`;

/* ================================
   Hero
================================ */

const HeroSection = styled.section`
  position: relative;
  width: 100%;
  height: 560px;
  padding-top: calc(var(--header-height) + 28px);
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
  height: 38px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: var(--color-white);
  font-size: 15px;
  font-weight: 800;
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
  font-weight: 700;
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
  font-weight: 900;
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
  font-weight: 800;
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
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
  animation: ${fadeUp} 0.8s ease ${({ $index }) => 0.2 + $index * 0.12}s both;

  &:nth-child(2) {
    margin-top: 34px;
  }

  &:nth-child(3) {
    margin-top: -4px;
  }

  &:nth-child(4) {
    margin-top: 30px;
  }
`;

const CardImageWrap = styled.div`
  position: absolute;
  inset: 0;
`;

const CardImageFallback = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background:
    linear-gradient(180deg, rgba(12, 41, 38, 0.3), rgba(12, 41, 38, 0.08)),
    linear-gradient(135deg, #eafff7, #cceee1);
  color: var(--color-main-dark);
  text-align: center;

  strong {
    font-size: 18px;
    font-weight: 900;
  }

  span {
    font-size: 14px;
    font-weight: 700;
  }
`;

const CardOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 4;
  padding: 36px 34px;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.42) 0%,
    rgba(0, 0, 0, 0.18) 45%,
    rgba(0, 0, 0, 0.08) 100%
  );
`;

const CardTitle = styled.h3`
  margin: 0;
  color: var(--color-white);
  font-size: 27px;
  line-height: 1.2;
  font-weight: 900;
  letter-spacing: -1px;
`;

const CardDesc = styled.p`
  margin: 7px 0 0;
  color: var(--color-white);
  font-size: 11px;
  font-weight: 700;
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
`;

const MonitorFrameBox = styled.div`
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
`;

const MonitorFallback = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  border-radius: 28px;
  background:
    linear-gradient(#202020 0 0) center top 36px / 650px 390px no-repeat,
    linear-gradient(#d8d8d8 0 0) center bottom 85px / 350px 35px no-repeat,
    linear-gradient(#cfcfcf 0 0) center bottom 0 / 520px 95px no-repeat;
`;

const MonitorFallbackScreen = styled.div`
  width: 650px;
  height: 390px;
  margin-top: 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.35);
  font-size: 42px;
  font-weight: 900;
  text-align: center;

  strong {
    display: block;
    font-size: 48px;
    line-height: 1;
  }
`;

const MonitorScreenBox = styled.div`
  position: absolute;
  left: 51px;
  top: 43px;
  width: 618px;
  height: 348px;
  overflow: hidden;
  border-radius: 4px;
  z-index: 2;
  background-color: var(--color-white);
`;

const MonitorScreenFallback = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background:
    linear-gradient(90deg, rgba(0, 174, 132, 0.08), rgba(0, 174, 132, 0.18)),
    var(--color-white);
  color: var(--color-main);
  text-align: center;

  strong {
    font-size: 30px;
    line-height: 1.4;
    font-weight: 900;
  }

  span {
    margin-top: 4px;
    font-size: 16px;
    font-weight: 700;
  }
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
  padding: 68px 0 60px;
  background-color: var(--color-bg-light);
`;

const ReviewInner = styled.div`
  width: 1080px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 82px;
`;

const ReviewList = styled.div`
  width: 445px;
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const ReviewCard = styled.article`
  width: 445px;
  min-height: 130px;
  padding: 18px 22px;
  display: flex;
  gap: 17px;
  align-items: flex-start;
  border-radius: 14px;
  background-color: var(--color-white);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.04);
`;

const ReviewProfileBox = styled.div`
  position: relative;
  width: 75px;
  height: 75px;
  flex: 0 0 75px;
  border-radius: 50%;
  overflow: hidden;
`;

const ProfileFallback = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    radial-gradient(circle at 50% 34%, #9be6d0 0 20%, transparent 21%),
    radial-gradient(
      circle at 50% 80%,
      var(--color-main) 0 34%,
      transparent 35%
    ),
    #e5fff7;
`;

const ReviewContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const StarText = styled.div`
  color: var(--color-main);
  font-size: 24px;
  line-height: 1;
  font-weight: 900;
  letter-spacing: 1px;
`;

const ReviewName = styled.div`
  margin-top: 3px;
  color: var(--text-desc);
  font-size: 12px;
  font-weight: 600;
`;

const ReviewText = styled.p`
  margin: 7px 0 0;
  color: var(--text-sub);
  font-size: 12px;
  line-height: 1.45;
  font-weight: 500;
`;

const ReviewTextBox = styled.div`
  flex: 1;
`;

const ReviewMainTitle = styled.h2`
  margin: 0;
  color: #000000;
  font-size: 42px;
  line-height: 1.22;
  font-weight: 900;
  letter-spacing: -2px;
`;

const PointText = styled.span`
  color: var(--color-main);
`;

const ReviewSubText = styled.p`
  margin: 34px 0 0;
  color: #6b6b6b;
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
`;

const CtaImageFallback = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background-color: rgba(255, 255, 255, 0.45);
  color: var(--color-main-dark);
  text-align: center;

  strong {
    font-size: 15px;
    font-weight: 900;
  }

  span {
    margin-top: 4px;
    font-size: 12px;
    font-weight: 700;
  }
`;
