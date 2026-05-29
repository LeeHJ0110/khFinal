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
    isEdit: "false",
  };
  // 켈린더 이벤트 호출
  const { list, isLoading, asyncFetchScheduleList } = useScheduleList();

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
    return (
      <>
        <div
          className="mini-event-bar"
          style={{
            backgroundColor: info.event.backgroundColor || "#3788d8",
            height: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: "8px",
              fontWeight: "bolder",
              lineHeight: "1",
              whiteSpace: "nowrap", // 줄바꿈 방지
              pointerEvents: "none", // 클릭 이벤트 방해 방지
              textOverflow: "ellipsis",
            }}
          >
            {info.event.title}
          </span>
        </div>
      </>
    );
  };

  const onEventClick = (info) => {
    // FullCalendar의 이벤트 객체에서 데이터 추출

    if (info.event) {
      setSelectedEvent({
        ...initialState,
        id: info.event.id,
        title: info.event.title,

        startDate: info.event.startStr,
        endDate: info.event.endStr,

        backgroundColor: info.event.backgroundColor,

        content: info.event.extendedProps?.content,
        at: info.event.extendedProps?.at,
        isEdit: true,
      });
    } else {
      setSelectedEvent({
        ...initialState,
        id: "",
        startDate: info.startStr,
        endDate: info.endStr,
        isEdit: false,
      });
    }

    setDetailOpen(true); // 상세 조회 모달 열기
  };

  return (
    <Wrapper>
      {isLoading ? (
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
            eventContent={renderEventContent} // 이벤트 커스텀
            eventClick={onEventClick}
            // contentHeight={280}
            // fixedWeekCount={false} // 해당 월의 주차만큼만 표시
          />
          <ScheduleModal
            open={detailOpen}
            onClose={() => setDetailOpen(false)}
            data={selectedEvent}
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
