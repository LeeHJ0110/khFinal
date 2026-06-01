import React, { useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import usePetCareList from "../../features/petcare/hooks/usePetCareList";

export default function DiagnosisManagePage() {
  const navigate = useNavigate();

  const {
    asyncFetchPetCareList,
    currentPage,
    isLoading,
    list,
    setCurrentPage,
    totalElements,
    totalPages,
  } = usePetCareList();

  useEffect(() => {
    asyncFetchPetCareList(currentPage);
  }, [currentPage]);

  // 날짜 표시
  function formatDate(dateStr) {
    if (!dateStr) {
      return "-";
    }

    const date = new Date(dateStr);

    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  // 화면상 순번 계산
  function getRowNumber(idx) {
    return totalElements - currentPage * 10 - idx;
  }

  // 상태 문구 변환
  function formatStatus(status) {
    if (status === "Y") {
      return "진단 진행 중";
    }

    if (status === "N") {
      return "진단 완료";
    }

    return "상태 확인 필요";
  }

  return (
    <Wrapper>
      <Header>
        <HeaderTextArea>
          <Eyebrow>PET HEALTH CARE</Eyebrow>

          <Title>건강진단 신청 목록</Title>

          <Description>
            접수된 반려동물 건강진단 신청 내역을 확인할 수 있습니다.
          </Description>
        </HeaderTextArea>

        <TotalCount>
          전체 <strong>{totalElements}</strong>건
        </TotalCount>
      </Header>

      <TableCard>
        {isLoading ? (
          <LoadingArea>
            <LoadingSpinner />

            <LoadingText>건강진단 신청 내역을 불러오는 중입니다.</LoadingText>
          </LoadingArea>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>번호</th>
                <th>진행 상태</th>
                <th>신청일</th>
                <th>상세보기</th>
              </tr>
            </thead>

            <tbody>
              {list.length === 0 ? (
                <tr>
                  <EmptyCell colSpan={4}>
                    <EmptyIcon>♡</EmptyIcon>

                    <EmptyTitle>등록된 건강진단 신청이 없습니다.</EmptyTitle>

                    <EmptyDescription>
                      새로운 신청이 등록되면 이곳에서 확인할 수 있습니다.
                    </EmptyDescription>
                  </EmptyCell>
                </tr>
              ) : (
                list.map((item, idx) => (
                  <TableRow
                    key={item.diagnosisReqId}
                    onClick={() =>
                      navigate(`/healthcare/manage/${item.diagnosisReqId}`)
                    }
                  >
                    <NumberCell>{getRowNumber(idx)}</NumberCell>

                    <td>
                      <StatusBadge $active={item.diagnosisReqStatus === "Y"}>
                        <StatusDot $active={item.diagnosisReqStatus === "Y"} />

                        {formatStatus(item.diagnosisReqStatus)}
                      </StatusBadge>
                    </td>

                    <DateCell>{formatDate(item.createdAt)}</DateCell>

                    <td>
                      <DetailButton
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();

                          navigate(`/healthcare/manage/${item.diagnosisReqId}`);
                        }}
                      >
                        상세보기
                        <span>›</span>
                      </DetailButton>
                    </td>
                  </TableRow>
                ))
              )}
            </tbody>
          </Table>
        )}
      </TableCard>

      {totalPages > 0 && (
        <Pagination>
          <PaginationButton
            type="button"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            ‹
          </PaginationButton>

          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationButton
              key={index}
              type="button"
              $active={currentPage === index}
              aria-current={currentPage === index ? "page" : undefined}
              onClick={() => setCurrentPage(index)}
            >
              {index + 1}
            </PaginationButton>
          ))}

          <PaginationButton
            type="button"
            disabled={currentPage === totalPages - 1}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            ›
          </PaginationButton>
        </Pagination>
      )}
    </Wrapper>
  );
}

/* =====================================
   전체 영역
===================================== */

const Wrapper = styled.main`
  width: min(1180px, calc(100% - 48px));

  margin: 0 auto;
  padding: 52px 0 88px;

  box-sizing: border-box;
`;

/* =====================================
   상단 제목 영역
===================================== */

const Header = styled.header`
  display: flex;

  align-items: flex-end;
  justify-content: space-between;

  gap: 20px;

  margin-bottom: 24px;
`;

const HeaderTextArea = styled.div`
  min-width: 0;
`;

const Eyebrow = styled.p`
  margin: 0 0 8px;

  color: #00a97b;

  font-size: 12px;
  font-weight: 800;

  letter-spacing: 1.4px;
`;

const Title = styled.h1`
  margin: 0;

  color: #202927;

  font-size: 30px;
  font-weight: 800;

  letter-spacing: -1px;
`;

const Description = styled.p`
  margin: 10px 0 0;

  color: #7a8582;

  font-size: 14px;
  font-weight: 500;
`;

const TotalCount = styled.div`
  flex-shrink: 0;

  padding: 9px 15px;

  border: 1px solid rgba(0, 169, 123, 0.18);

  border-radius: 999px;

  background: rgba(0, 169, 123, 0.06);

  color: #62706c;

  font-size: 13px;
  font-weight: 700;

  strong {
    color: #00a97b;

    font-size: 15px;
  }
`;

/* =====================================
   테이블 영역
===================================== */

