import styled from "styled-components";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import useScheduleList from "../hooks/useScheduleList";
import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import useTrainingList from "../hooks/useTrainingList";
import pawPrint from "../../petcare/img/pawprint 18.png";
import { useNavigate } from "react-router-dom";

const LONG_PRESS_DURATION = 500;

export default function ScheduleMain({ onOpenModal, detailOpen, small }) {
  const navigate = useNavigate();

  const scheduleInit = {
    id: "",
    title: "",
    content: "",
    at: "00:00",
    startDate: "",
    endDate: "",
    backgroundColor: "#5EC8A7",
    isEdit: false,
  };

  const trainingInit = {
    id: "",
    content: "",
    trainingTime: "",
    createdAt: "",
    trainingPetList: [],
    isEdit: true,
  };

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

  useEffect(() => {
    asyncFetchScheduleList();
    fetchDiaryList();
  }, [detailOpen]);

  // ── Long Press 상태 ───────────────────────────────────────────────
  const longPressTimer = useRef(null);
  const isLongPress = useRef(false);
  const [isLongPressing, setIsLongPressing] = useState(false);

  const getDateStr = (date) => date.toLocaleDateString("sv-SE");

  const handleCellMouseDown = () => {
    isLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      setIsLongPressing(true);
    }, LONG_PRESS_DURATION);
  };

  const handleCellMouseUp = () => {
    clearTimeout(longPressTimer.current);
    setIsLongPressing(false);
  };

  const handleCellMouseLeave = () => {
    if (!isLongPress.current) {
      clearTimeout(longPressTimer.current);
      setIsLongPressing(false);
    }
  };

  // FullCalendar select: long press일 때만 생성 모달 오픈
  const onSelect = (info) => {
    if (!isLongPress.current) return;
    isLongPress.current = false;
    setIsLongPressing(false);
    onOpenModal({
      type: "schedule",
      data: {
        ...scheduleInit,
        startDate: info.startStr,
        endDate: info.endStr,
      },
    });
  };

  // ── dayCellContent ─────────────────────────────────────────────────
  const renderDayCell = (info) => {
    const localDateStr = getDateStr(info.date);

    const trainingData = trainingList.find((item) => {
      return getDateStr(new Date(item.start)) === localDateStr;
    });
    const hasTraining = !!trainingData;

    const handleTrainingClick = (e) => {
      if (isLongPress.current) return; // long press 중이면 무시
      e.stopPropagation();
      onOpenModal({
        type: "training",
        data: {
          ...trainingInit,
          id: trainingData.id,
          content: trainingData.extendedProps?.content,
          trainingTime: trainingData.extendedProps?.trainingTime,
          createdAt: trainingData.extendedProps?.createdAt,
          trainingPetList: trainingData.extendedProps?.trainingPetList,
        },
      });
    };

    return (
      <CellWrapper
        $isLongPressing={isLongPressing}
        $hasTraining={hasTraining}
        onMouseDown={handleCellMouseDown}
        onMouseUp={handleCellMouseUp}
        onMouseLeave={handleCellMouseLeave}
        onClick={hasTraining ? handleTrainingClick : undefined}
      >
        {hasTraining && <Stamp src={pawPrint} alt="stamp" />}
        <span
          style={{
            position: "absolute",
            zIndex: 2,
            fontWeight: "bold",
            fontSize: "14px",
            color: "#222",
            pointerEvents: "none",
          }}
        >
          {info.dayNumberText.replace("일", "")}
        </span>
      </CellWrapper>
    );
  };

  // ── eventContent ───────────────────────────────────────────────────
  const renderEventContent = (info) => {
    return (
      <div
        style={{
          backgroundColor: info.event.backgroundColor || "#3788d8",
          height: small ? "8px" : "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <span
            style={{
              width: "100%",
              fontSize: small ? "8px" : "15px",
              padding: "3px",
              fontWeight: "bolder",
              lineHeight: "1",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            {info.event.title}
          </span>
        </div>
      </div>
    );
  };

  // ── eventClick (일반 일정 조회) ────────────────────────────────────
  const onEventClick = (info) => {
    onOpenModal({
      type: "schedule",
      data: {
        ...scheduleInit,
        id: info.event.id,
        title: info.event.title,
        content: info.event.extendedProps?.content,
        at: info.event.extendedProps?.at,
        startDate: info.event?.startStr,
        endDate: info.event?.endStr || info.event?.startStr,
        backgroundColor: info.event.backgroundColor,
        isEdit: true,
      },
    });
  };

  const handleCalendarBodyClick = (e) => {
    if (!small) return;

    if (isLongPress.current) return;

    if (e.target.closest(".fc-more-link")) return;

    if (
      e.target.closest(".fc-col-header") ||
      e.target.closest(".fc-daygrid-body")
    ) {
      navigate("/healthCare/schedule");
    }
  };

  return (
    <Wrapper $small={small}>
      {sLoading || tLoading ? (
        <p>불러오는 중...</p>
      ) : (
        <div onClick={handleCalendarBodyClick}>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="ko"
            height={small ? 480 : 780}
            events={scheduleList}
            headerToolbar={{
              left: "prev",
              center: "title",
              right: "next",
            }}
            dayMaxEvents={small ? 2 : 5}
            moreLinkContent={(args) => `+${args.num}`}
            selectable={true}
            select={onSelect}
            dayCellContent={renderDayCell}
            eventContent={renderEventContent}
            eventClick={onEventClick}
          />
        </div>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: ${({ $small }) => ($small ? "100%" : "1100px")};

  .fc-scroller,
  .fc-scroller-liquid-absolute {
    overflow: hidden !important;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none !important;
    }
  }

  .fc .fc-scrollgrid-sync-table {
    table-layout: fixed !important;
    width: 100% !important;
  }

  .fc-daygrid-day-frame {
    height: 100% !important;
    min-height: 0 !important;
    display: block !important;
    position: relative;
  }

  .fc-daygrid-day-top {
    padding: 2px 0 !important;
  }

  .fc-daygrid-day-events {
    padding: 2px !important;
  }
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

  .fc-daygrid-bg-harness {
    max-height: 180px;
  }

  .fc-view-harness {
    cursor: ${({ $small }) => ($small ? "pointer" : "default")};
  }

  /* 이전 / 다음 버튼 */
  .fc .fc-button {
    background: transparent !important;
    border: none !important;
    color: #444 !important;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;

    transition:
      transform 0.2s ease-in-out,
      box-shadow 0.2s ease-in-out !important;

    &:hover {
      transform: scale(1.04);
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.15) !important;
      z-index: 5 !important;
    }
  }

  .fc-v-event,
  .fc-h-event {
    transition:
      transform 0.2s ease-in-out,
      box-shadow 0.2s ease-in-out !important;

    &:hover {
      transform: scale(1.04);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
      z-index: 5 !important;
    }
  }
`;

const Stamp = styled.img`
  position: absolute;
  width: 28px;
  height: 28px;
  opacity: 0.4;
  z-index: 1;
  pointer-events: none;
  cursor: pointer;
  transition:
    transform 0.2s ease-in-out,
    opacity 0.2s ease-in-out;
`;

const CellWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ $isLongPressing, $hasTraining }) =>
    $isLongPressing ? "copy" : $hasTraining ? "pointer" : "default"};
  user-select: none;

  &:hover ${Stamp} {
    transform: scale(1.25);
    opacity: 0.85;
    border: 1px solid var(--color-mint);
    border-radius: 5px;
  }
`;
