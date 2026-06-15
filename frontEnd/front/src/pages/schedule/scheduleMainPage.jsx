import styled from "styled-components";
import ScheduleMain from "../../features/schedule/components/scheduleMain";
import TrainingDiaryModal from "../../features/schedule/components/TrainingDiaryModal";
import useTraining from "../../features/schedule/hooks/useTraining";
import { useEffect, useState } from "react";
import ScheduleModal from "../../features/schedule/components/scheduleModal";
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
        <ContentLayout>
          {/* 왼쪽 섹션: 오늘 일정 보드 구역 (400px 고정) */}
          <AsideSection>
            <TodayCard>
              <CardHeader>
                <CardIcon>📅</CardIcon>
                <CardTitle>오늘 일정</CardTitle>
              </CardHeader>
              <TodaySchedule open={detailOpen} />
            </TodayCard>
          </AsideSection>

          {/* 오른쪽 섹션: 1148px 규격에 칼같이 일치시킨 상단 버튼 및 메인 캘린더 구역 */}
          <MainSection>
            <ActionGrid>
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
            </ActionGrid>

            {/* 내부 패딩을 포함하여 최종 가로 총합이 1148px이 되도록 안전 마감 선언 */}
            <CalendarCard>
              <ScheduleMain
                onOpenModal={handleOpenModal}
                detailOpen={detailOpen}
              />
            </CalendarCard>
          </MainSection>
        </ContentLayout>

        {/* 글로벌 등록/수정 모달 관리 레이어 */}
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

// ==========================================
// 1148px 정밀 조율 대시보드 구조 스타일드 컴포넌트
// ==========================================
const Wrapper = styled.main`
  width: 100%;
  /* 💡 정밀 스케일 계산: 오늘일정(400px) + 여백(20px) + 메인(1148px) = 정확히 1568px 매칭 */
  max-width: 1568px;
  margin: 0 auto;
  padding: 24px 20px;
  box-sizing: border-box;
`;

const ContentLayout = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  align-items: flex-start;

  @media (max-width: 1588px) {
    justify-content: center; /* 전체 윈도우 창이 좁아질 때 틀어짐 방지용 중앙 밀착 정렬 */
  }

  @media (max-width: 1188px) {
    flex-direction: column;
    align-items: center;
  }
`;

const AsideSection = styled.div`
  width: 400px;
  flex-shrink: 0;
  min-width: 0;

  @media (max-width: 1188px) {
    width: 100%;
    max-width: 1148px; /* 반응형 구조 붕괴 시 하단 1148px 축과 선 정렬 */
  }
`;

const MainSection = styled.div`
  /* 💡 수정 반영: CalendarCard가 패딩 포함 1148px이 됨에 따라 전체 가로 라인을 1148px로 상향 고정 */
  width: 1148px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;

  @media (max-width: 1188px) {
    width: 100%;
    max-width: 1148px;
  }
`;

const ActionGrid = styled.div`
  display: grid;
  /* 버튼 2개가 좌우로 완벽히 반반씩 나누어 채워 정확히 1148px 라인에 맞아떨어지게 설정 */
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const TodayCard = styled.div`
  width: 400px;
  max-height: 920px;
  box-sizing: border-box;
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px 18px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  min-width: 0;

  @media (max-width: 1188px) {
    width: 100%;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding-bottom: 14px;
  margin-bottom: 14px;
  border-bottom: 1.5px solid #f1f5f9;
`;

const CardIcon = styled.span`
  font-size: 18px;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 17px;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.5px;
  text-align: center;
`;

const CalendarCard = styled.div`
  /* 💡 수정 반영: 좌우 패딩을 마음 편히 사용해도 최종 외곽선이 1148px이 되도록 픽스 */
  width: 1148px;
  box-sizing: border-box;
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.03);

  @media (max-width: 1188px) {
    width: 100%;
  }
`;
