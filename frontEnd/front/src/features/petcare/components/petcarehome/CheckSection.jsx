import styled from "styled-components";

import basicInfoImg from "../../img/기본정보.png";
import selfCheckImg from "../../img/자가진단.png";
import imageAnalysisImg from "../../img/이미지 분석.png";
import vetReviewImg from "../../img/수의사검토png.png";
import resultImg from "../../img/결과확인.png";

import eyeImg from "../../img/눈.png";
import toothImg from "../../img/치아.png";
import skinImg from "../../img/피부.png";
import stressImg from "../../img/스트레스.png";
import vaccineImg from "../../img/예방접종.png";
import diseaseImg from "../../img/질병이력.png";

import cameraImg from "../../img/카메라.png";
import clockImg from "../../img/시계.png";
import shieldImg from "../../img/방패.png";

function CheckSection() {
  const processList = [
    { title: "기본 정보", image: basicInfoImg },
    { title: "자가 진단", image: selfCheckImg },
    { title: "이미지 분석", image: imageAnalysisImg },
    { title: "수의사 검토", image: vetReviewImg },
    { title: "결과 확인", image: resultImg },
  ];

  const diagnosisList = [
    {
      title: "눈 건강",
      image: eyeImg,
      firstLine: "눈물·충혈 확인",
      secondLine: "눈 상태 진단",
    },
    {
      title: "치아 건강",
      image: toothImg,
      firstLine: "치석·잇몸 확인",
      secondLine: "구강 상태 진단",
    },
    {
      title: "피부 건강",
      image: skinImg,
      firstLine: "발진·가려움 확인",
      secondLine: "피부 상태 진단",
    },
    {
      title: "스트레스",
      image: stressImg,
      firstLine: "행동 변화 확인",
      secondLine: "정서 상태 진단",
    },
    {
      title: "예방접종",
      image: vaccineImg,
      firstLine: "접종 이력 확인",
      secondLine: "예방 상태 진단",
    },
    {
      title: "질병 이력",
      image: diseaseImg,
      firstLine: "과거 병력 확인",
      secondLine: "건강 이력 진단",
    },
  ];
  const guideList = [
    {
      image: cameraImg,
      text: (
        <>
          사진은 빛을 피해서
          <strong>선명하게 촬영해주세요.</strong>
        </>
      ),
    },
    {
      image: clockImg,
      text: (
        <>
          진단 결과는
          <strong>1~3일 소요됩니다.</strong>
        </>
      ),
    },
    {
      image: shieldImg,
      text: (
        <>
          입력한 정보는
          <strong>안전하게 보호됩니다.</strong>
        </>
      ),
    },
  ];

  return (
    <CheckWrapper>
      {/* 1. 진단 진행과정 */}
      <ProcessArea>
        <SectionTitle>진단 진행과정</SectionTitle>

        <ProcessList>
          {processList.map((item, index) => (
            <ProcessFragment key={item.title}>
              <ProcessItem>
                <ProcessImageBox>
                  <ProcessImage src={item.image} alt={item.title} />
                </ProcessImageBox>

                <ProcessText>{item.title}</ProcessText>
              </ProcessItem>

              {index !== processList.length - 1 && <Arrow>&gt;</Arrow>}
            </ProcessFragment>
          ))}
        </ProcessList>
      </ProcessArea>

      {/* 2. 진단 항목 */}
      <DiagnosisArea>
        <SectionTitle>진단 항목</SectionTitle>

        <DiagnosisGrid>
          {diagnosisList.map((item) => (
            <DiagnosisCard key={item.title}>
              <DiagnosisImageBox>
                <DiagnosisImage src={item.image} alt={item.title} />
              </DiagnosisImageBox>

              <DiagnosisTextBox>
                <DiagnosisTitle>{item.title}</DiagnosisTitle>
                <DiagnosisDesc>{item.firstLine}</DiagnosisDesc>
                <DiagnosisDesc>{item.secondLine}</DiagnosisDesc>
              </DiagnosisTextBox>
            </DiagnosisCard>
          ))}
        </DiagnosisGrid>
      </DiagnosisArea>

      {/* 3. 신청 전 안내사항 */}
      <GuideArea>
        <GuideTitle>신청 전 안내사항</GuideTitle>

        <GuideList>
          {guideList.map((item, index) => (
            <GuideItem key={index}>
              <GuideImageBox>
                <GuideImage src={item.image} alt="" />
              </GuideImageBox>

              <GuideText>{item.text}</GuideText>
            </GuideItem>
          ))}
        </GuideList>
      </GuideArea>
    </CheckWrapper>
  );
}

