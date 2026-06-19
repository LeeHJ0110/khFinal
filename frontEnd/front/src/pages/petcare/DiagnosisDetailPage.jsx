import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";

import usePetCareDetail from "../../features/petcare/hooks/usePetCareDetail";
import useKarte from "../../features/karte/hooks/useKarte";

import {
  completeDiagnosis,
  rejectDiagnosis,
} from "../../features/petcare/api/petCareApi";

// =========================================================
// 문진 카테고리 정보
// =========================================================
const CATEGORY_META = {
  VACCINE: {
    label: "예방접종",
    description: "예방접종 여부와 관련 이력을 확인합니다.",
  },

  DISEASE: {
    label: "질병 이력",
    description: "기존 진단 또는 치료 이력을 확인합니다.",
  },

  STRESS: {
    label: "스트레스",
    description: "행동 변화와 스트레스 반응을 확인합니다.",
  },

  SLEEP: {
    label: "수면",
    description: "수면 시간과 휴식 상태를 확인합니다.",
  },

  EXERCISE: {
    label: "운동",
    description: "활동량과 운동 상태를 확인합니다.",
  },

  MEAL: {
    label: "식사",
    description: "식욕과 식습관 변화를 확인합니다.",
  },

  SKIN: {
    label: "피부",
    description: "피부와 피모 상태를 확인합니다.",
  },

  EYE: {
    label: "눈",
    description: "눈과 눈 주변 상태를 확인합니다.",
  },

  TEETH: {
    label: "치아",
    description: "구강과 치아 상태를 확인합니다.",
  },

  CONSULT: {
    label: "보호자 상담 내용",
    description: "보호자가 추가로 작성한 내용을 확인합니다.",
  },
};

