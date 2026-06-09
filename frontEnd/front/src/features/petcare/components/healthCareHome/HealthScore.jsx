import { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import useScore from "../../../karte/hooks/useScore";

const SCORE_CONFIG = [
  {
    min: 90,
    max: 100,
    message: "최상의 건강 상태예요!\n지금처럼 잘 유지해주세요.",
  },
  {
    min: 75,
    max: 89,
    message: "건강 상태가 아주 좋습니다!\n지금처럼 건강을 잘 관리해주세요.",
  },
  {
    min: 60,
    max: 74,
    message: "건강 상태가 양호해요.\n꾸준한 관리로 더 좋아질 수 있어요.",
  },
  {
    min: 40,
    max: 59,
    message: "건강 관리가 필요해요.\n정기적인 검진을 추천드려요.",
  },
  { min: 0, max: 39, message: "건강 상태를 주의 깊게\n살펴봐야 할 것 같아요." },
];

function getScoreMessage(score) {
  const config = SCORE_CONFIG.find(
    ({ min, max }) => score >= min && score <= max,
  );
  return config?.message ?? "";
}

const CIRCLE_RADIUS = 80;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;
const GAP_ANGLE = 60; // 하단 비어있는 각도(도)
const ARC_RATIO = (360 - GAP_ANGLE) / 360;

function getStrokeDashoffset(score) {
  const filled = (score / 100) * ARC_RATIO * CIRCLE_CIRCUMFERENCE;
  return CIRCLE_CIRCUMFERENCE - filled;
}

// 하단 갭을 위해 전체 원을 회전
const ROTATION = 90 + GAP_ANGLE / 2; // 시작점을 왼쪽 하단으로

const dashAnimate = (score) => keyframes`
  from { stroke-dashoffset: ${CIRCLE_CIRCUMFERENCE * ARC_RATIO + CIRCLE_CIRCUMFERENCE * (1 - ARC_RATIO)}; }
  to   { stroke-dashoffset: ${getStrokeDashoffset(score)}; }
`;

// ── Styled Components ──────────────────────────────────────────────

const Card = styled.div`
  width: 100%;
  height: 100vh;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #d9eddf;
  padding: 28px 32px 24px;
  min-width: 200px;
  gap: 16px;
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  }
`;

const GaugeWrapper = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
`;

const StyledSvg = styled.svg`
  transform: rotate(${ROTATION}deg);
`;

const TrackCircle = styled.circle`
  fill: none;
  stroke: #e8f5f0;
  stroke-width: 12;
  stroke-linecap: round;
  stroke-dasharray: ${CIRCLE_CIRCUMFERENCE * ARC_RATIO};
`;

const ProgressCircle = styled.circle`
  fill: none;
  stroke: #2db87a;
  stroke-width: 12;
  stroke-linecap: round;
  stroke-dasharray: ${CIRCLE_CIRCUMFERENCE};
  stroke-dashoffset: ${({ $score }) => getStrokeDashoffset($score)};
  animation: ${({ $score }) => dashAnimate($score)} 1s ease-out forwards;
  transition: stroke-dashoffset 0.6s ease;
`;

const ScoreTextBox = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
`;

const ScoreLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #2db87a;
  letter-spacing: 0.04em;
`;

const Divider = styled.div`
  width: 40px;
  height: 1px;
  background: #d0d0d0;
  margin: 2px 0;
`;

const ScoreNumber = styled.span`
  font-size: 52px;
  font-weight: 800;
  color: #1a1a1a;
  line-height: 1;
`;

const MessageBox = styled.div`
  text-align: center;
  line-height: 1.6;
`;

const PetName = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
`;

const MessageText = styled.p`
  font-size: 13px;
  color: #555;
  margin: 0;
  white-space: pre-line;
`;

const LoadingCircle = styled.circle`
  fill: none;
  stroke: #e8f5f0;
  stroke-width: 12;
`;

const EmptyText = styled.p`
  font-size: 18px;
  color: #aaa;
  margin: auto;
`;

// ── Component ─────────────────────────────────────────────────────

export default function HealthScore({ petId, petName }) {
  const { isLoading, data, asyncFetchScore } = useScore();

  useEffect(() => {
    asyncFetchScore(petId, "TOTAL");
  }, [petId]);

  const score = Number(data) || 0;
  const message = getScoreMessage(score);

  return (
    <Card>
      {score > 0 ? (
        <>
          <GaugeWrapper>
            <StyledSvg width="200" height="200" viewBox="0 0 200 200">
              {isLoading ? (
                <LoadingCircle cx="100" cy="100" r={CIRCLE_RADIUS} />
              ) : (
                <>
                  <TrackCircle cx="100" cy="100" r={CIRCLE_RADIUS} />
                  <ProgressCircle
                    cx="100"
                    cy="100"
                    r={CIRCLE_RADIUS}
                    $score={score}
                  />
                </>
              )}
            </StyledSvg>

            <ScoreTextBox>
              <ScoreLabel>건강 점수</ScoreLabel>
              <Divider />
              <ScoreNumber>{isLoading ? "–" : score}</ScoreNumber>
            </ScoreTextBox>
          </GaugeWrapper>

          {!isLoading && (
            <MessageBox>
              <MessageText>
                <PetName>{petName}</PetName>의 {message}
              </MessageText>
            </MessageBox>
          )}
        </>
      ) : (
        <EmptyText>검사를 진행해주세요</EmptyText>
      )}
    </Card>
  );
}
