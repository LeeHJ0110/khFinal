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

const CheckWrapper = styled.section`
  width: 100%;
  min-width: 850px;
  height: 100%;

  margin: 0 auto;
  padding: 20px 16px 28px;

  display: flex;
  flex-direction: column;
  gap: 46px;

  box-sizing: border-box;

  border-radius: 16px;

  background: var(--color-white);

  overflow-x: auto;
`;

/* =========================================
   공통 제목
========================================= */

const SectionTitle = styled.h2`
  margin: 0 0 20px;

  color: var(--color-main);

  font-size: 17px;
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
  width: 120px;
  flex-shrink: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
`;

const ProcessImageBox = styled.div`
  width: 120px;
  height: 100px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(0, 169, 123, 0.12);
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.98);

  box-shadow:
    0 4px 12px rgba(0, 169, 123, 0.035),
    0 1px 3px rgba(0, 0, 0, 0.018);

  transition:
    border-color 0.25s ease,
    background-color 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.25s ease;

  &:hover {
    border-color: rgba(0, 169, 123, 0.3);

    background: color-mix(
      in srgb,
      var(--color-bg-light) 22%,
      var(--color-white)
    );

    box-shadow:
      0 8px 16px rgba(0, 169, 123, 0.085),
      0 2px 5px rgba(0, 0, 0, 0.02);

    transform: translateY(-3px);
  }
`;

const ProcessImage = styled.img`
  width: 100px;
  height: 80px;

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
  flex-shrink: 0;

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
  min-width: 760px;

  display: grid;
  grid-template-columns: repeat(3, minmax(240px, 1fr));
  gap: 10px;
`;

const DiagnosisCard = styled.div`
  min-height: 88px;

  display: flex;
  align-items: center;
  gap: 14px;

  padding: 12px 16px;

  box-sizing: border-box;

  border: 1px solid rgba(0, 169, 123, 0.12);
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.98);

  box-shadow:
    0 4px 12px rgba(0, 169, 123, 0.035),
    0 1px 3px rgba(0, 0, 0, 0.018);

  transition:
    border-color 0.25s ease,
    background-color 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.25s ease;

  &:hover {
    border-color: rgba(0, 169, 123, 0.3);

    background: color-mix(
      in srgb,
      var(--color-bg-light) 22%,
      var(--color-white)
    );

    box-shadow:
      0 8px 16px rgba(0, 169, 123, 0.085),
      0 2px 5px rgba(0, 0, 0, 0.02);

    transform: translateY(-2px);
  }
`;

const DiagnosisImageBox = styled.div`
  width: 60px;
  height: 60px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const DiagnosisImage = styled.img`
  width: 56px;
  height: 56px;

  object-fit: contain;

  transition: transform 0.25s ease;

  ${DiagnosisCard}:hover & {
    transform: scale(1.08);
  }
`;

const DiagnosisTextBox = styled.div`
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 3px;
`;
const DiagnosisTitle = styled.h3`
  margin: 0 0 2px;

  color: var(--color-main);

  font-size: 15px;
  font-weight: 800;

  white-space: nowrap;
`;

const DiagnosisDesc = styled.p`
  margin: 0;

  color: var(--text-sub);

  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
`;

/* =========================================
   3. 신청 전 안내사항
========================================= */

const GuideArea = styled.div`
  width: 100%;
  min-height: 118px;

  align-self: center;

  padding: 15px 22px 18px;

  box-sizing: border-box;

  border-radius: 10px;

  background: color-mix(in srgb, var(--color-bg-soft) 45%, var(--color-white));
`;

const GuideTitle = styled.h2`
  margin: 0 0 13px;

  color: var(--color-main);

  font-size: 15px;
  font-weight: 800;
`;

const GuideList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
`;

const GuideItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const GuideImageBox = styled.div`
  width: 52px;
  height: 52px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const GuideImage = styled.img`
  width: 48px;
  height: 48px;

  object-fit: contain;
`;

const GuideText = styled.p`
  margin: 0;

  display: flex;
  flex-direction: column;
  gap: 2px;

  color: var(--text-sub);

  font-size: 11px;
  line-height: 1.5;

  strong {
    color: var(--text-main);

    font-size: 12px;
    font-weight: 700;
  }
`;
