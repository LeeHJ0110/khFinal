import styled from "styled-components";
import ScheduleMain from "../../features/schedule/components/ScheduleMain";
import TrainingDiaryModal from "../../features/schedule/components/TrainingDiaryModal";
import useTraining from "../../features/schedule/hooks/useTraining";
import { useEffect, useState } from "react";
import ScheduleModal from "../../features/schedule/components/scheduleModal";
import useFormData from "../../shared/hooks/useFormData";
import ScheduleCard from "../../features/schedule/components/ScheduleCard";

export default function ScheduleMainPage() {
  const trainingInit = {
    id: "",
    content: "",
    trainingTime: "00:00",
    createdAt: "",
    trainingPetList: [],
    isEdit: false,
  };
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
  const { checkToday, isSuccess, isDuple } = useTraining();
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalType, setModalType] = useState(null);

  const today = new Date().toLocaleDateString("sv-SE");

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
      <CenterContainer>
        <VerticalDiv>
          <ScheduleCard
            onButtonClick={() => {
              handleOpenModal({
                type: "schedule",
                data: { ...scheduleInit, startDate: today, endDate: today },
              });
            }}
          />
          <ScheduleCard isTraining={true} onButtonClick={handleTraininClick} />
        </VerticalDiv>
      </CenterContainer>
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

const Wrapper = styled.main`
  width: 100%;
  max-width: 1800px;
  margin: 0 auto;
  padding: 20px;
  display: flex; // 추가
  flex-direction: column; // 추가
  align-items: center; // 추가 - 자식 요소 가운데 정렬
`;

const CenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: fit-content; // 캘린더 너비에 맞게 자동 조절
`;

const VerticalDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-bottom: 20px;
`;
