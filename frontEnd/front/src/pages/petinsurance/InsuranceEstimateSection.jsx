import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

import { fetchMyInsurancePaymentHistory } from "../../features/petInsurance/api/petInsuranceApi";

function InsuranceEstimateSection() {
  const [paymentHistoryList, setPaymentHistoryList] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  // =========================================================
  // 모달이 열려 있는 동안 배경 스크롤 방지
  // =========================================================
  useEffect(() => {
    if (!isModalOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isModalOpen]);

  // =========================================================
  // 정기결제 내역 조회 후 모달 열기
  // =========================================================
  async function handleOpenPaymentHistory() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await fetchMyInsurancePaymentHistory();

      const data = response.data;

      if (!Array.isArray(data)) {
        throw new Error("정기결제 내역 응답 형식이 올바르지 않습니다.");
      }

      setPaymentHistoryList(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("펫 보험 정기결제 내역 조회 실패:", error);

      setErrorMessage(
        getErrorMessage(error, "정기결제 내역을 불러오지 못했습니다."),
      );
    } finally {
      setIsLoading(false);
    }
  }

  // =========================================================
  // 모달 닫기
  // =========================================================
  function handleCloseModal() {
    if (isLoading) {
      return;
    }

    setIsModalOpen(false);
  }

  return (
    <>
      <GuideSection>
        <GuideBadge>펫 보험 이용 안내</GuideBadge>

        <Title>
          우리 아이의 보험을
          <br />
          편리하게 관리해 보세요
        </Title>

        <Description>
          가입 신청부터 결제 내역 확인까지
          <br />한 화면에서 간편하게 관리할 수 있습니다.
        </Description>

        <Divider />

        <GuideList>
          <GuideItem>
            <GuideNumber>1</GuideNumber>

            <GuideContent>
              <GuideItemTitle>반려동물을 선택해 주세요</GuideItemTitle>

              <GuideItemDescription>
                등록된 반려동물의 정보를 기준으로 월 보험료가 자동 계산됩니다.
              </GuideItemDescription>
            </GuideContent>
          </GuideItem>

          <GuideItem>
            <GuideNumber>2</GuideNumber>

            <GuideContent>
              <GuideItemTitle>가입 신청을 진행해 주세요</GuideItemTitle>

              <GuideItemDescription>
                진료확인서를 첨부하고 카카오페이 결제 수단을 등록해 주세요.
              </GuideItemDescription>
            </GuideContent>
          </GuideItem>

          <GuideItem>
            <GuideNumber>3</GuideNumber>

            <GuideContent>
              <GuideItemTitle>승인 후 가입이 완료됩니다</GuideItemTitle>

              <GuideItemDescription>
                관리자 승인 이후 등록한 결제 수단으로 최초 보험료가 결제됩니다.
              </GuideItemDescription>
            </GuideContent>
          </GuideItem>
        </GuideList>

        <HistoryButton
          type="button"
          onClick={handleOpenPaymentHistory}
          disabled={isLoading}
        >
          <ReceiptIcon>₩</ReceiptIcon>

          {isLoading ? "결제 내역 불러오는 중..." : "정기결제 내역 확인하기"}

          {!isLoading && <ArrowIcon>›</ArrowIcon>}
        </HistoryButton>

        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </GuideSection>

      {isModalOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <ModalOverlay onClick={handleCloseModal} role="presentation">
            <ModalBox
              role="dialog"
              aria-modal="true"
              aria-labelledby="payment-history-modal-title"
              onClick={(event) => event.stopPropagation()}
            >
              <ModalHeader>
                <div>
                  <ModalBadge>보험료 결제 내역</ModalBadge>

                  <ModalTitle id="payment-history-modal-title">
                    펫 보험 정기결제 내역
                  </ModalTitle>

                  <ModalDescription>
                    최초 보험료 결제와 이후 정기결제 내역을 확인할 수 있습니다.
                  </ModalDescription>
                </div>

                <CloseButton
                  type="button"
                  aria-label="정기결제 내역 모달 닫기"
                  onClick={handleCloseModal}
                >
                  ×
                </CloseButton>
              </ModalHeader>

              <ModalBody>
                {paymentHistoryList.length === 0 ? (
                  <EmptyHistory>
                    <EmptyIcon>₩</EmptyIcon>

                    <EmptyTitle>아직 결제된 보험료가 없습니다</EmptyTitle>

                    <EmptyDescription>
                      보험 가입 승인 후 결제가 완료되면 이곳에서 내역을 확인할
                      수 있습니다.
                    </EmptyDescription>
                  </EmptyHistory>
                ) : (
                  <PaymentHistoryList>
                    {paymentHistoryList.map((payment) => (
                      <PaymentHistoryItem key={payment.paymentId}>
                        <PaymentTopRow>
                          <PaymentDate>
                            {formatDateTime(payment.paidAt)}
                          </PaymentDate>

                          <PaymentStatus $status={payment.paymentStatus}>
                            {getPaymentStatusLabel(payment.paymentStatus)}
                          </PaymentStatus>
                        </PaymentTopRow>

                        <PaymentDivider />

                        <PaymentInfoRow>
                          <PaymentLabel>반려동물</PaymentLabel>

                          <PaymentValue>{payment.petName || "-"}</PaymentValue>
                        </PaymentInfoRow>

                        <PaymentInfoRow>
                          <PaymentLabel>보험 상품</PaymentLabel>

                          <PaymentValue>
                            {payment.productName || "-"}
                          </PaymentValue>
                        </PaymentInfoRow>

                        <PaymentInfoRow>
                          <PaymentLabel>결제 금액</PaymentLabel>

                          <PaymentPrice>
                            {formatPrice(payment.paymentAmount)}원
                          </PaymentPrice>
                        </PaymentInfoRow>
                      </PaymentHistoryItem>
                    ))}
                  </PaymentHistoryList>
                )}
              </ModalBody>

              <ModalFooter>
                <ConfirmButton type="button" onClick={handleCloseModal}>
                  확인
                </ConfirmButton>
              </ModalFooter>
            </ModalBox>
          </ModalOverlay>,
          document.body,
        )}
    </>
  );
}

