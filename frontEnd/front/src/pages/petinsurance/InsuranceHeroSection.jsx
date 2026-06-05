import React from "react";
import styled from "styled-components";

import petModel1 from "../../features/petInsurance/img/보험모델.png";

function InsuranceHeroSection() {
  return (
    <HeroWrapper>
      <TextArea>
        <BrandText>PET&I FOR</BrandText>

        <Title>스마트 펫 보험</Title>

        <Description>
          반려동물에게 꼭 필요한 보장을
          <br />
          간편하게 준비해 보세요.
        </Description>

        <Badge>우리 아이를 위한 든든한 선택</Badge>
      </TextArea>

      <ImageArea>
        <HeroImage src={petModel1} alt="펫 보험 소개 이미지" />
      </ImageArea>

      <BackgroundCircle />
    </HeroWrapper>
  );
}

export default InsuranceHeroSection;

// =========================================================
// styled-components
// =========================================================

const HeroWrapper = styled.section`
  position: relative;

  width: 100%;
  height: 245px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 28px 36px;

  overflow: hidden;

  border-radius: 18px;

  background: color-mix(in srgb, var(--color-bg-soft) 50%, var(--color-white));

  box-sizing: border-box;

  @media (max-width: 900px) {
    height: 260px;
  }

  @media (max-width: 640px) {
    height: 280px;
  }
`;

const TextArea = styled.div`
  position: relative;
  z-index: 2;
`;

const BrandText = styled.p`
  margin: 0;

  font-size: 14px;
  font-weight: 800;
  letter-spacing: 1.8px;
  color: var(--color-primary);
`;

const Title = styled.h1`
  margin: 8px 0 0;

  font-size: 34px;
  font-weight: 800;
  letter-spacing: -1px;
  color: var(--color-text-primary);
`;

const Description = styled.p`
  margin: 12px 0 0;

  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text-secondary);
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;

  margin-top: 16px;
  padding: 7px 13px;

  border: 1px solid
    color-mix(in srgb, var(--color-primary) 35%, var(--color-white));

  border-radius: 20px;

  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary);
`;

const ImageArea = styled.div`
  position: absolute;
  right: 150px;
  bottom: 0;

  z-index: 20;

  display: flex;
  align-items: flex-end;
  justify-content: center;

  width: 320px;
  height: 100%;
`;

const HeroImage = styled.img`
  display: block;

  width: 100%;
  max-height: 235px;

  object-fit: contain;
  object-position: center bottom;
`;

const BackgroundCircle = styled.div`
  position: absolute;
  right: -80px;
  bottom: -140px;

  width: 360px;
  height: 360px;

  border-radius: 50%;

  background: color-mix(in srgb, var(--color-white) 36%, transparent);
`;
