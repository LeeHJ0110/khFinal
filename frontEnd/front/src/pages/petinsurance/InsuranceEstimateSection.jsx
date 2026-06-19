import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { fetchMyInsurancePaymentHistory } from "../../features/petInsurance/api/petInsuranceApi";

function InsuranceEstimateSection() {
  // =========================================================
  // 로그인 여부 확인
  // 로그인 전에는 이 컴포넌트 전체를 렌더링하지 않음
  // =========================================================
  const accessToken = useSelector((state) => state.member.accessToken);

  const [paymentHistoryList, setPaymentHistoryList] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [selectedYear, setSelectedYear] = useState("ALL");
  const [selectedMonth, setSelectedMonth] = useState("ALL");

  // =========================================================
  // 조회 가능한 연도 목록
  // 현재 연도부터 1980년까지 모두 표시
  // =========================================================
  const availableYearList = useMemo(() => {
    const currentYear = new Date().getFullYear();

    return Array.from(
      { length: currentYear - 1980 + 1 },
      (_, index) => currentYear - index,
    );
  }, []);

  // =========================================================
  // 선택한 연도와 월에 맞게 결제 내역 필터링
  // =========================================================
  const filteredPaymentHistoryList = useMemo(() => {
    return paymentHistoryList.filter((payment) => {
      const date = getValidDate(payment.paidAt);

      if (!date) {
        return selectedYear === "ALL" && selectedMonth === "ALL";
      }

      const year = String(date.getFullYear());
      const month = String(date.getMonth() + 1).padStart(2, "0");

      const isYearMatched = selectedYear === "ALL" || year === selectedYear;

      const isMonthMatched = selectedMonth === "ALL" || month === selectedMonth;

      return isYearMatched && isMonthMatched;
    });
  }, [paymentHistoryList, selectedYear, selectedMonth]);

  // =========================================================
  // 결제 내역을 월별로 그룹화
  // SUCCESS 상태의 결제 금액만 월별 최종 금액에 포함
  // =========================================================
  const monthlyPaymentHistoryList = useMemo(() => {
    const groupedMap = new Map();

    filteredPaymentHistoryList.forEach((payment) => {
      const monthKey = getMonthKey(payment.paidAt);

      if (!groupedMap.has(monthKey)) {
        groupedMap.set(monthKey, {
          monthKey,
          monthLabel: formatMonthLabel(monthKey),
          totalAmount: 0,
          paymentList: [],
        });
      }

      const monthGroup = groupedMap.get(monthKey);

      monthGroup.paymentList.push(payment);

      if (payment.paymentStatus === "SUCCESS") {
        monthGroup.totalAmount += Number(payment.paymentAmount || 0);
      }
    });

    return Array.from(groupedMap.values()).sort((a, b) =>
      b.monthKey.localeCompare(a.monthKey),
    );
  }, [filteredPaymentHistoryList]);

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

      const latestPeriod = getLatestPaymentPeriod(data);

      setPaymentHistoryList(data);
      setSelectedYear(latestPeriod.year);
      setSelectedMonth(latestPeriod.month);
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

  // =========================================================
  // 로그인 전에는 영역 전체 숨김
  // =========================================================
  if (!accessToken) {
    return null;
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
                등록된 나이 정보를 기준으로 월 보험료가 계산됩니다. 나이에 따라
                보험료가 달라질 수 있으며, 만 10세 이상은 가입이 어렵습니다.
              </GuideItemDescription>
            </GuideContent>
          </GuideItem>

          <GuideItem>
            <GuideNumber>2</GuideNumber>

            <GuideContent>
              <GuideItemTitle>진료확인서를 첨부해 주세요</GuideItemTitle>

              <GuideItemDescription>
                최근 6개월 이내 건강에 이상이 없다는 의사 소견이 확인되어야
                합니다. 진료확인서가 없거나 확인이 어려운 경우 가입이 제한될 수
                있습니다.
              </GuideItemDescription>
            </GuideContent>
          </GuideItem>

          <GuideItem>
            <GuideNumber>3</GuideNumber>

            <GuideContent>
              <GuideItemTitle>
                결제 수단 등록 후 승인을 기다려 주세요
              </GuideItemTitle>

              <GuideItemDescription>
                카카오페이 결제 수단 등록 후 신청이 접수됩니다. 관리자 승인 시
                최초 보험료가 결제되며, 해지 신청 후에도 당월까지는 보험 혜택이
                유지됩니다.
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

                  <FilterRow>
                    <FilterSelect
                      value={selectedYear}
                      onChange={(event) => setSelectedYear(event.target.value)}
                      aria-label="결제 연도 선택"
                    >
                      <option value="ALL">전체 연도</option>

                      {availableYearList.map((year) => (
                        <option key={year} value={String(year)}>
                          {year}년
                        </option>
                      ))}
                    </FilterSelect>

                    <FilterSelect
                      value={selectedMonth}
                      onChange={(event) => setSelectedMonth(event.target.value)}
                      aria-label="결제 월 선택"
                    >
                      <option value="ALL">전체 월</option>

                      {MONTH_OPTION_LIST.map((month) => (
                        <option key={month} value={month}>
                          {Number(month)}월
                        </option>
                      ))}
                    </FilterSelect>

                    <ResetFilterButton
                      type="button"
                      onClick={() => {
                        const latestPeriod =
                          getLatestPaymentPeriod(paymentHistoryList);

                        setSelectedYear(latestPeriod.year);
                        setSelectedMonth(latestPeriod.month);
                      }}
                    >
                      최신 내역
                    </ResetFilterButton>
                  </FilterRow>
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
                {filteredPaymentHistoryList.length === 0 ? (
                  <EmptyHistory>
                    <EmptyIcon>₩</EmptyIcon>

                    <EmptyTitle>
                      {paymentHistoryList.length === 0
                        ? "아직 결제된 보험료가 없습니다"
                        : "선택한 기간의 결제 내역이 없습니다"}
                    </EmptyTitle>

                    <EmptyDescription>
                      {paymentHistoryList.length === 0
                        ? "보험 가입 승인 후 결제가 완료되면 이곳에서 내역을 확인할 수 있습니다."
                        : "조회 연도 또는 월을 변경해 주세요."}
                    </EmptyDescription>
                  </EmptyHistory>
                ) : (
                  <MonthlyHistoryList>
                    {monthlyPaymentHistoryList.map((monthGroup) => (
                      <MonthlyHistorySection key={monthGroup.monthKey}>
                        <MonthlySummary>
                          <div>
                            <MonthlyTitle>{monthGroup.monthLabel}</MonthlyTitle>

                            <MonthlyDescription>
                              결제 완료된 보험료 기준
                            </MonthlyDescription>
                          </div>

                          <MonthlyTotalArea>
                            <MonthlyTotalLabel>
                              월별 최종 금액
                            </MonthlyTotalLabel>

                            <MonthlyTotalPrice>
                              {formatPrice(monthGroup.totalAmount)}원
                            </MonthlyTotalPrice>
                          </MonthlyTotalArea>
                        </MonthlySummary>

                        <PaymentHistoryList>
                          {monthGroup.paymentList.map((payment) => (
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

                                <PaymentValue>
                                  {payment.petName || "-"}
                                </PaymentValue>
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
                      </MonthlyHistorySection>
                    ))}
                  </MonthlyHistoryList>
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
const MONTH_OPTION_LIST = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];

function getLatestPaymentPeriod(paymentHistoryList) {
  const latestDate = paymentHistoryList
    .map((payment) => getValidDate(payment.paidAt))
    .filter(Boolean)
    .sort((a, b) => b.getTime() - a.getTime())[0];

  if (!latestDate) {
    return {
      year: "ALL",
      month: "ALL",
    };
  }

  return {
    year: String(latestDate.getFullYear()),
    month: String(latestDate.getMonth() + 1).padStart(2, "0"),
  };
}

function getValidDate(dateTimeValue) {
  if (!dateTimeValue) {
    return null;
  }

  const date = new Date(dateTimeValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function getMonthKey(dateTimeValue) {
  const date = getValidDate(dateTimeValue);

  if (!date) {
    return "unknown";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

function formatMonthLabel(monthKey) {
  if (monthKey === "unknown") {
    return "결제 일시 미확인";
  }

  const [year, month] = monthKey.split("-");

  return `${year}년 ${month}월`;
}

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
  height: 685px;

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

  color: var(--text-main);

  font-size: 22px;
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: -0.7px;

  word-break: keep-all;
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

  color: var(--text-main);

  font-size: 13px;
  font-weight: 800;

  word-break: keep-all;
`;

const GuideItemDescription = styled.p`
  margin: 4px 0 0;

  color: var(--text-desc);

  font-size: 12px;
  line-height: 1.6;

  word-break: keep-all;
`;

const HistoryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;

  width: 100%;
  min-height: 52px;

  margin-top: auto;
  padding: 0 15px;

  border: 1px solid #bfe9dd;
  border-radius: 11px;

  background: #f1fbf8;

  color: var(--color-main-dark);

  font-size: 13px;
  font-weight: 800;
  letter-spacing: -0.2px;

  white-space: nowrap;

  cursor: pointer;

  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    transform 0.18s ease;

  &:hover {
    border-color: var(--color-main);
    background: #e7f8f3;

    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;

    cursor: default;

    transform: none;
  }

  @media (max-width: 1150px) {
    gap: 8px;

    min-height: 48px;

    padding: 0 12px;

    font-size: 12px;
  }
`;

const ReceiptIcon = styled.span`
  flex-shrink: 0;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 28px;
  height: 28px;

  border-radius: 8px;

  background: var(--color-main);

  color: var(--color-white);

  font-size: 14px;
  font-weight: 900;
`;

const ArrowIcon = styled.span`
  margin-left: auto;

  color: var(--color-main-dark);

  font-size: 22px;
  font-weight: 500;
  line-height: 1;

  transition: transform 0.18s ease;

  ${HistoryButton}:hover & {
    transform: translateX(2px);
  }
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

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  margin-top: 15px;
`;

const FilterSelect = styled.select`
  min-width: 108px;
  height: 36px;

  padding: 0 10px;

  border: 1px solid #dfe8e5;
  border-radius: 8px;

  background: var(--color-white);

  font-size: 12px;
  color: var(--text-main);

  cursor: pointer;

  &:focus {
    outline: 1px solid var(--color-main);
  }
`;

const ResetFilterButton = styled.button`
  height: 36px;

  padding: 0 12px;

  border: 1px solid var(--color-mint);
  border-radius: 8px;

  background: var(--color-bg-light);

  font-size: 12px;
  font-weight: 700;
  color: var(--color-main-dark);

  cursor: pointer;

  &:hover {
    border-color: var(--color-main);
  }
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

const MonthlyHistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const MonthlyHistorySection = styled.section`
  overflow: hidden;

  border: 1px solid #dfe8e5;
  border-radius: 14px;

  background: #fafdfc;
`;

const MonthlySummary = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  padding: 15px 16px;

  border-bottom: 1px solid #e7ecea;

  background: var(--color-bg-light);
`;

const MonthlyTitle = styled.h3`
  margin: 0;

  font-size: 15px;
  font-weight: 800;
  color: var(--text-main);
`;

const MonthlyDescription = styled.p`
  margin: 5px 0 0;

  font-size: 11px;
  color: var(--text-desc);
`;

const MonthlyTotalArea = styled.div`
  flex-shrink: 0;

  text-align: right;
`;

const MonthlyTotalLabel = styled.p`
  margin: 0;

  font-size: 11px;
  color: var(--text-desc);
`;

const MonthlyTotalPrice = styled.strong`
  display: block;

  margin-top: 4px;

  font-size: 19px;
  font-weight: 800;
  color: var(--color-main-dark);
`;

const PaymentHistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  padding: 12px;
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