const TableCard = styled.section`
  overflow: hidden;

  min-height: 330px;

  border: 1px solid #e2ece8;
  border-radius: 16px;

  background: #ffffff;

  box-shadow: 0 8px 24px rgba(20, 72, 58, 0.055);
`;

const Table = styled.table`
  width: 100%;

  border-collapse: collapse;

  table-layout: fixed;

  th {
    padding: 16px 14px;

    border-bottom: 1px solid #e5eeeb;

    background: #f7fbf9;

    color: #687571;

    font-size: 13px;
    font-weight: 800;

    text-align: center;
  }

  td {
    padding: 18px 14px;

    border-bottom: 1px solid #edf2f0;

    color: #47534f;

    font-size: 14px;

    text-align: center;
  }

  th:nth-child(1) {
    width: 16%;
  }

  th:nth-child(2) {
    width: 32%;
  }

  th:nth-child(3) {
    width: 32%;
  }

  th:nth-child(4) {
    width: 20%;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;

const TableRow = styled.tr`
  cursor: pointer;

  transition:
    background-color 0.18s ease,
    transform 0.18s ease;

  &:hover {
    background: #f8fffc;
  }
`;

const NumberCell = styled.td`
  color: #8a9692 !important;

  font-weight: 700;
`;

const DateCell = styled.td`
  color: #7b8783 !important;

  font-size: 13px !important;
`;

/* =====================================
   상태 표시
===================================== */

const StatusBadge = styled.span`
  display: inline-flex;

  min-width: 106px;

  align-items: center;
  justify-content: center;

  gap: 7px;

  padding: 7px 11px;

  border: 1px solid
    ${({ $active }) =>
      $active ? "rgba(0, 169, 123, 0.2)" : "rgba(112, 126, 121, 0.18)"};

  border-radius: 999px;

  background: ${({ $active }) =>
    $active ? "rgba(0, 169, 123, 0.08)" : "#f5f7f6"};

  color: ${({ $active }) => ($active ? "#008f69" : "#78837f")};

  font-size: 12px;
  font-weight: 800;
`;

const StatusDot = styled.span`
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: ${({ $active }) => ($active ? "#00a97b" : "#aeb8b5")};
`;

/* =====================================
   상세보기 버튼
===================================== */

const DetailButton = styled.button`
  display: inline-flex;

  align-items: center;
  justify-content: center;

  gap: 6px;

  padding: 8px 12px;

  border: 1px solid rgba(0, 169, 123, 0.2);

  border-radius: 8px;

  background: #ffffff;
  color: #00a97b;

  font-size: 12px;
  font-weight: 800;

  cursor: pointer;

  transition:
    background-color 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease,
    box-shadow 0.18s ease;

  span {
    font-size: 17px;

    line-height: 1;

    transition: transform 0.18s ease;
  }

  &:hover {
    background: #00a97b;
    color: #ffffff;

    transform: translateY(-2px);

    box-shadow: 0 5px 11px rgba(0, 169, 123, 0.15);

    span {
      transform: translateX(2px);
    }
  }
`;

/* =====================================
   빈 목록
===================================== */

const EmptyCell = styled.td`
  height: 270px;

  text-align: center !important;
`;
import PetCareNav from "./../../features/petcare/components/petcarehome/PetCareNav";

const EmptyIcon = styled.div`
  margin-bottom: 10px;

  color: #a8d9cb;

  font-size: 33px;
  font-weight: 800;
`;

const EmptyTitle = styled.p`
  margin: 0;

  color: #51605b;

  font-size: 15px;
  font-weight: 800;
`;

const EmptyDescription = styled.p`
  margin: 8px 0 0;

  color: #929d99;

  font-size: 13px;
`;

/* =====================================
   로딩 영역
===================================== */

const LoadingArea = styled.div`
  display: flex;

  min-height: 330px;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  gap: 13px;
`;

const LoadingSpinner = styled.div`
  width: 28px;
  height: 28px;

  border: 3px solid rgba(0, 169, 123, 0.15);

  border-top-color: #00a97b;

  border-radius: 50%;

  animation: rotate 0.8s linear infinite;

  @keyframes rotate {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  margin: 0;

  color: #7d8985;

  font-size: 13px;
  font-weight: 600;
`;

/* =====================================
   페이지네이션
===================================== */

const Pagination = styled.div`
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 7px;

  margin-top: 26px;
`;

const PaginationButton = styled.button`
  display: flex;

  min-width: 36px;
  height: 36px;

  align-items: center;
  justify-content: center;

  border: 1px solid ${({ $active }) => ($active ? "#00a97b" : "#dce5e2")};

  border-radius: 9px;

  background: ${({ $active }) => ($active ? "#00a97b" : "#ffffff")};

  color: ${({ $active }) => ($active ? "#ffffff" : "#74807c")};

  font-size: 13px;
  font-weight: 800;

  cursor: pointer;

  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease;

  &:hover:not(:disabled) {
    border-color: #00a97b;

    background: ${({ $active }) =>
      $active ? "#00a97b" : "rgba(0, 169, 123, 0.08)"};

    color: ${({ $active }) => ($active ? "#ffffff" : "#00a97b")};

    transform: translateY(-2px);
  }

  &:disabled {
    background: #f5f7f6;
    color: #c0c8c5;

    cursor: default;
  }
`;
