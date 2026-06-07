import styled, { keyframes } from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import backgroundImg from "../../assets/images/petStore/결제완료배경.png";

export default function PetStoreOrderCompletePage() {
  const navigate = useNavigate();

  return (
    <Wrapper $bg={backgroundImg}>
      <DimLayer />

      <CompleteCard>
        <IconCircle>
          <CheckIcon>✓</CheckIcon>
        </IconCircle>

        <Eyebrow>ORDER COMPLETED</Eyebrow>

        <Title>주문이 정상적으로 접수되었어요.</Title>

        <Description>
          PET&I FOR를 이용해주셔서 감사합니다.
          <br />
          주문하신 상품은 확인 후 안전하게 포장해 발송 준비를 시작할게요.
        </Description>

        <NoticeBox>
          <NoticeTitle>안내</NoticeTitle>
          <NoticeText>
            배송 현황은 마이페이지 - 주문내역에서 진행 상태를 확인하실 수
            있어요.
          </NoticeText>
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
    </Wrapper>
  );
}

const pop = keyframes`
  0% {
    transform: scale(0.72);
    opacity: 0;
  }

  70% {
    transform: scale(1.08);
    opacity: 1;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const fadeUp = keyframes`
  0% {
    transform: translateY(18px);
    opacity: 0;
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

const Wrapper = styled.main`
  position: relative;
  width: 100%;
  min-height: calc(100vh - 180px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 110px 20px;
  overflow: hidden;

  background-image: url(${({ $bg }) => $bg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const DimLayer = styled.div`
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      90deg,
      rgba(255, 252, 244, 0.24) 0%,
      rgba(255, 252, 244, 0.48) 40%,
      rgba(255, 252, 244, 0.22) 100%
    ),
    rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(0.2px);
`;

const CompleteCard = styled.section`
  position: relative;
  z-index: 1;

  width: min(680px, 90%);
  min-height: 468px;
  padding: 54px 58px 48px;

  display: flex;
  flex-direction: column;
  align-items: center;

  border: 1px solid rgba(215, 238, 229, 0.95);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 24px 70px rgba(18, 45, 46, 0.12);
  backdrop-filter: blur(10px);

  text-align: center;
  animation: ${fadeUp} 0.45s ease;
`;

const IconCircle = styled.div`
  width: 86px;
  height: 86px;
  margin: 0 auto 20px;
  border-radius: 50%;

  background:
    radial-gradient(
      circle at 30% 25%,
      rgba(255, 255, 255, 0.42),
      transparent 34%
    ),
    linear-gradient(180deg, #00a97b 0%, #5ec8a7 100%);

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0 14px 34px rgba(0, 169, 123, 0.28);
  animation: ${pop} 0.45s ease;
`;

const CheckIcon = styled.span`
  color: #ffffff;
  font-size: 48px;
  font-weight: 900;
  line-height: 1;
`;

const Eyebrow = styled.div`
  margin-bottom: 10px;
  color: #00a97b;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 1.8px;
`;

const Title = styled.h1`
  margin: 0;
  color: #122d2e;
  font-size: 32px;
  font-weight: 900;
  line-height: 1.35;
  letter-spacing: -1.2px;
`;

const Description = styled.p`
  margin: 18px 0 26px;
  color: #444444;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.75;
  letter-spacing: -0.35px;
`;

const NoticeBox = styled.div`
  width: min(480px, 100%);
  margin-bottom: 34px;
  padding: 17px 20px;

  border: 1px solid rgba(0, 169, 123, 0.2);
  border-radius: 12px;
  background: rgba(236, 253, 246, 0.76);
`;

const NoticeTitle = styled.div`
  margin-bottom: 5px;
  color: #00a97b;
  font-size: 14px;
  font-weight: 900;
`;

const NoticeText = styled.div`
  color: #4b5c58;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.55;
`;

const ButtonGroup = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 16px;
`;

const BaseButton = styled.button`
  width: 190px;
  height: 54px;

  border-radius: 999px;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;

  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const PrimaryButton = styled(BaseButton)`
  border: 0;
  background: #00a97b;
  color: #ffffff;
  box-shadow: 0 12px 24px rgba(0, 169, 123, 0.22);

  &:hover {
    background: #00966e;
    box-shadow: 0 16px 28px rgba(0, 169, 123, 0.28);
  }
`;

const SecondaryButton = styled(BaseButton)`
  border: 1px solid #00a97b;
  background: rgba(255, 255, 255, 0.72);
  color: #00a97b;

  &:hover {
    background: rgba(236, 253, 246, 0.86);
    border-color: #00966e;
    color: #00966e;
  }
`;

const SubLink = styled(Link)`
  display: inline-block;
  margin-top: 24px;

  color: #4b5c58;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;

  transition: color 0.18s ease;

  &:hover {
    color: #00a97b;
    text-decoration: underline;
  }
`;
