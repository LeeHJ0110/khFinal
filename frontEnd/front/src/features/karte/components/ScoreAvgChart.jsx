import React, { useState, useMemo } from "react";
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

function getCombinedChartData(scores, listArr) {
  // 1. 방어 코드: 데이터가 아직 로드되지 않은 경우 빈 배열 반환
  if (!scores || !listArr) {
    return [];
  }

  // 2. 각 그룹의 초기 객체 설정
  const myDogRow = { name: "내 강아지" };
  const breedAvgRow = { name: "품종 평균" };
  const petTypeAvgRow = { name: "종 평균" };

  // 3. 내 강아지 점수들을 객체에 컬럼 형태로 주입 (예: { EYE: 99, SLEEP: 85, ... })
  scores.forEach((item) => {
    myDogRow[item.category] = item.score;
  });

  // 4. 품종 평균 점수들을 객체에 컬럼 형태로 주입
  if (listArr.breedAvgList) {
    listArr.breedAvgList.forEach((item) => {
      breedAvgRow[item.category] = item.score;
    });
  }

  // 5. 종 평균 점수들을 객체에 컬럼 형태로 주입
  if (listArr.petTypeAvgList) {
    listArr.petTypeAvgList.forEach((item) => {
      petTypeAvgRow[item.category] = item.score;
    });
  }

  // 6. Recharts가 인식할 3개의 행을 하나의 배열로 묶어서 반환
  return [myDogRow, breedAvgRow, petTypeAvgRow];
}

// 1. 카테고리별 한글 이름 매핑 및 무지개 계열 색상 정의 (TOTAL은 제외)
const CATEGORY_CONFIG = {
  VACCINE: { name: "예방접종", color: "#FF6B6B" }, // 빨강
  DISEASE: { name: "질병내역", color: "#FF9233" }, // 주황
  STRESS: { name: "스트레스", color: "#FFCD38" }, // 노랑
  SLEEP: { name: "수면상태", color: "#4D96FF" }, // 파랑
  EXERCISE: { name: "운동량", color: "#6BCB77" }, // 초록
  MEAL: { name: "식사량", color: "#323232" }, // 다크그레이 (포인트)
  SKIN: { name: "피부상태", color: "#9B51E0" }, // 보라
  EYE: { name: "안구건강", color: "#FF7676" }, // 핑크
  TEETH: { name: "치아상태", color: "#2D31FA" }, // 남색
};

export default function PetScoreChart({ petData, listArr }) {
  // 2. 체크박스로 켜고 닫을 나머지 9개 카테고리의 상태 관리 (초기값은 모두 false)
  const [activeCategories, setActiveCategories] = useState({
    VACCINE: false,
    DISEASE: false,
    STRESS: false,
    SLEEP: false,
    EXERCISE: false,
    MEAL: false,
    SKIN: false,
    EYE: false,
    TEETH: false,
  });

  // 3. Recharts용 데이터 바인딩 (메모이제이션으로 최적화)
  const chartData = useMemo(() => {
    return getCombinedChartData(petData?.scores, listArr);
  }, [petData, listArr]);

  // 4. 체크박스 핸들러
  const handleCheckboxChange = (category) => {
    setActiveCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <div
      style={{
        width: "100%",
        padding: "20px",
        background: "#fff",
        borderRadius: "12px",
      }}
    >
      {/* 5. 상단 체크박스 컨트롤러 영역 */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        {Object.keys(CATEGORY_CONFIG).map((key) => (
          <label
            key={key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "14px",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <input
              type="checkbox"
              checked={activeCategories[key]}
              onChange={() => handleCheckboxChange(key)}
              style={{ accentColor: CATEGORY_CONFIG[key].color }} // 체크박스 자체 색상 피팅
            />
            <span
              style={{
                borderBottom: `2px solid ${CATEGORY_CONFIG[key].color}`,
                paddingBottom: "2px",
              }}
            >
              {CATEGORY_CONFIG[key].name}
            </span>
          </label>
        ))}
      </div>

      {/* 6. Recharts 차트 렌더링 영역 */}
      <div style={{ width: "100%", height: 400 }}>
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

            {/* 🌟 종합점수 (TOTAL): 항상 켜져있으며 요청하신 #5EC8A7 고정 색상 */}
            <Bar
              dataKey="TOTAL"
              fill="#5EC8A7"
              name="종합 점수"
              radius={[4, 4, 0, 0]}
            />

            {/* 나머지 9개 카테고리: 체크박스가 활성화(true)된 항목만 동적으로 차트에 추가 */}
            {Object.keys(CATEGORY_CONFIG).map((key) => {
              if (!activeCategories[key]) return null; // 꺼져있으면 렌더링 안 함
              return (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={CATEGORY_CONFIG[key].color}
                  name={CATEGORY_CONFIG[key].name}
                  radius={[4, 4, 0, 0]}
                />
              );
            })}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
