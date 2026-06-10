import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { getMyInfo } from "../../features/mypage/member/api/mypageMemberApi";

import {
  fetchMyPetList,
  fetchQuestionList,
  updatePetWeight,
} from "../../features/petcare/api/petCareApi";

import useRequestDiagnosis from "../../features/petcare/hooks/useRequestDiagnosis";

import DiagnosisProgress from "./DiagnosisProgress";
import PetSelectStep from "./PetSelectStep";
import YnQuestionStep from "./YnQuestionStep";
import ScoreQuestionStep from "./ScoreQuestionStep";
import ConsultStep from "./ConsultStep";
import ImageUploadStep from "./ImageUploadStep";

// =========================================================
// 자가진단 카테고리 이동 순서
// =========================================================
const SELF_CATEGORY_ORDER = [
  "STRESS",
  "SLEEP",
  "EXERCISE",
  "MEAL",
  "SKIN",
  "EYE",
  "TEETH",
  "CONSULT",
];

// =========================================================
// 카테고리 한글 표시
// =========================================================
function formatQuestionCategory(category) {
  if (category === "STRESS") return "스트레스";
  if (category === "SLEEP") return "수면";
  if (category === "EXERCISE") return "운동";
  if (category === "MEAL") return "식사";
  if (category === "SKIN") return "피부";
  if (category === "EYE") return "눈";
  if (category === "TEETH") return "치아";
  if (category === "CONSULT") return "기타 특이사항";

  return category;
}

