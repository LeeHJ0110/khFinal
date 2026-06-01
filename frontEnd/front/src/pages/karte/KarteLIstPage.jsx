import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import useKarteList from "../../features/karte/hooks/useKarteList";
import { useEffect } from "react";

export default function KarteLIstPage() {
  const navigate = useNavigate();
  const {
    asyncFetchKarteList,
    list,
    currentPage,
    setCurrentPage,
    totalPages,
    totalElements,
    isLoading,
  } = useKarteList();

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
                    onClick={() => navigate(`/karte/${item.id}`)}
                  >
                    <td>{getRowNumber(idx)}</td>
                    <td>{item.petName} 건강검진 결과</td>
                    <td>{formatDate(item.createdAt)}</td>
                    <td>{item.visited}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
        {/* 하단 페이지네이션 */}
        {totalPages > 1 && (
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
        )}
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div``;
