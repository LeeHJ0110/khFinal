import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import usePet from "../../features/mypage/pet/hooks/usePet";
import PetCareNav from "../../features/petcare/components/petcarehome/PetCareNav";
import { useNavigate } from "react-router-dom";
import useScore from "../../features/karte/hooks/useScore";
import HealthScore from "../../features/petcare/components/healthCareHome/HealthScore";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ActionCardGroup from "../../features/petcare/components/healthCareHome/ActionCardGroup";
import ScheduleMain from "../../features/schedule/components/scheduleMain";
import insurance from "../../features/petcare/img/preInsurance.png";

function getTotalChartData(score, listArr) {
  if (!listArr) return [];
  const myScore = typeof score === "number" ? score : 0;
  const breedAvg =
    listArr.breedAvgList?.find((i) => i.category === "TOTAL")?.score ?? 0;
  const petTypeAvg =
    listArr.petTypeAvgList?.find((i) => i.category === "TOTAL")?.score ?? 0;
  return [
    { name: "내 강아지", score: myScore },
    { name: "품종 평균", score: breedAvg },
    { name: "종 평균", score: petTypeAvg },
  ];
}

export default function HealthCareHome() {
  const {
    isLoading: scoreLoading,
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

  useEffect(() => {
    if (!petList?.length) return;
    const representIndex = petList.findIndex((pet) => pet.representYn === "Y");
    setCurrentIndex(representIndex >= 0 ? representIndex : 0);
  }, [petList]);

  useEffect(() => {
    if (currentPet?.petId) {
      asyncFetchScore(currentPet.petId, "TOTAL");
      asyncFetchScoreAvg(currentPet.petId);
      asyncFetchScoreHistory(currentPet.petId);
    }
  }, [currentPet?.petId]);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 + petList.length) % petList.length);
  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % petList.length);

  const score = typeof data === "number" ? data : 0;

  const sortedHistory = useMemo(
    () =>
      [...(listHis ?? [])].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      ),
    [listHis],
  );

  const totalChartData = useMemo(
    () => getTotalChartData(score, listArr),
    [score, listArr],
  );

  const breedAvgScore = listArr?.breedAvgList?.find(
    (i) => i.category === "TOTAL",
  )?.score;
  const diffFromBreed = breedAvgScore != null ? score - breedAvgScore : null;
  const compText =
    diffFromBreed === null
      ? ""
      : diffFromBreed > 0
        ? `${currentPet?.name ?? "우리 아이"}는 품종 평균보다 ${diffFromBreed}점 높아요`
        : diffFromBreed < 0
          ? `${currentPet?.name ?? "우리 아이"}는 품종 평균보다 ${Math.abs(diffFromBreed)}점 낮아요`
          : "품종 평균과 동일해요";

  const showNav = petList?.length > 1;

  return (
    <>
      <PetCareNav />
      <Wrapper>
        {/* ── TopSection ── */}
        <TopWrapper>
          {/* 왼쪽 화살표 */}
          {showNav && (
            <ArrowBtn onClick={handlePrev} aria-label="이전 반려동물">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M13 4L7 10L13 16"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </ArrowBtn>
          )}

          <TopCard>
            {/* 프로필 */}
            <TopCell>
              {loading ? (
                <p>로딩중</p>
              ) : currentPet ? (
                <PetCard>
                  <PetThumb>
                    {currentPet.imageUrl ? (
                      <img src={currentPet.imageUrl} alt={currentPet.name} />
                    ) : (
                      <span>🐾</span>
                    )}
                  </PetThumb>
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
                    <PetButton
                      type="button"
                      onClick={() => navigate("/mypage/pet-manage")}
                    >
                      반려동물 정보관리
                    </PetButton>
                  </PetInfo>
                </PetCard>
              ) : (
                <RegisterBtn onClick={() => navigate("/mypage/pet-manage")}>
                  반려동물 등록하기
                </RegisterBtn>
              )}
            </TopCell>

            {/* 건강 점수 */}
            <TopCell $center>
              {scoreLoading ? (
                <p>로딩중</p>
              ) : currentPet ? (
                <HealthScore
                  petId={currentPet.petId}
                  petName={currentPet.name}
                />
              ) : (
                <p>반려동물을 등록해주세요</p>
              )}
            </TopCell>

            {/* 액션 카드 */}
            <TopCell $gap>
              <ActionCardGroup />
            </TopCell>

            {/* 건강점수 추이 차트 */}
            <TopCell $flex={1.5}>
              <CardTitle>건강점수 추이</CardTitle>
              {scoreLoading ? (
                <EmptyText>로딩중</EmptyText>
              ) : sortedHistory.length < 2 ? (
                <EmptyText>검사 기록이 너무 적습니다</EmptyText>
              ) : (
                <ResponsiveContainer width="100%" height="85%">
                  <AreaChart data={sortedHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="createdAt" tick={{ fontSize: 11 }} />
                    <YAxis width={36} domain={[0, 100]} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#5EC8A7"
                      fill="#5EC8A7"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </TopCell>
          </TopCard>

          {/* 오른쪽 화살표 */}
          {showNav && (
            <ArrowBtn onClick={handleNext} aria-label="다음 반려동물">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M7 4L13 10L7 16"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </ArrowBtn>
          )}
        </TopWrapper>

        {/* ── BottomSection ── */}
        <BottomSection>
          {/* 오늘 일정 */}
          <Card>
            <CardTitle>오늘 일정</CardTitle>
          </Card>

          {/* 건강점수 비교 */}
          <Card $flex={1.2}>
            <CardTitle>건강점수 비교</CardTitle>
            {scoreLoading ? (
              <EmptyText>로딩중</EmptyText>
            ) : (
              <ResponsiveContainer width="100%" height="80%">
                <BarChart
                  data={totalChartData}
                  margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} width={36} />
                  <Tooltip />
                  <Bar
                    dataKey="score"
                    fill="#5EC8A7"
                    radius={[4, 4, 0, 0]}
                    name="종합 점수"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
            {!scoreLoading && compText && (
              <CompText $positive={diffFromBreed >= 0}>{compText}</CompText>
            )}
          </Card>

          {/* 캘린더 */}
          <Card $flex={1} $noPad>
            <ScheduleMain small={true} />
          </Card>

          {/* 배너 */}
          <Card $flex={1} $banner>
            <img
              src={insurance}
              alt="보험 배너"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "16px",
              }}
              onClick={() => {
                navigate("/healthcare/petinsurance");
              }}
            />
          </Card>
        </BottomSection>
      </Wrapper>
    </>
  );
}

// ── Styled Components ──────────────────────────────────────────────

const Wrapper = styled.main`
  width: 100%;
  max-width: 1800px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TopWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ArrowBtn = styled.button`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #5ec8a7;
  transition:
    background 0.15s,
    box-shadow 0.15s;

  &:hover {
    background: #f0faf6;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const TopCard = styled.div`
  flex: 1;
  display: flex;
  align-items: stretch;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  height: 360px;
  min-width: 0;
`;

const TopCell = styled.div`
  flex: ${({ $flex }) => $flex ?? 1};
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: ${({ $center }) => ($center ? "center" : "flex-start")};
  justify-content: ${({ $center }) => ($center ? "center" : "flex-start")};
  gap: ${({ $gap }) => ($gap ? "12px" : "0")};
  min-width: 0;
`;

const Divider = styled.div`
  width: 1px;
  background: #f0f0f0;
  align-self: stretch;
  flex-shrink: 0;
`;

const BottomSection = styled.div`
  display: flex;
  gap: 20px;
  height: 420px;
`;

const Card = styled.div`
  flex: ${({ $flex }) => $flex ?? 1};
  background: #fff;
  border-radius: 16px;
  padding: ${({ $noPad }) => ($noPad ? "0" : "20px 24px")};
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  ${({ $banner }) => $banner && "background: #e8f5f1; box-shadow: none;"}
`;

const PetCard = styled.section`
  display: flex;
  align-items: center;
  gap: 30px;
`;

const PetThumb = styled.div`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  margin: 12px auto 10px;
  background: #ddd;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  span {
    font-size: 30px;
  }
`;

const PetInfo = styled.div`
  flex: 1;
`;

const PetName = styled.h2`
  font-size: 36px;
  margin-bottom: 20px;
`;

const PetButton = styled.button`
  margin-top: 18px;
  border: none;
  border-radius: 999px;
  padding: 10px 28px;
  background: #e2fbf2;
  color: #00a982;
  font-weight: 700;
  cursor: pointer;
`;

const InfoRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 6px;
  font-size: 13px;
  span {
    width: 52px;
    color: #666;
  }
  strong {
    color: #333;
  }
`;

const RegisterBtn = styled.button`
  background: #5ec8a7;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const CardTitle = styled.h3`
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 700;
  color: #333;
`;

const EmptyText = styled.p`
  font-size: 13px;
  color: #aaa;
  margin: auto;
`;

const CompText = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: ${({ $positive }) => ($positive ? "#5EC8A7" : "#FF6B6B")};
  margin: 0 0 8px;
`;
