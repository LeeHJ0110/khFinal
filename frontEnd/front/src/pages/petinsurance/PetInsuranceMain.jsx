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

      <InsuranceHeroSection />

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

  background: #fff;

  box-sizing: border-box;
`;

// =========================================================
// 하단 레이아웃
// 왼쪽 안내 카드 + 오른쪽 보험 상품 목록
// =========================================================
const BottomLayout = styled.main`
  display: grid;

  grid-template-columns:
    400px
    minmax(0, 1fr);

  align-items: start;

  gap: 70px;

  width: min(1600px, calc(100% - 48px));

  margin: 40px auto 100px;

  box-sizing: border-box;

  @media (max-width: 1100px) {
    grid-template-columns:
      280px
      minmax(0, 1fr);

    gap: 32px;

    width: calc(100% - 32px);
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;

    gap: 20px;

    width: calc(100% - 24px);

    margin: 28px auto 46px;
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

  @media (max-width: 760px) {
    position: static;
  }
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