const CATEGORY_ORDER = [
  "VACCINE",
  "DISEASE",
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
// 날짜 표시
// =========================================================
function formatDate(dateStr) {
  if (!dateStr) {
    return "-";
  }

  const date = new Date(dateStr);

  if (Number.isNaN(date.getTime())) {
    return dateStr;
  }

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

// =========================================================
// 생년월일 표시
// =========================================================
function formatBirthDate(birthDate) {
  if (!birthDate) {
    return "-";
  }

  const text = String(birthDate);

  if (text.length === 8) {
    return `${text.slice(0, 4)}.${text.slice(4, 6)}.${text.slice(6, 8)}`;
  }

  return text;
}

// =========================================================
// 만 나이 계산
// =========================================================
function calculateAge(birthDate) {
  if (!birthDate) {
    return null;
  }

  const text = String(birthDate);

  let year;
  let month;
  let day;

  if (text.length === 8) {
    year = Number(text.slice(0, 4));
    month = Number(text.slice(4, 6));
    day = Number(text.slice(6, 8));
  } else {
    const parsedDate = new Date(text);

    if (Number.isNaN(parsedDate.getTime())) {
      return null;
    }

    year = parsedDate.getFullYear();
    month = parsedDate.getMonth() + 1;
    day = parsedDate.getDate();
  }

  const today = new Date();

  let age = today.getFullYear() - year;

  const birthdayPassed =
    today.getMonth() + 1 > month ||
    (today.getMonth() + 1 === month && today.getDate() >= day);

  if (!birthdayPassed) {
    age -= 1;
  }

  return age;
}

// =========================================================
// 반려동물 종류 표시
// =========================================================
function formatPetType(petType) {
  if (petType === "DOG" || petType === "D") {
    return "강아지";
  }

  if (petType === "CAT" || petType === "C") {
    return "고양이";
  }

  return petType ?? "-";
}

// =========================================================
// 성별 표시
// =========================================================
function formatGender(gender) {
  if (gender === "M") {
    return "수컷";
  }

  if (gender === "F") {
    return "암컷";
  }

  return gender ?? "-";
}

// =========================================================
// 진단 상태 표시
// =========================================================
function formatStatus(status) {
  if (status === "Y") {
    return "평가 대기";
  }

  if (status === "N") {
    return "평가 완료";
  }

  return "상태 확인 필요";
}

// =========================================================
// 문진 답변 표시
// =========================================================
function getAnswerText(value) {
  if (value === null || value === undefined || String(value).trim() === "") {
    return "-";
  }

  if (value === "Y") {
    return "예";
  }

  if (value === "N") {
    return "아니오";
  }

  return value;
}

// =========================================================
// 이미지 카테고리 표시
// =========================================================
function getImageCategoryLabel(category) {
  return CATEGORY_META[category]?.label ?? category ?? "기타";
}

// =========================================================
// 이미지 URL 필드 대응
// =========================================================
function getImageUrl(file) {
  return (
    file.imgUrl ||
    file.imageUrl ||
    file.url ||
    file.fileUrl ||
    file.imagePath ||
    null
  );
}

function DiagnosisDetailPage() {
  const navigate = useNavigate();

  const { id } = useParams();

  const { petCareVo, asyncFetchPetCareDetail, isLoading } = usePetCareDetail();

  const { asyncFetchKarteWrite, isSuccess } = useKarte();

  const [categoryScores, setCategoryScores] = useState({});

  const [opinion, setOpinion] = useState("");

  const [summary, setSummary] = useState("");

  const [isRejecting, setIsRejecting] = useState(false);

  const [imageModal, setImageModal] = useState(null);

  const completeRequestRef = useRef(false);

  // =========================================================
  // 상세 정보 조회
  // =========================================================
  useEffect(() => {
    if (id) {
      asyncFetchPetCareDetail(id);
    }
  }, [id]);

  useEffect(() => {
    console.log("상세조회 응답:", petCareVo);
    console.log("이미지 목록:", petCareVo?.fileList);
  }, [petCareVo]);

  // =========================================================
  // 상세 번호 변경 시 완료 요청 상태 초기화
  // =========================================================
  useEffect(() => {
    completeRequestRef.current = false;
  }, [id]);

  // =========================================================
  // 평가 저장 성공 후 진단 상태 완료 처리
  // =========================================================
  useEffect(() => {
    if (!isSuccess || !id || completeRequestRef.current) {
      return;
    }

    completeRequestRef.current = true;

    async function completeAndMove() {
      try {
        await completeDiagnosis(id);

        window.alert("평가 저장이 완료되었습니다.");

        navigate(-1);
      } catch (error) {
        completeRequestRef.current = false;

        console.error("건강진단 완료 처리 실패:", error);

        window.alert(
          error.response?.data?.message ||
            "평가는 저장되었지만 완료 처리에 실패했습니다.",
        );
      }
    }

    completeAndMove();
  }, [isSuccess, id, navigate]);

  const answerList = petCareVo?.answerList ?? [];

  const fileList = petCareVo?.fileList ?? [];

  // =========================================================
  // 문진 답변 카테고리별 그룹화
  // =========================================================
  const groupedAnswers = useMemo(() => {
    return answerList.reduce((groupMap, answer) => {
      const category = answer.questionCategory ?? "ETC";

      if (!groupMap[category]) {
        groupMap[category] = [];
      }

      groupMap[category].push(answer);

      return groupMap;
    }, {});
  }, [answerList]);

  // =========================================================
  // 화면에 노출할 카테고리 순서
  // =========================================================
  const visibleCategories = useMemo(() => {
    const registeredCategories = CATEGORY_ORDER.filter(
      (category) =>
        groupedAnswers[category] && groupedAnswers[category].length > 0,
    );

    const extraCategories = Object.keys(groupedAnswers).filter(
      (category) => !CATEGORY_ORDER.includes(category),
    );

    return [...registeredCategories, ...extraCategories];
  }, [groupedAnswers]);

  // =========================================================
  // 업로드 이미지 카테고리별 그룹화
  // =========================================================
  const groupedFiles = useMemo(() => {
    return fileList.reduce((groupMap, file) => {
      const category = file.category ?? "ETC";

      if (!groupMap[category]) {
        groupMap[category] = [];
      }

      groupMap[category].push(file);

      return groupMap;
    }, {});
  }, [fileList]);

  // =========================================================
  // 카테고리 점수 입력
  // =========================================================
  function handleScoreChange(category, value) {
    if (value === "") {
      setCategoryScores((previous) => ({
        ...previous,
        [category]: "",
      }));

      return;
    }

    const numberValue = Number(value);

    if (Number.isNaN(numberValue)) {
      return;
    }

    const normalizedValue = Math.min(100, Math.max(0, numberValue));

    setCategoryScores((previous) => ({
      ...previous,
      [category]: normalizedValue,
    }));
  }

  // =========================================================
  // 평균 평가 점수
  // =========================================================
  const averageScore = useMemo(() => {
    const scoreList = Object.entries(categoryScores)
      .filter(
        ([category, score]) =>
          category !== "CONSULT" &&
          score !== "" &&
          score !== null &&
          score !== undefined,
      )
      .map(([, score]) => Number(score))
      .filter((score) => !Number.isNaN(score));

    if (scoreList.length === 0) {
      return null;
    }

    const sum = scoreList.reduce(
      (accumulator, score) => accumulator + score,
      0,
    );

    return Math.round(sum / scoreList.length);
  }, [categoryScores]);

  // =========================================================
  // 건강진단 신청 반려 처리
  // =========================================================
  async function handleRejectDiagnosis() {
    const isConfirmed = window.confirm(
      "해당 건강진단 신청을 반려하시겠습니까?\n반려 후 보호자는 다시 건강진단을 신청할 수 있습니다.",
    );

    if (!isConfirmed) {
      return;
    }

    try {
      setIsRejecting(true);

      await rejectDiagnosis(id);

      window.alert(
        "건강진단 신청이 반려되었습니다.\n보호자가 다시 신청할 수 있도록 상태가 초기화되었습니다.",
      );

      navigate(-1);
    } catch (error) {
      console.error("건강진단 신청 반려 처리 실패:", error);

      window.alert(
        error.response?.data?.message ||
          "건강진단 신청 반려 처리에 실패했습니다.",
      );
    } finally {
      setIsRejecting(false);
    }
  }

  // =========================================================
  // 수의사 평가 저장
  // =========================================================
  function handleSaveEvaluation() {
    const scoreRequiredCategories = visibleCategories.filter(
      (category) => category !== "CONSULT",
    );

    const missingScoreCategory = scoreRequiredCategories.find(
      (category) =>
        categoryScores[category] === undefined ||
        categoryScores[category] === null ||
        categoryScores[category] === "",
    );

    if (missingScoreCategory) {
      const categoryLabel =
        CATEGORY_META[missingScoreCategory]?.label ?? missingScoreCategory;

      window.alert(`${categoryLabel} 항목의 평가 점수를 입력해 주세요.`);

      return;
    }

    if (!opinion.trim()) {
      window.alert("수의사 종합 의견을 입력해 주세요.");

      return;
    }

    if (!summary.trim()) {
      window.alert("진단 요약을 입력해 주세요.");

      return;
    }

    if (averageScore === null) {
      window.alert("평가 점수를 입력해 주세요.");

      return;
    }

    const scores = scoreRequiredCategories.map((category) => ({
      category,
      score: Number(categoryScores[category]),
    }));

    scores.push({
      category: "TOTAL",
      score: averageScore,
    });

    const formData = {
      diaReqId: petCareVo?.diagnosisReqId,
      scores,
      opinion: opinion.trim(),
      summary: summary.trim(),
    };

    console.log("수의사 평가 저장 요청 데이터:", formData);

    asyncFetchKarteWrite(formData);
  }

  // =========================================================
  // 로딩 화면
  // =========================================================
  if (isLoading) {
    return (
      <Wrapper>
        <LoadingArea>
          <LoadingSpinner />

          <LoadingText>건강진단 상세 정보를 불러오는 중입니다.</LoadingText>
        </LoadingArea>
      </Wrapper>
    );
  }

  // =========================================================
  // 상세 정보 없음
  // =========================================================
  if (!petCareVo) {
    return (
      <Wrapper>
        <EmptyPage>
          <EmptyPageTitle>건강진단 정보를 찾을 수 없습니다.</EmptyPageTitle>

          <BackButton type="button" onClick={() => navigate(-1)}>
            목록으로 돌아가기
          </BackButton>
        </EmptyPage>
      </Wrapper>
    );
  }

  const modalFiles = imageModal
    ? (groupedFiles[imageModal.category] ?? [])
    : [];

  const currentModalFile = imageModal ? modalFiles[imageModal.index] : null;

  const currentModalImageUrl = currentModalFile
    ? getImageUrl(currentModalFile)
    : null;

  const currentModalCategoryLabel = imageModal
    ? getImageCategoryLabel(imageModal.category)
    : "";

  function handlePrevImage() {
    if (!imageModal || modalFiles.length === 0) {
      return;
    }

    setImageModal((previous) => ({
      ...previous,
      index: previous.index === 0 ? modalFiles.length - 1 : previous.index - 1,
    }));
  }

  function handleNextImage() {
    if (!imageModal || modalFiles.length === 0) {
      return;
    }

    setImageModal((previous) => ({
      ...previous,
      index: previous.index === modalFiles.length - 1 ? 0 : previous.index + 1,
    }));
  }

  const age = calculateAge(petCareVo.birthDate);

  return (
    <Wrapper>
      <PageHeader>
        <HeaderTextArea>
          <PageLabel>수의사 검토</PageLabel>

          <PageTitle>건강진단 평가</PageTitle>

          <PageDescription>
            보호자가 제출한 문진표와 첨부 이미지를 확인하고 진단 결과를 작성해
            주세요.
          </PageDescription>
        </HeaderTextArea>

        <BackButton type="button" onClick={() => navigate(-1)}>
          목록으로
        </BackButton>
      </PageHeader>

      <ProfileCard>
        <ProfileHeader>
          <ProfileTitleArea>
            <SectionLabel>반려동물 정보</SectionLabel>

            <PetName>{petCareVo.petName ?? "이름 미등록"}</PetName>

            <PetMetaRow>
              <PetMetaChip>{formatPetType(petCareVo.petType)}</PetMetaChip>
            </PetMetaRow>
          </ProfileTitleArea>

          <StatusBadge $active={petCareVo.diagnosisReqStatus === "Y"}>
            <StatusDot $active={petCareVo.diagnosisReqStatus === "Y"} />

            {formatStatus(petCareVo.diagnosisReqStatus)}
          </StatusBadge>
        </ProfileHeader>

        <ProfileGrid>
          <ProfileInfoItem $highlight>
            <InfoLabel>보호자 닉네임</InfoLabel>
            <InfoValue>{petCareVo.memberNickname ?? "-"}</InfoValue>
          </ProfileInfoItem>

          <ProfileInfoItem>
            <InfoLabel>진단 신청 번호</InfoLabel>
            <InfoValue>#{petCareVo.diagnosisReqId ?? "-"}</InfoValue>
          </ProfileInfoItem>

          <ProfileInfoItem>
            <InfoLabel>품종</InfoLabel>
            <InfoValue>{petCareVo.breedName ?? "품종 미등록"}</InfoValue>
          </ProfileInfoItem>

          <ProfileInfoItem>
            <InfoLabel>신청일</InfoLabel>
            <InfoValue>{formatDate(petCareVo.createdAt)}</InfoValue>
          </ProfileInfoItem>

          <ProfileInfoItem>
            <InfoLabel>성별</InfoLabel>
            <InfoValue>{formatGender(petCareVo.gender)}</InfoValue>
          </ProfileInfoItem>

          <ProfileInfoItem>
            <InfoLabel>나이</InfoLabel>
            <InfoValue>{age !== null ? `${age}살` : "-"}</InfoValue>
          </ProfileInfoItem>

          <ProfileInfoItem>
            <InfoLabel>생년월일</InfoLabel>
            <InfoValue>{formatBirthDate(petCareVo.birthDate)}</InfoValue>
          </ProfileInfoItem>

          <ProfileInfoItem>
            <InfoLabel>체중</InfoLabel>
            <InfoValue>
              {petCareVo.weight != null ? `${petCareVo.weight}kg` : "-"}
            </InfoValue>
          </ProfileInfoItem>
        </ProfileGrid>
      </ProfileCard>

      <EvaluationSummary>
        <SummaryTitleArea>
          <SectionLabel>평가 현황</SectionLabel>

          <SummaryTitle>평균 평가 점수</SummaryTitle>

          <SummaryDescription>
            항목별 점수를 입력하면 평균 점수가 자동으로 계산됩니다.
          </SummaryDescription>
        </SummaryTitleArea>

        <AverageScoreBox>
          <AverageScoreLabel>평균 점수</AverageScoreLabel>

          <AverageScoreValue>
            {averageScore !== null ? averageScore : "-"}
          </AverageScoreValue>

          <AverageScoreUnit>/ 100</AverageScoreUnit>
        </AverageScoreBox>
      </EvaluationSummary>

      <Section>
        <SectionHeader>
          <div>
            <SectionLabel>문진표 검토</SectionLabel>

            <SectionTitle>항목별 평가</SectionTitle>

            <SectionDescription>
              보호자가 작성한 답변을 확인하고 점수를 입력해 주세요.
            </SectionDescription>
          </div>

          <CountBadge>총 {answerList.length}개 문항</CountBadge>
        </SectionHeader>

        {visibleCategories.length === 0 ? (
          <EmptyCard>등록된 문진 답변이 없습니다.</EmptyCard>
        ) : (
          <CategoryList>
            {visibleCategories.map((category, categoryIndex) => {
              const meta = CATEGORY_META[category] ?? {
                label: category,
                description: "추가 문진 항목입니다.",
              };

              const categoryAnswers = groupedAnswers[category];

              if (category === "CONSULT") {
                return (
                  <ConsultCard key={category} $index={categoryIndex}>
                    <ConsultHeader>
                      <CategoryTitleArea>
                        <CategoryNumber>
                          {String(categoryIndex + 1).padStart(2, "0")}
                        </CategoryNumber>

                        <div>
                          <CategoryTitle>{meta.label}</CategoryTitle>

                          <CategoryDescription>
                            {meta.description}
                          </CategoryDescription>
                        </div>
                      </CategoryTitleArea>

                      <ConsultBadge>보호자 작성</ConsultBadge>
                    </ConsultHeader>

                    <ConsultBody>
                      <ConsultLabel>상담 요청 내용</ConsultLabel>

                      <ConsultContentList>
                        {categoryAnswers.map((answer, index) => (
                          <ConsultContent
                            key={answer.questionId ?? `${category}-${index}`}
                          >
                            {getAnswerText(answer.answerValue)}
                          </ConsultContent>
                        ))}
                      </ConsultContentList>
                    </ConsultBody>
                  </ConsultCard>
                );
              }

              return (
                <CategoryCard key={category} $index={categoryIndex}>
                  <CategoryHeader>
                    <CategoryTitleArea>
                      <CategoryNumber>
                        {String(categoryIndex + 1).padStart(2, "0")}
                      </CategoryNumber>

                      <div>
                        <CategoryTitle>{meta.label}</CategoryTitle>

                        <CategoryDescription>
                          {meta.description}
                        </CategoryDescription>
                      </div>
                    </CategoryTitleArea>

                    <ScoreInputArea>
                      <ScoreLabel>평가 점수</ScoreLabel>

                      <ScoreInputRow>
                        <ScoreInput
                          type="number"
                          min="0"
                          max="100"
                          value={categoryScores[category] ?? ""}
                          placeholder="0"
                          onChange={(event) =>
                            handleScoreChange(category, event.target.value)
                          }
                        />

                        <ScoreUnit>/ 100</ScoreUnit>
                      </ScoreInputRow>
                    </ScoreInputArea>
                  </CategoryHeader>

                  <AnswerList>
                    {categoryAnswers.map((answer, index) => (
                      <AnswerItem
                        key={answer.questionId ?? `${category}-${index}`}
                      >
                        <QuestionText>
                          {answer.questionContent ?? "질문 내용 없음"}
                        </QuestionText>

                        <AnswerValue
                          $positive={answer.answerValue === "Y"}
                          $negative={answer.answerValue === "N"}
                        >
                          {getAnswerText(answer.answerValue)}
                        </AnswerValue>
                      </AnswerItem>
                    ))}
                  </AnswerList>
                </CategoryCard>
              );
            })}
          </CategoryList>
        )}
      </Section>

      <Section>
        <SectionHeader>
          <div>
            <SectionLabel>이미지 검토</SectionLabel>

            <SectionTitle>첨부 이미지 확인</SectionTitle>

            <SectionDescription>
              눈, 피부, 치아 이미지를 확인해 주세요.
            </SectionDescription>
          </div>

          <CountBadge>총 {fileList.length}장</CountBadge>
        </SectionHeader>

        {fileList.length === 0 ? (
          <EmptyCard>업로드된 이미지가 없습니다.</EmptyCard>
        ) : (
          <ImageCategoryList>
            {Object.entries(groupedFiles).map(([category, files]) => (
              <ImageCategorySection key={category}>
                <ImageCategoryHeader>
                  <ImageCategoryTitle>
                    {getImageCategoryLabel(category)}
                  </ImageCategoryTitle>

                  <ImageCount>{files.length}장</ImageCount>
                </ImageCategoryHeader>

                <ImageGrid>
                  {files.map((file, index) => {
                    const imageUrl = getImageUrl(file);

                    return (
                      <ImageCard key={file.imgId ?? `${category}-${index}`}>
                        {imageUrl ? (
                          <UploadedImage
                            src={imageUrl}
                            alt={`${getImageCategoryLabel(category)} 이미지`}
                            onClick={() =>
                              setImageModal({
                                category,
                                index,
                              })
                            }
                          />
                        ) : (
                          <ImagePlaceholder>
                            이미지 미리보기 URL이 없습니다.
                          </ImagePlaceholder>
                        )}
                      </ImageCard>
                    );
                  })}
                </ImageGrid>
              </ImageCategorySection>
            ))}
          </ImageCategoryList>
        )}
      </Section>

      <Section>
        <SectionHeader>
          <div>
            <SectionLabel>진단 의견</SectionLabel>

            <SectionTitle>수의사 종합 의견</SectionTitle>

            <SectionDescription>
              보호자에게 전달할 진단 의견을 작성해 주세요.
            </SectionDescription>
          </div>
        </SectionHeader>

        <CommentBox
          value={opinion}
          placeholder="예) 전반적인 상태, 주의가 필요한 부분, 추가 확인이 필요한 증상을 작성해 주세요."
          onChange={(event) => setOpinion(event.target.value)}
        />
      </Section>

      <Section>
        <SectionHeader>
          <div>
            <SectionLabel>결과 요약</SectionLabel>

            <SectionTitle>진단 요약</SectionTitle>

            <SectionDescription>
              핵심 내용을 짧게 정리해 주세요.
            </SectionDescription>
          </div>
        </SectionHeader>

        <CommentBox
          value={summary}
          placeholder="예) 피부 상태 관찰 필요, 눈물 증가 확인, 치아 관리 권장"
          onChange={(event) => setSummary(event.target.value)}
        />
      </Section>

      <ActionArea>
        <RejectButton
          type="button"
          onClick={handleRejectDiagnosis}
          disabled={isRejecting}
        >
          {isRejecting ? "반려 처리 중..." : "신청 반려"}
        </RejectButton>

        <PrimaryButton
          type="button"
          onClick={handleSaveEvaluation}
          disabled={isRejecting}
        >
          평가 저장
        </PrimaryButton>
      </ActionArea>

      {imageModal && currentModalImageUrl && (
        <ImageModalOverlay onClick={() => setImageModal(null)}>
          <ImageModalContent onClick={(event) => event.stopPropagation()}>
            <ImageModalCloseButton
              type="button"
              onClick={() => setImageModal(null)}
            >
              ×
            </ImageModalCloseButton>

            <ImageModalCount>
              {imageModal.index + 1} / {modalFiles.length}
            </ImageModalCount>

            <ImageModalImageWrap>
              <LargeImage
                src={currentModalImageUrl}
                alt={`${currentModalCategoryLabel} 이미지`}
              />
            </ImageModalImageWrap>

            {modalFiles.length > 1 && (
              <>
                <ImageNavButton
                  type="button"
                  $position="left"
                  onClick={handlePrevImage}
                >
                  ‹
                </ImageNavButton>

                <ImageNavButton
                  type="button"
                  $position="right"
                  onClick={handleNextImage}
                >
                  ›
                </ImageNavButton>
              </>
            )}
          </ImageModalContent>
        </ImageModalOverlay>
      )}
    </Wrapper>
  );
}

export default DiagnosisDetailPage;

// =========================================================
// animation
// =========================================================
const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

// =========================================================
// styled-components
// =========================================================
const Wrapper = styled.main`
  width: min(1120px, calc(100% - 48px));

  margin: 0 auto;

  padding: 44px 0 90px;

  box-sizing: border-box;
`;

const PageHeader = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;

  margin-bottom: 22px;
`;

const HeaderTextArea = styled.div`
  min-width: 0;
`;

const PageLabel = styled.p`
  margin: 0 0 8px;

  color: #00976f;

  font-size: 13px;
  font-weight: 800;
`;

const PageTitle = styled.h1`
  margin: 0;

  color: #222222;

  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.8px;
`;

const PageDescription = styled.p`
  margin: 10px 0 0;

  color: #6f7f7a;

  font-size: 14px;
  font-weight: 500;
  line-height: 1.6;

  word-break: keep-all;
`;

const BackButton = styled.button`
  flex-shrink: 0;

  padding: 9px 15px;

  border: 1px solid #cfe5dd;
  border-radius: 8px;

  background: #ffffff;
  color: #008f69;

  font-size: 13px;
  font-weight: 800;

  cursor: pointer;

  transition:
    background 0.18s ease,
    color 0.18s ease;

  &:hover {
    background: #00a97b;
    color: #ffffff;
  }
`;

const ProfileCard = styled.section`
  padding: 22px 24px;

  border: 1px solid #dfece7;
  border-radius: 14px;

  background: #ffffff;

  box-shadow: 0 4px 14px rgba(20, 72, 58, 0.035);

  animation: ${fadeUp} 0.3s ease-out both;
`;

const ProfileHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;

  padding-bottom: 16px;

  border-bottom: 1px solid #e8efed;
`;

const ProfileTitleArea = styled.div`
  min-width: 0;
`;

const SectionLabel = styled.p`
  margin: 0 0 7px;

  color: #00976f;

  font-size: 13px;
  font-weight: 800;
`;

const PetName = styled.h2`
  margin: 0;

  color: #222222;

  font-size: 27px;
  font-weight: 800;
`;

const PetMetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;

  margin-top: 10px;
`;

const PetMetaChip = styled.span`
  display: inline-flex;
  align-items: center;

  padding: 5px 10px;

  border: 1px solid #cfe5dd;
  border-radius: 999px;

  background: #f7fcfa;

  color: #008f69;

  font-size: 12px;
  font-weight: 800;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 7px;

  padding: 6px 10px;

  border: 1px solid ${({ $active }) => ($active ? "#cfe5dd" : "#dddddd")};
  border-radius: 999px;

  background: ${({ $active }) => ($active ? "#f7fcfa" : "#f6f6f6")};

  color: ${({ $active }) => ($active ? "#008f69" : "#777777")};

  font-size: 12px;
  font-weight: 800;
`;

const StatusDot = styled.span`
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: ${({ $active }) => ($active ? "#00a97b" : "#aeb8b5")};
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));

  margin-top: 18px;

  border: 1px solid #e4ece9;
  border-radius: 12px;

  overflow: hidden;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileInfoItem = styled.div`
  min-height: 64px;

  padding: 13px 15px;

  border-right: 1px solid #e4ece9;
  border-bottom: 1px solid #e4ece9;

  background: ${({ $highlight }) => ($highlight ? "#f7fcfa" : "#ffffff")};

  &:nth-child(4n) {
    border-right: none;
  }

  &:nth-last-child(-n + 4) {
    border-bottom: none;
  }

  @media (max-width: 900px) {
    &:nth-child(4n) {
      border-right: 1px solid #e4ece9;
    }

    &:nth-child(2n) {
      border-right: none;
    }

    &:nth-last-child(-n + 4) {
      border-bottom: 1px solid #e4ece9;
    }

    &:nth-last-child(-n + 2) {
      border-bottom: none;
    }
  }

  @media (max-width: 520px) {
    border-right: none;

    &:nth-child(4n),
    &:nth-child(2n) {
      border-right: none;
    }

    &:nth-last-child(-n + 2) {
      border-bottom: 1px solid #e4ece9;
    }

    &:last-child {
      border-bottom: none;
    }
  }
`;

