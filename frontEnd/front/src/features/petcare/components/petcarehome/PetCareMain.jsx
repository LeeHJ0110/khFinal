import styled from "styled-components";

import TopSection from "./TopSection";
import CheckSection from "./CheckSection";
import PreviewSection from "./PreviewSection";

function PetCareMain() {
  return (
    <Wrapper>
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
  width: 98%;

  display: flex;
  flex-direction: column;
  gap: 10px;

  margin: 0 auto;
  padding: 10px 24px 12px;

  box-sizing: border-box;
`;

const BottomArea = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(420px, 1fr);
  gap: 14px;

  align-items: stretch;
`;