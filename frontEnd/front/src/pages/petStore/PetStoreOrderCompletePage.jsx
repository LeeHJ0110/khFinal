import styled, { keyframes } from "styled-components";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function PetStoreOrderCompletePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get("orderId");

  return (
    <Wrapper>
      <CompleteCard>
        <IconCircle>
          <CheckIcon>✓</CheckIcon>
        </IconCircle>

        <Title>결제가 완료되었습니다</Title>

        <Description>
          PET&I FOR를 이용해주셔서 감사합니다.
          <br />
          소중한 반려동물을 위한 상품을 정성껏 준비하겠습니다.
        </Description>

        {orderId && (
          <OrderNumberBox>
            <span>주문번호</span>
            <strong>{orderId}</strong>
          </OrderNumberBox>
        )}

        <ButtonGroup>
          <PrimaryButton type="button" onClick={() => navigate("/store")}>
            쇼핑 계속하기
          </PrimaryButton>

          <SecondaryButton type="button" onClick={() => navigate("/home")}>
            홈으로 가기
          </SecondaryButton>
        </ButtonGroup>

        <SubLink to="/store/cart/list">장바구니 확인하기</SubLink>
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
  }
`;

const Wrapper = styled.main`
  min-height: calc(100vh - 180px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 90px 20px;
  background:
    radial-gradient(
      circle at top left,
      rgba(0, 168, 120, 0.11),
      transparent 34%
    ),
    linear-gradient(180deg, #ffffff 0%, #f6fffb 100%);
`;

const CompleteCard = styled.section`
  width: 620px;
  border: 1px solid #d7eee5;
  border-radius: 24px;
  background: #ffffff;
  padding: 54px 48px 46px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 80, 60, 0.11);
`;

const IconCircle = styled.div`
  width: 92px;
  height: 92px;
  margin: 0 auto 28px;
  border-radius: 50%;
  background: #00a878;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${pop} 0.45s ease;
`;

const CheckIcon = styled.span`
  color: #ffffff;
  font-size: 50px;
  font-weight: 900;
  line-height: 1;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 34px;
  font-weight: 900;
  color: #111111;
`;

const Description = styled.p`
  margin: 18px 0 30px;
  font-size: 17px;
  line-height: 1.7;
  color: #555555;
`;

const OrderNumberBox = styled.div`
  width: 360px;
  height: 62px;
  margin: 0 auto 34px;
  border-radius: 12px;
  background: #f1fff9;
  border: 1px solid #c6eee0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;

  span {
    font-size: 15px;
    font-weight: 700;
    color: #555555;
  }

  strong {
    font-size: 20px;
    font-weight: 900;
    color: #00a878;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const PrimaryButton = styled.button`
  width: 180px;
  height: 52px;
  border: 0;
  border-radius: 999px;
  background: #00a878;
  color: #ffffff;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
`;

const SecondaryButton = styled.button`
  width: 180px;
  height: 52px;
  border: 1px solid #cfd8d5;
  border-radius: 999px;
  background: #ffffff;
  color: #333333;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
`;

const SubLink = styled(Link)`
  display: inline-block;
  margin-top: 24px;
  font-size: 14px;
  font-weight: 700;
  color: #00a878;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
