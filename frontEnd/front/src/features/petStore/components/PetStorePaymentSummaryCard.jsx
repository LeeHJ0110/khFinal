import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

export default function PetStorePaymentSummaryCard({
  totalProductAmount = 0,
  orderDeliveryFee = 0,
  finalOrderAmount = 0,

  primaryButtonText = "주문하기",
  secondaryButtonText = "쇼핑 계속하기",

  onPrimaryClick,
  onSecondaryClick,

  primaryDisabled = false,
  isProcessing = false,
}) {
  const [isDeliveryHelpOpen, setIsDeliveryHelpOpen] = useState(false);
  const deliveryHelpRef = useRef(null);

  function handleToggleDeliveryHelp() {
    setIsDeliveryHelpOpen((prev) => !prev);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (!isDeliveryHelpOpen) {
        return;
      }

      if (
        deliveryHelpRef.current &&
        !deliveryHelpRef.current.contains(event.target)
      ) {
        setIsDeliveryHelpOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDeliveryHelpOpen]);

  return (
    <SummaryCard>
      <SummaryTitle>결제금액 요약</SummaryTitle>

      <SummaryRow>
        <SummaryLabel>주문 금액</SummaryLabel>
        <SummaryValue>{formatPrice(totalProductAmount)}</SummaryValue>
      </SummaryRow>

      <SummaryRow>
        <SummaryLabel>
          배송비
          <HelpWrap ref={deliveryHelpRef}>
            <HelpIcon
              type="button"
              aria-label="배송비 안내 보기"
              onClick={handleToggleDeliveryHelp}
            >
              ?
            </HelpIcon>

            {isDeliveryHelpOpen && (
              <HelpTooltip>
                <HelpTooltipTitle>배송비 안내</HelpTooltipTitle>
                <HelpTooltipText>
                  주문금액이 30,000원 이상이면 배송비가 무료입니다.
                </HelpTooltipText>
              </HelpTooltip>
            )}
          </HelpWrap>
        </SummaryLabel>

        <SummaryValue>{formatPrice(orderDeliveryFee)}</SummaryValue>
      </SummaryRow>

      <PointRow>
        <SummaryLabel>사용 포인트</SummaryLabel>

        <PointInputWrap>
          <PointInput value="0" readOnly />
          <PointSubText>현재 보유 포인트 : 0P</PointSubText>
        </PointInputWrap>
      </PointRow>

      <Divider />

      <FinalRow>
        <FinalLabel>최종 결제 금액</FinalLabel>
        <FinalValue>{formatPrice(finalOrderAmount)}</FinalValue>
      </FinalRow>

      <Divider />

      <PrimaryButton
        type="button"
        onClick={onPrimaryClick}
        disabled={primaryDisabled || isProcessing}
      >
        {isProcessing ? "처리 중..." : primaryButtonText}
      </PrimaryButton>

      {secondaryButtonText && (
        <SecondaryButton type="button" onClick={onSecondaryClick}>
          {secondaryButtonText}
        </SecondaryButton>
      )}
    </SummaryCard>
  );
}

function formatPrice(value) {
  return `${Number(value ?? 0).toLocaleString()}원`;
}

const SummaryCard = styled.aside`
  box-sizing: border-box;
  width: 400px;
  border: 1px solid #d8d8d8;
  border-radius: 6px;
  background-color: #ffffff;
  padding: 28px 30px;
  position: sticky;
  top: 120px;
`;

const SummaryTitle = styled.h2`
  margin: 0 0 28px;
  font-size: 22px;
  font-weight: 800;
  color: #111111;
  letter-spacing: -0.5px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const SummaryLabel = styled.div`
  position: relative;

  font-size: 15px;
  font-weight: 500;
  color: #333333;

  display: flex;
  align-items: center;
  gap: 5px;
`;

const SummaryValue = styled.div`
  font-size: 16px;
  font-weight: 800;
  color: #111111;
`;

const HelpWrap = styled.span`
  position: relative;

  display: inline-flex;
  align-items: center;
`;

const HelpIcon = styled.button`
  width: 14px;
  height: 14px;
  padding: 0;

  border: 1px solid #aaaaaa;
  border-radius: 50%;
  background-color: #ffffff;
  color: #777777;

  font-size: 10px;
  font-weight: 800;
  line-height: 1;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition:
    border-color 0.15s ease,
    color 0.15s ease,
    background-color 0.15s ease;

  &:hover {
    border-color: #05a77b;
    color: #05a77b;
    background-color: #ecfff9;
  }
`;

const HelpTooltip = styled.div`
  position: absolute;
  left: -10px;
  top: 24px;
  z-index: 20;

  width: 230px;
  padding: 14px 16px;

  border: 1px solid #bdebd9;
  border-radius: 6px;
  background-color: #ffffff;
  box-shadow: 0 8px 20px rgba(18, 45, 46, 0.12);

  color: #333333;
  text-align: left;

  animation: tooltipFadeIn 0.16s ease both;

  &::before {
    content: "";
    position: absolute;
    left: 12px;
    top: -6px;

    width: 10px;
    height: 10px;

    border-left: 1px solid #bdebd9;
    border-top: 1px solid #bdebd9;
    background-color: #ffffff;

    transform: rotate(45deg);
  }

  @keyframes tooltipFadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const HelpTooltipTitle = styled.strong`
  display: block;
  margin-bottom: 7px;

  color: #111111;
  font-size: 13px;
  font-weight: 900;
  line-height: 1;
`;

const HelpTooltipText = styled.p`
  margin: 0;

  color: #555555;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: -0.2px;
`;

const PointRow = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  align-items: start;
  gap: 12px;
  margin-bottom: 24px;
`;

const PointInputWrap = styled.div`
  min-width: 0;
`;

const PointInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 30px;
  border: 1px solid #d4d4d4;
  padding: 0 10px;
  text-align: right;
  font-size: 14px;
  background-color: #f9f9f9;
  color: #222222;

  &:focus {
    outline: none;
  }
`;

const PointSubText = styled.div`
  margin-top: 6px;
  text-align: right;
  font-size: 11px;
  color: #05a77b;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #dddddd;
  margin: 24px 0;
`;

const FinalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FinalLabel = styled.div`
  font-size: 17px;
  font-weight: 800;
  color: #111111;
`;

const FinalValue = styled.div`
  font-size: 30px;
  font-weight: 900;
  color: #05a77b;
  letter-spacing: -1px;
`;

const PrimaryButton = styled.button`
  width: 100%;
  height: 54px;
  border: none;
  border-radius: 8px;
  background-color: #05a77b;
  color: #ffffff;
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    background-color: #04966f;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled.button`
  width: 100%;
  height: 48px;
  border: 1px solid #d8d8d8;
  border-radius: 8px;
  background-color: #ffffff;
  color: #333333;
  font-size: 15px;
  font-weight: 800;
  margin-top: 12px;
  cursor: pointer;

  &:hover {
    background-color: #f8f8f8;
  }
`;
