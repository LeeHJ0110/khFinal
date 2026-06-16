import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useEffect } from "react";
import useKarte from "../../features/karte/hooks/useKarte";
import MailOpen from "../../features/karte/components/MailOpen";
import MailClosed from "../../features/karte/components/MailClosed";
import PetCareNav from "../../features/petcare/components/petcarehome/PetCareNav";

export default function KarteListPage() {
  const navigate = useNavigate();
  const {
    asyncFetchKarteList,
    list,
    currentPage,
    setCurrentPage,
    totalPages,
    totalElements,
    isLoading,
  } = useKarte();

  useEffect(() => {
    asyncFetchKarteList(currentPage);
  }, [currentPage]);

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  return (
    <>
      <PetCareNav />
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
              <LoadingText>건강진단 결과 내역을 불러오는 중입니다.</LoadingText>
            </LoadingArea>
          ) : (
            <Table>
              <thead>
                <tr>
                  {/* 💡 번호 컬럼을 제거하고 데이터 성격에 맞춰 균형 있는 비율로 재조정 */}
                  <th style={{ width: "30%" }}>제목</th>
                  <th style={{ width: "20%" }}>생성일</th>
                  <th style={{ width: "18%" }}>작성자</th>
                  <th style={{ width: "12%" }}>열람여부</th>
                </tr>
              </thead>

              <tbody>
                {list.length === 0 ? (
                  <tr>
                    <EmptyCell colSpan={4}>
                      <EmptyIcon>♡</EmptyIcon>
                      <EmptyTitle>등록된 건강진단 결과가 없습니다.</EmptyTitle>
                      <EmptyDescription>
                        관리자가 검사를 마치면 이곳에서 확인할 수 있습니다.
                      </EmptyDescription>
                    </EmptyCell>
                  </tr>
                ) : (
                  list.map((item) => (
                    <TableRow
                      key={item.id}
                      onClick={() => navigate(`/healthcare/result/${item.id}`)}
                    >
                      {/* 💡 펫 이름을 강조하는 배지 스타일을 도입하고 왼쪽 정렬로 가독성 확보 */}
                      <TitleCell>
                        <PetNameBadge>{item.petName}</PetNameBadge>
                        <TitleText>건강검진 결과 보고서</TitleText>
                      </TitleCell>
                      <DateCell>{formatDate(item.createdAt)}</DateCell>
                      <td>{item.writer}</td>
                      <td>
                        {item.visited === "Y" ? (
                          <MailOpen />
                        ) : (
                          <MailClosed color="#5ec8a7" />
                        )}
                      </td>
                    </TableRow>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </TableCard>

        {/* 하단 페이지네이션 */}
        {totalPages > 1 && (
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
    </>
  );
}

/* =====================================
   전체 영역
===================================== */
const Wrapper = styled.main`
  /* 💡 요소 간의 거리가 너무 멀어지지 않도록 전체 max-width를 860px로 축소 */
  width: min(860px, calc(100% - 48px));
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
  margin-bottom: 28px;
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
  font-size: 28px;
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
  padding: 8px 16px;
  border: 1px solid rgba(0, 169, 123, 0.15);
  border-radius: 999px;
  background: rgba(0, 169, 123, 0.05);
  color: #62706c;
  font-size: 13px;
  font-weight: 700;

  strong {
    color: #00a97b;
    font-size: 14px;
  }
`;

/* =====================================
   테이블 영역
===================================== */
const TableCard = styled.section`
  min-height: 330px;
  overflow: hidden;
  border: 1px solid #e2ece8;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(20, 72, 58, 0.04);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  th {
    padding: 18px 14px;
    border-bottom: 1px solid #edf5f2;
    background: #f8fbf9;
    color: #687571;
    font-size: 13px;
    font-weight: 800;
    text-align: center;
  }

  td {
    padding: 20px 14px;
    border-bottom: 1px solid #f0f5f3;
    color: #47534f;
    font-size: 14px;
    text-align: center;
    vertical-align: middle;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;

const TableRow = styled.tr`
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background: #f6fdfa;
  }
`;

/* 💡 제목 컬럼 내부 정렬 스타일 */
const TitleCell = styled.td`
  text-align: left !important;
  padding-left: 32px !important;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PetNameBadge = styled.span`
  background-color: #e6f7f2;
  color: #00a97b;
  font-size: 12px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 6px;
  letter-spacing: -0.3px;
  display: inline-block;
  flex-shrink: 0;
`;

const TitleText = styled.span`
  font-weight: 700;
  color: #2d3835;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DateCell = styled.td`
  color: #7b8783 !important;
  font-size: 13px !important;
`;

/* =====================================
   페이지네이션
===================================== */
const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-top: 32px;
`;

const PaginationButton = styled.button`
  min-width: 36px;
  height: 36px;
  display: flex;
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

/* =====================================
   빈 목록 및 로딩 (미사용 컴포넌트는 하단 유지)
===================================== */
const EmptyCell = styled.td`
  height: 270px;
  text-align: center !important;
`;

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

const LoadingArea = styled.div`
  min-height: 330px;
  display: flex;
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
