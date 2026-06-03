import styled, { keyframes } from "styled-components";

import stressImage from "../../features/petcare/img/스트레스.png";
import sleepImage from "../../features/petcare/img/수면.png";
import mealImage from "../../features/petcare/img/식사.png";
import exerciseImage from "../../features/petcare/img/운동.png";
import skinImage from "../../features/petcare/img/피부.png";
import eyeImage from "../../features/petcare/img/눈.png";
import teethImage from "../../features/petcare/img/치아.png";

const SCORE_OPTIONS = [
  "아주 그렇지 않다",
  "조금 그렇지 않다",
  "보통",

  "조금 그렇다",
  "아주 그렇다"
];

// 카테고리별 이미지 연결
const CATEGORY_IMAGE_MAP = {
  STRESS: stressImage,
  SLEEP: sleepImage,
  EXERCISE: exerciseImage,
  MEAL: mealImage,
  SKIN: skinImage,
  EYE: eyeImage,
  TEETH: teethImage,
};

function ScoreQuestionStep({
  category,
  title,
  description,
  questionList,
  getAnswerValue,
  onSelect,
}) {
  // 현재 카테고리에 맞는 이미지 선택
  const categoryImage = CATEGORY_IMAGE_MAP[category];

  return (
    <Section>
      {categoryImage && (
        <CategoryImage
          key={category}
          src={categoryImage}
          alt={`${title} 이미지`}
        />
      )}

      <Category>{title}</Category>

      <Title>{description}</Title>

      {questionList.length === 0 ? (
        <Empty>등록된 문항이 없습니다.</Empty>
      ) : (
        <QuestionList>
          {questionList.map((question, questionIndex) => (
            <QuestionCard key={question.questionId} $index={questionIndex}>
              <QuestionText>{question.questionContent}</QuestionText>

              <ScoreButtonList>
                {SCORE_OPTIONS.map((option) => {
                  const isActive =
                    getAnswerValue(question.questionId) === option;

                  return (
                    <ScoreButton
                      key={option}
                      type="button"
                      $active={isActive}
                      onClick={() => onSelect(question.questionId, option)}
                    >
                      {option}
                    </ScoreButton>
                  );
                })}
              </ScoreButtonList>
            </QuestionCard>
          ))}
        </QuestionList>
      )}
    </Section>
  );
}

export default ScoreQuestionStep;

/* =====================================
   등장 애니메이션
===================================== */

const imageAppear = keyframes`
  0% {
    opacity: 0;
    transform: translateY(16px) scale(0.9);
  }

  65% {
    opacity: 1;
    transform: translateY(-3px) scale(1.04);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const textAppear = keyframes`
  0% {
    opacity: 0;
    transform: translateY(8px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const cardAppear = keyframes`
  0% {
    opacity: 0;
    transform: translateY(14px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

/* =====================================
   화면 스타일
===================================== */

const Section = styled.section`
  text-align: center;
`;

const CategoryImage = styled.img`
  width: 82px;
  height: 82px;
  margin-bottom: 10px;

  object-fit: contain;

  animation: ${imageAppear} 0.62s ease-out both;
`;

const Category = styled.p`
  margin: 0;

  color: #333;

  font-size: 20px;
  font-weight: 800;

  animation: ${textAppear} 0.4s ease-out 0.12s both;
`;

const Title = styled.h2`
  margin: 12px 0 24px;

  color: #222;

  font-size: 23px;
  font-weight: 500;

  animation: ${textAppear} 0.4s ease-out 0.18s both;
`;

const Empty = styled.p`
  color: #777;
`;

const QuestionList = styled.div`
  display: flex;
  width: min(720px, 100%);
  flex-direction: column;
  gap: 12px;
  margin: 0 auto;
`;

const QuestionCard = styled.div`
  padding: 14px 14px 13px;

  border: 1px solid #e0ebe7;
  border-radius: 10px;

  background: #ffffff;

  animation: ${cardAppear} 0.4s ease-out
    ${({ $index }) => 0.22 + $index * 0.06}s both;
`;

const QuestionText = styled.p`
  margin: 0 0 14px;

  color: #333;

  font-size: 16px;
  font-weight: 700;
`;

const ScoreButtonList = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 6px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const ScoreButton = styled.button`
  min-height: 38px;
  padding: 5px;

  border: 1px solid ${({ $active }) => ($active ? "#00a97b" : "#cfd8d5")};

  border-radius: 7px;

  background: ${({ $active }) => ($active ? "#00a97b" : "#ffffff")};

  color: ${({ $active }) => ($active ? "#ffffff" : "#666666")};

  font-size: 13px;

  font-weight: ${({ $active }) => ($active ? "700" : "500")};

  cursor: pointer;

  transition:
    border-color 0.18s ease,
    background-color 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    border-color: #00a97b;

    transform: translateY(-3px);

    box-shadow: 0 6px 14px rgba(0, 169, 123, 0.12);
  }

  &:active {
    transform: translateY(-1px) scale(0.99);
  }
`;
