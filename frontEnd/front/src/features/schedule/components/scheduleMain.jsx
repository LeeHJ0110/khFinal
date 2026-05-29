import styled from "styled-components";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import useScheduleList from "../hooks/useScheduleList";
import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import ScheduleModal from "./scheduleModal";
import useScheduleDetail from "../hooks/useScheduleDetail";
import useTrainingList from "../hooks/useTrainingList";
import TrainingDiaryModal from "./TrainingDiaryModal";

export default function ScheduleMain({ onOpenModal, detailOpen }) {
  const scheduleInit = {
    id: "",
    title: "",
    content: "",
    at: "",
    startDate: "",
    endDate: "",
    backgroundColor: "#5EC8A7",
    isEdit: false,
  };
  const trainingInit = {
    id: "",
    content: "",
    trainingTime: "",
    petList: [],
    isEdit: false,
  };

  // 켈린더 이벤트 호출
  const {
    scheduleList,
    isLoading: sLoading,
    asyncFetchScheduleList,
  } = useScheduleList();
  const {
    trainingList,
    isLoading: tLoading,
    fetchDiaryList,
  } = useTrainingList();

  // 상세 조회용 모달 오픈 여부

  useEffect(() => {
    asyncFetchScheduleList();
    fetchDiaryList();
  }, [detailOpen]);

  const mergedEvents = [...scheduleList, ...trainingList];

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
      return <div className="training-stamp">훈련</div>;
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
    if (!info.event) {
      onOpenModal({
        type: "schedule",
        data: {
          ...scheduleInit,
          startDate: info.startStr,
          endDate: info.endStr,
        },
      });
    } else {
      if (info.event.extendedProps?.type === "training") {
        onOpenModal({
          ...trainingInit,
          type: "training",
          data: {
            id: info.event.id,
            content: info.event.extendedProps?.content,
            trainingTime: info.event.extendedProps?.trainingTime,
          },
        });
      } else {
        console.log(info);

        onOpenModal({
          type: "schedule",
          data: {
            ...scheduleInit,
            id: info.event.id,
            title: info.event.title,
            content: info.event.extendedProps?.content,
            at: info.event.extendedProps?.at,
            startDate: info.event.startStr,
            endDate: info.event.endStr,
            isEdit: true,
          },
        });
      }
    }
  };

  return (
    <Wrapper>
      {sLoading || tLoading ? (
        <p>불러오는 중...</p>
      ) : (
        <>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="ko"
            height={500}
            events={mergedEvents}
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
