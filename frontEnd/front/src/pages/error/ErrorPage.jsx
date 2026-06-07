import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import errorBg from "../../assets/images/errorPage/errorpage.png";
import errorill from "../../assets/images/errorPage/에러페이지 일러스트.png";

export default function ErrorPage({
  title = "앗, 페이지를 불러오지 못했어요.",
  description = "요청하신 페이지를 표시하는 중 문제가 발생했어요.",
  subDescription = "잠시 후 다시 시도하시거나, 홈으로 이동해 주세요.",
}) {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/common/home");
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <Wrapper $bg={errorBg}>
      <DimLayer />

      <ErrorCard>
        <PetIconBox>
          <PetIconImage src={errorill} alt="에러 안내 일러스트" />
        </PetIconBox>

        <Title>{title}</Title>

        <DescriptionBox>
          <Description>{description}</Description>
          <SubDescription>{subDescription}</SubDescription>
        </DescriptionBox>

        <ButtonBox>
          <HomeButton type="button" onClick={handleGoHome}>
            홈으로 가기
          </HomeButton>

          <RetryButton type="button" onClick={handleRetry}>
            다시 시도
          </RetryButton>
        </ButtonBox>
      </ErrorCard>
    </Wrapper>
  );
}

const cardUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(18px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const bubblePop = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.7);
  }

  70% {
    opacity: 1;
    transform: scale(1.08);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const Wrapper = styled.main`
  position: relative;
  width: 100%;
  min-height: calc(100vh - 180px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 96px 20px;
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
      rgba(255, 252, 245, 0.1) 0%,
      rgba(255, 252, 245, 0.28) 46%,
      rgba(255, 252, 245, 0.08) 100%
    ),
    rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(0.3px);
`;

const ErrorCard = styled.section`
  position: relative;
  z-index: 1;

  width: min(680px, 90%);
  min-height: 430px;
  padding: 50px 56px 56px;

  display: flex;
  flex-direction: column;
  align-items: center;

  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.74);
  box-shadow: 0 24px 70px rgba(18, 45, 46, 0.12);
  backdrop-filter: blur(8px);

  text-align: center;
  animation: ${cardUp} 0.42s ease;
`;

const PetIconBox = styled.div`
  position: relative;
  width: 176px;
  height: 112px;
  margin-bottom: 26px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const PetIconImage = styled.img`
  width: 250px;
  height: auto;
  display: block;
  object-fit: contain;
`;

const Title = styled.h1`
  margin: 0;

  color: #00a987;
  font-size: 31px;
  font-weight: 800;
  line-height: 1.34;
  letter-spacing: -1.3px;
`;

const DescriptionBox = styled.div`
  margin-top: 18px;
`;

const Description = styled.p`
  margin: 0;

  color: #444444;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.7;
  letter-spacing: -0.25px;
`;

const SubDescription = styled.p`
  margin: 4px 0 0;

  color: #444444;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.7;
  letter-spacing: -0.25px;
`;

const ButtonBox = styled.div`
  width: 100%;
  margin-top: 36px;

  display: flex;
  justify-content: center;
  gap: 42px;
`;

const BaseButton = styled.button`
  width: 250px;
  height: 60px;

  border-radius: 8px;
  font-size: 22px;
  font-weight: 800;
  cursor: pointer;

  transition:
    transform 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const HomeButton = styled(BaseButton)`
  border: 1px solid #00a987;
  background: #00a987;
  color: #ffffff;
  box-shadow: 0 12px 24px rgba(0, 169, 135, 0.2);

  &:hover {
    background: #009576;
    border-color: #009576;
    box-shadow: 0 16px 30px rgba(0, 169, 135, 0.26);
  }
`;

const RetryButton = styled(BaseButton)`
  border: 1px solid #00a987;
  background: rgba(255, 255, 255, 0.72);
  color: #00a987;

  &:hover {
    background: rgba(236, 253, 246, 0.82);
    border-color: #009576;
    color: #009576;
  }
`;
