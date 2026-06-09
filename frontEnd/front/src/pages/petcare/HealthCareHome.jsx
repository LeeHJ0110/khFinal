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
import schedule from "../../features/petcare/img/calendar 1.png";
import graph from "../../features/petcare/img/GGgraph 1.png";
import pawprint from "../../features/petcare/img/pawprint 18.png";
import heart from "../../features/petcare/img/하트.png";

function getTotalChartData(score, listArr, currentPet) {
  if (!listArr) return [];
  const myScore = typeof score === "number" ? score : 0;
  const breedAvg =
    listArr.breedAvgList?.find((i) => i.category === "TOTAL")?.score ?? 0;
  const petTypeAvg =
    listArr.petTypeAvgList?.find((i) => i.category === "TOTAL")?.score ?? 0;
  const curPetType =
    currentPet?.petType === "D" ? "강아지 평균" : "고양이 평균";
  return [
    { name: currentPet?.name, score: myScore },
    { name: currentPet?.breedName + "평균", score: breedAvg },
    { name: curPetType, score: petTypeAvg },
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

  const getAge = (birthDate) => {
    if (!birthDate) return "-";

    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();

    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();

    // 아직 생일이 지나지 않았으면 1살 감소
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  };

  const totalChartData = useMemo(
    () => getTotalChartData(score, listArr, currentPet),
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
          <TopCard>
            <FlexDiv $margin={"10px"}>
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
            </FlexDiv>

            {/* 프로필 */}
            <TopCell $flex={1.3}>
              <>
                {loading ? (
                  <p>로딩중</p>
                ) : (
                  <PetCard>
                    <PetThumb>
                      {currentPet?.imageUrl ? (
                        <img src={currentPet.imageUrl} alt={currentPet.name} />
                      ) : (
                        <span>🐾</span>
                      )}
                    </PetThumb>
                    <PetInfo>
                      <PetName>{currentPet?.name ?? "반려동물을"}</PetName>
                      <BreedName>
                        {currentPet?.breedName ?? "입력해주세요"}
                      </BreedName>
                      <InfoRow>
                        <InfoBadge>
                          <InfoIcon src={heart} alt="" />
                          <span>{getAge(currentPet?.birthDate) ?? "-"}살</span>
                        </InfoBadge>

                        <InfoBadge>
                          <InfoIcon src={pawprint} alt="" />
                          <span>{currentPet?.weight ?? "-"}kg</span>
                        </InfoBadge>
                      </InfoRow>
                      {currentPet ? (
                        <PetButton
                          type="button"
                          onClick={() => navigate("/mypage/pet-manage")}
                        >
                          반려동물 정보관리
                        </PetButton>
                      ) : (
                        <PetButton
                          type="button"
                          onClick={() => navigate("/mypage/pet-manage")}
                        >
                          반려동물 등록하기
                        </PetButton>
                      )}
                    </PetInfo>
                  </PetCard>
                )}
              </>
            </TopCell>

            {/* 건강 점수 */}
            <TopCell $center $flex={0.8}>
              {scoreLoading ? (
                <p>로딩중</p>
              ) : currentPet ? (
                <HealthScore
                  petId={currentPet.petId}
                  petName={currentPet.name}
                />
              ) : (
                <EmptyCard>
                  <EmptyText>반려동물을 등록해주세요</EmptyText>
                </EmptyCard>
              )}
            </TopCell>

            {/* 액션 카드 */}
            <TopCell $gap>
              <ActionCardGroup />
            </TopCell>

            {/* 건강점수 추이 차트 */}
            <TopCell $flex={1.5}>
              <WhiteCard>
                <CardTitle>건강점수 추이</CardTitle>
                {scoreLoading ? (
                  <EmptyText>로딩중</EmptyText>
                ) : sortedHistory.length < 2 ? (
                  <FlexDiv $center>
                    <EmptyText>검사 기록이 너무 적습니다</EmptyText>
                  </FlexDiv>
                ) : (
                  <ResponsiveContainer width="100%" height="85%">
                    <AreaChart data={sortedHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="createdAt" tick={{ fontSize: 11 }} />
                      <YAxis
                        width={36}
                        domain={[0, 100]}
                        tick={{ fontSize: 11 }}
                      />
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
              </WhiteCard>
            </TopCell>
            <FlexDiv $margin={"10px"}>
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
            </FlexDiv>
          </TopCard>
        </TopWrapper>

        {/* ── BottomSection ── */}
        <BottomSection>
          {/* 오늘 일정 */}
          <Card>
            <FlexDiv>
              <SmallIcon src={schedule} alt="일정" />
              <CardTitle>오늘 일정</CardTitle>
            </FlexDiv>
            <Label>오늘 해야 할 일들을 볼 수 있어요.</Label>
          </Card>

          {/* 건강점수 비교 */}
          <Card $flex={1.2}>
            <FlexDiv>
              <SmallIcon src={graph} alt="차트" />
              <CardTitle>건강점수 비교</CardTitle>
            </FlexDiv>
            <Label>비슷한 반려동물과 비교한 결과에요.</Label>
            {scoreLoading ? (
              <EmptyText>로딩중</EmptyText>
            ) : totalChartData[0]?.score > 0 ? (
              <ResponsiveContainer width="100%" height="80%">
                <BarChart
                  data={totalChartData}
                  margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                >
                  {console.log(totalChartData[0]?.score)}
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} width={36} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar
                    dataKey="score"
                    fill="#5EC8A7"
                    radius={[4, 4, 0, 0]}
                    name="종합 점수"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyText>검사를 진행해주세요</EmptyText>
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
          <HealthCard>
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
          </HealthCard>
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

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  ${({ $center }) => ($center ? "height: 100%" : "")};
  justify-content: ${({ $center }) => ($center ? "center" : "flex-start")};
  margin: ${({ $margin }) => $margin ?? 0};
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
  background: #f1f8f6;
  border-radius: 20px;
  border: 1px solid #d9eddf;
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
  border: 1px solid #d9eddf;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  ${({ $banner }) => $banner && "background: #e8f5f1; box-shadow: none;"}
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  }
`;

const PetCard = styled.section`
  display: flex;
  align-items: center;
  gap: 30px;
  margin-top: 30px;
  margin-left: 30px;
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

const EmptyCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: white;
  width: 100%;
  height: 100vh;
  border: 1px solid #d9eddf;
  border-radius: 16px;
`;

const WhiteCard = styled.div`
  border: 1px solid #d9eddf;
  border-radius: 16px;
  background-color: white;
  width: 100%;
  height: 100vh;
  padding: 10px 20px 0 10px;

  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  }
`;

const PetInfo = styled.div`
  flex: 1;
`;

const PetName = styled.h2`
  font-size: 36px;
  margin-bottom: 20px;
`;

const BreedName = styled.h3`
  font-size: 20px;
  color: #555555;
`;

const PetButton = styled.button`
  width: 100%;
  margin-top: 18px;
  border: 1px solid #d9eddf;
  border-radius: 999px;
  padding: 10px 28px;
  background: #e2fbf2;
  color: #00a982;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background-color: #5ec8a7;
    color: white;
  }
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

const InfoBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  width: fit-content;
  min-width: 60px;

  padding: 5px 10px;

  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background: #f8f8f8;

  white-space: nowrap;
`;

const InfoIcon = styled.img`
  width: 16px;
  height: 16px;
  object-fit: contain;
`;

const CardTitle = styled.h3`
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 700;
  color: #333;
`;

const EmptyText = styled.p`
  font-size: 18px;
  color: #aaa;
  margin: auto;
`;

const CompText = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: ${({ $positive }) => ($positive ? "#5EC8A7" : "#FF6B6B")};
  margin: 0 0 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;

  color: #666;
  margin-bottom: 10px;
`;

const SmallIcon = styled.img`
  margin-bottom: 10px;
  margin-right: 10px;
`;

const HealthCard = styled.div`
  width: 427px;
  height: 414px;
  background: url(insurance) no-repeat center/cover;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  }
`;
