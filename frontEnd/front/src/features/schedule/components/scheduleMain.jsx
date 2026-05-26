import styled from "styled-components";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import useScheduleList from "../hooks/useScheduleList";
import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import ScheduleModal from "./scheduleModal";
import useScheduleDetail from "../hooks/useScheduleDetail";

export default function ScheduleMain() {
  const initialState = {
    id: "",
    title: "",
    content: "",
    at: "",
    startDate: "",
    endDate: "",
    hour: "",
    minute: "",
    backgroundColor: "#5EC8A7",
  };
  // 켈린더 이벤트 호출
  const {
    list,
    isLoading: isListLoading,
    asyncFetchScheduleList,
  } = useScheduleList();
  const {
    detail,
    isLoading: isDetailLoading,
    asyncFetchSchedule,
  } = useScheduleDetail();

  // 상세 조회용 모달 오픈 여부
  const [detailOpen, setDetailOpen] = useState(false);

  // 선택된 일정의 정보를 담을 객체
  const [selectedEvent, setSelectedEvent] = useState(initialState);

  useEffect(() => {
    asyncFetchScheduleList();
  }, [detailOpen]);

  //날짜 숫자만 표시
  const renderDayCell = (info) => {
    return (
      <div className="mini-day-number">
        {info.dayNumberText.replace("일", "")}
      </div>
    );
  };

  //일정 정보바
  const renderEventContent = (info) => {
    if (info.event.extendedProps?.type === "training") {
      console.log(info);

      return <div className="training-stamp"></div>;
    }
    return <></>;
  };

  const onEventClick = (info) => {
    // FullCalendar의 이벤트 객체에서 데이터 추출

    if (info.event) {
      asyncFetchSchedule(info.event.id);
      setSelectedEvent(detail);
    } else {
      setSelectedEvent({
        ...initialState,
        id: "",
        startDate: info.startStr,
        endDate: info.endStr,
      });
    }

    setDetailOpen(true); // 상세 조회 모달 열기
  };

  return (
    <Wrapper>
      {isListLoading ? (
        <p>불러오는 중...</p>
      ) : (
        <>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="ko"
            height={500}
            events={list}
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
            selectable={true}
            select={onEventClick}
            dayCellContent={renderDayCell} // 날짜 커스텀
            // eventContent={renderEventContent} // 이벤트 커스텀
            eventClick={onEventClick}
            // contentHeight={280}
            // fixedWeekCount={false} // 해당 월의 주차만큼만 표시
          />
          <ScheduleModal
            open={detailOpen}
            onClose={() => setDetailOpen(false)}
            data={selectedEvent}
            isLoading={isDetailLoading}
          />
        </>
      )}
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