const InfoLabel = styled.span`
  display: block;

  margin-bottom: 7px;

  color: #8b9693;

  font-size: 11px;
  font-weight: 700;
`;

const InfoValue = styled.strong`
  color: #41504b;

  font-size: 14px;
  font-weight: 800;
`;

const EvaluationSummary = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;

  margin-top: 20px;
  padding: 18px 20px;

  border: 1px solid #dfece7;
  border-radius: 14px;

  background: #fbfdfc;
`;

const SummaryTitleArea = styled.div`
  min-width: 0;
`;

const SummaryTitle = styled.h2`
  margin: 0;

  color: #26332f;

  font-size: 20px;
  font-weight: 800;
`;

const SummaryDescription = styled.p`
  margin: 7px 0 0;

  color: #7f8d89;

  font-size: 13px;
  line-height: 1.55;

  word-break: keep-all;
`;

const AverageScoreBox = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 6px;

  min-width: 180px;
`;

const AverageScoreLabel = styled.span`
  margin-right: 7px;

  color: #71807b;

  font-size: 12px;
  font-weight: 700;
`;

const AverageScoreValue = styled.strong`
  color: #00a97b;

  font-size: 34px;
  font-weight: 900;
`;

const AverageScoreUnit = styled.span`
  color: #7f8c88;

  font-size: 14px;
  font-weight: 700;
`;

