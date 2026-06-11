import styled from "styled-components";
import useKarte from "../../features/karte/hooks/useKarte";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useScore from "../../features/karte/hooks/useScore";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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
    EYE: { category: "SNACK", tagId: 12 },
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

    // 아직 생일이 지나지 않았으면 1살 감소
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

  // 최신 vs 이전 점수 비교
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
    <>
      <PetCareNav />
      <Wrapper>
        {isLoading ? (
          <p>로딩중</p>
        ) : (
          <>
            <ContentRow>
              <PetCard>
                <PetThumb>
                  {data.pet?.imageUrl ? (
                    <img src={data.pet?.imageUrl} alt={data.pet.name} />
                  ) : (
                    <span>🐾</span>
                  )}
                </PetThumb>
                <PetInfo>
                  <PetName>{data.pet?.name ?? "반려동물을"}</PetName>
                  <BreedName>
                    {data.pet?.breed.name ?? "입력해주세요"}
                  </BreedName>
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
                </PetInfo>
              </PetCard>

              <RightSection>
                <DateBadge>{formatDate(data.createdAt)}</DateBadge>

                <OpinionContainer>
                  <OpinionHeader>진단 요약 내용</OpinionHeader>
                  <OpinionContent>{data.summary}</OpinionContent>
                </OpinionContainer>
              </RightSection>
            </ContentRow>
            <ContentRow>
              <ChartCard style={{ maxWidth: "500px" }}>
                <ChartTitle>카테고리별 건강 점수</ChartTitle>
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
              </ChartCard>
              <ChartCard>
                <ChartTitle>현재 건강점수 추이</ChartTitle>
                {diffText && (
                  <DiffBadge $positive={scoreDiff > 0}>{diffText}</DiffBadge>
                )}
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={sortedHistory}
                    onContextMenu={(_, e) => e.preventDefault()}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="createdAt" />
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
              </ChartCard>
            </ContentRow>
            <ChartCard>
              <ChartTitle>{data.pet?.name}와 평균 비교</ChartTitle>
              <PetScoreChart petData={data} listArr={listArr} />
            </ChartCard>
            <ContentRow>
              <OpinionContainer>
                <OpinionHeader>의사소견</OpinionHeader>
                <OpinionContent>{data.opinion}</OpinionContent>
              </OpinionContainer>
            </ContentRow>
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
    </>
  );
}

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
  margin: 20px 0;
  gap: 24px;
  align-items: stretch;
`;
const PetCard = styled.section`
  display: flex;
  align-items: center;
  gap: 30px;
  border: 1px solid var(--color-mint);
  border-radius: 16px;
  padding: 20px;
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

const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* 날짜 배지를 오른쪽으로 */
  gap: 16px;
`;

const DateBadge = styled.div`
  background-color: #5ec4a5; /* 이미지의 민트색상 */
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 24px;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

const OpinionContainer = styled.div`
  width: 100%;
  margin-top: 20px;
  background-color: #d9eddf; /* 회색빛 배경색 */
  border-radius: 16px;
  padding-top: 12px; /* 헤더 위치를 위한 여백 */
  position: relative;
  min-height: 150px;
`;

const OpinionHeader = styled.div`
  display: inline-block;
  background-color: #d9eddf;
  padding: 10px 24px;
  border-radius: 20px 20px 0 0;
  font-size: 22px;
  font-weight: bold;

  color: #333;
  position: absolute;
  top: -24px; /* 박스 위로 살짝 걸치게 */
`;

const OpinionContent = styled.div`
  background-color: white;
  margin: 12px 1px 0;
  margin-top: 24px; /* 헤더 아래쪽 공간 확보 */
  padding: 20px;
  min-height: 100px;
  font-size: 16px;
  line-height: 1.6;
  color: #444;
  word-break: break-all;
  white-space: pre-wrap; /* 줄바꿈 유지 */
`;

const ChartTitle = styled.p`
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0 0 6px;
`;

const DiffBadge = styled.span`
  display: block; // 추가
  font-size: 14px;
  font-weight: 600;
  color: ${({ $positive }) => ($positive ? "#5EC8A7" : "#FF6B6B")};
  margin-bottom: 30px;
`;

const ChartCard = styled.div`
  width: 100%;
  min-width: 0;
  padding: 20px 24px;
  border: 1.5px solid var(--color-mint);
  border-radius: 16px;
  background: #fff;
`;
