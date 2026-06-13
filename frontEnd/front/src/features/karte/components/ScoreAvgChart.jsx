import React, { useState, useMemo } from "react";
import styled from "styled-components";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function getCombinedChartData(petData, listArr) {
  const scores = petData?.scores;
  if (!scores || !listArr) return [];

  const myDogRow = { name: petData?.pet.name };
  const breedAvgRow = { name: petData?.pet.breed.name + " 평균" };
  const petTypeAvgRow = {
    name: petData?.pet.breed.petType === "D" ? "강아지 평균" : "고양이 평균",
  };

  scores.forEach((item) => {
    myDogRow[item.category] = item.score;
  });
  if (listArr.breedAvgList) {
    listArr.breedAvgList.forEach((item) => {
      breedAvgRow[item.category] = item.score;
    });
  }
  if (listArr.petTypeAvgList) {
    listArr.petTypeAvgList.forEach((item) => {
      petTypeAvgRow[item.category] = item.score;
    });
  }

  return [myDogRow, breedAvgRow, petTypeAvgRow];
}

/* 💡 각 버튼에 들어갈 직관적인 건강 관리 이모지 매핑 추가 */
const CATEGORY_CONFIG = {
  VACCINE: { name: "예방접종", color: "#FF6B6B", emoji: "💉" },
  DISEASE: { name: "질병내역", color: "#FF9233", emoji: "🏥" },
  STRESS: { name: "스트레스", color: "#FFCD38", emoji: "⚡" },
  SLEEP: { name: "수면상태", color: "#4D96FF", emoji: "💤" },
  EXERCISE: { name: "운동량", color: "#6BCB77", emoji: "🏃‍♂️" },
  MEAL: { name: "식사량", color: "#323232", emoji: "🍖" },
  SKIN: { name: "피부상태", color: "#9B51E0", emoji: "✨" },
  EYE: { name: "안구건강", color: "#FF7676", emoji: "👀" },
  TEETH: { name: "치아상태", color: "#2D31FA", emoji: "🦷" },
};

export default function PetScoreChart({ petData, listArr }) {
  const [activeCategories, setActiveCategories] = useState(
    Object.fromEntries(Object.keys(CATEGORY_CONFIG).map((k) => [k, false])),
  );

  const chartData = useMemo(
    () => getCombinedChartData(petData, listArr),
    [petData, listArr],
  );

  const handleToggle = (category) => {
    setActiveCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <Container>
      {/* 차트 */}
      <ChartArea>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#666", fontSize: 14 }} />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="TOTAL"
              fill="#5EC8A7"
              name="종합 점수"
              radius={[4, 4, 0, 0]}
            />
            {Object.keys(CATEGORY_CONFIG).map((key) =>
              activeCategories[key] ? (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={CATEGORY_CONFIG[key].color}
                  name={CATEGORY_CONFIG[key].name}
                  radius={[4, 4, 0, 0]}
                />
              ) : null,
            )}
          </BarChart>
        </ResponsiveContainer>
      </ChartArea>

      {/* 카테고리 토글 버튼 */}
      <ButtonGroup>
        {Object.keys(CATEGORY_CONFIG).map((key) => (
          <CategoryButton
            key={key}
            $color={CATEGORY_CONFIG[key].color}
            $active={activeCategories[key]}
            onClick={() => handleToggle(key)}
          >
            {/* 💡 이모지와 텍스트가 자연스럽게 배치되도록 구조화 */}
            <span style={{ marginRight: "4px" }}>{CATEGORY_CONFIG[key].emoji}</span>
            {CATEGORY_CONFIG[key].name}
          </CategoryButton>
        ))}
      </ButtonGroup>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  padding: 20px 0; /* 부모 컨테이너 내부 여백에 맞추기 위해 가로 패딩 해제 */
  background: #fff;
  border-radius: 12px;
  box-sizing: border-box;
`;

const ChartArea = styled.div`
  width: 100%;
  height: 400px;
  margin-bottom: 24px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
`;

const CategoryButton = styled.button`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 30px; /* 조금 더 알약 같이 둥글고 세련된 형태로 다듬음 */
  border: 1.5px solid ${({ $color }) => $color};
  background: ${({ $active, $color }) => ($active ? $color : "#fff")};
  color: ${({ $active, $color }) => ($active ? "#fff" : $color)};
  font-size: 13px;
  font-weight: 700; /* 가독성을 위해 폰트 굵기 강화 */
  cursor: pointer;
  transition:
    background 0.18s ease,
    color 0.18s ease,
    transform 0.1s ease;
  user-select: none;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.96); /* 버튼을 누를 때 쫀득한 클릭감 제공 */
  }
`;