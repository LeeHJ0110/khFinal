import styled from "styled-components";

import AdminLayout from "../components/AdminLayout";

import useAdminInsurance from "../../../features/admin/hooks/useAdminInsurance";

import AdminInsuranceTabs from "../../../features/admin/components/AdminInsuranceTabs";
import AdminInsuranceList from "../../../features/admin/components/AdminInsuranceList";

export default function AdminInsurancePage() {
  const {
    status,
    applications,

    selectedIds,

    openId,
    details,

    page,
    totalPages,

    changeStatus,
    toggleOpen,
    toggleSelect,

    handleApprove,
    handleReject,

    fetchApplications,
  } = useAdminInsurance();

  return (
    <AdminLayout>
      <Container>
        <Header>
          <Title>펫보험 승인 관리</Title>

          {status === "WAITING" && (
            <ButtonArea>
              <ApproveButton onClick={handleApprove}>선택 승인</ApproveButton>

              <RejectButton onClick={handleReject}>선택 반려</RejectButton>
            </ButtonArea>
          )}
        </Header>

        <AdminInsuranceTabs status={status} onChange={changeStatus} />

        <AdminInsuranceList
          status={status}
          applications={applications}
          selectedIds={selectedIds}
          openId={openId}
          details={details}
          onToggleSelect={toggleSelect}
          onToggleOpen={toggleOpen}
        />

        <Pagination>
          <PageButton
            disabled={page === 0}
            onClick={() => fetchApplications(page - 1, status)}
          >
            이전
          </PageButton>

          <PageText>
            {page + 1} / {totalPages || 1}
          </PageText>

          <PageButton
            disabled={page >= totalPages - 1}
            onClick={() => fetchApplications(page + 1, status)}
          >
            다음
          </PageButton>
        </Pagination>
      </Container>
    </AdminLayout>
  );
}

const Container = styled.div`
  padding: 32px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
`;

const ButtonArea = styled.div`
  display: flex;
  gap: 10px;
`;

const ApproveButton = styled.button`
  height: 40px;

  padding: 0 18px;

  border: none;
  border-radius: 10px;

  background-color: #00a37a;
  color: white;

  font-weight: 700;

  cursor: pointer;
`;

const RejectButton = styled.button`
  height: 40px;

  padding: 0 18px;

  border: none;
  border-radius: 10px;

  background-color: #e74c3c;
  color: white;

  font-weight: 700;

  cursor: pointer;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  gap: 12px;

  margin-top: 24px;
`;

const PageButton = styled.button`
  height: 36px;

  padding: 0 14px;

  border: 1px solid #ddd;
  border-radius: 8px;

  background-color: white;

  cursor: pointer;

  &:disabled {
    color: #aaa;
    cursor: not-allowed;
  }
`;

const PageText = styled.span`
  font-weight: 700;
`;
