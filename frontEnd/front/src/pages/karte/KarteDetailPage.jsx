import styled from "styled-components";
import useKarte from "../../features/karte/hooks/useKarte";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useScore from "../../features/karte/hooks/useScore";
import {
  Area,
  AreaChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PetScoreChart from "../../features/karte/components/ScoreAvgChart";
import pawprint from "../../features/petcare/img/pawprint 18.png";
import heart from "../../features/petcare/img/하트.png";
import StoreList from "../../features/karte/components/StoreList";
import PetCareNav from "../../features/petcare/components/petcarehome/PetCareNav";

function getLowestHealthCategory(scores) {
  if (!scores || scores.length === 0) return null;

  const TARGET_MAPPING = {
    EYE: { category: "SUPPLEMENT", tagId: 12 },
    SKIN: { category: "FOOD", tagId: 3 },
    DISEASE: { category: "SUPPLEMENT", tagId: 11 },
    TEETH: { category: "SNACK", tagId: 5 },
    MEAL: { category: "FOOD", tagId: 4 },
  };

  const targetScores = scores.filter((item) =>
    Object.keys(TARGET_MAPPING).includes(item.category),
  );

  if (targetScores.length === 0) return null;

  const lowestItem = targetScores.reduce((lowest, current) => {
    return current.score < lowest.score ? current : lowest;
  }, targetScores[0]);

  return TARGET_MAPPING[lowestItem.category];
}

export default function KarteDetailPage() {
  const awsUrl = "https://kh251118fileserver-398370180939-ap-northeast-2-an.s3.ap-northeast-2.amazonaws.com/";
  const { isLoading, data, asyncFetchKarteDetail } = useKarte();
  const {
    isLoading: scoreLoaing,
    listArr,
    listHis,
    asyncFetchScore,
    asyncFetchScoreAvg,
    asyncFetchScoreHistory,
  } = useScore();
  const { id } = useParams();

  const CATEGORY_LABELS = {
    VACCINE: "예방접종",
    DISEASE: "질병내역",
    STRESS: "스트레스",
    SLEEP: "수면상태",
    EXERCISE: "운동량",
    MEAL: "식사량",
    SKIN: "피부상태",
    EYE: "안구건강",
    TEETH: "치아상태",
  };

  useEffect(() => {
    asyncFetchKarteDetail(id);
  }, [id]);

  useEffect(() => {
    if (data?.pet) {
      asyncFetchScoreAvg(data.pet.id);
      asyncFetchScoreHistory(data.pet?.id);
    }
  }, [data]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, "0")}월 ${String(date.getDate()).padStart(2, "0")}일`;
  };

  const getAge = (birthDate) => {
    if (!birthDate) return "-";

    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();

    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  };

  const scoresWithoutTotal = data.scores
    ?.filter((score) => score.category !== "TOTAL")
    .map((score) => ({
      ...score,
      category: CATEGORY_LABELS[score.category] ?? score.category,
    }));

  const sortedHistory = [...(listHis ?? [])].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  );

  const latestScore = sortedHistory.at(-1)?.score;
  const prevScore = sortedHistory.at(-2)?.score;

  const scoreDiff =
    latestScore != null && prevScore != null ? latestScore - prevScore : null;

  const diffText =
    scoreDiff === null
      ? ""
      : scoreDiff > 0
        ? `저번 검사보다 ${scoreDiff}점 올랐어요 🐾`
        : scoreDiff < 0
          ? `저번 검사보다 ${Math.abs(scoreDiff)}점 내려갔어요`
          : "저번 검사와 동일해요";

  const storeCategory = getLowestHealthCategory(data.scores);

  return (
    <PageBackground>
      <PetCareNav />
      <Wrapper>
        {isLoading ? (
          <p>로딩중</p>
        ) : (
          <>
            {/* 상단 프로필 및 통합 리포트 영역 */}
            <ContentRow style={{ marginTop: "40px" }}>
              <PetCard>
                <PetThumb>
                  {data.pet?.imageUrl ? (
                    <img src={awsUrl + data.pet?.imageUrl} alt={data.pet.name} />
                  ) : (
                    <span>🐾</span>
                  )}
                </PetThumb>
                <PetInfo>
                  <BreedName>
                    {data.pet?.breed.name ?? "입력해주세요"}
                  </BreedName>
                  <PetName>{data.pet?.name ?? "반려동물"}</PetName>
                </PetInfo>
                <InfoRow>
                  <InfoBadge>
                    <InfoIcon src={heart} alt="" />
                    <span>{getAge(data.pet?.birthDate) ?? "-"}살</span>
                  </InfoBadge>

                  <InfoBadge>
                    <InfoIcon src={pawprint} alt="" />
                    <span>{data.pet?.weight ?? "-"}kg</span>
                  </InfoBadge>
                </InfoRow>
              </PetCard>

              <RightSection>
                <DateBadge>{formatDate(data.createdAt)}</DateBadge>

                {/* 진단요약과 의사소견 통합 리포트 카드 */}
                <ReportContainer>
                  <ReportSection>
                    <SectionTitle>📋 진단 요약</SectionTitle>
                    <SectionContent>{data.summary ?? "진단 요약 데이터가 없습니다."}</SectionContent>
                  </ReportSection>
                  
                  <Divider />

                  <ReportSection>
                    <SectionTitle>🩺 의사 소견</SectionTitle>
                    <SectionContent>{data.opinion}</SectionContent>
                  </ReportSection>
                </ReportContainer>
              </RightSection>
            </ContentRow>

            {/* Radar와 Area 차트 통합 리포트 영역 */}
            <ContentRow>
              <CombinedChartContainer>
                {/* 왼쪽: 카테고리별 레이더 차트 영역 */}
                <ChartSection style={{ maxWidth: "460px" }}>
                  <ChartTitle>🕸️ 카테고리별 건강 점수</ChartTitle>
                  <ChartContentWrapper>
                    <RadarChart
                      style={{
                        width: "100%",
                        maxHeight: "80vh",
                        aspectRatio: 1.2,
                      }}
                      responsive
                      outerRadius="80%"
                      data={scoresWithoutTotal}
                    >
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Tooltip />
                      <Radar
                        dataKey="score"
                        stroke="#5EC8A7"
                        fill="#5EC8A7"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ChartContentWrapper>
                </ChartSection>

                <Divider />

                {/* 오른쪽: 건강 점수 추이 영역 */}
                <ChartSection>
                  <ChartTitle>📈 현재 건강점수 추이</ChartTitle>
                  {diffText && (
                    <DiffBadge $positive={scoreDiff > 0}>{diffText}</DiffBadge>
                  )}
                  <ChartContentWrapper>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart
                        data={sortedHistory}
                        onContextMenu={(_, e) => e.preventDefault()}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={true} />
                        <XAxis dataKey="createdAt" interval={0} tick={{ fill: "#666", fontSize: 14 }}/>
                        <YAxis width={40} domain={[0, 100]} />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="score"
                          stroke="#5EC8A7"
                          fill="#5EC8A7"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContentWrapper>
                </ChartSection>
              </CombinedChartContainer>
            </ContentRow>

            {/* 반려동물 평균 비교 차트 카드 */}
            <ContentRow>
              <AverageChartContainer>
                <AverageChartHeader>📊 {data.pet?.name}와 평균 비교</AverageChartHeader>
                <AverageChartContent>
                  <PetScoreChart petData={data} listArr={listArr} />
                </AverageChartContent>
              </AverageChartContainer>
            </ContentRow>

            {/* 맞춤 추천 상품 목록 카드 */}
            <ContentRow>
              <StoreList
                targetPetType={data.pet?.breed.petType}
                category={storeCategory?.category}
                tagId={storeCategory?.tagId}
              />
            </ContentRow>
          </>
        )}
      </Wrapper>
    </PageBackground>
  );
}

/* 💡 신규 추가: 카드들을 시각적으로 강력하게 띄워주기 위한 소프트 미색 배경 도포 */
const PageBackground = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #f8fafc; /* 차분하고 고급스러운 Slate 그레이시 화이트 적용 */
  padding-bottom: 60px;
`;

const Wrapper = styled.main`
  max-width: 1300px;
  margin: 0 auto;
  padding: 20px;
  font-family:
    "Pretendard",
    -apple-system,
    sans-serif;
`;

const ContentRow = styled.div`
  display: flex;
  margin: 28px 0;
  gap: 24px;
  align-items: stretch;
`;

/* 💡 공통 핵심 변경 사양: 옅은 보더선을 과감히 지우고, 입체적인 뎁스 섀도우 처리로 가독성 극대화 */
const PetCard = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  border-left: 6px solid #5ec8a7;
  border-radius: 4px 24px 24px 4px;
  padding: 54px 24px 24px 24px;
  /* 선명하고 묵직하게 바뀐 대시보드 전용 멀티 레이어 섀도우 */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 10px 25px -5px rgba(42, 65, 57, 0.08);
  min-width: 300px;
  text-align: center;
`;

const PetThumb = styled.div`
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: #ffffff;
  border: 4px solid #ffffff;
  box-shadow: 0 8px 24px rgba(42, 65, 57, 0.12);
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
    font-size: 32px;
  }
