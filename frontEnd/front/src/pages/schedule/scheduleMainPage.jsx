import styled from "styled-components";
import ScheduleMain from "../../features/schedule/components/ScheduleMain";
import TrainingDiaryModal from "../../features/schedule/components/TrainingDiaryModal";
import useTraining from "../../features/schedule/hooks/useTraining";
import { useState } from "react";
import ScheduleModal from "../../features/schedule/components/scheduleModal";

export default function ScheduleMainPage() {
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalType, setModalType] = useState(null);

  const handleOpenModal = ({ type, data }) => {
    setModalType(type);
    setSelectedEvent(data);
    setDetailOpen(true);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedEvent(null);
    setDetailOpen(false);
  };

  return (
    <Wrapper>
      <button>훈련일기작성</button>
      <ScheduleMain onOpenModal={handleOpenModal} detailOpen={detailOpen} />
      {modalType === "schedule" && (
        <ScheduleModal
          open={detailOpen}
          onClose={handleCloseModal}
          data={selectedEvent}
        />
      )}
      {modalType === "training" && (
        <TrainingDiaryModal
          open={detailOpen}
          onClose={handleCloseModal}
          data={selectedEvent}
        />
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div``;
