import styled, { keyframes } from "styled-components";

import vaccineImage from "../../features/petcare/img/예방접종.png";
import diseaseImage from "../../features/petcare/img/질병이력.png";

function YnQuestionStep({
  title,
  description,
  questionList,
  isSelected,
  onToggle,
}) {
  // title 값에 따라 이미지 변경
  const categoryImage =
    title === "예방접종"
      ? vaccineImage
      : title === "질병 이력"
        ? diseaseImage
        : null;

  return (
    <Section>
      {categoryImage && (
        <CategoryImage
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
          {questionList.map((question, index) => (
            <QuestionButton
              key={question.questionId}
              type="button"
              $active={isSelected(question.questionId)}
              $index={index}
              onClick={() => onToggle(question.questionId)}
            >
              {question.questionContent}
            </QuestionButton>
          ))}
        </QuestionList>
      )}
    </Section>
  );
}

export default YnQuestionStep;

/* ==============================
   등장 애니메이션
============================== */

const imageAppear = keyframes`
  0% {
    opacity: 0;
    transform: translateY(18px) scale(0.88);
  }

  65% {
    opacity: 1;
    transform: translateY(-4px) scale(1.04);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const textAppear = keyframes`
  0% {
    opacity: 0;
    transform: translateY(10px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const buttonAppear = keyframes`
  0% {
    opacity: 0;
    transform: translateY(12px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const selectedPulse = keyframes`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.025);
  }

  100% {
    transform: scale(1);
  }
`;

/* ==============================
   전체 영역
============================== */

const Section = styled.section`
  text-align: center;
`;

const CategoryImage = styled.img`
  width: 82px;
  height: 82px;
  margin-bottom: 10px;

  object-fit: contain;

  animation: ${imageAppear} 0.55s ease-out both;
`;

const Category = styled.p`
  margin: 0;

  color: #333;

  font-size: 18px;
  font-weight: 800;

  animation: ${textAppear} 0.4s ease-out 0.12s both;
`;

const Title = styled.h2`
  margin: 12px 0 20px;

  color: #222;

  font-size: 25px;
  font-weight: 500;

  animation: ${textAppear} 0.4s ease-out 0.2s both;
`;

const Empty = styled.p`
  color: #777;

  animation: ${textAppear} 0.4s ease-out both;
`;

const QuestionList = styled.div`
  display: flex;

  width: min(560px, 100%);

  flex-direction: column;
  gap: 10px;

  margin: 0 auto;
`;

const QuestionButton = styled.button`
  min-height: 44px;

  padding: 0 16px;

  border: 1px solid
    ${({ $active }) =>
      $active ? "#00a97b" : "#cfd8d5"};

  border-radius: 8px;

  background: ${({ $active }) =>
    $active ? "#00a97b" : "#ffffff"};

  color: ${({ $active }) =>
    $active ? "#ffffff" : "#666666"};

  font-size: 15px;
  font-weight: ${({ $active }) =>
    $active ? "700" : "500"};

  cursor: pointer;

  animation:
    ${buttonAppear} 0.38s ease-out
      ${({ $index }) => 0.24 + $index * 0.06}s both,
    ${({ $active }) =>
        $active
          ? selectedPulse
          : "none"}
      0.28s ease-out;

  transition:
    border-color 0.18s ease,
    background-color 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    border-color: #00a97b;

    transform: translateY(-3px);

    box-shadow: 0 7px 15px rgba(0, 169, 123, 0.13);
  }

  &:active {
    transform: translateY(-1px) scale(0.99);
  }
`;