import styled from "styled-components";

export default function AdminMemberFilter({ filters, onToggle }) {
  return (
    <FilterWrap>
      <FilterChip
        $active={filters.petType === "D"}
        onClick={() => onToggle("petType", "D")}
      >
        강아지 보유
      </FilterChip>

      <FilterChip
        $active={filters.petType === "C"}
        onClick={() => onToggle("petType", "C")}
      >
        고양이 보유
      </FilterChip>

      <FilterChip
        $active={filters.marketingAgreeYn === "Y"}
        onClick={() => onToggle("marketingAgreeYn", "Y")}
      >
        광고 동의
      </FilterChip>

      <FilterChip
        $active={filters.status === "S"}
        onClick={() => onToggle("status", "S")}
      >
        정지 회원
      </FilterChip>

      <FilterChip
        $active={filters.adminOnly === "true"}
        onClick={() => onToggle("adminOnly", "true")}
      >
        관리자
      </FilterChip>
    </FilterWrap>
  );
}

const FilterWrap = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const FilterChip = styled.button`
  padding: 8px 14px;
  border: 1px solid ${({ $active }) => ($active ? "#111" : "#ddd")};
  border-radius: 999px;
  background-color: ${({ $active }) => ($active ? "#111" : "white")};
  color: ${({ $active }) => ($active ? "white" : "#333")};
  cursor: pointer;
`;
