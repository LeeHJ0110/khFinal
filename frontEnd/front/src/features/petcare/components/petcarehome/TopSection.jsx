import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

import { fetchMyPetList } from "../../api/petCareApi";

import mainImg from "../../img/건강검진 메인.png";
import item1 from "../../img/십자가.png";
import item2 from "../../img/하트.png";
import item3 from "../../img/발자국.png";
import item4 from "../../img/방패.png";

function TopSection() {
  const navigate = useNavigate();

  // 대표 펫의 건강진단 신청 진행 여부
  const [isApplying, setIsApplying] = useState(false);

  // 상태 확인 중 여부
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDiagnosisStatus() {
      try {
        setIsLoading(true);

        const res = await fetchMyPetList();

        const petList = Array.isArray(res.data) ? res.data : [];

        /*
         * 대표 펫이 있으면 대표 펫 기준으로 확인
         * 대표 펫이 없으면 목록의 첫 번째 펫 기준으로 확인
         */
        const representPet =
          petList.find((pet) => pet.representYn === "Y") ?? petList[0];

        setIsApplying(representPet?.diagnosisInProgress === true);
      } catch (err) {
        console.error("건강진단 신청 상태 조회 실패:", err);

        // 조회 실패 시 화면은 유지
        setIsApplying(false);
      } finally {
        setIsLoading(false);
      }
    }

    loadDiagnosisStatus();
  }, []);

  // 건강진단 신청 페이지 이동
  const handleApply = () => {
    /*
     * 신청 중이거나 상태 확인 중이면 이동하지 않음
     */
    if (isApplying || isLoading) {
      return;
    }

    navigate("/healthcare/request");
  };

  return (
    <HeroWrapper>
      <HeroLeft>
        <HeroSubtitle>우리 아이의 건강을 미리 체크하세요</HeroSubtitle>

        <HeroTitle>
          <BrandText>PET&I FOR</BrandText>
          건강 진단
        </HeroTitle>

        <HeroDesc>
          병원 내원 없이 집에서 편리하게, 전문 수의사가 직접 문진과 이미지
          데이터를 분석하여 내 아이만을 위한 일대일 맞춤형 진단결과를
          제공합니다.
        </HeroDesc>

        <ApplyButton
          type="button"
          disabled={isApplying || isLoading}
          onClick={handleApply}
        >
          {isLoading ? (
            <>
              <StatusDot $loading />
              상태 확인 중
            </>
          ) : isApplying ? (
            <>
              <StatusDot />
              건강 진단 신청 중
            </>
          ) : (
            <>
              건강 진단 신청하기
              <Arrow>&gt;</Arrow>
            </>
          )}
        </ApplyButton>
      </HeroLeft>

      <DecorationArea>
        <CrossIcon src={item1} alt="" />

        <PawIcon className="paw-large" src={item3} alt="" />

        <PawIcon className="paw-medium" src={item3} alt="" />

        <PawIcon className="paw-small" src={item3} alt="" />

        <HeartIcon src={item2} alt="" />

        <ShieldIcon src={item4} alt="" />

        <PawIcon className="paw-right-top" src={item3} alt="" />

        <PawIcon className="paw-right-bottom" src={item3} alt="" />

        <HeroImage src={mainImg} alt="강아지와 고양이 건강진단 안내" />
      </DecorationArea>
    </HeroWrapper>
  );
}

export default TopSection;

/* =====================================
   전체 배너 영역
===================================== */

const HeroWrapper = styled.section`
  position: relative;
  width: 100%;
  height: 245px;
  min-height: 245px;
  margin: auto;
  overflow: hidden;

  background: color-mix(in srgb, var(--color-bg-soft) 50%, var(--color-white));
`;

/* =====================================
   왼쪽 문구 영역
===================================== */

const HeroLeft = styled.div`
  position: absolute;
  top: 28px;
  left: 52px;
  z-index: 5;
`;

const HeroSubtitle = styled.p`
  margin: 0 0 14px;

  color: var(--color-main);

  font-size: 18px;
  font-weight: 700;
`;

const HeroTitle = styled.h1`
  margin: 0 0 14px;

  color: var(--text-main);

  font-size: 30px;
  font-weight: 800;
`;

const BrandText = styled.span`
  margin-right: 10px;

  color: var(--color-main);

  font-weight: 700;
`;

