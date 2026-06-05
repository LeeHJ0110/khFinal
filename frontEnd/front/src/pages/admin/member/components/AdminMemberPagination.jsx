import styled from "styled-components";

export default function AdminMemberPagination({
  page,
  totalPages,
  onChangePage,
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index);

  return (
    <PaginationWrap>
      <PageButton disabled={page === 0} onClick={() => onChangePage(page - 1)}>
        이전
      </PageButton>

      {pages.map((pageNumber) => (
        <PageButton
          key={pageNumber}
          $active={pageNumber === page}
          onClick={() => onChangePage(pageNumber)}
        >
          {pageNumber + 1}
        </PageButton>
      ))}

      <PageButton
        disabled={page === totalPages - 1}
        onClick={() => onChangePage(page + 1)}
      >
        다음
      </PageButton>
    </PaginationWrap>
  );
}

const PaginationWrap = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 24px;
`;

const PageButton = styled.button`
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  border: 1px solid ${({ $active }) => ($active ? "#111" : "#ddd")};
  border-radius: 8px;
  background-color: ${({ $active }) => ($active ? "#111" : "white")};
  color: ${({ $active }) => ($active ? "white" : "#333")};
  cursor: pointer;

  &:disabled {
    color: #aaa;
    cursor: not-allowed;
  }
`;
