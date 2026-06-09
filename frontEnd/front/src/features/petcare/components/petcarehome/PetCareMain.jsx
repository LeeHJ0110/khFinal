import { useState } from "react";
import styled from "styled-components";

import TopSection from "./TopSection";
import CheckSection from "./CheckSection";
import PreviewSection from "./PreviewSection";
import PetCareNav from "./PetCareNav";

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
  width: 83%;

  display: grid;
  grid-template-columns: minmax(0, 1.8fr) minmax(0, 1fr);
  gap: 24px;

  margin: 0 auto;
  padding: 20px 5px;

  align-items: start;

  box-sizing: border-box;
`;
