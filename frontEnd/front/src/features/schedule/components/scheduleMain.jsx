import styled from "styled-components";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import useScheduleList from "../hooks/useScheduleList";
import { useEffect } from "react";
import FullCalendar from "@fullcalendar/react";

export default function ScheduleMain() {
  const { list, isLoading, asyncFetchScheduleList } = useScheduleList();
  useEffect(() => {
    asyncFetchScheduleList();
  }, []);

  console.log(list);

  return (
    <Wrapper>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="ko"
        height={500}
        // events={events}
        // 헤더 최소화
        headerToolbar={{
          left: "prev",
          center: "title",
          right: "next",
        }}
        dayMaxEvents={2} // TODO 큰버전은 5개 까지
        moreLinkContent={(args) => {
          return `+${args.num}`;
        }}
        // dayCellContent={renderDayCell} // 날짜 커스텀
        // eventContent={renderEventContent} // 이벤트 커스텀
        // eventClick={onEventClick}
        // contentHeight={280}
        // fixedWeekCount={false} // 해당 월의 주차만큼만 표시
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 300px;
  .fc-daygrid-day-number {
    width: 32px;
    height: 32px;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 0 !important;

    font-size: 14px;
    font-weight: 500;
    color: #222;

    transition: 0.2s;
  }
`;
