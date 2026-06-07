import React from "react";
import styled, { keyframes } from "styled-components";

import petModel1 from "../../features/petInsurance/img/보험모뎅.png";
import petModel2 from "../../features/petInsurance/img/발자국.png";

function InsuranceHeroSection() {
  return (
    <HeroWrapper>
      <DotPattern />

      <HeroInner>
        {/* =====================================================
            왼쪽 문구
        ===================================================== */}
        <TextArea>
          <BrandText>PET&I FOR</BrandText>

          <Title>
            우리 아이를 위한
            <br />
            <Highlight>스마트 펫 보험</Highlight>
          </Title>

          <Description>
            꼭 필요한 보장만 간편하게 준비하고
            <br />
            정기결제 내역까지 한 번에 관리해 보세요.
          </Description>

          <FeatureRow>
            <FeatureChip>맞춤 보험료</FeatureChip>
            <FeatureChip>간편 가입</FeatureChip>
            <FeatureChip>정기결제 관리</FeatureChip>
          </FeatureRow>
        </TextArea>

        {/* =====================================================
            발자국 장식 영역
        ===================================================== */}
        <PawDecorationArea>
          <PawItem $left="4%" $top="66%" $delay="0s">
            <PawImage
              src={petModel2}
              alt=""
              $size="25px"
              $rotate="-18deg"
            />
          </PawItem>

          <PawItem $left="17%" $top="42%" $delay="0.45s">
            <PawImage
              src={petModel2}
              alt=""
              $size="30px"
              $rotate="15deg"
            />
          </PawItem>

          <PawItem $left="29%" $top="70%" $delay="0.9s">
            <PawImage
              src={petModel2}
              alt=""
              $size="27px"
              $rotate="-12deg"
            />
          </PawItem>

          <PawItem $left="42%" $top="36%" $delay="1.35s">
            <PawImage
              src={petModel2}
              alt=""
              $size="34px"
              $rotate="18deg"
            />
          </PawItem>

          <PawItem $left="55%" $top="62%" $delay="1.8s">
            <PawImage
              src={petModel2}
              alt=""
              $size="29px"
              $rotate="-14deg"
            />
          </PawItem>

          <PawItem $left="67%" $top="30%" $delay="2.25s">
            <PawImage
              src={petModel2}
              alt=""
              $size="32px"
              $rotate="16deg"
            />
          </PawItem>

          <PawItem $left="78%" $top="57%" $delay="2.7s">
            <PawImage
              src={petModel2}
              alt=""
              $size="26px"
              $rotate="-12deg"
            />
          </PawItem>

          <PawItem $left="89%" $top="38%" $delay="3.15s">
            <PawImage
              src={petModel2}
              alt=""
              $size="29px"
              $rotate="14deg"
            />
          </PawItem>
        </PawDecorationArea>

        {/* =====================================================
            오른쪽 펫 이미지
        ===================================================== */}
        <ImageArea>
          <ImageHalo />

          <HeroImage
            src={petModel1}
            alt="펫 보험 소개 이미지"
          />
        </ImageArea>

        <LargeCircle />
        <SmallCircle />
      </HeroInner>
    </HeroWrapper>
  );
}

export default InsuranceHeroSection;

// =========================================================
// animation
// =========================================================
const pawFloat = keyframes`
  0% {
    transform: translateY(0);
    opacity: 0.14;
  }

  50% {
    transform: translateY(-6px);
    opacity: 0.28;
  }

  100% {
    transform: translateY(0);
    opacity: 0.14;
  }
`;

// =========================================================
// styled-components
// =========================================================
const HeroWrapper = styled.section`
  position: relative;

  width: 100%;
  margin: 0;
  padding: 0;

  overflow: hidden;

  background: color-mix(
    in srgb,
    var(--color-bg-soft) 40%,
    var(--color-white)
  );

  box-sizing: border-box;
`;

const HeroInner = styled.div`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: space-between;

  width: min(
    var(--layout-max-width),
    calc(100% - (var(--layout-padding-x) * 2))
  );

  height: 230px;

  margin: 0 auto;
  padding: 26px 34px;

  overflow: hidden;

  box-sizing: border-box;

  @media (max-width: 900px) {
    height: 220px;
    padding: 24px 28px;
  }

  @media (max-width: 640px) {
    height: 205px;
    padding: 20px;
  }
`;