const Section = styled.section`
  margin-top: 36px;
`;

const SectionHeader = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;

  margin-bottom: 14px;
`;

const SectionTitle = styled.h2`
  margin: 0;

  color: #26332f;

  font-size: 22px;
  font-weight: 800;
`;

const SectionDescription = styled.p`
  margin: 7px 0 0;

  color: #7f8d89;

  font-size: 13px;
  font-weight: 500;
  line-height: 1.55;

  word-break: keep-all;
`;

const CountBadge = styled.span`
  flex-shrink: 0;

  padding: 6px 11px;

  border: 1px solid #cfe5dd;
  border-radius: 999px;

  background: #ffffff;

  color: #008f69;

  font-size: 12px;
  font-weight: 800;
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const CategoryCard = styled.article`
  overflow: hidden;

  border: 1px solid #e2ebe8;
  border-radius: 12px;

  background: #ffffff;

  box-shadow: 0 3px 10px rgba(25, 76, 63, 0.025);

  animation: ${fadeUp} 0.3s ease-out ${({ $index }) => $index * 0.035}s both;
`;

const CategoryHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;

  padding: 14px 16px;

  border-bottom: 1px solid #e8efed;

  background: #fbfdfc;
`;

const CategoryTitleArea = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
`;

const CategoryNumber = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 32px;
  height: 32px;

  border-radius: 9px;

  background: #f0f8f5;

  color: #008f69;

  font-size: 12px;
  font-weight: 900;
