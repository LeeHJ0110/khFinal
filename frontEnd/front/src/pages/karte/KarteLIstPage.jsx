import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useEffect } from "react";
import useKarte from "../../features/karte/hooks/useKarte";

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

  function getRowNumber(idx) {
    return totalElements - currentPage * 10 - idx;
  }

  console.log(list);

  return (
    <Wrapper>
      <div>
        {isLoading ? (
          <p>불러오는 중...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>생성일</th>
                <th>작성자</th>
                <th>열람여부</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td colSpan={5}>등록된 진단결과가 없습니다.</td>
                </tr>
              ) : (
                list.map((item, idx) => (
                  <tr
                    key={item.id}
                    onClick={() => navigate(`/healthcare/result/${item.id}`)}
                  >
                    <td>{getRowNumber(idx)}</td>
                    <td>{item.petName} 건강검진 결과</td>
                    <td>{formatDate(item.createdAt)}</td>
                    <td>{item.writer}</td>
                    <td>{item.visited}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
        {/* 하단 페이지네이션 */}
        {/* {totalPages > 1 && (
          <PaginationWrapper>
            <PageArrowButton
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 0}
            >
              <SvgChevronLeft />
            </PageArrowButton>

            {Array.from({ length: totalPages }).map((_, idx) => (
              <PageNumberButton
                key={idx}
                active={currentPage === idx}
                onClick={() => setCurrentPage(idx)}
              >
                {idx + 1}
              </PageNumberButton>
            ))}

            <PageArrowButton
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages - 1}
            >
              <SvgChevronRight />
            </PageArrowButton>
          </PaginationWrapper>
        )} */}
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  padding: 24px;

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 12px;
  }

  thead th {
    text-align: left;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 600;
    color: #666;
    border-bottom: 2px solid #f0f0f0;
  }

  tbody tr {
    background: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  tbody tr:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  }

  tbody td {
    padding: 18px 16px;
    font-size: 14px;
    color: #333;
    background: #fff;
  }

  tbody td:first-child {
    border-radius: 12px 0 0 12px;
    font-weight: 600;
    color: #888;
  }

  tbody td:last-child {
    border-radius: 0 12px 12px 0;
  }

  tbody tr td:nth-child(2) {
    font-weight: 600;
    color: #222;
  }

  tbody tr td[colspan] {
    text-align: center;
    padding: 40px;
    background: #fafafa;
    border-radius: 12px;
  }

  @media (max-width: 768px) {
    padding: 16px;

    thead {
      display: none;
    }

    tbody tr {
      display: flex;
      flex-direction: column;
      margin-bottom: 12px;
    }

    tbody td {
      display: flex;
      justify-content: space-between;
      padding: 12px 16px;
      border-radius: 0 !important;
    }
  }
`;
