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
  width: 100%;
  min-height: 100vh;

  display: flex;
  flex-direction: column;

  box-sizing: border-box;
`;

const HeroArea = styled.section`
  width: 100%;

  margin: 0;
  padding: 0;

  box-sizing: border-box;
`;

const BottomLayout = styled.main`
  width: 85%;

  display: grid;
  grid-template-columns: 400px minmax(0, 1fr);
  gap: 48px;

  align-items: start;

  margin: 38px auto 100px;

  box-sizing: border-box;

  @media (max-width: 1200px) {
    width: calc(100% - 96px);
    grid-template-columns: 320px minmax(0, 1fr);
    gap: 32px;
  }

  @media (max-width: 900px) {
    width: calc(100% - 48px);
    grid-template-columns: 1fr;
    gap: 28px;
  }

  @media (max-width: 640px) {
    width: calc(100% - 32px);
    margin: 24px auto 60px;
  }
`;

const EstimateArea = styled.aside`
  position: sticky;
  top: 24px;

  width: 100%;

  box-sizing: border-box;

  @media (max-width: 900px) {
    position: static;
  }
`;

const InsuranceArea = styled.section`
  display: flex;
  flex-direction: column;

  width: 100%;
  min-width: 0;

  box-sizing: border-box;
`;