`;

const CategoryTitle = styled.h3`
  margin: 0;

  color: #34413d;

  font-size: 16px;
  font-weight: 800;
`;

const CategoryDescription = styled.p`
  margin: 4px 0 0;

  color: #8b9693;

  font-size: 11px;
`;

const ScoreInputArea = styled.div`
  flex-shrink: 0;
`;

const ScoreLabel = styled.span`
  display: block;

  margin-bottom: 5px;

  color: #798682;

  font-size: 11px;
  font-weight: 700;
  text-align: right;
`;

const ScoreInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`;

const ScoreInput = styled.input`
  width: 66px;
  height: 34px;

  padding: 0 8px;

  border: 1px solid #cfded9;
  border-radius: 8px;

  background: #ffffff;
  color: #26332f;

  font-size: 14px;
  font-weight: 800;
  text-align: center;

  outline: none;

  &:focus {
    border-color: #00a97b;
    box-shadow: 0 0 0 3px rgba(0, 169, 123, 0.09);
  }
`;

const ScoreUnit = styled.span`
  color: #7d8985;

  font-size: 12px;
  font-weight: 700;
`;

const AnswerList = styled.div`
  padding: 5px 16px;
`;

const AnswerItem = styled.div`
  display: grid;
  grid-template-columns:
    minmax(0, 1fr)
    auto;

  align-items: center;
  gap: 12px;

  padding: 11px 0;

  border-bottom: 1px solid #eef2f1;

  &:last-child {
    border-bottom: none;
  }
`;

