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
  height: 100%;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  box-sizing: border-box;
`;

const BottomArea = styled.div`
  width: 85%;

  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;

  margin: 0 auto;
  padding: 20px 5px 20px;

  align-items: start;

  box-sizing: border-box;
`;
