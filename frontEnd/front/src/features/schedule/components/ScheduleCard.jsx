import styled from "styled-components";
import pawPrint from "../../petcare/img/pawprint 18.png";

export default function ScheduleCard({ isTraining, onButtonClick, badgeDays }) {
  return (
    <Wrapper $isTraining={isTraining}>
      {isTraining && badgeDays && (
        <Badge>
          🔥 <BadgeHighlight>{badgeDays}일</BadgeHighlight> 연속!
        </Badge>
      )}

      <Inner>
        <Left>
          {/* 1148px 공간감을 고려하여 서클 크기를 아주 미세하게 볼륨업 (44px -> 46px) */}
          <IconCircle $isTraining={isTraining}>
            <Thumbnail src={pawPrint} alt={isTraining ? "훈련일기" : "일정"} />
          </IconCircle>

          <Description>
            {isTraining
              ? "소중한 반려동물의 오늘 운동 기록 남기기"
              : "달력의 날짜를 길게 눌러 범위를 지정해 보세요"}
          </Description>
        </Left>

        <ActionButton $isTraining={isTraining} onClick={onButtonClick}>
          {isTraining ? "훈련일기 작성" : "일정 작성"}
        </ActionButton>
      </Inner>
    </Wrapper>
  );
}

// ==========================================
// 1148px 부모 그리드 스케일에 맞춘 카드 디테일
// ==========================================
const Wrapper = styled.div`
  position: relative;
  background: ${({ $isTraining }) => ($isTraining ? "#f0fdf4" : "#f8fafc")};
  border: 1.5px solid
    ${({ $isTraining }) => ($isTraining ? "#bbf7d0" : "#e2e8f0")};
  border-radius: 16px;

  /* 💡 늘어난 가로 청크 폭에 맞춰 내부 패딩 밸런스를 24px로 시원하게 정돈 */
  padding: 22px 24px;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
    border-color: ${({ $isTraining }) => ($isTraining ? "#86efac" : "#cbd5e1")};
  }
`;

const Badge = styled.div`
  position: absolute;
  top: -10px;
  right: 20px;
  font-size: 11px;
  font-weight: 700;
  color: #166534;
  background: #dcfce7;
  padding: 3px 8px;
  border-radius: 20px;
  border: 1px solid #bbf7d0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const BadgeHighlight = styled.span`
  color: #15803d;
  font-weight: 800;
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px; /* 💡 가로가 넓어진 만큼 요소 간의 간격도 여유 있게 벌려 가독성 확보 */
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 16px; /* 아이콘과 안내 문구 사이 간격 조정 */
  flex: 1;
  min-width: 0;
`;

const IconCircle = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: ${({ $isTraining }) =>
    $isTraining ? "rgba(94, 200, 167, 0.15)" : "rgba(148, 163, 184, 0.15)"};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const Thumbnail = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
`;

const Description = styled.p`
  /* 💡 카드가 좌우로 넓어져 글자가 한눈에 들어오므로 가독성이 한층 높아진 14.5px 세팅 */
  font-size: 14.5px;
  font-weight: 700;
  color: #334155;
  margin: 0;
  line-height: 1.5;
  letter-spacing: -0.3px;

  white-space: normal;
  word-break: keep-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ActionButton = styled.button`
  flex-shrink: 0;
  background: ${({ $isTraining }) => ($isTraining ? "#5ec8a7" : "#475569")};
  color: #ffffff;
  border: none;
  border-radius: 12px;

  /* 💡 전체 가로 비율에 맞춰 버튼의 가로 볼륨감을 살짝 늘림 (padding 좌우 18px -> 24px) */
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.2px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.15s ease-in-out;

  &:hover {
    background: ${({ $isTraining }) => ($isTraining ? "#4ab896" : "#334155")};
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
`;