// =========================================================
// 왼쪽 문구 영역
// =========================================================
const TextArea = styled.div`
  position: relative;
  z-index: 6;

  width: 320px;
  flex-shrink: 0;

  transform: translateX(60px);

  @media (max-width: 900px) {
    transform: translateX(0);
  }
`;

const BrandText = styled.p`
  margin: 0;

  font-size: 13px;
  font-weight: 900;
  letter-spacing: 2px;

  color: var(--color-main-dark);
`;

const Title = styled.h1`
  margin: 8px 0 0;

  font-size: 34px;
  font-weight: 900;
  line-height: 1.18;
  letter-spacing: -1.4px;

  color: var(--text-main);

  @media (max-width: 640px) {
    font-size: 27px;
  }
`;

const Highlight = styled.span`
  color: var(--color-main-dark);
`;

const Description = styled.p`
  margin: 12px 0 0;

  font-size: 14px;
  line-height: 1.75;

  color: var(--text-sub);

  @media (max-width: 640px) {
    font-size: 12px;
  }
`;

const FeatureRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 7px;

  margin-top: 15px;

  @media (max-width: 640px) {
    display: none;
  }
`;

const FeatureChip = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 6px 10px;

  border: 1px solid rgba(0, 169, 123, 0.2);
  border-radius: 999px;

  background: rgba(255, 255, 255, 0.64);

  font-size: 11px;
  font-weight: 700;

  color: var(--color-main-dark);
`;

// =========================================================
// 발자국 영역
// =========================================================
const PawDecorationArea = styled.div`
  position: absolute;

  left: 390px;
  right: clamp(320px, 22vw, 400px);
  top: 0;
  bottom: 0;

  z-index: 3;

  pointer-events: none;

  @media (max-width: 1100px) {
    left: 340px;
    right: 280px;
  }

  @media (max-width: 760px) {
    display: none;
  }
`;

const PawItem = styled.div`
  position: absolute;

  left: ${({ $left }) => $left};
  top: ${({ $top }) => $top};

  animation: ${pawFloat} 3.8s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay};
`;

const PawImage = styled.img`
  display: block;

  width: ${({ $size }) => $size};
  height: auto;

  object-fit: contain;

  transform: rotate(${({ $rotate }) => $rotate});
`;

// =========================================================
// 펫 모델 영역
//
// --pet-image-offset-x 값만 바꾸면 위치 조절 가능
// 음수: 왼쪽 이동
// 양수: 오른쪽 이동
// =========================================================
const ImageArea = styled.div`
  --pet-image-offset-x: -85px;

  position: absolute;

  right: 0;
  bottom: 0;

  z-index: 5;

  display: flex;
  align-items: flex-end;
  justify-content: center;

  width: clamp(280px, 24vw, 390px);
  height: 100%;

  transform: translateX(var(--pet-image-offset-x));

  pointer-events: none;

  @media (max-width: 900px) {
    --pet-image-offset-x: -45px;

    width: 300px;
  }

  @media (max-width: 640px) {
    --pet-image-offset-x: -18px;

    right: -20px;
    width: 205px;
  }
`;

const ImageHalo = styled.div`
  position: absolute;

  left: 50%;
  bottom: 8px;

  width: 205px;
  height: 205px;

  border-radius: 50%;

  background: rgba(255, 255, 255, 0.56);

  transform: translateX(-50%);
`;

const HeroImage = styled.img`
  position: relative;
  z-index: 2;

  display: block;

  width: 100%;
  max-height: 250px;

  object-fit: contain;
  object-position: center bottom;

  @media (max-width: 640px) {
    max-height: 188px;
  }
`;

const LargeCircle = styled.div`
  position: absolute;

  right: -100px;
  bottom: -180px;

  width: 430px;
  height: 430px;

  border-radius: 50%;

  background: rgba(255, 255, 255, 0.34);
`;

const SmallCircle = styled.div`
  position: absolute;

  right: 300px;
  top: -100px;

  width: 230px;
  height: 230px;

  border-radius: 50%;

  background: rgba(255, 255, 255, 0.2);

  @media (max-width: 700px) {
    display: none;
  }
`;

const DotPattern = styled.div`
  position: absolute;
  inset: 0;

  opacity: 0.22;

  background-image: radial-gradient(
    rgba(0, 169, 123, 0.22) 1px,
    transparent 1px
  );

  background-size: 18px 18px;

  pointer-events: none;
`;