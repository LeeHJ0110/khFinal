import styled from "styled-components";
import TopSection from "./TopSection";
import CheckSection from "./CheckSection";
import GuideSection from "./GuideSection";
import PreviewSection from "./PreviewSection";

function PetCareMain() {
  return (
    <Wrapper>
      <TopSection />

      <PointText>포인트 사용 : 2,000 P</PointText>

      <BottomArea>
        <CheckSection />
        <GuideSection />
        <PreviewSection />
      </BottomArea>
    </Wrapper>
  );
}

export default PetCareMain;

const Wrapper = styled.div`
  width: 80%;
  margin: 0 auto;

  padding: 24px 48px 60px;

  box-sizing: border-box;
`;
const PointText = styled.p`
  text-align: center;
  margin: 10px 0 24px;
  color: #555;
  font-size: 14px;
`;

const BottomArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.35fr 0.9fr;
  gap: 32px;
  align-items: start;
`;
