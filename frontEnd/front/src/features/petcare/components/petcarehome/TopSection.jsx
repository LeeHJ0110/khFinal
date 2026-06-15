import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

import usePointEffect from "../../../point/hooks/usePointEffect";
import { POINT_ACTION_TYPE } from "../../../point/utils/pointPolicy";

import mainImg from "../../img/건강검진 메인.png";
import item1 from "../../img/십자가.png";
import item3 from "../../img/발자국.png";

function TopSection({ selectedPet }) {
  const navigate = useNavigate();

  const { checkPointBeforeStart } = usePointEffect();

  // undefined: 조회 중 / null: 등록된 펫 없음
  const isLoading = selectedPet === undefined;
  const hasPet = selectedPet !== null && selectedPet !== undefined;

  // 현재 선택한 펫의 신청 상태
  const isApplying = selectedPet?.diagnosisInProgress === true;

  // =========================================================
  // 건강진단 신청하기
  //
  // 버튼 클릭 시 포인트 확인
  // 2,000P 이상이면 진행 여부 확인
  // 확인을 누른 경우에만 신청 페이지로 이동
  // =========================================================
  const handleApply = async () => {
    if (isLoading || isApplying) {
      return;
    }

    if (!hasPet) {
      navigate("/mypage/pet-manage");

      return;
    }

    const canStart = await checkPointBeforeStart(
      POINT_ACTION_TYPE.HEALTHCARE_USE,
    );

    // 2,000P 미만이면 진입 차단
    if (!canStart) {
      return;
    }

    const isConfirmed = window.confirm(
      "건강진단 신청 시 2,000P가 소모됩니다.\n신청을 계속하시겠습니까?",
    );

    // 취소 버튼을 누르면 현재 화면 유지
    if (!isConfirmed) {
      return;
    }

    // 확인 버튼을 누른 경우에만 신청 페이지 이동
    navigate("/healthcare/request");
  };

  return (
    <HeroWrapper>
      <DotPattern />

      <HeroInner>
        {/* =====================================================
            왼쪽 문구
        ===================================================== */}
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
            disabled={isLoading || isApplying}
            onClick={handleApply}
            $isApplying={isApplying}
            $isLoading={isLoading}
          >
            {isLoading ? (
              <>
                <StatusDot $loading />
                상태 확인 중
              </>
            ) : isApplying ? (
              <>
                <StatusDot />
                건강 진단 진행 중
              </>
            ) : !hasPet ? (
              <>
                반려동물 등록하기
                <Arrow>&gt;</Arrow>
              </>
            ) : (
              <>
                건강 진단 신청하기
                <Arrow>&gt;</Arrow>
              </>
            )}
          </ApplyButton>
        </HeroLeft>

        {/* =====================================================
            발자국 장식 영역
        ===================================================== */}
        <PawDecorationArea>
          <PawItem $left="2%" $top="66%" $delay="0s">
            <PawImage src={item3} alt="" $size="25px" $rotate="-18deg" />
          </PawItem>

          <PawItem $left="16%" $top="39%" $delay="0.45s">
            <PawImage src={item3} alt="" $size="31px" $rotate="15deg" />
          </PawItem>

          <PawItem $left="30%" $top="68%" $delay="0.9s">
            <PawImage src={item3} alt="" $size="27px" $rotate="-12deg" />
          </PawItem>

          <PawItem $left="44%" $top="34%" $delay="1.35s">
            <PawImage src={item3} alt="" $size="34px" $rotate="18deg" />
          </PawItem>

          <PawItem $left="58%" $top="62%" $delay="1.8s">
            <PawImage src={item3} alt="" $size="29px" $rotate="-14deg" />
          </PawItem>

          <PawItem $left="73%" $top="31%" $delay="2.25s">
            <PawImage src={item3} alt="" $size="31px" $rotate="16deg" />
          </PawItem>

          <PawItem $left="88%" $top="58%" $delay="2.7s">
            <PawImage src={item3} alt="" $size="25px" $rotate="-12deg" />
          </PawItem>
        </PawDecorationArea>

        {/* =====================================================
            의료 십자가 포인트
        ===================================================== */}
        <CrossIcon src={item1} alt="" />

        {/* =====================================================
            오른쪽 펫 이미지
        ===================================================== */}
        <ImageArea>
          <HeroImage src={mainImg} alt="강아지와 고양이 건강진단 안내" />
        </ImageArea>
      </HeroInner>
    </HeroWrapper>
  );
}

