import { useEffect, useState } from "react";
import styled from "styled-components";
import useScheduleToday from "../hooks/useScheduleToday";

function formatDate(dateString) {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-");

  return `${Number(month)}월 ${Number(day)}일`;
}

export default function TodaySchedule({ open }) {
  const { isLoading, todayList, asyncFecthScheduleToday } = useScheduleToday();
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    asyncFecthScheduleToday();
  }, [open]);

  return (
    <ScheduleListWrapper>
      {isLoading ? (
        <LoadingBox>로딩 중...</LoadingBox>
      ) : todayList.length > 0 ? (
        todayList.map((item) => (
          <TodayCard
            key={item.id}
            $color={
              item.backgroundColor ? `#${item.backgroundColor}` : "#5ec8a7"
            }
            onClick={() => setOpenId(openId === item.id ? null : item.id)}
          >
            <ColorIndicator
              $color={
                item.backgroundColor ? `#${item.backgroundColor}` : "#5ec8a7"
              }
            />

            <CardContent>
              <TopRow>
                {/* 💡 긴 제목 말줄임표 처리 대상 */}
                <Title title={item.title}>{item.title}</Title>
                {item.at !== "00:00" && <TimeBadge>{item.at}</TimeBadge>}
              </TopRow>

              <DateText>
                {formatDate(item.startDate)} ~ {formatDate(item.endDate)}
              </DateText>

              {openId === item.id && (
                <ContentBox>
                  {item.content || "등록된 내용이 없습니다."}
                </ContentBox>
              )}
            </CardContent>
          </TodayCard>
        ))
      ) : (
        <EmptyCard>
          <EmptyIcon>📅</EmptyIcon>
          <EmptyText>오늘 일정이 없습니다</EmptyText>
        </EmptyCard>
      )}
    </ScheduleListWrapper>
  );
}

const ScheduleListWrapper = styled.div`
  max-height: 100%;
  overflow-y: auto;
  padding: 8px 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 4px;
  }
`;

const TodayCard = styled.div`
  position: relative;
  background-color: #ffffff;
  border-radius: 16px;
  margin-bottom: 14px;
  display: flex;
  overflow: hidden;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.03);
  border: 1.5px solid #f1f5f9;
  transition: all 0.24s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  user-select: none;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    transform: translateY(-2px);
    border-color: #e2e8f0;
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.08),
      0 4px 6px -2px rgba(0, 0, 0, 0.04);
  }
`;

const ColorIndicator = styled.div`
  width: 6px;
  background-color: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const CardContent = styled.div`
  flex: 1;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  min-width: 0; /* 💡 부모가 쪼그라들 때 자식의 너비 한계를 해제하여 말줄임표가 발동되도록 보장 */
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  min-width: 0; /* 💡 중요: Flex 자식 안에서 말줄임표가 먹히기 위한 필수 인프라 */
`;

const Title = styled.h3`
  margin: 0;
  display: block; /* 💡 확실한 너비 한계 인식을 위해 블록 지정 */
  white-space: nowrap; /* 💡 글자 줄바꿈 금지 */
  overflow: hidden; /* 💡 넘치는 부분 숨김 */
  text-overflow: ellipsis; /* 💡 핵심: 길면 ... 으로 처리 */
  flex: 1;
  min-width: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.3px;
  margin-right: 12px;
`;

const TimeBadge = styled.div`
  background: #f1f5f9;
  color: #475569;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0; /* 💡 제목이 아무리 길어져도 타임 배지가 찌그러지지 않도록 방어 */
`;

const DateText = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #94a3b8;
`;

const ContentBox = styled.div`
  width: 100%;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px dashed #e2e8f0;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  color: #475569;
  animation: slideDown 0.2s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const LoadingBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  font-size: 14px;
  font-weight: 600;
  color: #94a3b8;
`;

const EmptyCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #f8fafc;
  width: 100%;
  min-height: 180px;
  border-radius: 16px;
  border: 2px dashed #e2e8f0;
  padding: 24px;
  box-sizing: border-box;
`;

const EmptyIcon = styled.div`
  font-size: 28px;
  margin-bottom: 8px;
  opacity: 0.7;
`;

const EmptyText = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #94a3b8;
`;
