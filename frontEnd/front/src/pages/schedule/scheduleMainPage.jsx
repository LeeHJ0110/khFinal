import styled from "styled-components";
import ScheduleMain from "../../features/schedule/components/scheduleMain";
import TrainingDiaryModal from "../../features/schedule/components/TrainingDiaryModal";
import useTraining from "../../features/schedule/hooks/useTraining";
import { useEffect, useState } from "react";
import ScheduleModal from "../../features/schedule/components/scheduleModal";
import useFormData from "../../shared/hooks/useFormData";
import ScheduleCard from "../../features/schedule/components/ScheduleCard";
import TodaySchedule from "../../features/schedule/components/TodaySchedule";
import PetCareNav from "../../features/petcare/components/petcarehome/PetCareNav";

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
    <>
      <PetCareNav />
      <Wrapper>
        <VerticalDiv>
          <TodayCard>
            <CardTitle>오늘 일정</CardTitle>
            <hr />
            <TodaySchedule open={detailOpen} />
          </TodayCard>
          <div>
            <VerticalDiv>
              <ScheduleCard
                onButtonClick={() => {
                  handleOpenModal({
                    type: "schedule",
                    data: { ...scheduleInit, startDate: today, endDate: today },
                  });
                }}
              />
              <ScheduleCard
                isTraining={true}
                onButtonClick={handleTraininClick}
              />
            </VerticalDiv>
            <ScheduleMain
              onOpenModal={handleOpenModal}
              detailOpen={detailOpen}
            />
          </div>
        </VerticalDiv>
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
    </>
  );
}

const Wrapper = styled.main`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
  display: flex; // 추가
  flex-direction: column; // 추가
  align-items: center; // 추가 - 자식 요소 가운데 정렬
`;

const VerticalDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-bottom: 20px;
`;

const TodayCard = styled.div`
  width: 400px;
  max-height: 920px;
  border: 1px solid var(--color-mint);
  border-radius: 16px;
  padding: 12px;
  & hr {
    background-color: var(--color-mint);
    height: 1px;
    border: 0;
  }
`;

const CardTitle = styled.h3`
  margin: 10px;
  font-size: 18px;
  font-weight: 700;
  color: #333;
  text-align: center;
`;