export default InsuranceEstimateSection;

// =========================================================
// 유틸 함수
// =========================================================
function getErrorMessage(error, defaultMessage) {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    defaultMessage
  );
}

function formatPrice(price) {
  return Number(price || 0).toLocaleString("ko-KR");
}

function formatDateTime(dateTimeValue) {
  if (!dateTimeValue) {
    return "-";
  }

  return new Date(dateTimeValue).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getPaymentStatusLabel(status) {
  if (status === "SUCCESS") {
    return "결제 완료";
  }

  if (status === "FAIL") {
    return "결제 실패";
  }

  if (status === "CANCEL") {
    return "결제 취소";
  }

  return status || "-";
}

// =========================================================
// styled-components
// =========================================================
const GuideSection = styled.section`
  position: relative;

  display: flex;
  flex-direction: column;

  width: 100%;
  height: 620px;

  padding: 42px 26px;

  overflow: hidden;

  border: 1px solid #dfe8e5;
  border-radius: 16px;

  background: linear-gradient(
    145deg,
    var(--color-white) 0%,
    var(--color-white) 72%,
    var(--color-bg-light) 100%
  );

  box-sizing: border-box;
`;

const GuideBadge = styled.span`
  align-self: flex-start;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 6px 10px;

  border-radius: 999px;

  background: var(--color-bg-light);

  font-size: 11px;
  font-weight: 800;
  color: var(--color-main-dark);
`;

const Title = styled.h2`
  margin: 15px 0 0;

  font-size: 22px;
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: -0.7px;
  color: var(--text-main);
`;

const Description = styled.p`
  margin: 11px 0 0;

  font-size: 12px;
  line-height: 1.75;
  color: var(--text-desc);
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;

  margin: 19px 0;

  background: #edf0ef;
`;

const GuideList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const GuideItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

const GuideNumber = styled.span`
  flex-shrink: 0;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 23px;
  height: 23px;

  border-radius: 50%;

  background: var(--color-bg-light);

  font-size: 11px;
  font-weight: 800;
  color: var(--color-main-dark);
`;

const GuideContent = styled.div`
  min-width: 0;
`;

const GuideItemTitle = styled.p`
  margin: 1px 0 0;

  font-size: 13px;
  font-weight: 800;
  color: var(--text-main);
`;

const GuideItemDescription = styled.p`
  margin: 4px 0 0;

  font-size: 12px;
  line-height: 1.6;
  color: var(--text-desc);
`;

const HistoryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;

  width: 100%;
  min-height: 44px;

  margin-top: auto;
  padding: 0 13px;

  border: 1px solid var(--color-mint);
  border-radius: 9px;

  background: var(--color-white);

  font-size: 12px;
  font-weight: 800;
  color: var(--color-main-dark);

  cursor: pointer;

  transition:
    background 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    border-color: var(--color-main);
    background: var(--color-bg-light);
  }

  &:disabled {
    opacity: 0.65;
    cursor: default;
  }
