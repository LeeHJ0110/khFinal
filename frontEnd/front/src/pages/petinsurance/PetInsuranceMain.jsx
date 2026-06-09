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

// 배너 내부 컨테이너와 동일한 기준으로 정렬
const BottomLayout = styled.main`
  display: grid;
  grid-template-columns: 350px minmax(0, 1fr);
  gap: 100px;

  align-items: start;

  width: min(
    var(--layout-max-width),
    calc(100% - (var(--layout-padding-x) * 2))
  );

  margin: 50px auto 100px;

  box-sizing: border-box;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 760px) {
    width: min(100% - 30px, var(--layout-max-width));

    margin: 22px auto 46px;
  }
`;

const EstimateArea = styled.aside`
  width: 100%;
  margin-left: 100px;

  box-sizing: border-box;

  @media (min-width: 1101px) {
    position: sticky;
    top: 24px;
  }
`;

const InsuranceArea = styled.section`
  display: flex;
  flex-direction: column;

  width: 100%;
  min-width: 0;

  box-sizing: border-box;
`;
