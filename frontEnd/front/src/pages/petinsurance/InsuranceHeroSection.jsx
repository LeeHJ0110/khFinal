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
    opacity: 0.14;
  }

  8% {
    opacity: 0.75;
  }

  22% {
    opacity: 0.75;
  }

  42% {
    opacity: 0.14;
  }

  100% {
    opacity: 0.14;
  }
`;

// =========================================================
// styled-components
// =========================================================
// =========================================================
// styled-components
// =========================================================
const HeroWrapper = styled.section`
  position: relative;
  z-index: 1;

  width: 100%;
  height: 245px;

  overflow: hidden;

 background: color-mix(in srgb, var(--color-bg-soft)35%, var(--color-white));


  box-sizing: border-box;

  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    z-index: 5;

    transform: scale(1.015);

    box-shadow: 0 14px 32px rgba(0, 169, 123, 0.12);
  }

  @media (max-width: 900px) {
    height: 260px;
  }

  @media (max-width: 640px) {
    height: 280px;

    &:hover {
      transform: none;
    }
  }
`;

const HeroInner = styled.div`
  position: relative;

  width: min(1600px, calc(100% - 180px));
  height: 100%;

  margin: 0 auto;

  overflow: hidden;

  box-sizing: border-box;

  @media (max-width: 1200px) {
    width: calc(100% - 96px);
  }

  @media (max-width: 900px) {
    width: calc(100% - 48px);
  }

  @media (max-width: 640px) {
    width: calc(100% - 32px);
  }
`;

// =========================================================
// 왼쪽 문구 영역
// =========================================================
const TextArea = styled.div`
  position: absolute;
  top: 28px;
  left: 0;
  z-index: 6;

  width: min(530px, 55%);

  @media (max-width: 900px) {
    top: 24px;

    width: min(470px, 68%);
  }

  @media (max-width: 640px) {
    top: 22px;

    width: 100%;
  }
`;

const BrandText = styled.p`
  margin: 0;

  color: var(--color-main-dark);

  font-size: 13px;
  font-weight: 900;
  letter-spacing: 2px;
`;

const Title = styled.h1`
  margin: 8px 0 0;

  color: var(--text-main);

  font-size: 34px;
  font-weight: 900;
  line-height: 1.18;
  letter-spacing: -1.4px;

  @media (max-width: 640px) {
    font-size: 27px;
  }
`;

const Highlight = styled.span`
  color: var(--color-main-dark);
`;

const Description = styled.p`
  width: min(500px, 100%);

  margin: 12px 0 0;

  color: var(--text-sub);

  font-size: 14px;
  font-weight: 400;
  line-height: 1.75;

  word-break: keep-all;

  @media (max-width: 640px) {
    width: 100%;

    padding-right: 92px;

    box-sizing: border-box;

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

  color: var(--color-main-dark);

  font-size: 11px;
  font-weight: 700;
`;

// =========================================================
// 발자국 장식 영역
// =========================================================
const PawDecorationArea = styled.div`
  position: absolute;

  left: 410px;
  right: 330px;
  top: 0;
  bottom: 0;

  z-index: 3;

  pointer-events: none;

  @media (max-width: 1200px) {
    left: 390px;
    right: 300px;
  }

  @media (max-width: 900px) {
    left: 330px;
    right: 230px;
  }

  @media (max-width: 760px) {
    display: none;
  }
`;

const PawItem = styled.div`
  position: absolute;

  left: ${({ $left }) => $left};
  top: ${({ $top }) => $top};

  opacity: 0.14;

  animation: ${pawFloat} 6s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay};
  animation-fill-mode: both;
`;

const PawImage = styled.img`
  display: block;

  width: ${({ $size }) => $size};
  height: auto;

  object-fit: contain;

  transform: rotate(${({ $rotate }) => $rotate});
`;

// =========================================================
// 오른쪽 펫 이미지 영역
// 건강진단 TopSection 기준으로 위치 맞춤
// =========================================================
const ImageArea = styled.div`
  position: absolute;

  right: -50px;
  bottom: 0;
  z-index: 5;

  display: flex;
  align-items: flex-end;
  justify-content: center;

  width: 410px;
  height: 100%;

  pointer-events: none;

  @media (max-width: 1350px) {
    right: 10px;
  }

  @media (max-width: 1100px) {
    right: -30px;

    width: 355px;
  }

  @media (max-width: 900px) {
    right: -55px;

    width: 310px;
  }

  @media (max-width: 640px) {
    right: -95px;

    width: 245px;

    opacity: 0.28;
  }
`;

const ImageHalo = styled.div`
  display: none;
`;

const HeroImage = styled.img`
  position: relative;
  z-index: 2;

  display: block;

  width: 100%;
  max-height: 232px;

  object-fit: contain;
  object-position: center bottom;
`;

const LargeCircle = styled.div`
  display: none;
`;

const SmallCircle = styled.div`
  display: none;
`;

const DotPattern = styled.div`
  position: absolute;
  inset: 0;

  opacity: 0.16;

  background-image: radial-gradient(
    rgba(0, 169, 123, 0.22) 1px,
    transparent 1px
  );

  background-size: 18px 18px;

  pointer-events: none;
`;