`;

const PetInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 24px;
`;

const BreedName = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: #5ec8a7;
  background-color: #e6f7f2; /* 조금 더 대비를 높여 뚜렷하게 보이도록 수정 */
  padding: 4px 12px;
  border-radius: 20px;
  margin: 0 0 8px 0;
  letter-spacing: -0.3px;
`;

const PetName = styled.h2`
  font-size: 26px;
  font-weight: 800;
  color: #1a201e;
  margin: 0;
`;

const InfoRow = styled.div`
  display: flex;
  width: 100%;
  gap: 1px;
  background: #eef2f5; /* 절개선 음영 대비 강화 */
  border-radius: 12px;
  overflow: hidden;
  padding: 2px;
`;

const InfoBadge = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 0;
  background: #ffffff;
  border-radius: 10px;

  span {
    font-size: 15px;
    font-weight: 700;
    color: #334155;
  }
`;

const InfoIcon = styled.img`
  width: 16px;
  height: 16px;
  object-fit: contain;
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;
`;

const DateBadge = styled.div`
  background-color: #47b291; /* 폰트 및 바지 가독성을 위해 베이스 컬러 명도 조절 */
  color: white;
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(71, 178, 145, 0.2);
`;

const ReportContainer = styled.div`
  width: 100%;
  background-color: #ffffff;
  border-left: 6px solid #5ec8a7;
  border-radius: 4px 24px 24px 4px;
  padding: 28px 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 10px 25px -5px rgba(42, 65, 57, 0.08);
  flex: 1;
  
  display: flex;
  gap: 32px;
`;

const ReportSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
`;

const SectionContent = styled.div`
  font-size: 15px;
  line-height: 1.65;
  color: #475569;
  word-break: break-all;
  white-space: pre-wrap;
`;

const Divider = styled.div`
  width: 1px;
  background-color: #f1f5f9; /* 디바이더 선을 훨씬 깨끗하고 부드럽게 정돈 */
  align-self: stretch;
`;

const CombinedChartContainer = styled.div`
  width: 100%;
  background-color: #ffffff;
  border-left: 6px solid #5ec8a7;
  border-radius: 4px 24px 24px 4px;
  padding: 28px 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 10px 25px -5px rgba(42, 65, 57, 0.08);
  
  display: flex;
  gap: 32px;
`;

const ChartSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ChartTitle = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
`;

const ChartContentWrapper = styled.div`
  width: 100%;
  min-height: 0;
`;

const DiffBadge = styled.span`
  display: inline-block;
  font-size: 14px;
  font-weight: 700;
  color: ${({ $positive }) => ($positive ? "#47b291" : "#ef4444")};
  margin-bottom: 8px;
`;

const AverageChartContainer = styled.div`
  width: 100%;
  background-color: #ffffff;
  border-left: 6px solid #5ec8a7;
  border-radius: 4px 24px 24px 4px;
  padding: 28px 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 10px 25px -5px rgba(42, 65, 57, 0.08);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const AverageChartHeader = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: #1e293b;
`;

const AverageChartContent = styled.div`
  width: 100%;
  min-height: 0;
`;