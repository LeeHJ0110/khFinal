import React, { useEffect, useState } from "react";
import styled from "styled-components";

import {
  fetchQuestionList,
  requestDiagnosis,
} from "../../features/petcare/api/petCareApi";

function DiagnosisRequestPage() {
  const [petInfo] = useState({
    petId: 1,
    petName: "깨깨",
    breedName: "비숑 프리제",
    age: "5살",
    weight: "7kg",
    petType: "D",
  });

  const [questionList, setQuestionList] = useState([]);
  const [answerList, setAnswerList] = useState([]);
  const [consultContent, setConsultContent] = useState("");

  const [eyeFiles, setEyeFiles] = useState([]);
  const [skinFiles, setSkinFiles] = useState([]);
  const [teethFiles, setTeethFiles] = useState([]);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await fetchQuestionList(petInfo.petType);
        setQuestionList(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    loadQuestions();
  }, [petInfo.petType]);

  const handleAnswer = (questionId, value) => {
    setAnswerList((prev) => {
      const filtered = prev.filter((item) => item.questionId !== questionId);

      return [
        ...filtered,
        {
          questionId,
          answerValue: value,
        },
      ];
    });
  };

  const getAnswerValue = (questionId) => {
    return (
      answerList.find((item) => item.questionId === questionId)?.answerValue ??
      ""
    );
  };

  const isChecked = (questionId, value) => {
    return getAnswerValue(questionId) === value;
  };

  const handleMultiAnswer = (questionId, option) => {
    const currentValue = getAnswerValue(questionId);

    const currentList = currentValue
      ? currentValue.split(",").filter((item) => item !== "")
      : [];

    let nextList;

    if (currentList.includes(option)) {
      nextList = currentList.filter((item) => item !== option);
    } else {
      nextList = [...currentList, option];
    }

    handleAnswer(questionId, nextList.join(","));
  };

  const isMultiChecked = (questionId, option) => {
    const currentValue = getAnswerValue(questionId);

    if (!currentValue) {
      return false;
    }

    return currentValue.split(",").includes(option);
  };

  const getOptionList = (question) => {
    if (question.optionList && question.optionList.length > 0) {
      return question.optionList;
    }

    if (question.questionType === "SCORE") {
      return ["1", "2", "3", "4", "5"];
    }

    if (question.questionType === "SINGLE") {
      return ["없음", "가끔", "자주"];
    }

    if (question.questionType === "MULTI") {
      return ["기침", "구토", "설사", "가려움", "식욕저하"];
    }

    return [];
  };

  const renderAnswerInput = (question) => {
    const questionId = question.questionId;
    const questionType = question.questionType;

    if (questionType === "YN") {
      return (
        <ButtonGroup>
          <AnswerButton
            type="button"
            $active={isChecked(questionId, "Y")}
            onClick={() => handleAnswer(questionId, "Y")}
          >
            예
          </AnswerButton>

          <AnswerButton
            type="button"
            $active={isChecked(questionId, "N")}
            onClick={() => handleAnswer(questionId, "N")}
          >
            아니오
          </AnswerButton>
        </ButtonGroup>
      );
    }

    if (questionType === "TEXT") {
      return (
        <TextInput
          type="text"
          placeholder="답변을 입력해 주세요."
          value={getAnswerValue(questionId)}
          onChange={(e) => handleAnswer(questionId, e.target.value)}
        />
      );
    }

    if (questionType === "SCORE") {
      return (
        <ScoreGroup>
          {getOptionList(question).map((score) => (
            <ScoreButton
              key={score}
              type="button"
              $active={isChecked(questionId, score)}
              onClick={() => handleAnswer(questionId, score)}
            >
              {score}
            </ScoreButton>
          ))}
        </ScoreGroup>
      );
    }

    if (questionType === "SINGLE") {
      return (
        <OptionGroup>
          {getOptionList(question).map((option) => (
            <OptionButton
              key={option}
              type="button"
              $active={isChecked(questionId, option)}
              onClick={() => handleAnswer(questionId, option)}
            >
              {option}
            </OptionButton>
          ))}
        </OptionGroup>
      );
    }

    if (questionType === "MULTI") {
      return (
        <CheckBoxGroup>
          {getOptionList(question).map((option) => (
            <CheckLabel key={option}>
              <input
                type="checkbox"
                checked={isMultiChecked(questionId, option)}
                onChange={() => handleMultiAnswer(questionId, option)}
              />
              <span>{option}</span>
            </CheckLabel>
          ))}
        </CheckBoxGroup>
      );
    }

    return null;
  };

  const handleSubmit = async () => {
    try {
      const vo = {
        petId: petInfo.petId,
        answerList,
      };

      await requestDiagnosis(vo, eyeFiles, skinFiles, teethFiles);

      alert("건강진단 신청 완료");
    } catch (err) {
      console.error(err);
      alert("건강진단 신청 실패");
    }
  };

  return (
    <Wrapper>
      <Title>건강진단 신청</Title>

      <Section>
        <SectionTitle>반려동물 정보</SectionTitle>

        <PetCard>
          <PetImage />
          <PetText>
            <strong>{petInfo.petName}</strong>
            <span>
              {petInfo.breedName} · {petInfo.age} · {petInfo.weight}
            </span>
          </PetText>
        </PetCard>
      </Section>

      <Section>
        <SectionTitle>문진표 작성</SectionTitle>

        {questionList.map((question) => (
          <QuestionBox key={question.questionId}>
            <QuestionMeta>{question.questionCategory}</QuestionMeta>

            <QuestionText>{question.questionContent}</QuestionText>

            {renderAnswerInput(question)}
          </QuestionBox>
        ))}
      </Section>

      <Section>
        <SectionTitle>이미지 업로드</SectionTitle>

        <UploadGrid>
          <UploadBox>
            <UploadTitle>눈 이미지</UploadTitle>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setEyeFiles([...e.target.files])}
            />
          </UploadBox>

          <UploadBox>
            <UploadTitle>피부 이미지</UploadTitle>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setSkinFiles([...e.target.files])}
            />
          </UploadBox>

          <UploadBox>
            <UploadTitle>치아 이미지</UploadTitle>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setTeethFiles([...e.target.files])}
            />
          </UploadBox>
        </UploadGrid>
      </Section>

      <Section>
        <SectionTitle>상담 내용</SectionTitle>

        <TextArea
          placeholder="수의사에게 전달할 상담 내용을 작성해 주세요."
          value={consultContent}
          onChange={(e) => setConsultContent(e.target.value)}
        />
      </Section>

      <SubmitButton onClick={handleSubmit}>건강진단 신청</SubmitButton>
    </Wrapper>
  );
}