export default CheckSection;

/* =========================================
   전체 영역
========================================= */

/* =========================================
   전체 영역
========================================= */

/* =========================================
   전체 영역
========================================= */

const CheckWrapper = styled.section`
  width: 95%;
  height: 100%;

  justify-self: end;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: 10px;

  padding: 14px 16px;

  border-radius: 12px;
  background: var(--color-white);
`;

/* =========================================
   공통 제목
========================================= */

const SectionTitle = styled.h2`
  margin: 0 0 8px;

  color: var(--color-main);
  font-size: 16px;
  font-weight: 800;
`;

/* =========================================
   1. 진단 진행과정
========================================= */

const ProcessArea = styled.div`
  padding-bottom: 2px;
`;

const ProcessList = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 10px;
`;

const ProcessFragment = styled.div`
  display: contents;
`;

const ProcessItem = styled.div`
  width: 92px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const ProcessImageBox = styled.div`
  width: 68px;
  height: 68px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(0, 169, 123, 0.25);
  border-radius: 10px;

  background: var(--color-white);

  transition:
    border-color 0.25s ease,
    background-color 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.25s ease;

  &:hover {
    border-color: rgba(0, 169, 123, 0.55);
    background: var(--color-bg-light);

    box-shadow: 0 6px 14px rgba(0, 169, 123, 0.12);
    transform: translateY(-3px);
  }
`;

const ProcessImage = styled.img`
  width: 52px;
  height: 52px;

  object-fit: contain;

  transition: transform 0.25s ease;

  ${ProcessImageBox}:hover & {
    transform: scale(1.08);
  }
`;

const ProcessText = styled.p`
  margin: 0;

  color: var(--text-main);
  font-size: 13px;
  font-weight: 700;
`;

const Arrow = styled.span`
  margin-bottom: 18px;

  color: var(--color-main);
  font-size: 22px;
  font-weight: 700;
`;

/* =========================================
   2. 진단 항목
========================================= */

const DiagnosisArea = styled.div``;

const DiagnosisGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
`;

const DiagnosisCard = styled.div`
  min-height: 64px;

  display: flex;
  align-items: center;
  gap: 12px;

  padding: 8px 14px;

  border: 1px solid rgba(0, 169, 123, 0.2);
  border-radius: 8px;

  background: var(--color-white);

  transition:
    border-color 0.25s ease,
    background-color 0.25s ease,
    box-shadow 0.25s ease;

  &:hover {
    border-color: rgba(0, 169, 123, 0.48);
    background: var(--color-bg-light);

    box-shadow: 0 5px 12px rgba(0, 169, 123, 0.09);
  }
`;

const DiagnosisImageBox = styled.div`
  width: 46px;
  height: 46px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const DiagnosisImage = styled.img`
  width: 42px;
  height: 42px;

  object-fit: contain;

  transition: transform 0.25s ease;

  ${DiagnosisCard}:hover & {
    transform: scale(1.1);
  }
`;
const DiagnosisTextBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const DiagnosisTitle = styled.h3`
  margin: 0 0 2px;

  color: var(--color-main);
  font-size: 13px;
  font-weight: 800;
`;

const DiagnosisDesc = styled.p`
  margin: 0;

  color: var(--text-sub);
  font-size: 10px;
  font-weight: 500;
  line-height: 1.35;
`;

/* =========================================
   3. 신청 전 안내사항
========================================= */

const GuideArea = styled.div`
  padding: 10px 16px 11px;

  border-radius: 8px;

  background: color-mix(in srgb, var(--color-bg-soft) 45%, var(--color-white));
`;

const GuideTitle = styled.h2`
  margin: 0 0 8px;

  color: var(--color-main);
  font-size: 14px;
  font-weight: 800;
`;

const GuideList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
`;

const GuideItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const GuideImageBox = styled.div`
  width: 42px;
  height: 42px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const GuideImage = styled.img`
  width: 38px;
  height: 38px;

  object-fit: contain;
`;

const GuideText = styled.p`
  margin: 0;

  display: flex;
  flex-direction: column;

  color: var(--text-sub);
  font-size: 10px;
  line-height: 1.5;

  strong {
    color: var(--text-main);
    font-size: 11px;
    font-weight: 700;
  }
`;