export default TopSection;

// =========================================================
// animation
// =========================================================
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

const pawFloat = keyframes`
  0% {
    transform: translateY(0);
    opacity: 0.14;
  }

  50% {
    transform: translateY(-6px);
    opacity: 0.28;
  }

  100% {
    transform: translateY(0);
    opacity: 0.14;
  }
`;

const crossFloat = keyframes`
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

// =========================================================
// styled-components
// =========================================================
const HeroWrapper = styled.section`
  position: relative;
  z-index: 1;

  width: 100%;
  height: 245px;

  overflow: hidden;

  background: color-mix(in srgb, var(--color-bg-soft) 50%, var(--color-white));

  box-sizing: border-box;

  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    z-index: 5;

    transform: scale(1.015);

    box-shadow: 0 14px 32px rgba(0, 169, 123, 0.12);
  }

  @media (max-width: 900px) {
    height: 260px;
  }

  @media (max-width: 640px) {
    height: 280px;

    &:hover {
      transform: none;
    }
  }
`;

const HeroInner = styled.div`
  position: relative;

  width: min(1600px, calc(100% - 180px));
  height: 100%;

  margin: 0 auto;

  overflow: hidden;

  @media (max-width: 1200px) {
    width: calc(100% - 96px);
  }

  @media (max-width: 900px) {
    width: calc(100% - 48px);
  }

  @media (max-width: 640px) {
    width: calc(100% - 32px);
  }
`;

// =========================================================
// 왼쪽 문구 영역
// =========================================================
const HeroLeft = styled.div`
  position: absolute;
  top: 28px;
  left: 0;
  z-index: 6;

  width: min(530px, 55%);

  @media (max-width: 900px) {
    top: 24px;

    width: min(470px, 68%);
  }

  @media (max-width: 640px) {
    top: 22px;

    width: 100%;
  }
`;

const HeroSubtitle = styled.p`
  margin: 0;

  color: var(--color-main-dark);

  font-size: 13px;
  font-weight: 900;
  letter-spacing: 2px;
`;

const HeroTitle = styled.h1`
  margin: 8px 0 0;

  color: var(--text-main);

  font-size: 34px;
  font-weight: 900;
  line-height: 1.18;
  letter-spacing: -1.4px;

  @media (max-width: 640px) {
    font-size: 27px;
  }
`;

const BrandText = styled.span`
  margin-right: 10px;

  color: var(--color-main-dark);

  font-weight: 900;
`;

const HeroDesc = styled.p`
  width: min(500px, 100%);

  margin: 12px 0 22px;

  color: var(--text-sub);

  font-size: 14px;
  font-weight: 400;
  line-height: 1.75;

  word-break: keep-all;

  @media (max-width: 640px) {
    width: 100%;

    padding-right: 92px;

    box-sizing: border-box;

    font-size: 12px;
  }
`;

// =========================================================
// 신청 버튼
// =========================================================
const StatusDot = styled.span`
  width: 8px;
  height: 8px;

  flex-shrink: 0;

  border-radius: 50%;

  background: ${({ $loading }) =>
    $loading ? "rgba(255, 255, 255, 0.92)" : "#00a97b"};

  animation: ${({ $loading }) => ($loading ? loadingPulse : statusPulse)}
    ${({ $loading }) => ($loading ? "1.2s" : "1.8s")} ease-in-out infinite;
`;

const Arrow = styled.span`
  font-size: 18px;
  font-weight: 700;
  line-height: 1;

  transition: transform 0.2s ease;
