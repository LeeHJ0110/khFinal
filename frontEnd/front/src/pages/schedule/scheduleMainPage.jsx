import styled from "styled-components";
import ScheduleMain from "../../features/schedule/components/ScheduleMain";
import TrainingDiaryModal from "../../features/schedule/components/TrainingDiaryModal";
import useTraining from "../../features/schedule/hooks/useTraining";
import { useEffect, useState } from "react";
import ScheduleModal from "../../features/schedule/components/scheduleModal";
import useFormData from "../../shared/hooks/useFormData";

export default function ScheduleMainPage() {
  const trainingInit = {
    id: "",
    content: "",
    trainingTime: "00:00",
    createdAt: "",
    trainingPetList: [],
    isEdit: false,
  };
  const { checkToday, isSuccess, isDuple } = useTraining();
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

  useEffect(() => {
    if (isDuple) {
      handleOpenModal({ type: "training", data: trainingInit });
    }
  }, [isDuple]);

  function handleTraininClick() {
    checkToday();
  }

  return (
    <Wrapper>
      <button onClick={handleTraininClick}>훈련일기작성</button>
      <ScheduleMain onOpenModal={handleOpenModal} detailOpen={detailOpen} />
      <ScheduleMain
        onOpenModal={handleOpenModal}
        detailOpen={detailOpen}
        small={true}
      />
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