const HeroDesc = styled.p`
  width: 500px;

  margin: 0 0 24px;

  color: var(--text-sub);

  font-size: 13px;
  font-weight: 400;
  line-height: 1.55;
`;

/* =====================================
   신청 버튼
===================================== */

const statusPulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(0, 169, 123, 0.24);
  }

  70% {
    box-shadow: 0 0 0 7px rgba(0, 169, 123, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(0, 169, 123, 0);
  }
`;

const loadingPulse = keyframes`
  0% {
    opacity: 0.45;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.45;
  }
`;

const StatusDot = styled.span`
  width: 8px;
  height: 8px;

  flex-shrink: 0;

  border-radius: 50%;

  background: #00a97b;

  animation: ${({ $loading }) => ($loading ? loadingPulse : statusPulse)}
    ${({ $loading }) => ($loading ? "1.2s" : "1.8s")} ease-in-out infinite;
`;

const Arrow = styled.span`
  font-size: 18px;
  font-weight: 500;
  line-height: 1;

  transition: transform 0.2s ease;
`;

const ApplyButton = styled.button`
  display: flex;

  width: 205px;
  height: 48px;

  margin-top: -8px;

  align-items: center;
  justify-content: center;
  gap: 12px;

  border: 1px solid var(--color-main);
  border-radius: 10px;

  background: var(--color-white);
  color: var(--color-main);

  font-size: 16px;
  font-weight: 700;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover:not(:disabled) {
    background: var(--color-main);
    color: var(--color-white);

    transform: translateY(-2px);

    ${Arrow} {
      transform: translateX(4px);
    }
  }

  /*
   * 신청 중 또는 상태 확인 중
   * 클릭은 차단하지만 회색으로 죽이지 않음
   */
  &:disabled {
    border-color: rgba(0, 169, 123, 0.28);

    background: rgba(0, 169, 123, 0.09);
    color: #008f69;

    /* 금지 표시 대신 기본 커서 */
    cursor: default;

    opacity: 1;

    box-shadow:
      inset 0 0 0 1px rgba(0, 169, 123, 0.04),
      0 4px 10px rgba(0, 169, 123, 0.06);
  }
`;

/* =====================================
   오른쪽 장식 이미지 영역
===================================== */

const DecorationArea = styled.div`
  position: absolute;

  inset: 0;

  pointer-events: none;
`;

const HeroImage = styled.img`
  position: absolute;
  right: 138px;
  bottom: 0;

  width: 365px;
  max-height: 225px;

  object-fit: contain;
`;

const iconFloat = keyframes`
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-6px);
  }

  100% {
    transform: translateY(0);
  }
`;

const CrossIcon = styled.img`
  position: absolute;

  left: 350px;
  bottom: 22px;

  width: 72px;
  height: auto;

  animation: ${iconFloat} 3.4s ease-in-out infinite;
`;

const HeartIcon = styled.img`
  position: absolute;

  left: 70%;
  top: 40px;

  width: 42px;
  height: auto;

  animation: ${iconFloat} 3s ease-in-out infinite;
  animation-delay: 0.5s;
`;

const ShieldIcon = styled.img`
  position: absolute;

  right: 123px;
  top: 16px;

  width: 47px;
  height: auto;

  animation: ${iconFloat} 3.8s ease-in-out infinite;
  animation-delay: 1s;
`;

const pawFloat = keyframes`
  0% {
    transform: translateY(0);
    opacity: 0.25;
  }

  50% {
    transform: translateY(-8px);
    opacity: 0.45;
  }

  100% {
    transform: translateY(0);
    opacity: 0.25;
  }
`;

const PawIcon = styled.img`
  position: absolute;

  height: auto;

  opacity: 0.35;

  animation: ${pawFloat} 3s ease-in-out infinite;

  &.paw-large {
    left: 52%;
    top: 40px;

    width: 58px;

    animation-delay: 0s;
  }

  &.paw-medium {
    left: 58%;
    top: 128px;

    width: 48px;

    animation-delay: 0.7s;
  }

  &.paw-small {
    left: 65%;
    top: 145px;

    width: 26px;

    animation-delay: 1.4s;
  }

  &.paw-right-top {
    right: 61px;
    top: 52px;

    width: 25px;

    animation-delay: 0.4s;
  }

  &.paw-right-bottom {
    right: 22px;
    top: 125px;

    width: 27px;

    animation-delay: 1.1s;
  }
`;
