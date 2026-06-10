import React, { useEffect, useState } from "react";
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

  // 기본값: 전체 조회
  const [petTypeFilter, setPetTypeFilter] = useState("ALL");

  // =========================================================
  // 페이지 또는 필터 변경 시 목록 다시 조회
  // =========================================================
  useEffect(() => {
    asyncFetchPetCareList(currentPage, petTypeFilter);
  }, [currentPage, petTypeFilter]);

  // =========================================================
  // 필터 변경
  // 필터가 바뀌면 첫 페이지로 이동
  // =========================================================
  function handleChangePetType(nextPetType) {
    setPetTypeFilter(nextPetType);
    setCurrentPage(0);
  }

  // =========================================================
  // 날짜 표시
  // =========================================================
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

  // =========================================================
  // 펫 종류 문구 변환
  // =========================================================
  function formatPetType(petType) {
    if (petType === "D" || petType === "DOG") {
      return "강아지";
    }

    if (petType === "C" || petType === "CAT") {
      return "고양이";
    }

    return "반려동물";
  }

  // =========================================================
  // 상태 문구 변환
  // =========================================================
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
      {/* =====================================================
          상단 제목 영역
      ===================================================== */}
      <Header>
        <HeaderTextArea>
          <Title>건강진단 신청 목록</Title>

          <Description>
            접수된 반려동물 건강진단 신청 내역을 확인할 수 있습니다.
          </Description>
        </HeaderTextArea>

        <TotalCount>
          전체 <strong>{totalElements}</strong>건
        </TotalCount>
      </Header>

      {/* =====================================================
          필터 + 신청 목록
      ===================================================== */}
      <ListCard>
        <FilterToolbar>
          <FilterGroup>
            <FilterButton
              type="button"
              $active={petTypeFilter === "ALL"}
              onClick={() => handleChangePetType("ALL")}
            >
              전체
            </FilterButton>

            <FilterDivider />

            <FilterButton
              type="button"
              $active={petTypeFilter === "D"}
              onClick={() => handleChangePetType("D")}
            >
              강아지
            </FilterButton>

            <FilterDivider />

            <FilterButton
              type="button"
              $active={petTypeFilter === "C"}
              onClick={() => handleChangePetType("C")}
            >
              고양이
            </FilterButton>
          </FilterGroup>

          <ToolbarGuide>
            접수된 순서대로 표시됩니다. 항목을 클릭하면 상세 내용을 확인할 수
            있습니다.
          </ToolbarGuide>
        </FilterToolbar>

        {isLoading ? (
          <LoadingArea>
            <LoadingSpinner />

            <LoadingText>건강진단 신청 내역을 불러오는 중입니다.</LoadingText>
          </LoadingArea>
        ) : list.length === 0 ? (
          <EmptyArea>
            <EmptyIcon>♡</EmptyIcon>

            <EmptyTitle>등록된 건강진단 신청이 없습니다.</EmptyTitle>

            <EmptyDescription>
              새로운 신청이 등록되면 이곳에서 확인할 수 있습니다.
            </EmptyDescription>
          </EmptyArea>
        ) : (
          <RequestList>
            {list.map((item) => {
              const isProgress = item.diagnosisReqStatus === "Y";

              return (
                <RequestItem
                  key={item.diagnosisReqId}
                  type="button"
                  onClick={() =>
                    navigate(`/healthcare/manage/${item.diagnosisReqId}`)
                  }
                >
                  <RequestContent>
                    <RequestTop>
                      <PetTypeBadge $petType={item.petType}>
                        {formatPetType(item.petType)} 건강진단
                      </PetTypeBadge>

                      <RequestTitle>
                        {item.petName || "반려동물"} 건강진단 신청
                      </RequestTitle>
                    </RequestTop>

                    <RequestMeta>
                      <MetaText>
                        {item.memberNickname || "신청자 확인 필요"}
                      </MetaText>

                      <MetaDot>·</MetaDot>

                      <MetaText>{formatDate(item.createdAt)}</MetaText>

                      <MetaDot>·</MetaDot>

                      <MetaText>신청번호 {item.diagnosisReqId}</MetaText>
                    </RequestMeta>
                  </RequestContent>

                  <RequestRight>
                    <StatusBadge $active={isProgress}>
                      <StatusDot $active={isProgress} />

                      {formatStatus(item.diagnosisReqStatus)}
                    </StatusBadge>

                    <ArrowIcon>›</ArrowIcon>
                  </RequestRight>
                </RequestItem>
              );
            })}
          </RequestList>
        )}
      </ListCard>

      {/* =====================================================
          페이지네이션
      ===================================================== */}
      {totalPages > 0 && (
        <Pagination>
          <PaginationButton
            type="button"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((previous) => previous - 1)}
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
            onClick={() => setCurrentPage((previous) => previous + 1)}
          >
            ›
          </PaginationButton>
        </Pagination>
      )}
    </Wrapper>
  );
}

// =========================================================
// 전체 영역
// =========================================================

