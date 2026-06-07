import React, { useEffect, useState } from "react";
import styled from "styled-components";

import {
  approveInsuranceApplication,
  fetchWaitingInsuranceApplicationList,
} from "../../features/petInsurance/api/petInsuranceApi";

function InsuranceAdminApplicationPage() {
  const [applicationList, setApplicationList] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // =========================================================
  // 페이지 진입 시 승인 대기 목록 조회
  // =========================================================
  useEffect(() => {
    loadApplicationList();
  }, []);

  async function loadApplicationList() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response =
        await fetchWaitingInsuranceApplicationList();

      const data = response.data;

      console.log("관리자 보험 신청 목록:", data);

      if (!Array.isArray(data)) {
        throw new Error("보험 신청 목록 응답 형식이 올바르지 않습니다.");
      }

      setApplicationList(data);
    } catch (error) {
      console.error("관리자 보험 신청 목록 조회 실패:", error);

      setErrorMessage(
        getErrorMessage(error, "보험 신청 목록을 불러오지 못했습니다."),
      );
    } finally {
      setIsLoading(false);
    }
  }

  // =========================================================
  // 상세 모달 열기
  // =========================================================
  function handleOpenDetail(application) {
    setSelectedApplication(application);
    setErrorMessage("");
    setSuccessMessage("");
  }

  // =========================================================
  // 상세 모달 닫기
  // =========================================================
  function handleCloseDetail() {
    if (isApproving) {
      return;
    }

    setSelectedApplication(null);
  }

  // =========================================================
  // 관리자 승인
  // 등록된 SID로 최초 월 보험료 결제 후 APPROVED 변경
  // =========================================================
  async function handleApproveApplication() {
    if (!selectedApplication) {
      return;
    }

    const isConfirmed = window.confirm(
      `${selectedApplication.petName}의 보험 가입 신청을 승인하시겠습니까?\n\n승인 즉시 등록된 카드로 최초 월 보험료가 결제됩니다.`,
    );

    if (!isConfirmed) {
      return;
    }

    try {
      setIsApproving(true);
      setErrorMessage("");
      setSuccessMessage("");

      await approveInsuranceApplication(
        selectedApplication.applicationId,
      );

      setSelectedApplication(null);

      setSuccessMessage(
        "보험 가입 승인과 최초 월 보험료 결제가 완료되었습니다.",
      );

      await loadApplicationList();
    } catch (error) {
      console.error("보험 가입 승인 실패:", error);

      setErrorMessage(
        getErrorMessage(error, "보험 가입 승인 처리에 실패했습니다."),
      );
    } finally {
      setIsApproving(false);
    }
  }

  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>펫 보험 가입 신청 관리</PageTitle>

          <PageDescription>
            카드 등록을 완료한 보험 가입 신청을 확인하고 승인할 수 있습니다.
          </PageDescription>
        </div>

        <RefreshButton
          type="button"
          onClick={loadApplicationList}
          disabled={isLoading || isApproving}
        >
          {isLoading ? "불러오는 중..." : "목록 새로고침"}
        </RefreshButton>
      </PageHeader>

      <SummaryBar>
        <SummaryLabel>승인 대기 신청</SummaryLabel>

        <SummaryCount>{applicationList.length}건</SummaryCount>
      </SummaryBar>

      {errorMessage && (
        <ErrorMessage>{errorMessage}</ErrorMessage>
      )}

      {successMessage && (
        <SuccessMessage>{successMessage}</SuccessMessage>
      )}

      <TableContainer>
        {isLoading ? (
          <EmptyBox>
            보험 신청 목록을 불러오고 있습니다.
          </EmptyBox>
        ) : applicationList.length === 0 ? (
          <EmptyBox>
            현재 승인 대기 중인 보험 신청이 없습니다.
          </EmptyBox>
        ) : (
          <ApplicationTable>
            <thead>
              <tr>
                <th>신청 번호</th>
                <th>보호자</th>
                <th>반려동물</th>
                <th>가입 상품</th>
                <th>월 보험료</th>
                <th>신청일</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>

            <tbody>
              {applicationList.map((application) => (
                <tr key={application.applicationId}>
                  <td>
                    <ApplicationNumber>
                      #{application.applicationId}
                    </ApplicationNumber>
                  </td>

                  <td>{application.memberNickname || "-"}</td>

                  <td>
                    <PetName>{application.petName || "-"}</PetName>
                  </td>

                  <td>{application.productName || "-"}</td>

                  <td>
                    <PriceText>
                      {formatPrice(application.productMonthly)}원
                    </PriceText>
                  </td>

                  <td>{formatDate(application.createdAt)}</td>

                  <td>
                    <WaitingBadge>신청 중</WaitingBadge>
                  </td>

                  <td>
                    <DetailButton
                      type="button"
                      onClick={() => handleOpenDetail(application)}
                    >
                      상세 보기
                    </DetailButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </ApplicationTable>
        )}
      </TableContainer>

      {selectedApplication && (
        <ModalOverlay onClick={handleCloseDetail}>
          <ModalBox onClick={(event) => event.stopPropagation()}>
            <ModalHeader>
              <div>
                <ModalBadge>보험 가입 심사</ModalBadge>

                <ModalTitle>펫 보험 가입 신청 상세</ModalTitle>

                <ModalDescription>
                  신청 정보를 확인한 뒤 승인 여부를 결정해 주세요.
                </ModalDescription>
              </div>

              <CloseButton
                type="button"
                onClick={handleCloseDetail}
              >
                ×
              </CloseButton>
            </ModalHeader>

            <ModalBody>
              <InfoSection>
                <SectionTitle>신청 정보</SectionTitle>

                <InfoTable>
                  <InfoRow>
                    <InfoLabel>신청 번호</InfoLabel>
                    <InfoValue>
                      #{selectedApplication.applicationId}
                    </InfoValue>
                  </InfoRow>

                  <InfoRow>
                    <InfoLabel>신청 상태</InfoLabel>
                    <InfoValue>
                      <WaitingBadge>신청 중</WaitingBadge>
                    </InfoValue>
                  </InfoRow>

                  <InfoRow>
                    <InfoLabel>보호자</InfoLabel>
                    <InfoValue>
                      {selectedApplication.memberNickname || "-"}
                    </InfoValue>
                  </InfoRow>

                  <InfoRow>
                    <InfoLabel>반려동물</InfoLabel>
                    <InfoValue>
                      {selectedApplication.petName || "-"}
                    </InfoValue>
                  </InfoRow>

                  <InfoRow>
                    <InfoLabel>가입 상품</InfoLabel>
                    <InfoValue>
                      {selectedApplication.productName || "-"}
                    </InfoValue>
                  </InfoRow>

                  <InfoRow>
                    <InfoLabel>월 보험료</InfoLabel>
                    <PriceValue>
                      {formatPrice(
                        selectedApplication.productMonthly,
                      )}
                      원
                    </PriceValue>
                  </InfoRow>

                  <InfoRow>
                    <InfoLabel>신청일</InfoLabel>
                    <InfoValue>
                      {formatDate(selectedApplication.createdAt)}
                    </InfoValue>
                  </InfoRow>
                </InfoTable>
              </InfoSection>

              <DocumentSection>
                <SectionTitle>제출 서류</SectionTitle>

                <CertificateCard>
                  <CertificateInfo>
                    <CertificateTitle>진료확인서</CertificateTitle>

                    <CertificateDescription>
                      제출된 진료확인서를 확인한 뒤 가입 여부를 결정해 주세요.
                    </CertificateDescription>
                  </CertificateInfo>

                  {selectedApplication.medicalCertificateUrl ? (
                    <CertificateLink
                      href={
                        selectedApplication.medicalCertificateUrl
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      진료확인서 보기
                    </CertificateLink>
                  ) : (
                    <MissingText>
                      등록된 파일이 없습니다.
                    </MissingText>
                  )}
                </CertificateCard>
              </DocumentSection>

              <NoticeBox>
                <NoticeTitle>승인 전 확인해 주세요</NoticeTitle>

                <NoticeText>
                  승인하면 사용자가 등록한 카드로 최초 월 보험료가 즉시
                  결제됩니다. 결제 성공 후 보험 상태는 가입 완료로 변경되며,
                  현재 대기 목록에서 자동으로 제외됩니다.
                </NoticeText>
              </NoticeBox>
            </ModalBody>

            <ModalFooter>
              <CancelButton
                type="button"
                onClick={handleCloseDetail}
                disabled={isApproving}
              >
                닫기
              </CancelButton>

              <ApproveButton
                type="button"
                onClick={handleApproveApplication}
                disabled={isApproving}
              >
                {isApproving
                  ? "결제 및 승인 처리 중..."
                  : "신청 확인 및 최초 결제"}
              </ApproveButton>
            </ModalFooter>
          </ModalBox>
        </ModalOverlay>
      )}
    </Page>
  );
}

export default InsuranceAdminApplicationPage;

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

function formatDate(dateStr) {
  if (!dateStr) {
    return "-";
  }

  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

// =========================================================
// styled-components
// =========================================================
const PRIMARY = "#20b486";
const PRIMARY_DARK = "#189b72";

const Page = styled.main`
  width: min(1280px, calc(100% - 48px));

  min-height: calc(100vh - 260px);

  margin: 0 auto;
  padding: 44px 0 70px;
`;

const PageHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;

  margin-bottom: 22px;
`;

const PageTitle = styled.h1`
  margin: 0;

  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.8px;
  color: #171717;
`;

const PageDescription = styled.p`
  margin: 8px 0 0;

  font-size: 14px;
  color: #777777;
`;

const RefreshButton = styled.button`
  height: 40px;

  padding: 0 15px;

  border: 1px solid #cfe8df;
  border-radius: 9px;

  background: #f4fbf8;

  font-size: 13px;
  font-weight: 700;
  color: ${PRIMARY_DARK};

  cursor: pointer;

  &:hover {
    background: #eaf8f3;
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const SummaryBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  margin-bottom: 14px;
`;

const SummaryLabel = styled.span`
  font-size: 18px;
  font-weight: 800;
  color: #222222;
`;

const SummaryCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 38px;
  height: 25px;

  padding: 0 9px;

  border-radius: 999px;

  background: #ecfaf5;

  font-size: 12px;
  font-weight: 700;
  color: ${PRIMARY_DARK};
`;

const ErrorMessage = styled.p`
  margin: 0 0 14px;
  padding: 13px 15px;

  border-radius: 10px;

  background: #fff3f1;

  font-size: 13px;
  color: #d84b3f;
`;

const SuccessMessage = styled.p`
  margin: 0 0 14px;
  padding: 13px 15px;

  border-radius: 10px;

  background: #ecfaf5;

  font-size: 13px;
  color: ${PRIMARY_DARK};
`;

const TableContainer = styled.section`
  overflow-x: auto;

  border: 1px solid #e6e6e6;
  border-radius: 15px;

  background: #ffffff;
`;

const ApplicationTable = styled.table`
  width: 100%;
  min-width: 980px;

  border-collapse: collapse;

  th,
  td {
    padding: 16px 18px;

    border-bottom: 1px solid #eeeeee;

    text-align: left;
    vertical-align: middle;
  }

  th {
    background: #f8fbfa;

    font-size: 12px;
    font-weight: 800;
    color: #65716d;
  }

  td {
    font-size: 13px;
    color: #444444;
  }

  tbody tr {
    transition: background 0.16s ease;
  }

  tbody tr:hover {
    background: #fbfefd;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;

const ApplicationNumber = styled.span`
  font-size: 12px;
  color: #888888;
`;

const PetName = styled.span`
  font-weight: 800;
  color: #222222;
`;

const PriceText = styled.span`
  font-weight: 800;
  color: ${PRIMARY_DARK};
`;

const WaitingBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 5px 10px;

  border-radius: 999px;

  background: #fff6e4;

  font-size: 11px;
  font-weight: 700;
  color: #c98500;
`;

const DetailButton = styled.button`
  height: 34px;

  padding: 0 12px;

  border: 1px solid #cfe8df;
  border-radius: 8px;

  background: #f4fbf8;

  font-size: 12px;
  font-weight: 700;
  color: ${PRIMARY_DARK};

  cursor: pointer;

  &:hover {
    background: #e8f7f1;
  }
`;

const EmptyBox = styled.div`
  padding: 80px 20px;

  text-align: center;

  font-size: 14px;
  color: #888888;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(0, 0, 0, 0.46);
`;

const ModalBox = styled.div`
  display: flex;
  flex-direction: column;

  width: min(580px, 100%);
  max-height: 84vh;

  overflow: hidden;

  border-radius: 20px;

  background: #ffffff;

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

  background: #edf9f5;

  font-size: 11px;
  font-weight: 700;
  color: ${PRIMARY_DARK};
`;

const ModalTitle = styled.h2`
  margin: 11px 0 0;

  font-size: 21px;
  font-weight: 800;
  color: #171717;
`;

const ModalDescription = styled.p`
  margin: 7px 0 0;

  font-size: 12px;
  line-height: 1.6;
  color: #777777;
`;

const CloseButton = styled.button`
  border: none;

  background: transparent;

  font-size: 27px;
  line-height: 1;
  color: #888888;

  cursor: pointer;

  &:hover {
    color: #333333;
  }
`;

const ModalBody = styled.div`
  overflow-y: auto;

  padding: 20px 24px;
`;

const InfoSection = styled.section``;

const DocumentSection = styled.section`
  margin-top: 20px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 10px;

  font-size: 14px;
  font-weight: 800;
  color: #222222;
`;

const InfoTable = styled.div`
  overflow: hidden;

  border: 1px solid #e8eeeb;
  border-radius: 13px;

  background: #ffffff;
`;

const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 130px 1fr;

  min-height: 44px;

  border-bottom: 1px solid #eeeeee;

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  display: flex;
  align-items: center;

  padding: 0 14px;

  background: #f8fbfa;

  font-size: 12px;
  font-weight: 700;
  color: #71807a;
`;

const InfoValue = styled.span`
  display: flex;
  align-items: center;

  padding: 0 14px;

  font-size: 13px;
  font-weight: 700;
  color: #333333;
`;

const PriceValue = styled.span`
  display: flex;
  align-items: center;

  padding: 0 14px;

  font-size: 16px;
  font-weight: 800;
  color: ${PRIMARY_DARK};
`;

const CertificateCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;

  padding: 15px;

  border: 1px solid #eeeeee;
  border-radius: 12px;

  background: #ffffff;
`;

const CertificateInfo = styled.div`
  min-width: 0;
`;

const CertificateTitle = styled.h4`
  margin: 0;

  font-size: 13px;
  font-weight: 800;
  color: #333333;
`;

const CertificateDescription = styled.p`
  margin: 6px 0 0;

  font-size: 11px;
  line-height: 1.55;
  color: #888888;
`;

const CertificateLink = styled.a`
  flex-shrink: 0;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  height: 36px;

  padding: 0 12px;

  border-radius: 8px;

  background: #ecfaf5;

  font-size: 12px;
  font-weight: 700;
  color: ${PRIMARY_DARK};

  text-decoration: none;

  &:hover {
    background: #e3f7ef;
  }
`;

const MissingText = styled.p`
  flex-shrink: 0;

  margin: 0;

  font-size: 12px;
  color: #999999;
`;

const NoticeBox = styled.div`
  margin-top: 18px;
  padding: 14px 15px;

  border-radius: 12px;

  background: #fff8e8;
`;

const NoticeTitle = styled.h4`
  margin: 0 0 7px;

  font-size: 13px;
  font-weight: 800;
  color: #a66f00;
`;

const NoticeText = styled.p`
  margin: 0;

  font-size: 12px;
  line-height: 1.65;
  color: #896b2f;
`;

const ModalFooter = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.7fr;
  gap: 10px;

  padding: 16px 24px 20px;

  border-top: 1px solid #eeeeee;

  background: #ffffff;
`;

const CancelButton = styled.button`
  height: 46px;

  border: 1px solid #dddddd;
  border-radius: 10px;

  background: #ffffff;

  font-size: 13px;
  font-weight: 700;
  color: #555555;

  cursor: pointer;

  &:hover {
    background: #fafafa;
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const ApproveButton = styled.button`
  height: 46px;

  border: none;
  border-radius: 10px;

  background: ${PRIMARY};

  font-size: 13px;
  font-weight: 800;
  color: #ffffff;

  cursor: pointer;

  &:hover {
    background: ${PRIMARY_DARK};
  }

  &:disabled {
    background: #a9ddce;

    cursor: default;
  }
`;