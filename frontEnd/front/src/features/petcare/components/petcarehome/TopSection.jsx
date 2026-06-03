import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

import mainImg from "../../img/건강검진 메인.png";
import item1 from "../../img/십자가.png";
import item2 from "../../img/하트.png";
import item3 from "../../img/발자국.png";
import item4 from "../../img/방패.png";

function TopSection({ selectedPet }) {
  const navigate = useNavigate();

  // undefined: 조회 중 / null: 등록된 펫 없음
  const isLoading = selectedPet === undefined;
  const hasPet = selectedPet !== null && selectedPet !== undefined;

  // 현재 선택한 펫의 신청 상태
  const isApplying =
    selectedPet?.diagnosisInProgress === true;

  const handleApply = () => {
    if (isLoading || isApplying) {
      return;
    }

    if (!hasPet) {
      navigate("/mypage/pet-manage");
      return;
    }

    navigate("/healthcare/request");
  };

  return (
    <HeroWrapper>
      {/* 왼쪽 문구는 아래 콘텐츠와 동일한 85% 정렬선 사용 */}
      <HeroInner>
        <HeroLeft>
          <HeroSubtitle>
            우리 아이의 건강을 미리 체크하세요
          </HeroSubtitle>

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
      </HeroInner>

      {/* 왼쪽 십자가 장식 */}
      <CrossIcon src={item1} alt="" />

      {/* 오른쪽 이미지는 하나의 묶음으로 관리 */}
      <RightVisualGroup>
        <PawIcon className="paw-large" src={item3} alt="" />
        <PawIcon className="paw-medium" src={item3} alt="" />
        <PawIcon className="paw-small" src={item3} alt="" />

        <HeartIcon src={item2} alt="" />
        <ShieldIcon src={item4} alt="" />

        <PawIcon className="paw-right-top" src={item3} alt="" />
        <PawIcon className="paw-right-bottom" src={item3} alt="" />

        <HeroImage
          src={mainImg}
          alt="강아지와 고양이 건강진단 안내"
        />
      </RightVisualGroup>
    </HeroWrapper>
  );
}

export default TopSection;

/* =====================================
   애니메이션
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

/* =====================================
   배너 전체 영역
===================================== */

const HeroWrapper = styled.section`
  position: relative;

  width: 100%;
  height: 245px;

  overflow: hidden;

  background: color-mix(
    in srgb,
    var(--color-bg-soft) 50%,
    var(--color-white)
  );

  @media (max-width: 900px) {
    height: 260px;
  }

  @media (max-width: 640px) {
    height: 280px;
  }
`;

/* 아래 콘텐츠와 동일한 왼쪽 정렬선 */
const HeroInner = styled.div`
  position: relative;

  width: 85%;
  height: 100%;

  margin: 0 auto;

  @media (max-width: 900px) {
    width: calc(100% - 48px);
  }

  @media (max-width: 640px) {
    width: calc(100% - 32px);
  }
`;

/* =====================================
   왼쪽 문구 영역
===================================== */

const HeroLeft = styled.div`
  position: absolute;
  top: 28px;
  left: 0;
  z-index: 5;

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
  margin: 0 0 12px;

  color: var(--color-main);

  font-size: clamp(15px, 1.2vw, 18px);
  font-weight: 700;
`;

const HeroTitle = styled.h1`
  margin: 0 0 12px;

  color: var(--text-main);

  font-size: clamp(25px, 2vw, 30px);
  font-weight: 800;
`;

const BrandText = styled.span`
  margin-right: 10px;

  color: var(--color-main);

  font-weight: 700;
`;

const HeroDesc = styled.p`
  width: min(500px, 100%);

  margin: 0 0 22px;

  color: var(--text-sub);

  font-size: clamp(12px, 0.9vw, 13px);
  font-weight: 400;
  line-height: 1.55;

  word-break: keep-all;

  @media (max-width: 640px) {
    width: 100%;

    padding-right: 92px;

    box-sizing: border-box;
  }
`;

/* =====================================
   신청 버튼
===================================== */

const StatusDot = styled.span`
  width: 8px;
  height: 8px;

  flex-shrink: 0;

  border-radius: 50%;

  background: #00a97b;

  animation: ${({ $loading }) =>
      $loading ? loadingPulse : statusPulse}
    ${({ $loading }) => ($loading ? "1.2s" : "1.8s")}
    ease-in-out infinite;
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

  &:disabled {
    border-color: rgba(0, 169, 123, 0.28);

    background: rgba(0, 169, 123, 0.09);
    color: #008f69;

    cursor: default;

    opacity: 1;

    box-shadow:
      inset 0 0 0 1px rgba(0, 169, 123, 0.04),
      0 4px 10px rgba(0, 169, 123, 0.06);
  }

  @media (max-width: 640px) {
    width: 190px;
    height: 44px;

    font-size: 14px;
  }
`;

/* =====================================
   왼쪽 장식
===================================== */

const CrossIcon = styled.img`
  position: absolute;
  left: clamp(350px, 23vw, 470px);
  bottom: 22px;

  width: 72px;
  height: auto;

  animation: ${iconFloat} 3.4s ease-in-out infinite;

  @media (max-width: 900px) {
    left: 48%;

    width: 54px;
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

/* =====================================
   오른쪽 이미지 묶음
===================================== */

const RightVisualGroup = styled.div`
  position: absolute;
  right: clamp(150px, 12vw, 180px);
  bottom: 0;

  width: 650px;
  height: 100%;

  pointer-events: none;

  transform-origin: right bottom;

  @media (max-width: 1350px) {
    right: 20px;

    transform: scale(0.9);
  }

  @media (max-width: 1100px) {
    right: -25px;

    transform: scale(0.78);
  }

  @media (max-width: 900px) {
    right: -55px;

    transform: scale(0.66);
  }

  @media (max-width: 640px) {
    right: -90px;

    opacity: 0.3;

    transform: scale(0.55);
  }
`;

const HeroImage = styled.img`
  position: absolute;
  right: 35px;
  bottom: 0;

  width: 390px;
  max-height: 225px;

  object-fit: contain;
`;

const HeartIcon = styled.img`
  position: absolute;
  left: 200px;
  top: 40px;

  width: 42px;
  height: auto;

  animation: ${iconFloat} 3s ease-in-out infinite;
  animation-delay: 0.5s;
`;

const ShieldIcon = styled.img`
  position: absolute;
  right: 40px;
  top: 16px;

  width: 47px;
  height: auto;

  animation: ${iconFloat} 3.8s ease-in-out infinite;
  animation-delay: 1s;
`;

const PawIcon = styled.img`
  position: absolute;

  height: auto;

  opacity: 0.35;

  animation: ${pawFloat} 3s ease-in-out infinite;

  &.paw-large {
    left: 0;
    top: 38px;

    width: 58px;

    animation-delay: 0s;
  }

  &.paw-medium {
    left: 92px;
    top: 128px;

    width: 48px;

    animation-delay: 0.7s;
  }

  &.paw-small {
    left: 185px;
    top: 145px;

    width: 26px;

    animation-delay: 1.4s;
  }

  &.paw-right-top {
    right: 0;
    top: 90px;

    width: 25px;

    animation-delay: 0.4s;
  }

  &.paw-right-bottom {
    right: -50px;
    top: 158px;

    width: 27px;

    animation-delay: 1.1s;
  }
`;