const QuestionText = styled.p`
  margin: 0;

  color: #56625f;

  font-size: 13px;
  font-weight: 600;
  line-height: 1.5;
`;

const AnswerValue = styled.span`
  min-width: 68px;

  padding: 6px 9px;

  border-radius: 999px;

  background: ${({ $positive, $negative }) => {
    if ($positive) {
      return "#f0f8f5";
    }

    if ($negative) {
      return "#f4f5f5";
    }

    return "#f7faf9";
  }};

  color: ${({ $positive, $negative }) => {
    if ($positive) {
      return "#008f69";
    }

    if ($negative) {
      return "#89938f";
    }

    return "#58746c";
  }};

  font-size: 12px;
  font-weight: 800;
  text-align: center;
`;

const ConsultCard = styled.article`
  overflow: hidden;

  border: 1px solid #e2ebe8;
  border-radius: 12px;

  background: #ffffff;

  box-shadow: 0 3px 10px rgba(25, 76, 63, 0.025);

  animation: ${fadeUp} 0.3s ease-out ${({ $index }) => $index * 0.035}s both;
`;

const ConsultHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;

  padding: 14px 16px;

  border-bottom: 1px solid #e8efed;

  background: #fbfdfc;
`;

const ConsultBadge = styled.span`
  flex-shrink: 0;

  padding: 6px 10px;

  border: 1px solid #cfe5dd;
  border-radius: 999px;

  background: #ffffff;

  color: #008f69;

  font-size: 11px;
  font-weight: 800;
