import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import usePetCareDetail from "../../features/petcare/hooks/usePetCareDetail";
import useKarte from "../../features/karte/hooks/useKarte";
import { completeDiagnosis } from "../../features/petcare/api/petCareApi";

const CATEGORY_META = {
  VACCINE: {
    label: "예방접종",
    description: "최근 예방접종 이력",
  },
  DISEASE: {
    label: "질병 이력",
    description: "과거 진단 및 치료 이력",
  },
  STRESS: {
    label: "스트레스",
    description: "행동 변화 및 스트레스 반응",
  },
  SLEEP: {
    label: "수면",
    description: "수면 패턴 및 휴식 상태",
  },
  EXERCISE: {
    label: "운동",
    description: "활동량 및 운동 상태",
  },
  MEAL: {
    label: "식사",
    description: "식욕 및 식습관 상태",
  },
  SKIN: {
    label: "피부",
    description: "피부 및 피모 상태",
  },
  EYE: {
    label: "눈",
    description: "안구 및 눈 주변 상태",
  },
  TEETH: {
    label: "치아",
    description: "구강 및 치아 상태",
  },
  CONSULT: {
    label: "기타 특이사항",
    description: "보호자가 추가로 작성한 상담 요청 내용",
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

function formatPetType(petType) {
  if (petType === "DOG" || petType === "D") {
    return "강아지";
  }

  if (petType === "CAT" || petType === "C") {
    return "고양이";
  }

  return petType ?? "-";
}

function formatGender(gender) {
  if (gender === "M") {
    return "수컷";
  }

  if (gender === "F") {
    return "암컷";
  }

  return gender ?? "-";
}

function formatStatus(status) {
  if (status === "Y") {
    return "진단 진행 중";
  }

  if (status === "N") {
    return "진단 완료";
  }

  return "상태 확인 필요";
}

function getAnswerText(value) {
  if (
    value === null ||
    value === undefined ||
    String(value).trim() === ""
  ) {
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

function getImageCategoryLabel(category) {
  return CATEGORY_META[category]?.label ?? category ?? "기타";
}

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

  const { petCareVo, asyncFetchPetCareDetail, isLoading } =
    usePetCareDetail();

  const { asyncFetchKarteWrite, isSuccess } = useKarte();

  const [categoryScores, setCategoryScores] = useState({});
  const [opinion, setOpinion] = useState("");
  const [summary, setSummary] = useState("");

  // 평가 저장 성공 후 완료 API가 중복 호출되는 것을 방지
  const completeRequestRef = useRef(false);

  useEffect(() => {
    if (id) {
      asyncFetchPetCareDetail(id);
    }
  }, [id]);

  useEffect(() => {
    completeRequestRef.current = false;
  }, [id]);

  useEffect(() => {
    if (!isSuccess || !id || completeRequestRef.current) {
      return;
    }

    completeRequestRef.current = true;

    async function completeAndMove() {
      try {
        // 평가 저장이 성공한 경우 진단 상태를 완료로 변경
        await completeDiagnosis(id);

        alert("평가 저장이 완료되었습니다.");
        navigate(-1);
      } catch (error) {
        completeRequestRef.current = false;

        console.error("건강진단 완료 처리 실패:", error);

        alert(
          error.response?.data?.message ||
            "평가는 저장되었지만 완료 처리에 실패했습니다.",
        );
      }
    }

    completeAndMove();
  }, [isSuccess, id, navigate]);

  const answerList = petCareVo?.answerList ?? [];
  const fileList = petCareVo?.fileList ?? [];

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

  const visibleCategories = useMemo(() => {
    const registeredCategories = CATEGORY_ORDER.filter(
      (category) =>
        groupedAnswers[category] &&
        groupedAnswers[category].length > 0,
    );

    const extraCategories = Object.keys(groupedAnswers).filter(
      (category) => !CATEGORY_ORDER.includes(category),
    );

    return [...registeredCategories, ...extraCategories];
  }, [groupedAnswers]);

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

  const handleScoreChange = (category, value) => {
    if (value === "") {
      setCategoryScores((prev) => ({
        ...prev,
        [category]: "",
      }));

      return;
    }

    const numberValue = Number(value);

    if (Number.isNaN(numberValue)) {
      return;
    }

    const normalizedValue = Math.min(100, Math.max(0, numberValue));

    setCategoryScores((prev) => ({
      ...prev,
      [category]: normalizedValue,
    }));
  };

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

    const sum = scoreList.reduce((acc, score) => acc + score, 0);

    return Math.round(sum / scoreList.length);
  }, [categoryScores]);

  const handleSaveEvaluation = () => {
    const scores = Object.entries(categoryScores).map(
      ([category, score]) => ({
        category,
        score,
      }),
    );

    scores.push({
      category: "TOTAL",
      score: averageScore,
    });

    const formData = {
      diaReqId: petCareVo?.diagnosisReqId,
      scores,
      opinion,
      summary,
    };

    console.log("수의사 평가 저장 요청 데이터:", formData);

    asyncFetchKarteWrite(formData);
  };

  if (isLoading) {
    return (
      <Wrapper>
        <LoadingArea>
          <LoadingSpinner />

          <LoadingText>
            건강진단 상세 정보를 불러오는 중입니다.
          </LoadingText>
        </LoadingArea>
      </Wrapper>
    );
  }

  if (!petCareVo) {
    return (
      <Wrapper>
        <EmptyPage>
          <EmptyPageTitle>
            건강진단 정보를 찾을 수 없습니다.
          </EmptyPageTitle>

          <BackButton
            type="button"
            onClick={() => navigate(-1)}
          >
            목록으로 돌아가기
          </BackButton>
        </EmptyPage>
      </Wrapper>
    );
  }

  const age = calculateAge(petCareVo.birthDate);

  return (
    <Wrapper>
      <PageHeader>
        <div>
          <Eyebrow>VETERINARY ASSESSMENT</Eyebrow>

          <PageTitle>건강진단 상세 평가</PageTitle>

          <PageDescription>
            보호자가 작성한 문진 결과와 업로드 이미지를 확인한 후 항목별 평가
            점수를 입력해 주세요.
          </PageDescription>
        </div>

        <BackButton
          type="button"
          onClick={() => navigate(-1)}
        >
          목록으로
        </BackButton>
      </PageHeader>

      {/* 반려동물 및 보호자 정보 */}
      <ProfileCard>
        <ProfileHeader>
          <ProfileTitleArea>
            <ProfileLabel>PATIENT INFORMATION</ProfileLabel>

            <PetName>
              {petCareVo.petName ?? "이름 미등록"}
            </PetName>

            <PetMetaRow>
              <PetMetaChip>
                {formatPetType(petCareVo.petType)}
              </PetMetaChip>

              <PetMetaChip>
                {petCareVo.breedName ?? "품종 미등록"}
              </PetMetaChip>
            </PetMetaRow>
          </ProfileTitleArea>

          <StatusBadge
            $active={petCareVo.diagnosisReqStatus === "Y"}
          >
            <StatusDot
              $active={petCareVo.diagnosisReqStatus === "Y"}
            />

            {formatStatus(petCareVo.diagnosisReqStatus)}
          </StatusBadge>
        </ProfileHeader>

        <ProfileGrid>
          <ProfileInfoItem $highlight>
            <InfoLabel>보호자 닉네임</InfoLabel>

            <InfoValue>
              {petCareVo.memberNickname ?? "-"}
            </InfoValue>
          </ProfileInfoItem>

          <ProfileInfoItem>
            <InfoLabel>진단 신청 번호</InfoLabel>

            <InfoValue>
              #{petCareVo.diagnosisReqId ?? "-"}
            </InfoValue>
          </ProfileInfoItem>

          <ProfileInfoItem>
            <InfoLabel>반려동물 번호</InfoLabel>

            <InfoValue>
              #{petCareVo.petId ?? "-"}
            </InfoValue>
          </ProfileInfoItem>

          <ProfileInfoItem>
            <InfoLabel>신청일</InfoLabel>

            <InfoValue>
              {formatDate(petCareVo.createdAt)}
            </InfoValue>
          </ProfileInfoItem>

          <ProfileInfoItem>
            <InfoLabel>성별</InfoLabel>

            <InfoValue>
              {formatGender(petCareVo.gender)}
            </InfoValue>
          </ProfileInfoItem>

          <ProfileInfoItem>
            <InfoLabel>나이</InfoLabel>

            <InfoValue>
              {age !== null ? `${age}살` : "-"}
            </InfoValue>
          </ProfileInfoItem>

          <ProfileInfoItem>
            <InfoLabel>생년월일</InfoLabel>

            <InfoValue>
              {formatBirthDate(petCareVo.birthDate)}
            </InfoValue>
          </ProfileInfoItem>

          <ProfileInfoItem>
            <InfoLabel>체중</InfoLabel>

            <InfoValue>
              {petCareVo.weight != null
                ? `${petCareVo.weight}kg`
                : "-"}
            </InfoValue>
          </ProfileInfoItem>
        </ProfileGrid>
      </ProfileCard>

      <EvaluationSummary>
        <SummaryTitleArea>
          <SummaryEyebrow>ASSESSMENT SUMMARY</SummaryEyebrow>

          <SummaryTitle>수의사 평가 현황</SummaryTitle>

          <SummaryDescription>
            카테고리별 평가 점수를 입력하면 평균 점수가 자동으로 계산됩니다.
          </SummaryDescription>
        </SummaryTitleArea>

        <AverageScoreBox>
          <AverageScoreLabel>
            평균 평가 점수
          </AverageScoreLabel>

          <AverageScoreValue>
            {averageScore !== null ? averageScore : "-"}
          </AverageScoreValue>

          <AverageScoreUnit>/ 100</AverageScoreUnit>
        </AverageScoreBox>
      </EvaluationSummary>

      <Section>
        <SectionHeader>
          <div>
            <SectionEyebrow>
              QUESTIONNAIRE REVIEW
            </SectionEyebrow>

            <SectionTitle>
              카테고리별 문진 평가
            </SectionTitle>

            <SectionDescription>
              문진 답변을 검토한 후 각 항목의 평가 점수를 입력해 주세요.
            </SectionDescription>
          </div>

          <CountBadge>
            총 {answerList.length}개 문항
          </CountBadge>
        </SectionHeader>

        {visibleCategories.length === 0 ? (
          <EmptyCard>
            등록된 문진 답변이 없습니다.
          </EmptyCard>
        ) : (
          <CategoryList>
            {visibleCategories.map((category, categoryIndex) => {
              const meta = CATEGORY_META[category] ?? {
                label: category,
                description: "추가 문진 항목",
              };

              const categoryAnswers = groupedAnswers[category];

              if (category === "CONSULT") {
                return (
                  <ConsultCard
                    key={category}
                    $index={categoryIndex}
                  >
                    <ConsultHeader>
                      <CategoryTitleArea>
                        <CategoryNumber>
                          {String(categoryIndex + 1).padStart(2, "0")}
                        </CategoryNumber>

                        <div>
                          <CategoryTitle>
                            {meta.label}
                          </CategoryTitle>

                          <CategoryDescription>
                            {meta.description}
                          </CategoryDescription>
                        </div>
                      </CategoryTitleArea>

                      <ConsultBadge>
                        보호자 작성
                      </ConsultBadge>
                    </ConsultHeader>

                    <ConsultBody>
                      <ConsultLabel>
                        상담 요청 내용
                      </ConsultLabel>

                      <ConsultContentList>
                        {categoryAnswers.map((answer, index) => (
                          <ConsultContent
                            key={
                              answer.questionId ??
                              `${category}-${index}`
                            }
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
                <CategoryCard
                  key={category}
                  $index={categoryIndex}
                >
                  <CategoryHeader>
                    <CategoryTitleArea>
                      <CategoryNumber>
                        {String(categoryIndex + 1).padStart(2, "0")}
                      </CategoryNumber>

                      <div>
                        <CategoryTitle>
                          {meta.label}
                        </CategoryTitle>

                        <CategoryDescription>
                          {meta.description}
                        </CategoryDescription>
                      </div>
                    </CategoryTitleArea>

                    <ScoreInputArea>
                      <ScoreLabel>
                        평가 점수
                      </ScoreLabel>

                      <ScoreInputRow>
                        <ScoreInput
                          type="number"
                          min="0"
                          max="100"
                          value={categoryScores[category] ?? ""}
                          placeholder="0"
                          onChange={(e) =>
                            handleScoreChange(
                              category,
                              e.target.value,
                            )
                          }
                        />

                        <ScoreUnit>/ 100</ScoreUnit>
                      </ScoreInputRow>
                    </ScoreInputArea>
                  </CategoryHeader>

                  <AnswerList>
                    {categoryAnswers.map((answer, index) => (
                      <AnswerItem
                        key={
                          answer.questionId ??
                          `${category}-${index}`
                        }
                      >
                        <QuestionText>
                          {answer.questionContent ??
                            "질문 내용 없음"}
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
            <SectionEyebrow>
              IMAGE REVIEW
            </SectionEyebrow>

            <SectionTitle>
              업로드 이미지
            </SectionTitle>

            <SectionDescription>
              눈, 피부, 치아 관련 이미지를 확인해 주세요.
            </SectionDescription>
          </div>

          <CountBadge>
            총 {fileList.length}장
          </CountBadge>
        </SectionHeader>

        {fileList.length === 0 ? (
          <EmptyCard>
            업로드된 이미지가 없습니다.
          </EmptyCard>
        ) : (
          <ImageCategoryList>
            {Object.entries(groupedFiles).map(
              ([category, files]) => (
                <ImageCategorySection key={category}>
                  <ImageCategoryHeader>
                    <ImageCategoryTitle>
                      {getImageCategoryLabel(category)}
                    </ImageCategoryTitle>

                    <ImageCount>
                      {files.length}장
                    </ImageCount>
                  </ImageCategoryHeader>

                  <ImageGrid>
                    {files.map((file, index) => {
                      const imageUrl = getImageUrl(file);

                      return (
                        <ImageCard
                          key={
                            file.imgId ??
                            `${category}-${index}`
                          }
                        >
                          {imageUrl ? (
                            <UploadedImage
                              src={imageUrl}
                              alt={
                                file.imageOriginName ??
                                `${category} 이미지`
                              }
                            />
                          ) : (
                            <ImagePlaceholder>
                              이미지 미리보기 URL이 없습니다.
                            </ImagePlaceholder>
                          )}

                          <ImageInfo>
                            <ImageFileName
                              title={
                                file.imageOriginName ||
                                file.imageChangedName
                              }
                            >
                              {file.imageOriginName ||
                                file.imageChangedName ||
                                "파일명 없음"}
                            </ImageFileName>
                          </ImageInfo>
                        </ImageCard>
                      );
                    })}
                  </ImageGrid>
                </ImageCategorySection>
              ),
            )}
          </ImageCategoryList>
        )}
      </Section>

      <Section>
        <SectionHeader>
          <div>
            <SectionEyebrow>OPINION</SectionEyebrow>

            <SectionTitle>
              수의사 종합 의견
            </SectionTitle>

            <SectionDescription>
              보호자에게 전달할 진단 의견을 작성해 주세요.
            </SectionDescription>
          </div>
        </SectionHeader>

        <CommentBox
          value={opinion}
          placeholder="반려동물의 상태에 대한 종합 의견을 입력해 주세요."
          onChange={(e) => setOpinion(e.target.value)}
        />
      </Section>

      <Section>
        <SectionHeader>
          <div>
            <SectionEyebrow>SUMMARY</SectionEyebrow>

            <SectionTitle>
              진단 요약
            </SectionTitle>

            <SectionDescription>
              진단 내용의 요약을 입력해 주세요.
            </SectionDescription>
          </div>
        </SectionHeader>

        <CommentBox
          value={summary}
          placeholder="간단하게 반려동물의 상태를 설명해 주세요."
          onChange={(e) => setSummary(e.target.value)}
        />
      </Section>

      <ActionArea>
        <SecondaryButton
          type="button"
          onClick={() => navigate(-1)}
        >
          목록으로
        </SecondaryButton>

        <PrimaryButton
          type="button"
          onClick={handleSaveEvaluation}
        >
          평가 저장
        </PrimaryButton>
      </ActionArea>
    </Wrapper>
  );
}

export default DiagnosisDetailPage;

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
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

const Wrapper = styled.main`
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
  padding: 52px 0 90px;
  box-sizing: border-box;
`;

const PageHeader = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
`;

const Eyebrow = styled.p`
  margin: 0 0 8px;
  color: #00a97b;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.5px;
`;

const PageTitle = styled.h1`
  margin: 0;
  color: #202927;
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -1px;
`;

const PageDescription = styled.p`
  margin: 10px 0 0;
  color: #7b8884;
  font-size: 14px;
  font-weight: 500;
`;

const BackButton = styled.button`
  flex-shrink: 0;
  padding: 10px 15px;
  border: 1px solid rgba(0, 169, 123, 0.22);
  border-radius: 9px;
  background: #ffffff;
  color: #008f69;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.18s ease;

  &:hover {
    background: #00a97b;
    color: #ffffff;
    transform: translateY(-2px);
  }
`;

const ProfileCard = styled.section`
  padding: 23px 25px;
  border: 1px solid rgba(0, 169, 123, 0.18);
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 7px 22px rgba(20, 72, 58, 0.05);
  animation: ${fadeUp} 0.4s ease-out both;
`;

const ProfileHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding-bottom: 17px;
  border-bottom: 1px solid #e8efed;
`;

const ProfileTitleArea = styled.div`
  min-width: 0;
`;

const ProfileLabel = styled.p`
  margin: 0 0 7px;
  color: #00a97b;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.2px;
`;

const PetName = styled.h2`
  margin: 0;
  color: #202927;
  font-size: 28px;
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
  padding: 5px 9px;
  border: 1px solid rgba(0, 169, 123, 0.16);
  border-radius: 999px;
  background: rgba(0, 169, 123, 0.06);
  color: #008f69;
  font-size: 12px;
  font-weight: 800;
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
  min-height: 66px;
  padding: 13px 15px;
  border-right: 1px solid #e4ece9;
  border-bottom: 1px solid #e4ece9;
  background: ${({ $highlight }) =>
    $highlight ? "rgba(0, 169, 123, 0.055)" : "#fbfdfc"};

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

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 10px;
  border: 1px solid
    ${({ $active }) =>
      $active
        ? "rgba(0, 169, 123, 0.22)"
        : "rgba(108, 123, 118, 0.17)"};
  border-radius: 999px;
  background: ${({ $active }) =>
    $active ? "rgba(0, 169, 123, 0.08)" : "#f4f6f5"};
  color: ${({ $active }) =>
    $active ? "#008f69" : "#7c8985"};
  font-size: 12px;
  font-weight: 800;
`;

const StatusDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ $active }) =>
    $active ? "#00a97b" : "#aeb8b5"};
`;

const EvaluationSummary = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
  margin-top: 22px;
  padding: 18px 22px;
  border: 1px solid rgba(0, 169, 123, 0.2);
  border-radius: 14px;
  background: #f8fcfa;
`;

const SummaryTitleArea = styled.div`
  min-width: 0;
`;

const SummaryEyebrow = styled.p`
  margin: 0 0 5px;
  color: #00a97b;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.2px;
`;

const SummaryTitle = styled.h2`
  margin: 0;
  color: #293632;
  font-size: 20px;
  font-weight: 800;
`;

const SummaryDescription = styled.p`
  margin: 7px 0 0;
  color: #85918d;
  font-size: 13px;
`;

const AverageScoreBox = styled.div`
  display: flex;
  min-width: 180px;
  align-items: baseline;
  justify-content: flex-end;
  gap: 6px;
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
  margin-top: 42px;
`;

const SectionHeader = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
`;

const SectionEyebrow = styled.p`
  margin: 0 0 6px;
  color: #00a97b;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.2px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: #26332f;
  font-size: 23px;
  font-weight: 800;
`;

const SectionDescription = styled.p`
  margin: 8px 0 0;
  color: #85918d;
  font-size: 13px;
`;

const CountBadge = styled.span`
  flex-shrink: 0;
  padding: 7px 11px;
  border: 1px solid rgba(0, 169, 123, 0.15);
  border-radius: 999px;
  background: rgba(0, 169, 123, 0.05);
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
  border-radius: 13px;
  background: #ffffff;
  box-shadow: 0 4px 15px rgba(25, 76, 63, 0.035);
  animation: ${fadeUp} 0.38s ease-out
    ${({ $index }) => $index * 0.05}s both;
`;

const CategoryHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 14px 16px;
  border-bottom: 1px solid #e8efed;
  background: #f8fcfa;
`;

const CategoryTitleArea = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
`;

const CategoryNumber = styled.span`
  display: flex;
  width: 35px;
  height: 35px;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: rgba(0, 169, 123, 0.1);
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
  width: 68px;
  height: 35px;
  padding: 0 8px;
  border: 1px solid #cfded9;
  border-radius: 7px;
  background: #ffffff;
  color: #26332f;
  font-size: 14px;
  font-weight: 800;
  text-align: center;
  outline: none;

  &:focus {
    border-color: #00a97b;
    box-shadow: 0 0 0 3px rgba(0, 169, 123, 0.1);
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
  grid-template-columns: minmax(0, 1fr) auto;
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
  min-width: 70px;
  padding: 6px 9px;
  border-radius: 999px;

  background: ${({ $positive, $negative }) => {
    if ($positive) {
      return "rgba(0, 169, 123, 0.09)";
    }

    if ($negative) {
      return "#f3f5f4";
    }

    return "rgba(0, 169, 123, 0.055)";
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
  border: 1px solid #dce8e4;
  border-radius: 13px;
  background: #ffffff;
  box-shadow: 0 4px 15px rgba(25, 76, 63, 0.035);
  animation: ${fadeUp} 0.38s ease-out
    ${({ $index }) => $index * 0.05}s both;
`;

const ConsultHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 14px 16px;
  border-bottom: 1px solid #e8efed;
  background: #f4faf8;
`;

const ConsultBadge = styled.span`
  flex-shrink: 0;
  padding: 6px 10px;
  border: 1px solid rgba(0, 169, 123, 0.17);
  border-radius: 999px;
  background: rgba(0, 169, 123, 0.07);
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
  border-radius: 13px;
  background: #ffffff;
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
  background: rgba(0, 169, 123, 0.08);
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
`;

const ImagePlaceholder = styled.div`
  display: flex;
  aspect-ratio: 4 / 3;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: #f7faf9;
  color: #9ba5a2;
  font-size: 11px;
  font-weight: 600;
  text-align: center;
`;

const ImageInfo = styled.div`
  padding: 9px 10px;
`;

const ImageFileName = styled.p`
  overflow: hidden;
  margin: 0;
  color: #74807c;
  font-size: 12px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CommentBox = styled.textarea`
  width: 100%;
  min-height: 165px;
  padding: 15px;
  border: 1px solid #d7e3df;
  border-radius: 11px;
  box-sizing: border-box;
  color: #34413d;
  font-size: 14px;
  line-height: 1.65;
  resize: vertical;
  outline: none;

  &:focus {
    border-color: #00a97b;
    box-shadow: 0 0 0 3px rgba(0, 169, 123, 0.1);
  }
`;

const ActionArea = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;
`;

const SecondaryButton = styled.button`
  padding: 11px 18px;
  border: 1px solid #d7e3df;
  border-radius: 8px;
  background: #ffffff;
  color: #687571;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
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
  min-height: 420px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 13px;
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
  min-height: 420px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 13px;
`;

const EmptyPageTitle = styled.p`
  margin: 0;
  color: #64716d;
  font-size: 15px;
  font-weight: 800;
`;