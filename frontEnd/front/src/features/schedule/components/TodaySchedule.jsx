import { useEffect, useState } from "react";
import styled from "styled-components";
import useScheduleToday from "../hooks/useScheduleToday";

function formatDate(dateString) {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-");

  return `${Number(month)}월 ${Number(day)}일`;
}

export default function TodaySchedule(open) {
  const { isLoading, todayList, asyncFecthScheduleToday } = useScheduleToday();
  const [openId, setOpenId] = useState(null);
  useEffect(() => {
    asyncFecthScheduleToday();
  }, [open]);

  return (
    <ScheduleListWrapper>
      {isLoading ? (
        <>로딩중</>
      ) : (
        todayList.map((item, idx) => (
          <TodayCard
            key={item.id}
            $color={`#${item.backgroundColor}`}
            onClick={() => setOpenId(openId === item.id ? null : item.id)}
          >
            <TopRow>
              <Title>{item.title}</Title>

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
          </TodayCard>
        ))
      )}
    </ScheduleListWrapper>
  );
}

const ScheduleListWrapper = styled.div`
  max-height: 100%;
  overflow-y: auto;
  padding: 4px;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 4px;
  }
`;

const TodayCard = styled.div`
  background-color: ${({ $color }) => $color || "#5ec8a7"};

  padding: 16px 18px;
  margin-bottom: 12px;
  border-radius: 12px;

  color: white;

  transition: all 0.25s ease;
  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    transform: scale(1.02);
    cursor: pointer;
  }
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 12px;
  min-width: 0;
`;

const Title = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  flex: 1;
  min-width: 0;

  font-size: 18px;
  font-weight: 700;

  margin-right: 12px;
`;

const TimeBadge = styled.div`
  background: rgba(255, 255, 255, 0.9);
  color: #222;

  padding: 8px 18px;
  border-radius: 12px;

  font-size: 16px;
  font-weight: 500;
`;

const DateText = styled.div`
  font-size: 15px;
  font-weight: 500;
`;

const ContentBox = styled.div`
  width: 310px;
  margin-top: 14px;
  padding-top: 14px;
  text-overflow: ellipsis;

  border-top: 1px solid rgba(255, 255, 255, 0.3);

  font-size: 14px;
  line-height: 1.6;

  white-space: pre-wrap;
  word-break: break-word;

  color: rgba(255, 255, 255, 0.95);

  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