`;

const ConsultBody = styled.div`
  padding: 17px 18px 18px;
`;

const ConsultLabel = styled.p`
  margin: 0 0 9px;

  color: #687672;

  font-size: 12px;
  font-weight: 800;
`;

const ConsultContentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
`;

const ConsultContent = styled.p`
  min-height: 56px;

  margin: 0;

  padding: 14px 15px;

  border: 1px solid #e3ebe8;
  border-radius: 9px;

  background: #fbfdfc;
  color: #4f5d58;

  font-size: 14px;
  font-weight: 500;
  line-height: 1.7;

  white-space: pre-wrap;
  word-break: break-word;
`;

const ImageCategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const ImageCategorySection = styled.div`
  padding: 15px;

  border: 1px solid #e4ece9;
  border-radius: 12px;

  background: #ffffff;

  box-shadow: 0 3px 10px rgba(25, 76, 63, 0.025);
`;

const ImageCategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  margin-bottom: 13px;
`;

const ImageCategoryTitle = styled.h3`
  margin: 0;

  color: #33413c;

  font-size: 16px;
  font-weight: 800;
`;

const ImageCount = styled.span`
  padding: 4px 7px;

  border-radius: 999px;

  background: #f0f8f5;

  color: #008f69;

  font-size: 11px;
  font-weight: 800;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));

  gap: 12px;
