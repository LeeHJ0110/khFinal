import React from "react";
import styled from "styled-components";
import BoardSubNavbar from "./BoardSubNavbar";

// HTML 태그 및 문자 엔티티 제거 함수
function cleanHtml(text) {
  if (!text) return "";
  return text
    .replace(/<\/?[^>]+(>|$)/g, "") // HTML 태그 제거 (<b>, </b> 등)
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ");
}

// RFC 822 날짜 포맷팅 함수 (예: "Sun, 07 Jun 2026 16:00:00 +0900" -> "2026.06.07")
function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}.${mm}.${dd}`;
  } catch (e) {
    return dateStr;
  }
}

export default function NewsBoardList({
  list,
  isLoading,
  activeTab,
  onTabChange,
}) {
  if (isLoading) {
    return (
      <>
        {activeTab && onTabChange && (
          <BoardSubNavbar activeTab={activeTab} onTabChange={onTabChange} />
        )}
        <LoadingText>최신 반려동물 뉴스를 가져오는 중입니다... 📰</LoadingText>
      </>
    );
  }

  if (!list || list.length === 0) {
    return (
      <>
        {activeTab && onTabChange && (
          <BoardSubNavbar activeTab={activeTab} onTabChange={onTabChange} />
        )}
        <EmptyMessage>등록된 최신 뉴스가 없습니다. 🐾</EmptyMessage>
      </>
    );
  }

  return (
    <>
      {activeTab && onTabChange && (
        <BoardSubNavbar activeTab={activeTab} onTabChange={onTabChange} />
      )}
      <NewsListWrapper>
        {list.map((item, idx) => (
          <NewsCard
            key={idx}
            onClick={() => {
              if (item.link) {
                window.open(item.link, "_blank", "noopener,noreferrer");
              } else {
                alert("이동할 기사 링크가 없습니다.");
              }
            }}
          >
            <NewsContent>
              <NewsHeader>
                <NewsTitle>{cleanHtml(item.title)}</NewsTitle>
                <NewsDate>{formatDate(item.pubDate)}</NewsDate>
              </NewsHeader>
              <NewsDesc>{cleanHtml(item.description)}</NewsDesc>
            </NewsContent>
          </NewsCard>
        ))}
      </NewsListWrapper>
    </>
  );
}

const NewsListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 1174px;
`;

const NewsCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #eef1f2;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
    border-color: var(--color-main);
  }
`;

const NewsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const NewsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
`;

const NewsTitle = styled.h3`
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: var(--color-dark);
  line-height: 1.4;
  text-align: left;
  flex: 1;

  ${NewsCard}:hover & {
    color: var(--color-main);
  }
`;

const NewsDate = styled.span`
  font-size: 12px;
  color: #adb5bd;
  white-space: nowrap;
`;

const NewsDesc = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #495057;
  text-align: left;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 80px 0;
  color: #888888;
  font-size: 15px;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 80px 0;
  color: #888888;
  font-size: 15px;
`;
