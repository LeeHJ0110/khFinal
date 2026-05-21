import styled from "styled-components";
import useScheduleList from "../hooks/useScheduleList";
import { useEffect } from "react";

export default function ScheduleMain() {
  const { list, isLoading, asyncFetchScheduleList } = useScheduleList();
  useEffect(() => {
    asyncFetchScheduleList();
  }, []);

  console.log(list);

  return (
    <Box sx={{ width: "500px", p: 1 }}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: "20px",
          border: "1px solid #f0f0f0",
          boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
        }}
      >
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="ko"
          height={500}
          events={events}
          // 헤더 최소화
          headerToolbar={{
            left: "prev",
            center: "title",
            right: "next",
          }}
          // 핵심 설정들
          dayMaxEvents={2} // 2개 넘으면 +N 표시
          moreLinkContent={(args) => {
            return `+${args.num}`;
          }}
          dayCellContent={renderDayCell} // 날짜 커스텀
          eventContent={renderEventContent} // 이벤트 커스텀
          eventClick={onEventClick}
          contentHeight={280}
          fixedWeekCount={false} // 해당 월의 주차만큼만 표시
        />
      </Paper>
    </Box>
  );
}

const Wrapper = styled.div``;
