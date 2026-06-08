import styled from "styled-components";
import pawPrint from "../../petcare/img/pawprint 18.png";

export default function ScheduleCard({ isTraining, onButtonClick }) {
  return (
    <Wrapper>
      {/* {isTraining && badgeDays && (
        <Badge>
          <BadgeHighlight>{badgeDays}일</BadgeHighlight> 연속 작성!
        </Badge>
      )} */}

      <Inner>
        <Left>
          <Thumbnail src={pawPrint} alt={isTraining ? pawPrint : pawPrint} />
          <Description>
            {isTraining
              ? "하루하루 건강하게 운동한 기록을 남겨보세요"
              : "일정은 달력에 숫자를 길게 눌러 범위지정을 할 수 있습니다"}
          </Description>
        </Left>

        <ActionButton onClick={onButtonClick}>
          {isTraining ? "훈련일기 작성" : "일정 작성"}
        </ActionButton>
      </Inner>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  background: #f0f8f4;
  border-radius: 16px;
  padding: 20px 24px;
  width: 100%;
  box-sizing: border-box;
`;

const Badge = styled.div`
  position: absolute;
  top: 14px;
  right: 16px;
  font-size: 13px;
  color: #555;
`;

const BadgeHighlight = styled.span`
  color: #f5a623;
  font-weight: 700;
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Thumbnail = styled.img`
  width: 64px;
  height: 64px;
  object-fit: contain;
  flex-shrink: 0;
`;

const Description = styled.p`
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.4;
`;

const ActionButton = styled.button`
  flex-shrink: 0;
  background: #5ec8a7;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #4ab896;
  }
`;
