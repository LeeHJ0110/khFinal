import React from "react";
import styled from "styled-components";

import PetCareNav from "../../features/petcare/components/petcarehome/PetCareNav";

import InsuranceEstimateSection from "../petinsurance/InsuranceEstimateSection";
import InsuranceHeroSection from "../petinsurance/InsuranceHeroSection";
import InsuranceProductSection from "../petinsurance/InsuranceProductSection";

function PetInsuranceMain() {
  return (
    <Wrapper>
      <PetCareNav />

      {/* 상단 배너 */}
      <HeroArea>
        <InsuranceHeroSection />
      </HeroArea>

      {/* 하단: 안내 카드 + 상품 목록 */}
      <BottomLayout>
        <EstimateArea>
          <InsuranceEstimateSection />
        </EstimateArea>

        <InsuranceArea>
          <InsuranceProductSection />
        </InsuranceArea>
      </BottomLayout>
    </Wrapper>
  );
}

export default PetInsuranceMain;

// =========================================================
// styled-components
// =========================================================

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  min-height: 100vh;

  box-sizing: border-box;
`;

const HeroArea = styled.section`
  width: 100%;

  margin: 0;
  padding: 0;

  box-sizing: border-box;
`;

// =========================================================
// 하단 레이아웃
//
// 왼쪽 안내 카드 + 오른쪽 보험 상품 목록
// 오른쪽 영역은 무한정 늘어나지 않도록 최대 너비 제한
// =========================================================
const BottomLayout = styled.main`
  display: grid;

  grid-template-columns:
    400px
    minmax(0, 1fr);

  align-items: start;

  gap: 70px;

  width: min(1600px, calc(100% - 48px));

  margin: 38px auto 100px;

  box-sizing: border-box;

  @media (max-width: 1100px) {
    grid-template-columns:
      220px
      minmax(0, 1fr);

    width: calc(100% - 32px);
  }

  @media (max-width: 760px) {
    grid-template-columns:
      minmax(210px, 220px)
      minmax(0, 1fr);

    gap: 8px;

    width: calc(100% - 24px);

    margin: 22px auto 46px;
  }
`;
// =========================================================
// 왼쪽 보험 이용 안내 카드
// =========================================================
const EstimateArea = styled.aside`
  position: sticky;
  top: 24px;

  width: 100%;

  box-sizing: border-box;
`;

// =========================================================
// 오른쪽 보험 상품 목록
// =========================================================
const InsuranceArea = styled.section`
  display: flex;
  flex-direction: column;

  width: 100%;
  max-width: 1330px;
  min-width: 0;

  box-sizing: border-box;
`;
