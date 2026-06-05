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

      <PageContent>
        <EstimateArea>
          <InsuranceEstimateSection />
        </EstimateArea>

        <InsuranceArea>
          <InsuranceHeroSection />
          <InsuranceProductSection />
        </InsuranceArea>
      </PageContent>
    </Wrapper>
  );
}

export default PetInsuranceMain;

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;

  display: flex;
  flex-direction: column;

  box-sizing: border-box;
`;
//보험료 확인하기 박스 왼쪽에서 떨어지게 이동
const PageContent = styled.main`
  width: min(1800px, 96%);
  margin: 50px;

  display: grid;
  grid-template-columns: 390px minmax(0, 1fr);
  gap: 50px;

  align-items: start;

  box-sizing: border-box;
`;

const EstimateArea = styled.aside`
  width: 100%;
`;

const InsuranceArea = styled.section`
  width: 100%;
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 24px;
`;
