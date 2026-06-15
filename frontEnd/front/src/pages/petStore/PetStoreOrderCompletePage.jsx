import styled, { keyframes } from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import backgroundImg from "../../assets/images/petStore/결제완료배경.png";
import PetStoreNavGate from "./PetStoreNavGate";

export default function PetStoreOrderCompletePage() {
  const navigate = useNavigate();

  return (
    <>
      <PetStoreNavGate />

      <PageSection $bg={backgroundImg}>
        <DimLayer />
        <GlowCircle $left />
        <GlowCircle />

        <CompleteCard>
          <SuccessBadge>
            <IconCircle>
              <CheckIcon>✓</CheckIcon>
            </IconCircle>
          </SuccessBadge>

          <Eyebrow>ORDER COMPLETED</Eyebrow>

          <Title>
            주문이 정상적으로
            <br />
            접수되었어요.
          </Title>

          <Description>
            PET&I FOR를 이용해주셔서 감사합니다.
            <br />
            주문하신 상품은 확인 후 안전하게 포장해 발송 준비를 시작할게요.
          </Description>

          <NoticeBox>
            <NoticeIcon>i</NoticeIcon>

            <NoticeContent>
              <NoticeTitle>배송 안내</NoticeTitle>
              <NoticeText>
                배송 현황은 마이페이지의 주문내역에서 진행 상태를 확인하실 수
                있어요.
              </NoticeText>
            </NoticeContent>
          </NoticeBox>

          <ButtonGroup>
            <PrimaryButton type="button" onClick={() => navigate("/store")}>
              쇼핑 계속하기
            </PrimaryButton>

            <SecondaryButton
              type="button"
              onClick={() => navigate("/mypage/orders")}
            >
              내 주문 확인하기
            </SecondaryButton>
          </ButtonGroup>

          <SubLink to="/home">홈으로 돌아가기</SubLink>
        </CompleteCard>
      </PageSection>
    </>
  );
}

/* ================================
   Animations
================================ */

const cardIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(28px) scale(0.96);
    filter: blur(10px);
  }

  70% {
    opacity: 1;
    transform: translateY(-4px) scale(1.01);
    filter: blur(0);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
`;

const checkPop = keyframes`
  0% {
    transform: scale(0.55) rotate(-16deg);
    opacity: 0;
  }

  62% {
    transform: scale(1.12) rotate(4deg);
    opacity: 1;
  }

  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
`;

const glowFloat = keyframes`
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.62;
  }

  50% {
    transform: translateY(-18px) scale(1.06);
    opacity: 0.9;
  }
`;

const shineMove = keyframes`
  0% {
    transform: translateX(-120%) rotate(16deg);
  }

  100% {
    transform: translateX(160%) rotate(16deg);
  }
`;

/* ================================
   Layout
================================ */

const PageSection = styled.main`
  position: relative;

  width: 100%;
  min-height: calc(100vh - 114px);
  padding: 92px 20px 104px;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  background-image: url(${({ $bg }) => $bg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const DimLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;

  background:
    radial-gradient(
      circle at 50% 42%,
      rgba(255, 255, 255, 0.42) 0%,
      rgba(255, 255, 255, 0.18) 34%,
      rgba(255, 255, 255, 0.08) 62%
    ),
    linear-gradient(
      135deg,
      rgba(238, 255, 249, 0.42) 0%,
      rgba(255, 255, 255, 0.2) 42%,
      rgba(234, 249, 244, 0.42) 100%
    ),
    rgba(255, 255, 255, 0.2);

  backdrop-filter: blur(1.4px);
`;

const GlowCircle = styled.div`
  position: absolute;
  z-index: 0;

  width: 320px;
  height: 320px;

  left: ${({ $left }) => ($left ? "14%" : "auto")};
  right: ${({ $left }) => ($left ? "auto" : "16%")};
  top: ${({ $left }) => ($left ? "18%" : "58%")};

  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(0, 169, 123, 0.18) 0%,
    rgba(94, 200, 167, 0.1) 42%,
    transparent 72%
  );

  filter: blur(2px);
  animation: ${glowFloat} 4.2s ease-in-out infinite;
`;

/* ================================
   Card
================================ */

const CompleteCard = styled.section`
  position: relative;
  z-index: 1;

  width: min(720px, 92vw);
  min-height: 520px;
  padding: 62px 64px 52px;

  display: flex;
  flex-direction: column;
  align-items: center;

  overflow: hidden;

  border: 1px solid rgba(255, 255, 255, 0.86);
  border-radius: 30px;

  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.94) 0%,
    rgba(250, 255, 252, 0.84) 52%,
    rgba(236, 253, 246, 0.86) 100%
  );

  box-shadow:
    0 34px 90px rgba(18, 45, 46, 0.18),
    0 0 0 1px rgba(0, 169, 123, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);

  backdrop-filter: blur(18px);

  text-align: center;
  animation: ${cardIn} 0.54s cubic-bezier(0.16, 1, 0.3, 1) both;

  &::before {
    content: "";
    position: absolute;
    top: -40%;
    left: 0;

    width: 42%;
    height: 180%;

    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.68),
      transparent
    );

    opacity: 0.68;
    animation: ${shineMove} 1.15s ease 0.28s both;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 18px;

    border: 1px solid rgba(0, 169, 123, 0.08);
    border-radius: 24px;

    pointer-events: none;
  }