`;

const ApplyButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  min-width: ${({ $isApplying, $isLoading }) =>
    $isApplying || $isLoading ? "214px" : "198px"};
  height: 46px;

  margin-top: -8px;
  padding: 0 18px;

  border: 1px solid
    ${({ $isApplying, $isLoading }) =>
      $isApplying || $isLoading ? "rgba(0, 169, 123, 0.18)" : "transparent"};

  border-radius: 999px;

  background: ${({ $isApplying, $isLoading }) =>
    $isApplying || $isLoading
      ? "rgba(255, 255, 255, 0.72)"
      : "linear-gradient(135deg, var(--color-main) 0%, var(--color-main-dark) 100%)"};

  color: ${({ $isApplying, $isLoading }) =>
    $isApplying || $isLoading
      ? "var(--color-main-dark)"
      : "var(--color-white)"};

  font-size: 14px;
  font-weight: 800;
  letter-spacing: -0.2px;

  cursor: ${({ $isApplying, $isLoading }) =>
    $isApplying || $isLoading ? "default" : "pointer"};

  box-shadow: ${({ $isApplying, $isLoading }) =>
    $isApplying || $isLoading
      ? "0 8px 18px rgba(0, 169, 123, 0.07)"
      : "0 10px 20px rgba(0, 169, 123, 0.18)"};

  backdrop-filter: blur(8px);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);

    box-shadow: 0 14px 24px rgba(0, 169, 123, 0.25);

    filter: brightness(1.03);

    ${Arrow} {
      transform: translateX(4px);
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 1;
  }

  @media (max-width: 640px) {
    min-width: 186px;
    height: 43px;

    padding: 0 15px;

    font-size: 13px;
  }
`;

// =========================================================
// 발자국 장식 영역
// =========================================================
const PawDecorationArea = styled.div`
  position: absolute;

  left: 410px;
  right: 330px;
  top: 0;
  bottom: 0;

  z-index: 3;

  pointer-events: none;

  @media (max-width: 1200px) {
    left: 390px;
    right: 300px;
  }

  @media (max-width: 900px) {
    left: 330px;
    right: 230px;
  }

  @media (max-width: 760px) {
    display: none;
  }
`;

const PawItem = styled.div`
  position: absolute;

  left: ${({ $left }) => $left};
  top: ${({ $top }) => $top};

  animation: ${pawFloat} 3.8s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay};
`;

const PawImage = styled.img`
  display: block;

  width: ${({ $size }) => $size};
  height: auto;

  object-fit: contain;

  transform: rotate(${({ $rotate }) => $rotate});
`;

// =========================================================
// 의료 십자가 포인트
// =========================================================
const CrossIcon = styled.img`
  position: absolute;
  right: 54px;
  top: 24px;
  z-index: 6;

  width: 44px;
  height: auto;

  opacity: 0.62;

  animation: ${crossFloat} 3.4s ease-in-out infinite;

  @media (max-width: 1100px) {
    right: 6px;

    width: 40px;
  }

  @media (max-width: 760px) {
    display: none;
  }
`;

// =========================================================
// 오른쪽 이미지 영역
// =========================================================
const ImageArea = styled.div`
  position: absolute;

  right: 42px;
  bottom: 0;
  z-index: 5;

  display: flex;
  align-items: flex-end;
  justify-content: center;

  width: 410px;
  height: 100%;

  pointer-events: none;

  @media (max-width: 1350px) {
    right: 10px;
  }

  @media (max-width: 1100px) {
    right: -30px;

    width: 355px;
  }

  @media (max-width: 900px) {
    right: -55px;

    width: 310px;
  }

  @media (max-width: 640px) {
    right: -95px;

    width: 245px;

    opacity: 0.28;
  }
`;

const HeroImage = styled.img`
  position: relative;
  z-index: 2;

  display: block;

  width: 100%;
  max-height: 232px;

  object-fit: contain;
  object-position: center bottom;
`;

const DotPattern = styled.div`
  position: absolute;
  inset: 0;

  opacity: 0.16;

  background-image: radial-gradient(
    rgba(0, 169, 123, 0.22) 1px,
    transparent 1px
  );

  background-size: 18px 18px;

  pointer-events: none;
`;
