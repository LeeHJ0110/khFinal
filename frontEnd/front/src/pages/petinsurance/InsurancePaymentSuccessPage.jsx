import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function InsurancePaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <SuccessCard>
        <IconCircle>✓</IconCircle>

        <Badge>PAYMENT METHOD REGISTERED</Badge>

        <Title>
          결제 수단 등록이
          <br />
          완료되었습니다
        </Title>

        <Description>
          펫 보험 가입 신청이 정상적으로 접수되었습니다.
          <br />
          관리자 심사가 완료되면 보험 가입이 최종 승인됩니다.
        </Description>

        <NoticeBox>
          <NoticeTitle>다음 단계 안내</NoticeTitle>

          <NoticeText>
            관리자 승인 이후 등록된 결제 수단으로 최초 보험료가 결제됩니다. 승인
            결과는 보험 상품 화면에서 확인할 수 있습니다.
          </NoticeText>
        </NoticeBox>

        <ButtonGroup>
          <SecondaryButton type="button" onClick={() => navigate("/")}>
            홈으로 이동
          </SecondaryButton>

          <PrimaryButton
            type="button"
            onClick={() => navigate("/healthcare/petinsurance")}
          >
            보험 화면으로 이동
          </PrimaryButton>
        </ButtonGroup>
      </SuccessCard>
    </PageWrapper>
  );
}

export default InsurancePaymentSuccessPage;

const PageWrapper = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;

  min-height: calc(100vh - 80px);
  padding: 48px 20px;

  background: #f8fcfb;

  box-sizing: border-box;
`;

const SuccessCard = styled.section`
  width: min(100%, 560px);

  padding: 52px 42px 38px;

  border: 1px solid #dcece7;
  border-radius: 22px;

  background: var(--color-white);

  text-align: center;

  box-shadow: 0 16px 36px rgba(0, 169, 123, 0.08);

  box-sizing: border-box;

  @media (max-width: 520px) {
    padding: 42px 24px 28px;
  }
`;

const IconCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 66px;
  height: 66px;

  margin: 0 auto;

  border-radius: 50%;

  background: var(--color-main);

  color: var(--color-white);

  font-size: 34px;
  font-weight: 800;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  margin-top: 22px;
  padding: 6px 11px;

  border-radius: 999px;

  background: var(--color-bg-light);

  color: var(--color-main-dark);

  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.5px;
`;

const Title = styled.h1`
  margin: 16px 0 0;

  color: var(--text-main);

  font-size: 29px;
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: -1px;

  word-break: keep-all;
`;

const Description = styled.p`
  margin: 16px 0 0;

  color: var(--text-desc);

  font-size: 14px;
  line-height: 1.75;

  word-break: keep-all;
`;

const NoticeBox = styled.div`
  margin-top: 25px;
  padding: 16px 18px;

  border-radius: 12px;

  background: #f6faf9;

  text-align: left;
`;

const NoticeTitle = styled.h2`
  margin: 0;

  color: var(--text-main);

  font-size: 13px;
  font-weight: 800;
`;

const NoticeText = styled.p`
  margin: 7px 0 0;

  color: var(--text-sub);

  font-size: 12px;
  line-height: 1.65;

  word-break: keep-all;
`;

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.45fr;
  gap: 10px;

  margin-top: 28px;
`;

const SecondaryButton = styled.button`
  height: 46px;

  border: 1px solid #dfe7e4;
  border-radius: 10px;

  background: var(--color-white);

  color: var(--text-sub);

  font-size: 13px;
  font-weight: 700;

  cursor: pointer;

  &:hover {
    background: #fafafa;
  }
`;

const PrimaryButton = styled.button`
  height: 46px;

  border: none;
  border-radius: 10px;

  background: var(--color-main);

  color: var(--color-white);

  font-size: 13px;
  font-weight: 800;

  cursor: pointer;

  &:hover {
    background: var(--color-main-dark);
  }
`;
