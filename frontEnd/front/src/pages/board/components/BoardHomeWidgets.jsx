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

// Helper: 상대 시간 포맷터
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
    month: "2-digit",
    day: "2-digit",
  });
}

// ==========================================
// 태그 목록 및 헬퍼 함수
// ==========================================
const DEFAULT_NO_IMAGE = "https://kh251118fileserver-398370180939-ap-northeast-2-an.s3.ap-northeast-2.amazonaws.com/board/%EC%82%AC%EC%A7%84%EC%97%86%EC%9D%84%EB%95%8C%EA%B8%B0%EB%B3%B8.png";

const TAG_LIST = [
  "성장", "체중관리", "피브", "소화", "치아",
  "칼로리", "보상", "기호성", "관절", "면영",
  "눈", "탈취", "흡수", "위생", "대용량"
];

function getMockTags(boardId) {
  if (!boardId) return ["성장", "기호성"];
  const idx1 = boardId % TAG_LIST.length;
  const idx2 = (boardId * 3 + 2) % TAG_LIST.length;
  return idx1 === idx2 ? [TAG_LIST[idx1]] : [TAG_LIST[idx1], TAG_LIST[idx2]];
}

// ==========================================
// 1. 인기 게시글 TOP 5 위젯
// ==========================================
export function PopularPostsWidget({ list, onItemClick, className }) {
  // 안전 장치: 리스트 가공 (최근 1주일 글 필터링은 백엔드에서 수행)
  // 인기 점수 공식: (조회수 * 1) + (좋아요 * 3) + (댓글 * 3)
  // 프론트엔드 연산 및 상위 5개 정렬 바인딩
  const computedList = [...list]
    .map((item) => {
      const replyCount = item.replyCount || 0;
      const likeCount = item.likeCount || 0;
      const score = (item.hits || 0) * 1 + likeCount * 3 + replyCount * 3;
      return { ...item, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <WidgetContainer className={className}>
      <WidgetHeader>
        <WidgetTitle>
          <SvgCrown /> 인기 게시글 TOP 5
        </WidgetTitle>
      </WidgetHeader>
      <PopularList>
        {computedList.length === 0 ? (
          <EmptyText>인기 게시글이 없습니다.</EmptyText>
        ) : (
          computedList.map((item, index) => {
            let categoryLabel = "자유";
            if (item.category === "PRODUCT_REVIEW") categoryLabel = "상품후기";
            if (item.category === "FAC_REVIEW") categoryLabel = "시설후기";

            return (
              <PopularItem
                key={item.boardId}
                onClick={() => onItemClick?.(item)}
              >
                <RankNumber $rank={index + 1}>{index + 1}</RankNumber>
                <PopularItemTitle>{item.title}</PopularItemTitle>
                <CategoryBadge $type={item.category}>
                  {categoryLabel}
                </CategoryBadge>
                <WidgetStats>
                  <StatText title="조회수">
                    <SvgEye />
                    <span>{item.hits ? item.hits.toLocaleString() : 0}</span>
                  </StatText>
                  <StatText title="댓글수">
                    <SvgComment />
                    <span>{item.replyCount || 0}</span>
                  </StatText>
                  <StatText title="좋아요수">
                    <SvgHeartSmall />
                    <span>{item.likeCount || 0}</span>
                  </StatText>
                </WidgetStats>
              </PopularItem>
            );
          })
        )}
      </PopularList>
    </WidgetContainer>
  );
}

// ==========================================
// 2. 자유게시판 최신글 위젯
// ==========================================
export function LatestFreePostsWidget({ list, onItemClick, onMoreClick, className }) {
  const latestList = [...list].slice(0, 4);

  return (
    <WidgetContainer className={className}>
      <WidgetHeader>
        <WidgetTitle>자유게시판 최신글</WidgetTitle>
        <MoreLink onClick={onMoreClick}>더보기 &gt;</MoreLink>
      </WidgetHeader>
      <LatestList>
        {latestList.length === 0 ? (
          <EmptyText>작성된 게시글이 없습니다.</EmptyText>
        ) : (
          latestList.map((item) => {
            const firstImg =
              extractFirstImg(item.content) || DEFAULT_NO_IMAGE;

            return (
              <LatestItem
                key={item.boardId}
                onClick={() => onItemClick?.(item)}
              >
                <LatestThumbnail>
                  <img src={firstImg} alt="썸네일" />
                </LatestThumbnail>
                <LatestInfo>
                  <LatestItemTitle>{item.title}</LatestItemTitle>
                  <LatestMeta>
                    <span>{item.writerNickname}</span>
                    <span>•</span>
                    <span>{formatRelativeTime(item.createdAt)}</span>
                  </LatestMeta>
                </LatestInfo>
                <WidgetStats>
                  <StatText title="조회수">
                    <SvgEye />
                    <span>{item.hits ? item.hits.toLocaleString() : 0}</span>
                  </StatText>
                  <StatText title="댓글수">
                    <SvgComment />
                    <span>{item.replyCount || 0}</span>
                  </StatText>
                  <StatText title="좋아요수">
                    <SvgHeartSmall />
                    <span>{item.likeCount || 0}</span>
                  </StatText>
                </WidgetStats>
              </LatestItem>
            );
          })
        )}
      </LatestList>
    </WidgetContainer>
  );
}

// ==========================================
// 3. 시설후기 베스트 위젯
// ==========================================
export function BestFacilityReviewsWidget({ list, onItemClick, onMoreClick }) {
  const facilityReviews = [...list]
    .filter((item) => item.category === "FAC_REVIEW" || !item.category)
    .sort((a, b) => (b.stars || 5) - (a.stars || 5))
    .slice(0, 4);

  return (
    <WidgetContainer>
      <WidgetHeader>
        <WidgetTitle>시설후기 베스트</WidgetTitle>
        <MoreLink onClick={onMoreClick}>더보기 &gt;</MoreLink>
      </WidgetHeader>
      <ReviewCardGrid>
        {facilityReviews.length === 0 ? (
          <EmptyText style={{ gridColumn: "span 4" }}>
            등록된 시설 후기가 없습니다.
          </EmptyText>
        ) : (
          facilityReviews.map((item, idx) => {
            const firstImg =
              extractFirstImg(item.content) || DEFAULT_NO_IMAGE;
            return (
              <ReviewCard
                key={item.boardId}
                onClick={() => onItemClick?.(item)}
              >
                <CardImageWrapper>
                  <img src={firstImg} alt={item.title} />
                  <RatingBadge>★ {(item.stars || 5.0).toFixed(1)}</RatingBadge>
                </CardImageWrapper>
                <CardBody>
                  <CardTitle>{item.title}</CardTitle>
                  <CardTagGroup>
                    {getMockTags(item.boardId).map((tag, tIdx) => (
                      <CardTag key={tIdx} $type="facility">
                        #{tag}
                      </CardTag>
                    ))}
                  </CardTagGroup>
                </CardBody>
              </ReviewCard>
            );
          })
        )}
      </ReviewCardGrid>
    </WidgetContainer>
  );
}

// ==========================================
// 4. 상품후기 베스트 위젯
// ==========================================
export function BestProductReviewsWidget({ list, onItemClick, onMoreClick }) {
  const productReviews = [...list]
    .filter((item) => item.category === "PRODUCT_REVIEW" || !item.category)
    .sort((a, b) => (b.stars || 5) - (a.stars || 5))
    .slice(0, 4);

  return (
    <WidgetContainer>
      <WidgetHeader>
        <WidgetTitle>상품후기 베스트</WidgetTitle>
        <MoreLink onClick={onMoreClick}>더보기 &gt;</MoreLink>
      </WidgetHeader>
      <ReviewCardGrid>
        {productReviews.length === 0 ? (
          <EmptyText style={{ gridColumn: "span 4" }}>
            등록된 상품 후기가 없습니다.
          </EmptyText>
        ) : (
          productReviews.map((item, idx) => {
            const firstImg =
              extractFirstImg(item.content) || DEFAULT_NO_IMAGE;
            return (
              <ReviewCard
                key={item.boardId}
                onClick={() => onItemClick?.(item)}
              >
                <CardImageWrapper>
                  <img src={firstImg} alt={item.title} />
                  <RatingBadge>★ {(item.stars || 5.0).toFixed(1)}</RatingBadge>
                </CardImageWrapper>
                <CardBody>
                  <CardTitle>{item.title}</CardTitle>
                  <CardTagGroup>
                    {getMockTags(item.boardId).map((tag, tIdx) => (
                      <CardTag key={tIdx} $type="product">
                        #{tag}
                      </CardTag>
                    ))}
                  </CardTagGroup>
                </CardBody>
              </ReviewCard>
            );
          })
        )}
      </ReviewCardGrid>
    </WidgetContainer>
  );
}

// ==========================================
// 5. 반려 뉴스 Mock 위젯 (틀만 구성)
// ==========================================
export function LatestNewsWidget({ onMoreClick }) {
  // 시안 기반 뉴스 Mock 데이터 3선
  const mockNewsData = [
    {
      id: "news-1",
      title: "봄철 반려동물 알레르기, 이렇게 관리하세요!",
      date: "2026.05.10",
      img: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=150&q=80",
    },
    {
      id: "news-2",
      title: "강아지가 5성급 호텔 가고 저속노화 즐기는 시대",
      date: "2026.05.09",
      img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=150&q=80",
    },
    {
      id: "news-3",
      title: "우리 고양이가 좋아하는 '이것' 알고 먹여야 더 건강합니다",
      date: "2026.05.08",
      img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&q=80",
    },
  ];

  return (
    <WidgetContainer>
      <WidgetHeader>
        <WidgetTitle>반려 뉴스</WidgetTitle>
        <MoreLink onClick={onMoreClick}>더보기 &gt;</MoreLink>
      </WidgetHeader>
      <NewsList>
        {mockNewsData.map((news) => (
          <NewsItem
            key={news.id}
            onClick={() => alert("뉴스 기사는 현재 점검 준비 중입니다.")}
          >
            <NewsThumbnail>
              <img src={news.img} alt={news.title} />
            </NewsThumbnail>
            <NewsInfo>
              <NewsItemTitle>{news.title}</NewsItemTitle>
              <NewsDate>{news.date}</NewsDate>
            </NewsInfo>
          </NewsItem>
        ))}
      </NewsList>
    </WidgetContainer>
  );
}

// ==========================================
// SVGs
// ==========================================
const SvgCrown = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="#ffb703"
    style={{ marginRight: "6px", verticalAlign: "middle" }}
  >
    <path d="M2 22h20v-2H2v2zm10-5.71l3.54-5.3L22 17h-2.58l-1.92-2.88L14 17h-4l-3.5-2.88L4.58 17H2l6.46-6.01L12 16.29zM12 4a3 3 0 110 6 3 3 0 010-6z" />
  </svg>
);

const SvgEye = () => (
  <svg
    viewBox="0 0 24 24"
    width="13"
    height="13"
    fill="#adb5bd"
    style={{ marginRight: "4px" }}
  >
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
  </svg>
);

const SvgComment = () => (
  <svg
    viewBox="0 0 24 24"
    width="13"
    height="13"
    fill="#adb5bd"
    style={{ marginRight: "4px" }}
  >
    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
  </svg>
);

const SvgHeartSmall = () => (
  <svg
    viewBox="0 0 24 24"
    width="12"
    height="12"
    fill="#adb5bd"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const WidgetStats = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  flex-shrink: 0;
`;

const StatText = styled.div`
  display: flex;
  align-items: center;
  font-size: 11px;
  color: #adb5bd;
  gap: 3px;

  svg {
    fill: #adb5bd;
  }
`;

// ==========================================
// Styled Components
// ==========================================
const WidgetContainer = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #eef1f2;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.015);
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
    transform: translateY(-2px);
  }
`;

const WidgetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f8f9fa;
`;

const WidgetTitle = styled.h3`
  font-size: 16px;
  font-weight: 800;
  color: var(--color-dark, #2d2d3a);
  margin: 0;
  display: flex;
  align-items: center;
`;

const MoreLink = styled.button`
  background: none;
  border: none;
  font-size: 11px;
  font-weight: 700;
  color: var(--color-main, #00a97b);
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const EmptyText = styled.div`
  text-align: center;
  padding: 40px 0;
  color: #adb5bd;
  font-size: 13px;
`;

// 인기 게시판 스타일
const PopularList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 235px;
`;

const PopularItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 10px 0;

  &:hover h4 {
    color: var(--color-main, #00a97b);
  }
`;

const RankNumber = styled.span`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  color: #ffffff;
  flex-shrink: 0;
  background-color: ${(props) => {
    if (props.$rank === 1) return "#ffb703"; // 1위 골드
    if (props.$rank === 2) return "#02c39a"; // 2위 그린
    if (props.$rank === 3) return "#00a896"; // 3위 청록
    return "#adb5bd";
  }};
`;

const PopularItemTitle = styled.h4`
  font-size: 13px;
  font-weight: 700;
  color: #495057;
  margin: 0;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CategoryBadge = styled.span`
  font-size: 10px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
  flex-shrink: 0;
  border: 1px solid
    ${(props) => {
      if (props.$type === "PRODUCT_REVIEW") return "#ffe3e3";
      if (props.$type === "FAC_REVIEW") return "#e8f2ff";
      return "#e6fcf5";
    }};
  color: ${(props) => {
    if (props.$type === "PRODUCT_REVIEW") return "#fa5252";
    if (props.$type === "FAC_REVIEW") return "#228be6";
    return "#099268";
  }};
  background-color: ${(props) => {
    if (props.$type === "PRODUCT_REVIEW") return "#fff5f5";
    if (props.$type === "FAC_REVIEW") return "#f8f9fa";
    return "#ebfbee";
  }};
`;

const ViewsStat = styled.div`
  display: flex;
  align-items: center;
  font-size: 11px;
  color: #868e96;
  width: 50px;
  justify-content: flex-end;
  flex-shrink: 0;
`;

// 자유 최신 스타일
const LatestList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const LatestItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;

  &:hover h4 {
    color: var(--color-main, #00a97b);
  }
`;

const LatestThumbnail = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 6px;
  overflow: hidden;
  background-color: #f1f3f5;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const LatestInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const LatestItemTitle = styled.h4`
  font-size: 13px;
  font-weight: 700;
  color: #343a40;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LatestMeta = styled.div`
  font-size: 11px;
  color: #868e96;
  display: flex;
  gap: 6px;
`;

const CommentsStat = styled.div`
  display: flex;
  align-items: center;
  font-size: 11px;
  color: #868e96;
  flex-shrink: 0;
`;

// 후기 카드 격자
const ReviewCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
`;

const ReviewCard = styled.div`
  border-radius: 8px;
  border: 1px solid #f1f3f5;
  overflow: hidden;
  cursor: pointer;
  background-color: #ffffff;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  }
`;

const CardImageWrapper = styled.div`
  position: relative;
  height: 90px;
  background-color: #f1f3f5;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RatingBadge = styled.span`
  position: absolute;
  bottom: 6px;
  left: 6px;
  background-color: rgba(33, 37, 41, 0.85);
  color: #ffbc00;
  font-size: 9px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
  backdrop-filter: blur(2px);
`;

const CardBody = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const CardTitle = styled.h4`
  font-size: 12px;
  font-weight: 700;
  color: #212529;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardTagGroup = styled.div`
  display: none; /* 일단 커뮤니티 홈에서는 안보이게 처리 */
  gap: 4px;
  margin-top: 4px;
`;

const CardTag = styled.span`
  font-size: 9px;
  font-weight: 600;
  padding: 1px 4px;
  border-radius: 3px;
  background-color: ${(props) => {
    if (props.$type === "facility") return "#ebfbee";
    if (props.$type === "product") return "#fff4e6";
    return "#f8f9fa";
  }};
  color: ${(props) => {
    if (props.$type === "facility") return "#099268";
    if (props.$type === "product") return "#d9480f";
    return "#495057";
  }};
`;

// 뉴스 목록 스타일
const NewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const NewsItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;

  &:hover h4 {
    color: var(--color-main, #00a97b);
  }
`;

const NewsThumbnail = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 6px;
  overflow: hidden;
  background-color: #f1f3f5;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const NewsInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const NewsItemTitle = styled.h4`
  font-size: 12px;
  font-weight: 700;
  color: #343a40;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NewsDate = styled.span`
  font-size: 10px;
  color: #adb5bd;
`;