const Wrapper = styled.main`
  width: min(1180px, calc(100% - 48px));

  min-height: calc(100vh - 210px);

  margin: 0 auto;
  padding: 48px 0 56px;

  box-sizing: border-box;

  @media (max-width: 640px) {
    width: calc(100% - 28px);

    min-height: calc(100vh - 210px);

    padding: 34px 0 44px;
  }
`;

// =========================================================
// 상단 제목 영역
// =========================================================

const Header = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;

  padding-bottom: 20px;

  border-bottom: 1px solid #26332f;
`;

const HeaderTextArea = styled.div`
  min-width: 0;
`;

const Title = styled.h1`
  margin: 0;

  color: #202927;

  font-size: 30px;
  font-weight: 900;
  letter-spacing: -1px;
`;

const Description = styled.p`
  margin: 8px 0 0;

  color: #6f7b77;

  font-size: 14px;
  font-weight: 500;
`;

const TotalCount = styled.div`
  flex-shrink: 0;

  color: #697571;

  font-size: 13px;
  font-weight: 700;

  strong {
    margin-left: 3px;

    color: #00a97b;

    font-size: 16px;
    font-weight: 900;
  }
`;

// =========================================================
// 필터 + 목록 영역
// =========================================================

const ListCard = styled.section`
  overflow: hidden;

  background: #ffffff;
`;

const FilterToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  min-height: 60px;
  padding: 0 6px;

  border-bottom: 1px solid #e6ecea;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 17px;
`;

const FilterButton = styled.button`
  padding: 0;

  border: none;

  background: transparent;

  color: ${({ $active }) => ($active ? "#00a97b" : "#8e9995")};

  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? "900" : "600")};

  cursor: pointer;

  transition: color 0.18s ease;

  &:hover {
    color: #00a97b;
  }
`;

const FilterDivider = styled.span`
  width: 1px;
  height: 13px;

  background: #dfe6e3;
`;

const ToolbarGuide = styled.span`
  color: #a0aaa7;

  font-size: 12px;
  font-weight: 500;

  @media (max-width: 760px) {
    display: none;
  }
`;

// =========================================================
// 건강진단 신청 목록
// =========================================================

const RequestList = styled.div`
  display: flex;
  flex-direction: column;
`;

const RequestItem = styled.button`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 18px;

  width: 100%;
  min-height: 102px;
  padding: 18px 14px;

  border: none;
  border-bottom: 1px solid #edf2f0;

  background: #ffffff;

  text-align: left;

  cursor: pointer;

  transition:
    background-color 0.18s ease,
    transform 0.18s ease,
    box-shadow 0.18s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    z-index: 2;

    background: #f8fffc;

    transform: translateX(4px);

    box-shadow: inset 4px 0 0 #00a97b;
  }

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;

    min-height: 96px;
    padding: 15px 10px;
  }
`;

const RequestContent = styled.div`
  min-width: 0;
`;

const RequestTop = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 7px;
`;

const PetTypeBadge = styled.span`
  display: inline-flex;
  align-items: center;

  padding: 3px 8px;

  border: 1px solid
    ${({ $petType }) =>
      $petType === "C" || $petType === "CAT"
        ? "rgba(111, 143, 214, 0.28)"
        : "rgba(0, 169, 123, 0.28)"};

  border-radius: 4px;

  background: ${({ $petType }) =>
    $petType === "C" || $petType === "CAT" ? "#f5f8ff" : "#f5fff9"};

  color: ${({ $petType }) =>
    $petType === "C" || $petType === "CAT" ? "#5578bf" : "#00956e"};

  font-size: 11px;
  font-weight: 800;
`;

const RequestTitle = styled.strong`
  overflow: hidden;

  max-width: 100%;

  color: #26332f;

  font-size: 15px;
  font-weight: 900;

  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RequestMeta = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;

  margin-top: 9px;
`;

const MetaText = styled.span`
  color: #7b8783;

  font-size: 12px;
  font-weight: 500;
`;

const MetaDot = styled.span`
  color: #b5bfbc;

  font-size: 12px;
`;

const RequestRight = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  padding-right: 10px;

  @media (max-width: 640px) {
    justify-content: flex-start;

    padding-right: 0;
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  min-width: 106px;
  padding: 7px 11px;

  border: 1px solid
    ${({ $active }) =>
      $active ? "rgba(0, 169, 123, 0.22)" : "rgba(112, 126, 121, 0.18)"};

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

const ArrowIcon = styled.span`
  color: #b0bdb8;

  font-size: 24px;
  line-height: 1;

  transition:
    color 0.18s ease,
    transform 0.18s ease;

  ${RequestItem}:hover & {
    color: #00a97b;

    transform: translateX(3px);
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

// =========================================================
// 빈 목록
// =========================================================

const EmptyArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  min-height: 300px;
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

// =========================================================
// 로딩 영역
// =========================================================

const LoadingArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 13px;

  min-height: 300px;
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

// =========================================================
// 페이지네이션
// =========================================================

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  margin-top: 26px;
`;

const PaginationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  min-width: 36px;
  height: 36px;

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