// =========================================================
// 진단 신청 총괄 페이지
// =========================================================
function DiagnosisRequestPage() {
  const navigate = useNavigate();

  // =========================================================
  // 건강진단 신청 요청 훅
  // =========================================================
  const {
    submitDiagnosis,
    isSubmitting,
    errorMessage: submitErrorMessage,
  } = useRequestDiagnosis();

  /*
   * 상단 진행 단계
   * BASIC    : 기본정보
   * SELF     : 자가진단
   * IMAGE    : 이미지 분석
   * COMPLETE : 신청 완료
   */
  const [mainStep, setMainStep] = useState("BASIC");

  /*
   * 기본정보 내부 단계
   * PET     : 펫 선택 + 현재 체중
   * VACCINE : 예방접종
   * DISEASE : 질병 이력
   */
  const [basicStep, setBasicStep] = useState("PET");

  // 자가진단 내부 카테고리
  const [selfStep, setSelfStep] = useState("STRESS");

  // 로그인 회원 정보
  const [memberInfo, setMemberInfo] = useState(null);

  // 로그인한 회원의 반려동물 목록
  const [petList, setPetList] = useState([]);

  // 현재 선택한 반려동물
  const [selectedPet, setSelectedPet] = useState(null);

  // 사용자가 입력한 현재 체중
  const [currentWeight, setCurrentWeight] = useState("");

  // 전체 질문 목록
  const [questionList, setQuestionList] = useState([]);

  // 전체 답변 목록
  const [answerList, setAnswerList] = useState([]);

  // 이미지 분석 단계 업로드 파일
  const [eyeFiles, setEyeFiles] = useState([]);
  const [skinFiles, setSkinFiles] = useState([]);
  const [teethFiles, setTeethFiles] = useState([]);

  // 최초 화면 로딩 여부
  const [isLoading, setIsLoading] = useState(true);

  // 체중 저장 중 여부
  const [isWeightSaving, setIsWeightSaving] = useState(false);

  // =========================================================
  // 회원 정보 + 펫 목록 조회
  // =========================================================
  useEffect(() => {
    async function loadInitialData() {
      try {
        setIsLoading(true);

        const [memberRes, petRes] = await Promise.all([
          getMyInfo(),
          fetchMyPetList(),
        ]);

        const pets = petRes.data ?? [];

        setMemberInfo(memberRes.data);
        setPetList(pets);

        // 신청 중이 아닌 첫 번째 펫을 기본 선택
        const selectablePet = pets.find(
          (pet) => pet.diagnosisInProgress !== true,
        );

        if (selectablePet) {
          setSelectedPet(selectablePet);
          setCurrentWeight(selectablePet.weight ?? "");
        } else {
          setSelectedPet(null);
          setCurrentWeight("");
        }
      } catch (error) {
        console.error("초기 데이터 조회 실패:", error);

        alert("회원 또는 반려동물 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, []);

  // =========================================================
  // 선택한 펫이 바뀌면 해당 동물의 질문 목록 조회
  // =========================================================
  useEffect(() => {
    if (!selectedPet?.petId) {
      return;
    }

    async function loadQuestions() {
      try {
        const response = await fetchQuestionList(selectedPet.petType);

        const questions = response.data ?? [];

        setQuestionList(questions);

        setAnswerList(
          questions.map((question) => ({
            questionId: question.questionId,
            questionCategory: question.questionCategory,
            questionContent: question.questionContent,
            answerValue: question.questionType === "YN" ? "N" : "",
          })),
        );
      } catch (error) {
        console.error("질문 목록 조회 실패:", error);

        alert("질문을 불러오지 못했습니다.");
      }
    }

    loadQuestions();
  }, [selectedPet?.petId, selectedPet?.petType]);

  // =========================================================
  // 예방접종 YN 질문
  // =========================================================
  const vaccineQuestionList = questionList.filter(
    (question) =>
      question.questionCategory === "VACCINE" && question.questionType === "YN",
  );

  // =========================================================
  // 질병 이력 YN 질문
  // =========================================================
  const diseaseQuestionList = questionList.filter(
    (question) =>
      question.questionCategory === "DISEASE" && question.questionType === "YN",
  );

  // =========================================================
  // 현재 자가진단 SCORE 질문
  // =========================================================
  const currentScoreQuestionList = questionList.filter(
    (question) =>
      question.questionCategory === selfStep &&
      question.questionType === "SCORE",
  );

  // =========================================================
  // 상담 내용 TEXT 질문
  // =========================================================
  const consultQuestion = questionList.find(
    (question) =>
      question.questionCategory === "CONSULT" &&
      question.questionType === "TEXT",
  );

  // =========================================================
  // 반려동물 선택
  // =========================================================
  function handleSelectPet(pet) {
    setSelectedPet(pet);
    setCurrentWeight(pet.weight ?? "");

    // 다른 반려동물을 선택하면 기존 이미지 초기화
    setEyeFiles([]);
    setSkinFiles([]);
    setTeethFiles([]);
  }

  // =========================================================
  // 현재 체중 저장
  // =========================================================
  async function handleUpdateWeight() {
    if (!selectedPet) {
      alert("반려동물을 먼저 선택해 주세요.");

      return;
    }

    const nextWeight = Number(currentWeight);

    if (currentWeight === "" || Number.isNaN(nextWeight) || nextWeight <= 0) {
      alert("현재 체중을 올바르게 입력해 주세요.");

      return;
    }

    try {
      setIsWeightSaving(true);

      // 기존 펫 정보 + 변경된 몸무게 전송
      await updatePetWeight(selectedPet, nextWeight);

      // 화면에 표시되는 목록 값 수정
      setPetList((previousPetList) =>
        previousPetList.map((pet) =>
          pet.petId === selectedPet.petId
            ? {
                ...pet,
                weight: nextWeight,
              }
            : pet,
        ),
      );

      // 현재 선택한 펫 값도 수정
      setSelectedPet((previousPet) => ({
        ...previousPet,
        weight: nextWeight,
      }));

      alert("현재 체중이 저장되었습니다.");
    } catch (error) {
      console.error("몸무게 수정 실패:", error);
      console.error("응답 상태:", error.response?.status);
      console.error("응답 데이터:", error.response?.data);

      alert("현재 체중을 저장하지 못했습니다.");
    } finally {
      setIsWeightSaving(false);
    }
  }

  // =========================================================
  // YN 답변 토글
  // N → Y → N
  // =========================================================
  function handleYnToggle(questionId) {
    setAnswerList((previousAnswerList) =>
      previousAnswerList.map((answer) =>
        answer.questionId === questionId
          ? {
              ...answer,
              answerValue: answer.answerValue === "Y" ? "N" : "Y",
            }
          : answer,
      ),
    );
  }

  // =========================================================
  // 현재 YN 답변이 Y인지 확인
  // =========================================================
  function isYnSelected(questionId) {
    return (
      answerList.find((answer) => answer.questionId === questionId)
        ?.answerValue === "Y"
    );
  }

  // =========================================================
  // SCORE 또는 TEXT 답변 변경
  // =========================================================
  function handleAnswerChange(questionId, value) {
    setAnswerList((previousAnswerList) =>
      previousAnswerList.map((answer) =>
        answer.questionId === questionId
          ? {
              ...answer,
              answerValue: value,
            }
          : answer,
      ),
    );
  }

  // =========================================================
  // 특정 질문의 현재 답변값 조회
  // =========================================================
  function getAnswerValue(questionId) {
    return (
      answerList.find((answer) => answer.questionId === questionId)
        ?.answerValue ?? ""
    );
  }

  // =========================================================
  // 현재 SCORE 카테고리의 문항을 모두 선택했는지 검사
  // =========================================================
  function hasEmptyScoreAnswer() {
    return currentScoreQuestionList.some(
      (question) => getAnswerValue(question.questionId) === "",
    );
  }

  // =========================================================
  // 다음 버튼
  // =========================================================
  function handleNext() {
    // 기본정보 1: 펫 선택
    if (mainStep === "BASIC" && basicStep === "PET") {
      if (!selectedPet) {
        alert("반려동물을 선택해 주세요.");

        return;
      }

      setBasicStep("VACCINE");

      return;
    }

    // 기본정보 2: 예방접종
    if (mainStep === "BASIC" && basicStep === "VACCINE") {
      setBasicStep("DISEASE");

      return;
    }

    // 기본정보 3: 질병 이력
    if (mainStep === "BASIC" && basicStep === "DISEASE") {
      setMainStep("SELF");
      setSelfStep("STRESS");

      return;
    }

    // 자가진단: SCORE 카테고리
    if (mainStep === "SELF" && selfStep !== "CONSULT") {
      if (currentScoreQuestionList.length === 0) {
        alert(
          `${formatQuestionCategory(selfStep)} 문항이 등록되어 있지 않습니다.`,
        );

        return;
      }

      if (hasEmptyScoreAnswer()) {
        alert("모든 문항에 답변해 주세요.");

        return;
      }

      const currentIndex = SELF_CATEGORY_ORDER.indexOf(selfStep);

      const nextCategory = SELF_CATEGORY_ORDER[currentIndex + 1];

      setSelfStep(nextCategory);

      return;
    }

    // 자가진단: 상담 내용까지 완료
    if (mainStep === "SELF" && selfStep === "CONSULT") {
      setMainStep("IMAGE");
    }
  }

  // =========================================================
  // 건강진단 최종 신청
  // =========================================================
  async function handleSubmit() {
    if (!selectedPet) {
      alert("반려동물을 선택해 주세요.");

      return;
    }

    if (eyeFiles.length === 0) {
      alert("눈 이미지를 1장 이상 등록해 주세요.");

      return;
    }

    if (skinFiles.length === 0) {
      alert("피부 이미지를 1장 이상 등록해 주세요.");

      return;
    }

    if (teethFiles.length === 0) {
      alert("치아 이미지를 1장 이상 등록해 주세요.");

      return;
    }

    try {
      await submitDiagnosis({
        petId: selectedPet.petId,
        answerList,
        eyeFiles,
        skinFiles,
        teethFiles,
      });

      setMainStep("COMPLETE");

      alert("건강진단 신청이 완료되었습니다.");
    } catch (error) {
      console.error("건강진단 최종 신청 실패:", error);

      alert(
        error.response?.data?.message ||
          submitErrorMessage ||
          "건강진단 신청에 실패했습니다.",
      );
    }
  }

  // =========================================================
  // 이전 버튼
  // =========================================================
  function handlePrevious() {
    // 펫 선택 화면 → 이전 페이지
    if (mainStep === "BASIC" && basicStep === "PET") {
      window.history.back();

      return;
    }

    // 예방접종 → 펫 선택
    if (mainStep === "BASIC" && basicStep === "VACCINE") {
      setBasicStep("PET");

      return;
    }

    // 질병 이력 → 예방접종
    if (mainStep === "BASIC" && basicStep === "DISEASE") {
      setBasicStep("VACCINE");

      return;
    }

    // 자가진단 내부 이전 카테고리
    if (mainStep === "SELF") {
      const currentIndex = SELF_CATEGORY_ORDER.indexOf(selfStep);

      // 스트레스 → 질병 이력
      if (currentIndex === 0) {
        setMainStep("BASIC");
        setBasicStep("DISEASE");

        return;
      }

      setSelfStep(SELF_CATEGORY_ORDER[currentIndex - 1]);

      return;
    }

    // 이미지 분석 → 상담 내용
    if (mainStep === "IMAGE") {
      setMainStep("SELF");
      setSelfStep("CONSULT");

      return;
    }

    // 신청 완료 → 이미지 분석
    if (mainStep === "COMPLETE") {
      setMainStep("IMAGE");
    }
  }

  if (isLoading) {
    return <Wrapper>정보를 불러오는 중입니다.</Wrapper>;
  }

  return (
    <Wrapper>
      <Title>건강 진단 신청</Title>

      <DiagnosisProgress mainStep={mainStep} />

      <StepContent>
        {/* 기본정보 1: 펫 선택 + 현재 체중 */}
        {mainStep === "BASIC" && basicStep === "PET" && (
          <PetSelectStep
            memberInfo={memberInfo}
            petList={petList}
            selectedPet={selectedPet}
            currentWeight={currentWeight}
            isWeightSaving={isWeightSaving}
            onSelectPet={handleSelectPet}
            onChangeWeight={setCurrentWeight}
            onSaveWeight={handleUpdateWeight}
          />
        )}

        {/* 기본정보 2: 예방접종 */}
        {mainStep === "BASIC" && basicStep === "VACCINE" && (
          <YnQuestionStep
            title="예방접종"
            description="최근 1년 이내 접종한 항목을 모두 선택해 주세요."
            questionList={vaccineQuestionList}
            isSelected={isYnSelected}
            onToggle={handleYnToggle}
          />
        )}

        {/* 기본정보 3: 질병 이력 */}
        {mainStep === "BASIC" && basicStep === "DISEASE" && (
          <YnQuestionStep
            title="질병 이력"
            description="진단받거나 치료받은 이력이 있는 항목을 모두 선택해 주세요."
            questionList={diseaseQuestionList}
            isSelected={isYnSelected}
            onToggle={handleYnToggle}
          />
        )}

        {/* 자가진단: SCORE 카테고리 */}
        {mainStep === "SELF" && selfStep !== "CONSULT" && (
          <ScoreQuestionStep
            category={selfStep}
            title={formatQuestionCategory(selfStep)}
            description="현재 상태와 가장 가까운 항목을 선택해 주세요."
            questionList={currentScoreQuestionList}
            getAnswerValue={getAnswerValue}
            onSelect={handleAnswerChange}
          />
        )}

        {/* 자가진단: 상담 내용 */}
        {mainStep === "SELF" && selfStep === "CONSULT" && (
          <ConsultStep
            question={consultQuestion}
            value={
              consultQuestion ? getAnswerValue(consultQuestion.questionId) : ""
            }
            onChange={handleAnswerChange}
          />
        )}

        {/* 이미지 분석 */}
        {mainStep === "IMAGE" && (
          <ImageUploadStep
            eyeFiles={eyeFiles}
            skinFiles={skinFiles}
            teethFiles={teethFiles}
            onChangeEyeFiles={setEyeFiles}
            onChangeSkinFiles={setSkinFiles}
            onChangeTeethFiles={setTeethFiles}
          />
        )}

        {/* 신청 완료 */}
        {mainStep === "COMPLETE" && (
          <TemporaryBox>
            <TemporaryTitle>건강진단 신청 완료</TemporaryTitle>

            <TemporaryText>
              건강진단 신청이 정상적으로 접수되었습니다.
            </TemporaryText>
          </TemporaryBox>
        )}
      </StepContent>

      <ButtonGroup>
        {mainStep === "COMPLETE" ? (
          <NavigationButton
            type="button"
            $primary
            onClick={() => navigate("/healthcare/requesthome")}
          >
            제출완료
          </NavigationButton>
        ) : (
          <>
            <NavigationButton type="button" onClick={handlePrevious}>
              이전
            </NavigationButton>

            <NavigationButton
              type="button"
              $primary
              disabled={isSubmitting}
              onClick={mainStep === "IMAGE" ? handleSubmit : handleNext}
            >
              {mainStep === "IMAGE"
                ? isSubmitting
                  ? "신청 중"
                  : "건강진단 신청"
                : "다음"}
            </NavigationButton>
          </>
        )}
      </ButtonGroup>
    </Wrapper>
  );
}

export default DiagnosisRequestPage;

// =========================================================
// styled-components
// =========================================================
const Wrapper = styled.main`
  width: min(1100px, calc(100% - 48px));

  margin: 0 auto;
  padding: 54px 0 50px;

  box-sizing: border-box;
`;

const Title = styled.h1`
  margin: 0 0 22px;

  color: #00a97b;

  font-size: 36px;
  font-weight: 800;
  text-align: center;
  letter-spacing: -1.5px;
`;

const TemporaryBox = styled.section`
  padding: 58px 24px;

  border: 1px solid #e0ebe7;
  border-radius: 14px;

  background: #f8fcfa;

  text-align: center;
`;

const TemporaryTitle = styled.h2`
  margin: 0 0 12px;

  color: #00a97b;

  font-size: 26px;
  font-weight: 800;
`;

const TemporaryText = styled.p`
  margin: 0;

  color: #666;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;

  margin-top: 34px;
`;

const NavigationButton = styled.button`
  min-width: 132px;
  height: 42px;

  padding: 0 18px;

  border: 1px solid ${({ $primary }) => ($primary ? "#00a97b" : "#d5e8e1")};

  border-radius: 8px;

  background: ${({ $primary }) => ($primary ? "#00a97b" : "#e7f4ef")};

  color: ${({ $primary }) => ($primary ? "#ffffff" : "#00a97b")};

  font-size: 14px;
  font-weight: 800;

  cursor: pointer;

  transition: 0.2s ease;

  &:hover {
    transform: translateY(-2px);

    box-shadow: 0 5px 12px rgba(0, 169, 123, 0.14);
  }

  &:disabled {
    background: #9dcfc0;

    cursor: not-allowed;

    transform: none;
  }
`;

const StepContent = styled.section`
  min-height: 400px;
`;
