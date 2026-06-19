import { useState } from "react";
import styled from "styled-components";

import TopSection from "../../features/petcare/components/petcarehome/TopSection";
import CheckSection from "../../features/petcare/components/petcarehome/CheckSection";
import PreviewSection from "../../features/petcare/components/petcarehome/PreviewSection";
import PetCareNav from "../../features/petcare/components/petcarehome/PetCareNav";

function PetCareMain() {
  // PreviewSection과 TopSection이 함께 사용할 선택된 펫
  const [selectedPet, setSelectedPet] = useState(null);

  return (
    <Wrapper>
      <PetCareNav />

      <TopSection selectedPet={selectedPet} />

      <BottomArea>
        <CheckSection />

        <PreviewSection
          selectedPet={selectedPet}
          onChangeSelectedPet={setSelectedPet}
        />
      </BottomArea>
    </Wrapper>
  );
}

export default PetCareMain;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;

  margin: 0 auto;

  box-sizing: border-box;
`;

const BottomArea = styled.div`
  width: 85%;

  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
  gap: 20px;

  margin: 0 auto;

  align-items: start;

  box-sizing: border-box;
`;