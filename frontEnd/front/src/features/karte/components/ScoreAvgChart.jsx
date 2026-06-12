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

  console.log(petData?.pet);

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

const CATEGORY_CONFIG = {
  VACCINE: { name: "예방접종", color: "#FF6B6B" },
  DISEASE: { name: "질병내역", color: "#FF9233" },
  STRESS: { name: "스트레스", color: "#FFCD38" },
  SLEEP: { name: "수면상태", color: "#4D96FF" },
  EXERCISE: { name: "운동량", color: "#6BCB77" },
  MEAL: { name: "식사량", color: "#323232" },
  SKIN: { name: "피부상태", color: "#9B51E0" },
  EYE: { name: "안구건강", color: "#FF7676" },
  TEETH: { name: "치아상태", color: "#2D31FA" },
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
            {CATEGORY_CONFIG[key].name}
          </CategoryButton>
        ))}
      </ButtonGroup>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-sizing: border-box;
`;

const ChartArea = styled.div`
  width: 100%;
  height: 400px;
  margin-bottom: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
`;

const CategoryButton = styled.button`
  padding: 6px 14px;
  border-radius: 20px;
  border: 1.5px solid ${({ $color }) => $color};
  background: ${({ $active, $color }) => ($active ? $color : "#fff")};
  color: ${({ $active, $color }) => ($active ? "#fff" : $color)};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.18s ease,
    color 0.18s ease;
  user-select: none;

  &:hover {
    opacity: 0.85;
  }
`;
