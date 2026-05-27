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

  return (
    <Wrapper>
      <div>
        <div>
          <h2>건강진단 신청 목록</h2>

          <button onClick={() => navigate("/petcare/diagnosis/write")}>
            진단 신청하기
          </button>
        </div>

        {isLoading ? (
          <p>불러오는 중...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>번호</th>
                <th>진단 신청 번호</th>
                <th>진행 상태</th>
                <th>신청일</th>
              </tr>
            </thead>

            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td colSpan={4}>등록된 진단 신청이 없습니다.</td>
                </tr>
              ) : (
                list.map((item, idx) => (
                  <tr
                    key={item.diagnosisReqId}
                    onClick={() =>
                      navigate(`/healthcare/manage/${item.diagnosisReqId}`)
                    }
                  >
                    <td>{getRowNumber(idx)}</td>
                    <td>{item.diagnosisReqId}</td>
                    <td>{item.diagnosisReqStatus}</td>
                    <td>{formatDate(item.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {totalPages > 0 && (
          <div>
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 0}
            >
              &lt;
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setCurrentPage(i)}>
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages - 1}
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 80%;
  margin: 40px auto;
  padding: 20px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .title {
    font-size: 28px;
    font-weight: 700;
  }

  .write-btn {
    border: none;
    background-color: #00a97b;
    color: white;
    padding: 10px 18px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }

  thead {
    background-color: #f7f7f7;
  }

  th {
    padding: 16px;
    font-size: 15px;
    font-weight: 700;
    border-bottom: 1px solid #e5e5e5;
  }

  td {
    padding: 18px 16px;
    text-align: center;
    border-bottom: 1px solid #f0f0f0;
  }

  tbody tr {
    cursor: pointer;
    transition: 0.2s;
  }

  tbody tr:hover {
    background-color: #f8fffc;
  }

  .pagination {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 24px;
  }

  .pagination button {
    border: 1px solid #ddd;
    background: white;
    padding: 8px 14px;
    border-radius: 8px;
    cursor: pointer;
  }

  .pagination button:hover {
    background-color: #00a97b;
    color: white;
  }
`;
