import React, { useEffect, useState } from "react";
import { getMyInfo } from "../../features/mypage/member/api/mypageMemberApi";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import {
  fetchQuestionList,
  requestDiagnosis,
  fetchMyPetList,
} from "../../features/petcare/api/petCareApi";

function DiagnosisRequestPage() {
  const [petList, setPetList] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);

  const [questionList, setQuestionList] = useState([]);
  const [answerList, setAnswerList] = useState([]);
  const [consultContent, setConsultContent] = useState("");

  const [eyeFiles, setEyeFiles] = useState([]);
  const [skinFiles, setSkinFiles] = useState([]);
  const [teethFiles, setTeethFiles] = useState([]);
  const [memberInfo, setMemberInfo] = useState(null);
  const formatPetType = (petType) => {
    if (petType === "DOG") return "강아지";
    if (petType === "CAT") return "고양이";
    return petType ?? "-";
  };
  const formatQuestionCategory = (category) => {
    if (category === "VACCINE") return "예방접종";
    if (category === "DISEASE") return "질병이력";
    if (category === "STRESS") return "스트레스";
    if (category === "SLEEP") return "수면";
    if (category === "EXERCISE") return "운동";
    if (category === "MEAL") return "식사";
    if (category === "SKIN") return "피부";
    if (category === "EYE") return "눈";
    if (category === "TEETH") return "치아";
    if (category === "CONSULT") return "기타 특이사항";

    return category ?? "-";
  };
  const formatGender = (gender) => {
    if (gender === "M") return "수컷";
    if (gender === "F") return "암컷";
    return gender ?? "-";
  };

  const formatRepresentYn = (representYn) => {
    if (representYn === "Y") return "대표동물";
    if (representYn === "N") return "일반동물";
    return representYn ?? "-";
  };

  useEffect(() => {
    async function loadPetList() {
      try {
        const res = await fetchMyPetList();
        setPetList(res.data);
        console.log("반려동물 목록:", res.data);

        if (res.data.length > 0) {
          setSelectedPet(res.data[0]);
        }
      } catch (err) {
        console.error(err);
        alert("반려동물 정보를 불러오지 못했습니다.");
      }
    }

    loadPetList();
  }, []);

  useEffect(() => {
    if (!selectedPet) return;

    async function loadQuestions() {
      try {
        const res = await fetchQuestionList(selectedPet.petType);
        setQuestionList(res.data);
        setAnswerList([]);
      } catch (err) {
        console.error(err);
      }
    }

    loadQuestions();
  }, [selectedPet]);

  useEffect(() => {
    async function loadMemberInfo() {
      try {
        const res = await getMyInfo();
        setMemberInfo(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    loadMemberInfo();
  }, []);

  const handlePetChange = (e) => {
    const petId = Number(e.target.value);
    const pet = petList.find((item) => item.petId === petId);

    setSelectedPet(pet);
  };

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
      return [
        "매우 그렇지않음",
        "조금 그렇지않음",
        "보통",
        "조금 그렇다",
        "매우그렇다",
      ];
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
    if (!selectedPet) {
      alert("반려동물을 선택해 주세요.");
      return;
    }

    try {
      const vo = {
        petId: selectedPet.petId,
        consultContent,
        answerList,
      };
      console.log(vo);

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
      <p>보호자 정보 : {memberInfo?.nickname}</p>
      <Section>
        <SectionTitle>반려동물 정보</SectionTitle>

        {petList.length > 0 && (
          <PetSelect
            value={selectedPet?.petId ?? ""}
            onChange={handlePetChange}
          >
            {petList.map((pet) => (
              <option key={pet.petId} value={pet.petId}>
                {pet.name}
              </option>
            ))}
          </PetSelect>
        )}

        {selectedPet && (
          <PetCard>
            <PetImage>{selectedPet.name?.substring(0, 1)}</PetImage>

            <PetText>
              <strong>{selectedPet.name}</strong>

              <PetInfoList>
                <span>{formatPetType(selectedPet.petType)}</span>
                <span>{selectedPet.breedName ?? "품종 미등록"}</span>
                <span>{formatGender(selectedPet.gender)}</span>
                <span>{selectedPet.birthDate ?? "생년월일 미등록"}</span>
                <span>
                  {selectedPet.weight != null
                    ? `${selectedPet.weight}kg`
                    : "몸무게 미등록"}
                </span>
                <span>{formatRepresentYn(selectedPet.representYn)}</span>
              </PetInfoList>
            </PetText>
          </PetCard>
        )}
      </Section>

      <Section>
        <SectionTitle>문진표 작성</SectionTitle>

        {questionList.map((question) => (
          <QuestionBox key={question.questionId}>
            <QuestionMeta>
              {formatQuestionCategory(question.questionCategory)}
            </QuestionMeta>
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

const PetSelect = styled.select`
  width: 240px;
  height: 42px;
  margin-bottom: 18px;
  padding: 0 12px;
  border: 1px solid #d8eee6;
  border-radius: 8px;
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
  background: #d8eee6;
  color: #00a97b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 800;
`;

const PetText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  strong {
    font-size: 22px;
  }
`;

const PetInfoList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  span {
    padding: 6px 10px;
    border-radius: 999px;
    background: #f4fbf8;
    color: #555;
    font-size: 14px;
    font-weight: 700;
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
  min-width: 70px;
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
