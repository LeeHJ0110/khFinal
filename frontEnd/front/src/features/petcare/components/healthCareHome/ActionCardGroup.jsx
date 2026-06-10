import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import glassImg from "../../img/magnifying-glass 1.png";
import pawprint from "../../img/pawprint 18.png";

const CARDS = [
  {
    id: "diagnosis-request",
    title: "진단 신청하기",
    description: "전문 수의사에게\n글과 사진으로 건강상태를\n질문해 보세요",
    src: glassImg,
    path: "/healthCare/requesthome",
  },
  {
    id: "diagnosis-result",
    title: "진단 결과 확인",
    description:
      "수의사가 작성한 진단 결과를\n확인해 건강상태를\n확인해 보세요",
    src: pawprint,
    path: "/healthCare/result",
  },
];

// ── Styled Components ──────────────────────────────────────────────

const Card = styled.div`
  display: flex;
  align-items: center;
  width: 340px;
  height: 150px;
  background: #ffffff;
  border: 1px solid #d9eddf;

  border-radius: 16px;
  padding: 0 20px;
  gap: 16px;
  box-sizing: border-box;

  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  }
`;

const Thumbnail = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #f0faf5;
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    padding: 10px;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const TextBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Title = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
`;

const Description = styled.p`
  font-size: 12px;
  color: #888;
  line-height: 1.6;
  margin: 0;
  white-space: pre-line;
`;

const ArrowButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #2db87a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #25a06a;
  }
`;

const FlexColum = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

// ── Sub Component ──────────────────────────────────────────────────

function ActionCard({ title, description, src, path }) {
  const navigate = useNavigate();

  return (
    <Card>
      <Thumbnail>
        <img src={src} />
      </Thumbnail>

      <TextBox>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </TextBox>

      <ArrowButton onClick={() => navigate(path)}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </ArrowButton>
    </Card>
  );
}

// ── Main Component ─────────────────────────────────────────────────

export default function ActionCardGroup() {
  return (
    <FlexColum>
      {CARDS.map((card) => (
        <ActionCard key={card.id} {...card} />
      ))}
    </FlexColum>
  );
}
