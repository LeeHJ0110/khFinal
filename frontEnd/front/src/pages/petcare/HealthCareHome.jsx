import styled, { keyframes } from "styled-components";
import { useEffect, useState } from "react";
import usePet from "../../features/mypage/pet/hooks/usePet";
import PetCareNav from "../../features/petcare/components/petcarehome/PetCareNav";
import { useNavigate } from "react-router-dom";
import useScore from "../../features/karte/hooks/useScore";
import HealthScore from "../../features/petcare/components/healthCareHome/HealthScore";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ActionCardGroup from "../../features/petcare/components/healthCareHome/ActionCardGroup";
import ScheduleMain from "../../features/schedule/components/scheduleMain";

//TODO 세부 조정 하기
import insurance from "../../features/petcare/img/preInsurance.png";
import PetScoreChart from "../../features/karte/components/ScoreAvgChart";

// 필요정보 :펫리스트, 건강점수 평균, 일정표,
export default function HealthCareHome() {
  const {
    isLoading: scoreLoaing,
    data,
    listArr,
    listHis,
    asyncFetchScore,
    asyncFetchScoreAvg,
    asyncFetchScoreHistory,
  } = useScore();
  const { petList, loading, fetchMyPetList } = usePet();
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const currentPet = petList?.[currentIndex];

  useEffect(() => {
    fetchMyPetList();
  }, []);

  //대표찾기
  useEffect(() => {
    if (!petList?.length) return;
    const representIndex = petList.findIndex((pet) => pet.representYn === "Y");
    setCurrentIndex(representIndex >= 0 ? representIndex : 0);
  }, [petList]);

  useEffect(() => {
    if (currentPet != undefined) {
      console.log(currentPet);

      asyncFetchScore(currentPet.petId, "TOTAL");
      asyncFetchScoreAvg(currentPet.petId);
      asyncFetchScoreHistory(currentPet.petId);
    }
  }, [currentIndex]);

  //넘기기 버튼
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + petList.length) % petList.length);
  };
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % petList.length);
  };

  const score = typeof data === "number" ? data : 0;

  return (
    <>
      <PetCareNav />
      <Wrapper>
        <TopSection>
          <ProfileCard>
            {loading ? (
              <p>로딩중</p>
            ) : currentPet ? (
              <PetInfo>
                <PetName>{currentPet.name}</PetName>

                <InfoRow>
                  <span>품종</span>
                  <strong>{currentPet.breedName}</strong>
                </InfoRow>

                <InfoRow>
                  <span>몸무게</span>
                  <strong>{currentPet.weight}kg</strong>
                </InfoRow>

                <InfoRow>
                  <span>생년월일</span>
                  <strong>{currentPet.birthDate}</strong>
                </InfoRow>

                {scoreLoaing ? <p>로딩중</p> : <div></div>}

                <div>
                  <button onClick={handlePrev}>이전</button>

                  <span>
                    {currentIndex + 1} / {petList.length}
                  </span>

                  <button onClick={handleNext}>다음</button>
                </div>
              </PetInfo>
            ) : (
              <button
                onClick={() => {
                  navigate("/mypage/pet-manage");
                }}
              >
                반려동물 등록하기
              </button>
            )}
          </ProfileCard>

          <HealthScoreCard>
            {scoreLoaing ? (
              <p>로디웆ㅇ</p>
            ) : currentPet ? (
              <HealthScore
                petId={currentPet.petId}
                petName={currentPet.name}
              ></HealthScore>
            ) : (
              <p>반려동물을 등록해주세요</p>
            )}
          </HealthScoreCard>

          <ActionCardGroup />

          <ChartCard>
            <h1>건강점수 추이</h1>
            {listHis.length < 2 ? (
              <p>검사 기록이 너무 적습니다</p>
            ) : (
              <AreaChart
                style={{
                  width: "100%",
                  maxWidth: "700px",
                  maxHeight: "70vh",
                  aspectRatio: 2,
                }}
                responsive
                data={listHis}
                onContextMenu={(_, e) => e.preventDefault()}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="createdAt" niceTicks="snap125" />
                <YAxis width="auto" niceTicks="snap125" />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#5EC8A7"
                  fill="#5EC8A7"
                />
              </AreaChart>
            )}
          </ChartCard>
        </TopSection>

        {/* 하단 레이아웃 */}
        <BottomSection>
          <ScheduleCard>
            <Title>오늘 일정</Title>
            {/* 일정 리스트 영역 */}
          </ScheduleCard>

          <ComparisonCard>
            {scoreLoaing ? (
              <p>로디웆ㅇ</p>
            ) : (
              <PetScoreChart petData={data} listArr={listArr} />
            )}
          </ComparisonCard>

          <CalendarCard>
            <ScheduleMain />
          </CalendarCard>

          <BannerCard>
            <img src={insurance} alt="" />
          </BannerCard>
        </BottomSection>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.main`
  width: 100%;
  max-width: 1800px;
  margin: 0 auto;
  padding: 20px;
  font-family:
    "Pretendard",
    -apple-system,
    sans-serif;
`;

const PetCard = styled.section`
  padding: 24px;

  border-radius: 12px;

  display: flex;
  gap: 20px;
`;
const PetImage = styled.div`
  width: 110px;
  height: 110px;

  flex-shrink: 0;

  border-radius: 50%;

  border: 3px solid white;

  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
`;
const PetInfo = styled.div`
  flex: 1;
`;
const PetName = styled.h2`
  margin: 0 0 16px;

  font-size: 30px;
  font-weight: 700;
`;
const InfoRow = styled.div`
  display: flex;

  gap: 12px;

  margin-bottom: 8px;

  font-size: 14px;

  span {
    width: 60px;
    color: #666;
  }

  strong {
    color: #333;
  }
`;

const TopSection = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  height: 280px;
  background-color: gray;
  border-radius: 12px;
`;

const BottomSection = styled.div`
  display: flex;
  gap: 20px;
  height: 400px;
`;

const Card = styled.div`
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
`;

// 상단 카드들
const ProfileCard = styled(Card)`
  flex: 1.5;
  position: relative;
`;

const HealthScoreCard = styled(Card)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const SmallActionCard = styled(Card)`
  flex: 1;
  padding: 15px;
  justify-content: center;
`;

const ChartCard = styled(Card)`
  flex: 1.5;
`;

// 하단 카드들
const ScheduleCard = styled(Card)`
  flex: 1;
`;

const ComparisonCard = styled(Card)`
  flex: 1;
`;

const CalendarCard = styled(Card)`
  flex: 1.2;
`;

const BannerCard = styled(Card)`
  flex: 0.8;
  background-color: #e8f5f1;
  border: none;
`;

const Title = styled.h3`
  margin: 0 0 15px 0;
  font-size: 18px;
  font-weight: 700;
  color: #333;
`;