`;

const SuccessBadge = styled.div`
  position: relative;
  z-index: 1;

  width: 118px;
  height: 118px;
  margin-bottom: 18px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(0, 169, 123, 0.12), transparent 68%),
    rgba(236, 253, 246, 0.86);
`;

const IconCircle = styled.div`
  width: 88px;
  height: 88px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background:
    radial-gradient(
      circle at 28% 22%,
      rgba(255, 255, 255, 0.7),
      transparent 36%
    ),
    linear-gradient(160deg, #00a97b 0%, #35c89f 54%, #8ee8cd 100%);

  box-shadow:
    0 18px 36px rgba(0, 169, 123, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.52);

  animation: ${checkPop} 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
`;

const CheckIcon = styled.span`
  color: #ffffff;
  font-size: 48px;
  font-weight: 950;
  line-height: 1;
  transform: translateY(-1px);
`;

const Eyebrow = styled.div`
  position: relative;
  z-index: 1;

  margin-bottom: 12px;

  color: #00a97b;
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 2.2px;
`;

const Title = styled.h1`
  position: relative;
  z-index: 1;

  margin: 0;

  color: #122d2e;
  font-size: 38px;
  font-weight: 950;
  line-height: 1.22;
  letter-spacing: -1.6px;
`;

const Description = styled.p`
  position: relative;
  z-index: 1;

  margin: 22px 0 28px;

  color: #40524e;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.78;
  letter-spacing: -0.36px;
`;

const NoticeBox = styled.div`
  position: relative;
  z-index: 1;

  width: min(520px, 100%);
  margin-bottom: 36px;
  padding: 18px 20px;

  display: flex;
  align-items: flex-start;
  gap: 14px;

  border: 1px solid rgba(0, 169, 123, 0.18);
  border-radius: 18px;
  background: linear-gradient(
    135deg,
    rgba(236, 253, 246, 0.94),
    rgba(255, 255, 255, 0.74)
  );

  box-shadow:
    0 12px 26px rgba(18, 45, 46, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.82);

  text-align: left;
`;

const NoticeIcon = styled.div`
  width: 28px;
  height: 28px;
  flex: 0 0 28px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  background-color: #00a97b;
  color: #ffffff;

  font-size: 15px;
  font-weight: 900;
  font-family: Georgia, serif;
`;

const NoticeContent = styled.div`
  min-width: 0;
`;

const NoticeTitle = styled.div`
  margin-bottom: 5px;

  color: #00a97b;
  font-size: 14px;
  font-weight: 950;
`;

const NoticeText = styled.div`
  color: #4b5c58;
  font-size: 14px;
  font-weight: 650;
  line-height: 1.55;
`;

/* ================================
   Buttons
================================ */

const ButtonGroup = styled.div`
  position: relative;
  z-index: 1;

  width: 100%;

  display: flex;
  justify-content: center;
  gap: 14px;
`;

const BaseButton = styled.button`
  width: 196px;
  height: 56px;

  border-radius: 999px;
  font-size: 15px;
  font-weight: 900;
  letter-spacing: -0.2px;
  cursor: pointer;

  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease,
    background 0.16s ease,
    border-color 0.16s ease,
    color 0.16s ease;

  &:hover {
    transform: translateY(-3px);
  }

  &:active {
    transform: translateY(-1px) scale(0.985);
  }
`;

const PrimaryButton = styled(BaseButton)`
  border: 0;
  background: linear-gradient(135deg, #00a97b 0%, #16c194 56%, #5bd8b5 100%);
  color: #ffffff;

  box-shadow:
    0 14px 26px rgba(0, 169, 123, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.28);

  &:hover {
    box-shadow:
      0 18px 34px rgba(0, 169, 123, 0.32),
      inset 0 1px 0 rgba(255, 255, 255, 0.34);
  }
`;

const SecondaryButton = styled(BaseButton)`
  border: 1px solid rgba(0, 169, 123, 0.42);
  background: rgba(255, 255, 255, 0.74);
  color: #00a97b;

  box-shadow: 0 10px 22px rgba(18, 45, 46, 0.06);

  &:hover {
    background: rgba(236, 253, 246, 0.92);
    border-color: #00966e;
    color: #00966e;
    box-shadow: 0 14px 28px rgba(18, 45, 46, 0.09);
  }
`;

const SubLink = styled(Link)`
  position: relative;
  z-index: 1;

  display: inline-block;
  margin-top: 24px;

  color: #4b5c58;
  font-size: 14px;
  font-weight: 800;
  text-decoration: none;

  transition:
    color 0.16s ease,
    transform 0.16s ease;

  &:hover {
    color: #00a97b;
    transform: translateY(-1px);
    text-decoration: underline;
  }
`;