export default DiagnosisRequestPage;

const Wrapper = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: 32px 48px 80px;
  box-sizing: border-box;
`;

const Title = styled.h1`
  color: #00a97b;
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 32px;
`;

const Section = styled.section`
  margin-bottom: 28px;
  padding: 28px;
  border: 1px solid #d8eee6;
  border-radius: 14px;
  background: #fff;
`;

const SectionTitle = styled.h2`
  color: #00a97b;
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 18px;
`;

const PetCard = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const PetImage = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #ddd;
`;

const PetText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  strong {
    font-size: 22px;
  }

  span {
    color: #555;
    font-size: 14px;
  }
`;

const QuestionBox = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const QuestionMeta = styled.p`
  color: #00a97b;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 6px;
`;

const QuestionText = styled.p`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 12px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const AnswerButton = styled.button`
  width: 86px;
  height: 38px;
  border: 1px solid #00a97b;
  border-radius: 8px;
  background: ${({ $active }) => ($active ? "#00a97b" : "white")};
  color: ${({ $active }) => ($active ? "white" : "#00a97b")};
  font-weight: 700;
  cursor: pointer;
`;

const TextInput = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 14px;
  border: 1px solid #d8eee6;
  border-radius: 8px;
  box-sizing: border-box;
`;

const ScoreGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ScoreButton = styled.button`
  width: 42px;
  height: 38px;
  border: 1px solid #00a97b;
  border-radius: 8px;
  background: ${({ $active }) => ($active ? "#00a97b" : "white")};
  color: ${({ $active }) => ($active ? "white" : "#00a97b")};
  font-weight: 700;
  cursor: pointer;
`;

const OptionGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const OptionButton = styled.button`
  min-width: 72px;
  height: 38px;
  padding: 0 14px;
  border: 1px solid #00a97b;
  border-radius: 8px;
  background: ${({ $active }) => ($active ? "#00a97b" : "white")};
  color: ${({ $active }) => ($active ? "white" : "#00a97b")};
  font-weight: 700;
  cursor: pointer;
`;

const CheckBoxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const CheckLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;

  padding: 9px 12px;
  border: 1px solid #d8eee6;
  border-radius: 8px;
  background: #f4fbf8;

  font-size: 14px;
  font-weight: 700;
  color: #333;

  cursor: pointer;

  input {
    accent-color: #00a97b;
  }
`;

const UploadGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
`;

const UploadBox = styled.div`
  padding: 20px;
  border: 1px dashed #00a97b;
  border-radius: 12px;
  background: #f4fbf8;
`;

const UploadTitle = styled.h3`
  color: #00a97b;
  font-size: 16px;
  margin-bottom: 12px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 150px;
  padding: 16px;
  border: 1px solid #d8eee6;
  border-radius: 12px;
  resize: none;
  font-size: 15px;
  box-sizing: border-box;
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 58px;
  border: none;
  border-radius: 12px;
  background: #00a97b;
  color: white;
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;
`;
