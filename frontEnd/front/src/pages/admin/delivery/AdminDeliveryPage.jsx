import styled from "styled-components";
import AdminLayout from "../components/AdminLayout";
import AdminDeliveryTabs from "../../../features/admin/components/AdminDeliveryTabs";
import AdminDeliveryList from "../../../features/admin/components/AdminDeliveryList";
import useAdminDelivery from "../../../features/admin/hooks/useAdminDelivery";

export default function AdminDeliveryPage() {
  const {
    status,
    deliveries,
    selectedIds,
    openId,
    details,
    page,
    totalPages,
    changeStatus,
    toggleSelect,
    toggleSelectAll,
    toggleOpen,
    handleBulkShipping,
    fetchDeliveries,
  } = useAdminDelivery();

  return (
    <AdminLayout>
      <Container>
        <Header>
          <Title>배송 관리</Title>

          {status === "READY" && (
            <BulkButton onClick={handleBulkShipping}>
              선택건 배송중 처리
            </BulkButton>
          )}
        </Header>

        <AdminDeliveryTabs status={status} onChange={changeStatus} />

        <AdminDeliveryList
          status={status}
          deliveries={deliveries}
          selectedIds={selectedIds}
          openId={openId}
          details={details}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          onToggleOpen={toggleOpen}
        />

        <Pagination>
          <PageButton
            disabled={page === 0}
            onClick={() => fetchDeliveries(page - 1, status)}
          >
            이전
          </PageButton>

          <PageText>
            {page + 1} / {totalPages || 1}
          </PageText>

          <PageButton
            disabled={page >= totalPages - 1}
            onClick={() => fetchDeliveries(page + 1, status)}
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
`;

const BulkButton = styled.button`
  height: 40px;
  padding: 0 18px;
  border: none;
  border-radius: 10px;
  background-color: #111;
  color: white;
  font-weight: 700;
  cursor: pointer;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
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
