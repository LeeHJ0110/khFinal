import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  fetchBoardList,
  fetchNaverNewsApi,
} from "../../../features/board/api/boardApi";

// 기본 썸네일 이미지 (뉴스 이미지 매핑용)
const DEFAULT_NEWS_THUMB =
  "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=200&h=200";

// 언론사 주소 기반 한글 언론사명 분석기
const getPublisherName = (link) => {
  if (!link) return "언론사 뉴스";
  if (link.includes("nocutnews")) return "CBS 노컷뉴스";
  if (link.includes("naver")) return "네이버 뉴스";
  if (link.includes("daum")) return "다음 뉴스";
  if (link.includes("chosun")) return "조선일보";
  if (link.includes("joongang")) return "중앙일보";
  if (link.includes("donga")) return "동아일보";
  if (link.includes("hani")) return "한겨레";
  if (link.includes("khan")) return "경향신문";
  return "연합뉴스";
};

// HTML 태그 제거용 함수
const stripHtml = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replaceAll("&quot;", '"');
};

// RFC 822 날짜 포맷팅 함수 (예: "Sun, 07 Jun 2026 16:00:00 +0900" -> "2026.06.07")
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const mi = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
  } catch (e) {
    return dateStr;
  }
};

export default function BoardRightSidebar({ onNewsTabSelect }) {
  const navigate = useNavigate();
  const [weeklyRanking, setWeeklyRanking] = useState([]);
  const [latestNews, setLatestNews] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        setIsLoading(true);
        const [freeRes, facRes, prodRes, newsRes] = await Promise.all([
          fetchBoardList("FREE", 0),
          fetchBoardList("FAC_REVIEW", 0),
          fetchBoardList("PRODUCT_REVIEW", 0),
          fetchNaverNewsApi(0, "반려동물"),
        ]);

        // 1. 주간 랭킹 계산 (인기 TOP 3)
        const allPosts = [
          ...(freeRes.data?.content || []),
          ...(facRes.data?.content || []),
          ...(prodRes.data?.content || []),
        ];

        const ranked = allPosts
          .map((item) => {
            const replyCount = item.replyCount || 0;
            const likeCount = item.likeCount || 0;
            const score = (item.hits || 0) * 1 + likeCount * 3 + replyCount * 3;
            return { ...item, score };
          })
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);

        setWeeklyRanking(ranked);

        // 2. 최신 뉴스 1개 매핑
        const newsItems = newsRes.data?.content || [];
        if (newsItems.length > 0) {
          setLatestNews(newsItems[0]);
        }
      } catch (err) {
        console.error("우측 사이드바 데이터 로딩 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSidebarData();
  }, []);

  return (
    <SidebarContainer>
      {/* 1. 주간 랭킹 위젯 */}
      <WidgetCard>
        <WidgetHeader>
          <WidgetTitle>👑 주간랭킹</WidgetTitle>
        </WidgetHeader>
        <RankList>
          {weeklyRanking.map((item, index) => (
            <RankItem
              key={item.boardId}
              onClick={() => navigate(`/community/detail/${item.boardId}`)}
            >
              <RankBadge $rank={index + 1}>{index + 1}</RankBadge>
              <RankTitle>{item.title}</RankTitle>
            </RankItem>
          ))}
        </RankList>
      </WidgetCard>

      {/* 2. 반려동물 뉴스 위젯 */}
      <WidgetCard>
        <WidgetHeader>
          <WidgetTitle
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "4px",
            }}
          >
            <span>반려동물 뉴스</span>
            <SubTitle>오늘의 인기뉴스</SubTitle>
          </WidgetTitle>
        </WidgetHeader>

        {latestNews && (
          <NewsContentBox
            onClick={() => {
              if (latestNews.link) {
                window.open(latestNews.link, "_blank", "noopener,noreferrer");
              }
            }}
          >
            <NewsFlex>
              <NewsThumbnail src={DEFAULT_NEWS_THUMB} alt="News Thumbnail" />
              <NewsMetaArea>
                <NewsTitleText>{stripHtml(latestNews.title)}</NewsTitleText>
                <NewsSource>{getPublisherName(latestNews.link)}</NewsSource>
                <NewsDate>{formatDate(latestNews.pubDate)}</NewsDate>
              </NewsMetaArea>
            </NewsFlex>
            <Divider />
            <NewsViewAllButton
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onNewsTabSelect) {
                  onNewsTabSelect("NEWS");
                } else {
                  navigate("/community/list?category=NEWS");
                }
              }}
            >
              전체보기
            </NewsViewAllButton>
          </NewsContentBox>
        )}
      </WidgetCard>

      {/* 3. 이벤트 배너 카드 */}
      <EventBannerCard
        onClick={() => navigate("/store/event/detail")}
        aria-label="이벤트 보러가기"
      />
    </SidebarContainer>
  );
}

// Styled Components
const SidebarContainer = styled.div`
  width: 380px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex-shrink: 0;
  font-family: "Noto Sans KR", sans-serif;
`;

const WidgetCard = styled.div`
  background: #ffffff;
  border: 1px solid #e1e4e6;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.015);
`;

const WidgetHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const WidgetTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #111111;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const SubTitle = styled.span`
  font-size: 13px;
  color: #888888;
  font-weight: 400;
`;

const RankList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RankItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

const RankBadge = styled.span`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: ${(props) => {
    if (props.$rank === 1) return "#ffb703"; // 1위 노랑
    if (props.$rank === 2) return "#02c39a"; // 2위 초록
    return "#e76f51"; // 3위 오렌지
  }};
`;

const RankTitle = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #495057;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;

const NewsContentBox = styled.div`
  cursor: pointer;
`;

const NewsFlex = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

const NewsThumbnail = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
`;

const NewsMetaArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
`;

const NewsTitleText = styled.h4`
  font-size: 13px;
  font-weight: 700;
  color: #212529;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NewsSource = styled.span`
  font-size: 11px;
  color: #888888;
  margin-top: 4px;
`;

const NewsDate = styled.span`
  font-size: 11px;
  color: #adb5bd;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #f1f3f5;
  margin-bottom: 12px;
`;

const NewsViewAllButton = styled.button`
  width: 100%;
  background: none;
  border: none;
  font-size: 12px;
  color: #888888;
  cursor: pointer;
  text-align: center;
  font-weight: 500;
  padding: 4px 0;

  &:hover {
    text-decoration: underline;
  }
`;

const EventBannerCard = styled.div`
  width: 100%;
  height: 380px;
  background: url("https://kh251118fileserver-398370180939-ap-northeast-2-an.s3.ap-northeast-2.amazonaws.com/board/rightsidebarEvent.png")
    no-repeat center/cover;
  border-radius: 20px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  transition: all 0.25s ease-in-out;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }
`;