`;

const ImageCard = styled.article`
  overflow: hidden;

  border: 1px solid #e6ecea;
  border-radius: 10px;

  background: #ffffff;
`;

const UploadedImage = styled.img`
  width: 100%;

  aspect-ratio: 4 / 3;

  object-fit: cover;

  cursor: zoom-in;

  transition:
    transform 0.18s ease,
    filter 0.18s ease;

  &:hover {
    transform: scale(1.04);
    filter: brightness(0.93);
  }
`;

const ImagePlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  aspect-ratio: 4 / 3;

  padding: 12px;

  background: #f7faf9;
  color: #9ba5a2;

  font-size: 11px;
  font-weight: 600;
  text-align: center;
`;

const CommentBox = styled.textarea`
  width: 100%;
  height: 150px;

  padding: 15px;

  border: 1px solid #d7e3df;
  border-radius: 11px;

  box-sizing: border-box;

  background: #ffffff;
  color: #34413d;

  font-size: 14px;
  font-weight: 500;
  line-height: 1.65;

  resize: none;
  outline: none;

  &::placeholder {
    color: #9aa8a3;
    font-weight: 400;
  }

  &:focus {
    border-color: #00a97b;
    box-shadow: 0 0 0 3px rgba(0, 169, 123, 0.09);
  }
`;

const ActionArea = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  margin-top: 26px;
`;

const RejectButton = styled.button`
  padding: 11px 18px;

  border: 1px solid #e5aaa3;
  border-radius: 8px;

  background: #ffffff;
  color: #d45a4d;

  font-size: 13px;
  font-weight: 800;

  cursor: pointer;

  transition:
    background 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    border-color: #d45a4d;
    background: #fff5f4;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled.button`
  padding: 11px 20px;

  border: 1px solid #00a97b;
  border-radius: 8px;

  background: #00a97b;
  color: #ffffff;

  font-size: 13px;
  font-weight: 800;

  cursor: pointer;

  &:hover {
    background: #008f69;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const EmptyCard = styled.div`
  padding: 40px 20px;

  border: 1px dashed #d9e5e1;
  border-radius: 13px;

  background: #fbfdfc;
  color: #8b9793;

  font-size: 14px;
  font-weight: 600;
  text-align: center;
`;

const LoadingArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 13px;

  min-height: 420px;
`;

const LoadingSpinner = styled.div`
  width: 29px;
  height: 29px;

  border: 3px solid rgba(0, 169, 123, 0.15);
  border-top-color: #00a97b;
  border-radius: 50%;

  animation: ${spin} 0.8s linear infinite;
`;

const LoadingText = styled.p`
  margin: 0;

  color: #7d8985;

  font-size: 13px;
  font-weight: 600;
`;

const EmptyPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 13px;

  min-height: 420px;
`;

const EmptyPageTitle = styled.p`
  margin: 0;

  color: #64716d;

  font-size: 15px;
  font-weight: 800;
`;

const ImageModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 28px;

  background: rgba(21, 34, 30, 0.72);
`;

const ImageModalContent = styled.div`
  position: relative;

  width: min(720px, calc(100vw - 56px));
  max-height: calc(100vh - 56px);

  padding: 14px;

  border-radius: 18px;

  background: #ffffff;

  box-shadow: 0 20px 55px rgba(0, 0, 0, 0.24);
`;

const ImageModalImageWrap = styled.div`
  overflow: hidden;

  border-radius: 13px;

  background: #f7faf9;
`;

const LargeImage = styled.img`
  display: block;

  width: 100%;
  max-height: calc(100vh - 120px);

  object-fit: contain;

  border-radius: 13px;
`;

const ImageModalCount = styled.div`
  position: absolute;
  top: 26px;
  left: 28px;
  z-index: 2;

  min-width: 58px;

  padding: 7px 12px;

  border-radius: 999px;

  background: rgba(255, 255, 255, 0.92);
  color: #26332f;

  font-size: 13px;
  font-weight: 900;
  text-align: center;

  box-shadow: 0 5px 14px rgba(0, 0, 0, 0.12);
`;

const ImageModalCloseButton = styled.button`
  position: absolute;
  top: 26px;
  right: 28px;
  z-index: 2;

  width: 34px;
  height: 34px;

  border: none;
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.92);
  color: #66736f;

  font-size: 22px;
  font-weight: 700;
  line-height: 1;

  cursor: pointer;

  box-shadow: 0 5px 14px rgba(0, 0, 0, 0.12);

  &:hover {
    background: #00a97b;
    color: #ffffff;
  }
`;

const ImageNavButton = styled.button`
  position: absolute;
  top: 50%;

  ${({ $position }) =>
    $position === "left" ? "left: -24px;" : "right: -24px;"}

  transform: translateY(-50%);

  width: 48px;
  height: 48px;

  border: none;
  border-radius: 50%;

  background: #ffffff;
  color: #00a97b;

  font-size: 34px;
  font-weight: 300;
  line-height: 1;

  cursor: pointer;

  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);

  &:hover {
    background: #00a97b;
    color: #ffffff;
  }

  @media (max-width: 760px) {
    ${({ $position }) =>
      $position === "left" ? "left: 12px;" : "right: 12px;"}
  }
`;