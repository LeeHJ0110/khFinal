import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import errorBg from "../../assets/images/errorpage.png";

export default function ErrorPage({
  title = "앗, 페이지를 불러오지 못했어요.",
  description = "요청하신 페이지를 표시하는 중 문제가 발생했어요.",
  subDescription = "잠시 후 다시 시도하시거나, 홈으로 이동해 주세요.",
}) {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <Wrapper $bg={errorBg}>
      <DimLayer />

      <ErrorCard>
        <PetIconBox>
          <PetIcon>
            <DogFace>🐶</DogFace>
            <CatFace>🐱</CatFace>
            <Bubble>!</Bubble>
          </PetIcon>
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

const Wrapper = styled.main`
  position: relative;
  width: 100%;
  min-height: calc(100vh - 300px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 20px;
  overflow: hidden;

  background-image: url(${({ $bg }) => $bg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const DimLayer = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(255, 252, 245, 0.18);
  backdrop-filter: blur(1px);
`;

const ErrorCard = styled.section`
  position: relative;
  z-index: 1;

  width: min(700px, 90%);
  min-height: 430px;
  padding: 54px 56px 60px;

  display: flex;
  flex-direction: column;
  align-items: center;

  border-radius: 14px;
  background: rgba(255, 255, 255, 0.76);
  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(8px);

  text-align: center;
`;

const PetIconBox = styled.div`
  margin-bottom: 28px;
`;

const PetIcon = styled.div`
  position: relative;
  width: 170px;
  height: 105px;

  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 4px;

  color: #007f68;
`;

const DogFace = styled.div`
  font-size: 74px;
  line-height: 1;
  filter: grayscale(0.1);
`;

const CatFace = styled.div`
  font-size: 62px;
  line-height: 1;
  filter: grayscale(0.1);
`;

const Bubble = styled.div`
  position: absolute;
  top: 0;
  right: 10px;

  width: 34px;
  height: 34px;
  border: 2px solid #00a987;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #00a987;
  font-size: 22px;
  font-weight: 800;
`;

const Title = styled.h1`
  margin: 0;

  color: #00a987;
  font-size: 38px;
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: -1.2px;
`;

const DescriptionBox = styled.div`
  margin-top: 22px;
`;

const Description = styled.p`
  margin: 0;

  color: #444;
  font-size: 17px;
  font-weight: 500;
  line-height: 1.7;
`;

const SubDescription = styled.p`
  margin: 4px 0 0;

  color: #444;
  font-size: 17px;
  font-weight: 500;
  line-height: 1.7;
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
  font-weight: 700;
  cursor: pointer;

  transition: 0.18s ease;

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
  color: #fff;

  &:hover {
    background: #009576;
    border-color: #009576;
  }
`;

const RetryButton = styled(BaseButton)`
  border: 1px solid #00a987;
  background: rgba(255, 255, 255, 0.7);
  color: #00a987;

  &:hover {
    background: rgba(0, 169, 135, 0.08);
  }
`;
