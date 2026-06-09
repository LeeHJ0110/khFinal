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
// 화면이 줄어들어도
// 왼쪽 안내 카드 + 오른쪽 상품 목록 구조 유지
// =========================================================
const BottomLayout = styled.main`
  display: grid;

  grid-template-columns:
    clamp(250px, 22vw, 315px)
    minmax(0, 1fr);

  align-items: start;

  gap: clamp(22px, 3.5vw, 64px);

  width: min(
    var(--layout-max-width),
    calc(100% - (var(--layout-padding-x) * 2))
  );

  margin: 50px auto 100px;

  box-sizing: border-box;

  @media (max-width: 760px) {
    grid-template-columns:
      minmax(220px, 250px)
      minmax(0, 1fr);

    gap: 18px;

    width: calc(100% - 24px);

    margin: 22px auto 46px;
  }
`;

// =========================================================
// 왼쪽 보험 이용 안내 카드
// =========================================================
const EstimateArea = styled.aside`
  width: 100%;
  min-width: 0;

  box-sizing: border-box;

  position: sticky;
  top: 24px;
`;

// =========================================================
// 오른쪽 보험 상품 목록
// =========================================================
const InsuranceArea = styled.section`
  display: flex;
  flex-direction: column;

  width: 100%;
  min-width: 0;

  box-sizing: border-box;
`;
