import React from "react";
import styled from "styled-components";
import BoardSubNavbar from "./BoardSubNavbar";

// ==========================================
// Helper: 상대 시간 계산 포맷터
// ==========================================
function formatRelativeTime(dateString) {
  if (!dateString) return "방금 전";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "방금 전";
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function FAQBoardList({
  list,
  isLoading,
  onItemClick,
  activeTab,
  onTabChange,
}) {
  if (isLoading) {
    return (
      <>
        {activeTab && onTabChange && (
          <BoardSubNavbar activeTab={activeTab} onTabChange={onTabChange} />
        )}
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: "#888888",
            fontSize: "14px",
          }}
        >
          로딩 중입니다... 🐕
        </div>
      </>
    );
  }

  if (!list || list.length === 0) {
    return (
      <>
        {activeTab && onTabChange && (
          <BoardSubNavbar activeTab={activeTab} onTabChange={onTabChange} />
        )}
        <div
          style={{
            textAlign: "center",
            padding: "80px 0",
            color: "#aaaaaa",
            fontSize: "14px",
            borderBottom: "1px solid #f1f3f4",
          }}
        >
          자주 묻는 질문이 없습니다.
        </div>
      </>
    );
  }

  return (
    <>
      {activeTab && onTabChange && (
        <BoardSubNavbar activeTab={activeTab} onTabChange={onTabChange} />
      )}
      <BoardListWrapper>
        {list.map((item) => {
          return (
            <ListItem
              key={item.boardId}
              onClick={() =>
                onItemClick
                  ? onItemClick(item)
                  : alert("FAQ 상세 펼치기 준비 중!")
              }
            >
              <ItemContent>
                <SubCategoryTag>질문</SubCategoryTag>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemMeta>
                  <LevelBadge>M.1</LevelBadge>
                  <WriterName>{item.writerNickname || "관리자"}</WriterName>
                  <RelativeTime>
                    {formatRelativeTime(item.createdAt)}
                  </RelativeTime>
                </ItemMeta>
              </ItemContent>

              <ItemStats>
                <StatIconWrapper>
                  <SvgEye />
                  {item.hits ? item.hits.toLocaleString() : 0}
                </StatIconWrapper>
              </ItemStats>
            </ListItem>
          );
        })}
      </BoardListWrapper>
    </>
  );
}

// ==========================================
// SVGs
// ==========================================
const SvgEye = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
  </svg>
);

// ==========================================
// Styled Components
// ==========================================
const BoardListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  padding: 18px 10px;
  border-bottom: 1px solid #f1f3f4;
  gap: 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #fafbfc;
  }
`;

const ItemContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
`;

const SubCategoryTag = styled.span`
  align-self: flex-start;
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: -0.2px;
  border: 1px solid #ffd8a8;
  color: #ff922b;
  background-color: #fff9db;
`;

const ItemTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: var(--color-dark);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;

  &:hover {
    color: var(--color-main);
  }
`;

const ItemMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: var(--text-desc);
`;

const LevelBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  background-color: #e8f2ff;
  color: #228be6;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 800;
`;

const WriterName = styled.span`
  color: var(--text-sub);
  font-weight: 500;
`;

const RelativeTime = styled.span``;

const ItemStats = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-left: 20px;
  flex-shrink: 0;
`;

const StatIconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #888888;

  svg {
    width: 14px;
    height: 14px;
    fill: #adb5bd;
  }
`;
