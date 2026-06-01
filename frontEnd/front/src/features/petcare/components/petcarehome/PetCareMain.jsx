import styled from "styled-components";

import TopSection from "./TopSection";
import CheckSection from "./CheckSection";
import PreviewSection from "./PreviewSection";
import PetCareNav from "./PetCareNav";
function PetCareMain() {
  return (
    <Wrapper>
      <PetCareNav />
      <TopSection />

      <BottomArea>
        <CheckSection />
        <PreviewSection />
      </BottomArea>
    </Wrapper>
  );
}

export default PetCareMain;

const Wrapper = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;

  margin: 0 auto;

  box-sizing: border-box;
`;

const BottomArea = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) minmax(420px, 1fr);
  gap: 14px;
  padding: 5px;

  align-items: stretch;
`;
