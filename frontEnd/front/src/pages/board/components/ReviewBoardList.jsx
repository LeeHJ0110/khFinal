import React from "react";
import styled from "styled-components";

// ==========================================
// Helper: HTML 본문에서 첫 번째 <img> src 추출
// ==========================================
function extractFirstImg(htmlContent) {
  if (!htmlContent) return null;
  const match = htmlContent.match(/<img[^>]*src=["']([^"']*)["'][^>]*>/);
  return match ? match[1] : null;
}

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

export default function ReviewBoardList({
  category,
  list,
  isLoading,
  onItemClick,
}) {
  if (isLoading) {
    return (
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
    );
  }

  return <BoardListWrapper>ReviewBoardList</BoardListWrapper>;
}

// ==========================================
// SVGs
// ==========================================
const SvgComment = () => (
  <svg viewBox="0 0 24 24">
    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
  </svg>
);

const SvgEye = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
  </svg>
);

const SvgHeart = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const SvgPawPlaceholder = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 14c-1.66 0-3 1.34-3 3 0 2 2 3.5 3 3.5s3-1.5 3-3.5c0-1.66-1.34-3-3-3zm-4.5-2.5c-.83 0-1.5.67-1.5 1.5s1 2 1.5 2 1.5-1 1.5-2-.67-1.5-1.5-1.5zm9 0c-.83 0-1.5.67-1.5 1.5s.67 2 1.5 2 1.5-1 1.5-2-.67-1.5-1.5-1.5zm-8.2-3.8c-.83 0-1.5.67-1.5 1.5S7.5 11 8.2 11c1 0 1.2-.8 1.2-1.5s-.3-1.8-1.1-1.8zm7.4 0c-.8 0-1.1 1.1-1.1 1.8s.2 1.5 1.2 1.5c.7 0 1.4-.67 1.4-1.5s-.67-1.8-1.5-1.8z" />
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
  padding: 20px 10px;
  border-bottom: 1px solid #f1f3f4;
  gap: 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #fafbfc;
  }
`;

const ItemThumbnail = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f1f3f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  svg {
    width: 32px;
    height: 32px;
    fill: #adb5bd;
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
  border: 1px solid #b2f2bb;
  color: #37b24d;
  background-color: #ebfbee;
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
  background-color: #ecfdf6;
  color: #00a97b;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 800;
`;

const WriterName = styled.span`
  color: var(--text-sub);
  font-weight: 500;
`;

const RelativeTime = styled.span``;

const StarsText = styled.span`
  color: #ffbc00;
  font-weight: 700;
  font-size: 12px;
`;

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