`;

const ReceiptIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 23px;
  height: 23px;

  border-radius: 50%;

  background: var(--color-bg-light);

  font-size: 12px;
  font-weight: 800;
  color: var(--color-main-dark);
`;

const ArrowIcon = styled.span`
  margin-left: auto;

  font-size: 21px;
  font-weight: 400;
  line-height: 1;
  color: var(--color-main-dark);
`;

const ErrorMessage = styled.p`
  margin: 12px 0 0;

  font-size: 12px;
  line-height: 1.55;
  color: #e74c3c;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(0, 0, 0, 0.46);
`;

const ModalBox = styled.div`
  display: flex;
  flex-direction: column;

  width: min(560px, 100%);
  max-height: 84vh;

  overflow: hidden;

  border-radius: 20px;

  background: var(--color-white);

  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;

  padding: 24px 24px 18px;

  border-bottom: 1px solid #eeeeee;
`;

const ModalBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 5px 10px;

  border-radius: 999px;

  background: var(--color-bg-light);

  font-size: 11px;
  font-weight: 700;
  color: var(--color-main-dark);
`;

const ModalTitle = styled.h2`
  margin: 11px 0 0;

  font-size: 21px;
  font-weight: 800;
  color: var(--text-main);
`;

const ModalDescription = styled.p`
  margin: 7px 0 0;

  font-size: 12px;
  line-height: 1.6;
  color: var(--text-desc);
`;

const CloseButton = styled.button`
  border: none;

  background: transparent;

  font-size: 27px;
  line-height: 1;
  color: var(--text-desc);

  cursor: pointer;

  &:hover {
    color: var(--text-main);
  }
`;

const ModalBody = styled.div`
  overflow-y: auto;

  padding: 20px 24px;
`;

const EmptyHistory = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 44px 20px;

  border: 1px dashed #d8e5e1;
  border-radius: 12px;

  background: #fafdfc;

  text-align: center;
`;

const EmptyIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 42px;
  height: 42px;

  border-radius: 50%;

  background: var(--color-bg-light);

  font-size: 19px;
  font-weight: 800;
  color: var(--color-main-dark);
`;

const EmptyTitle = styled.h3`
  margin: 16px 0 0;

  font-size: 15px;
  font-weight: 800;
  color: var(--text-main);
`;

const EmptyDescription = styled.p`
  max-width: 340px;

  margin: 8px 0 0;

  font-size: 12px;
  line-height: 1.65;
  color: var(--text-desc);
`;

const PaymentHistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PaymentHistoryItem = styled.article`
  padding: 16px;

  border: 1px solid #e7ecea;
  border-radius: 12px;

  background: var(--color-white);
`;

const PaymentTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const PaymentDate = styled.span`
  font-size: 12px;
  color: var(--text-desc);
`;

const PaymentStatus = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 5px 9px;

  border-radius: 999px;

  background: ${({ $status }) => {
    if ($status === "SUCCESS") {
      return "var(--color-bg-light)";
    }

    if ($status === "FAIL") {
      return "#fff3f1";
    }

    return "#f3f3f3";
  }};

  font-size: 11px;
  font-weight: 700;

  color: ${({ $status }) => {
    if ($status === "SUCCESS") {
      return "var(--color-main-dark)";
    }

    if ($status === "FAIL") {
      return "#d45a4d";
    }

    return "var(--text-desc)";
  }};
`;

const PaymentDivider = styled.div`
  width: 100%;
  height: 1px;

  margin: 13px 0;

  background: #eeeeee;
`;

const PaymentInfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;

  margin-top: 8px;
`;

const PaymentLabel = styled.span`
  font-size: 12px;
  color: var(--text-desc);
`;

const PaymentValue = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: var(--text-main);
`;

const PaymentPrice = styled.span`
  font-size: 16px;
  font-weight: 800;
  color: var(--color-main-dark);
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;

  padding: 16px 24px 20px;

  border-top: 1px solid #eeeeee;

  background: var(--color-white);
`;

const ConfirmButton = styled.button`
  min-width: 106px;
  height: 42px;

  border: none;
  border-radius: 9px;

  background: var(--color-main);

  font-size: 13px;
  font-weight: 800;
  color: var(--color-white);

  cursor: pointer;

  &:hover {
    background: var(--color-main-dark);
  }
`;
