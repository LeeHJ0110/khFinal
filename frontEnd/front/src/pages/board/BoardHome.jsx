import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import BoardSubNavbar from "./components/BoardSubNavbar";
import {
  fetchBoardList,
  fetchNaverNewsApi,
} from "../../features/board/api/boardApi";
import {
  PopularPostsWidget,
  LatestFreePostsWidget,
  BestFacilityReviewsWidget,
  BestProductReviewsWidget,
  LatestNewsWidget,
} from "./components/BoardHomeWidgets";

const MAIN_BANNER_URL =
  "https://kh251118fileserver-398370180939-ap-northeast-2-an.s3.ap-northeast-2.amazonaws.com/board/Group+306.png";
const EVENT_BANNER_URL =
  "https://kh251118fileserver-398370180939-ap-northeast-2-an.s3.ap-northeast-2.amazonaws.com/board/Group+305.png";
const HEALTH_BANNER_URL =
  "https://kh251118fileserver-398370180939-ap-northeast-2-an.s3.ap-northeast-2.amazonaws.com/board/Group+295.png";
const SHORTCUTS_BANNER_URL =
  "https://kh251118fileserver-398370180939-ap-northeast-2-an.s3.ap-northeast-2.amazonaws.com/board/Group+315.png";

export default function BoardHome() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("HOME");

  // 각 카테고리별 데이터 관리 상태
  const [freeList, setFreeList] = useState([]);
  const [facList, setFacList] = useState([]);
  const [prodList, setProdList] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 백엔드 API로부터 실시간 데이터 일괄 Fetch
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        // 병렬로 세 가지 카테고리 데이터 로드
        const [freeRes, facRes, prodRes, newsRes] = await Promise.all([
          fetchBoardList("FREE", 0),
          fetchBoardList("FAC_REVIEW", 0),
          fetchBoardList("PRODUCT_REVIEW", 0),
          fetchNaverNewsApi(0, "반려동물"),
        ]);

        setFreeList(freeRes.data?.content || []);
        setFacList(facRes.data?.content || []);
        setProdList(prodRes.data?.content || []);
        setNewsList(newsRes.data?.content || []);
      } catch (err) {
        console.error("커뮤니티 홈 데이터 페치 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // 공통 상세이동 처리 핸들러
  const handleItemClick = (item) => {
    navigate(`/community/detail/${item.boardId}`);
  };

  return (
    <Container>
      {/* 상단 서브 내비게이션 바 (포털 우회하여 인라인 렌더링) */}
      <BoardSubNavbar
        activeTab="HOME"
        bypassPortal={true}
        onTabChange={(tab) => {
          if (tab === "HOME") {
            navigate(`/community`);
          } else {
            navigate(`/community/list?category=${tab}`);
          }
        }}
      />

      <HomeContentWrapper>
        <MainLayout>
          {/* 좌측 메인 영역 */}
          <LeftContent>
            {/* 메인 히어로 배너 */}
            <HeroBanner
              onClick={() => navigate("/community/list?category=FREE")}
              aria-label="반려인들의 이야기가 모이는 공간. 팁, 고민, 정보까지 서로의 경험을 나누며 더 나은 반려 라이프를 만들어가요. 자유게시판 보러가기"
            />

            {/* 중단/하단 격자형 2열 대시보드 그리드 */}
            <DashboardGrid>
              {/* 1열: 인기글 + 시설후기 */}
              <GridColumn>
                <PopularPostsWidget
                  list={[...freeList, ...facList, ...prodList]}
                  onItemClick={handleItemClick}
                />
                <BestFacilityReviewsWidget
                  list={facList}
                  onItemClick={handleItemClick}
                  onMoreClick={() =>
                    navigate("/community/list?category=FAC_REVIEW")
                  }
                />
              </GridColumn>

              {/* 2열: 자유최신글 + 상품후기 */}
              <GridColumn>
                <LatestFreePostsWidget
                  list={freeList}
                  isLoading={isLoading}
                  onItemClick={handleItemClick}
                  onMoreClick={() => navigate("/community/list?category=FREE")}
                />
                <BestProductReviewsWidget
                  list={prodList}
                  onItemClick={handleItemClick}
                  onMoreClick={() =>
                    navigate("/community/list?category=PRODUCT_REVIEW")
                  }
                />
              </GridColumn>
            </DashboardGrid>
          </LeftContent>

          {/* 우측 사이드바 영역 */}
          <RightSidebar>
            {/* 1단: 회원 감사 이벤트 */}
            <EventCard
              onClick={() => alert("준비 중인 이벤트입니다.")}
              aria-label="EVENT 회원 감사 이벤트: 신규 가입만 해도 웰컴 포인트 지급. 기간 2026.05.01 ~ 2026.07.31"
            />

            {/* 2단: 쇼핑몰 & 포인트 샵 숏컷 버튼 */}
            <ShortcutRow>
              <ShortcutButton
                onClick={() => navigate("/store")}
                aria-label="PET&I FOR 쇼핑몰: 사료, 간식, 용품까지 완비! 바로가기"
                $type="store"
              />
              <ShortcutButton
                onClick={() => navigate("/mypage")}
                aria-label="PET&I FOR 포인트 샵: 모은 포인트로 특별 득템! 바로가기"
                $type="point"
              />
            </ShortcutRow>

            {/* 3단: 반려동물 건강관리 */}
            <HealthCard
              onClick={() => navigate("/healthcare/requesthome")}
              aria-label="PET&I FOR 반려동물 건강관리 시작하기: 건강검진, 예방접종, 기록관리까지 한 곳에서 간편하게! 건강관리 바로가기"
            />

            {/* 4단: 반려 뉴스 */}
            <LatestNewsWidget
              list={newsList}
              onMoreClick={() => navigate("/community/list?category=NEWS")}
            />
          </RightSidebar>
        </MainLayout>
      </HomeContentWrapper>
    </Container>
  );
}

// ==========================================
// Styled Components (Premium Aesthetics)
// ==========================================

// ==========================================
// 1. 공통 컨테이너 및 래퍼 스타일 (전체 레이아웃 및 헤더 연동 가로폭/여백 제어)
// ==========================================

// 최외각 컨테이너 (화면 중앙 정렬 및 배경색 설정)
const Container = styled.div`
  width: 100%;
  background-color: #fafbfc;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Paperozi", "Noto Sans KR", sans-serif;
`;

// 콘텐츠 내부 정렬 래퍼 (상단 헤더/푸터의 1920px 폭 및 56px 여백 구조와 동기화)
const HomeContentWrapper = styled.div`
  width: var(--layout-width);
  max-width: 100%;
  margin: 0 auto;
  padding: 40px var(--layout-padding-x) 80px var(--layout-padding-x);
  display: flex;
  flex-direction: column;
  gap: 60px;
`;

// ==========================================
// 2. 메인 좌/우 2열 분할 레이아웃
// ==========================================

const MainLayout = styled.div`
  display: flex;
  gap: 15px;
  width: 100%;
  align-items: flex-start;
`;

const LeftContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-width: 0;
`;

const RightSidebar = styled.div`
  width: 504px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex-shrink: 0;
`;

// ==========================================
// 3. 좌측 메인 히어로 배너
// ==========================================

const HeroBanner = styled.div`
  width: 1271px;
  height: 361px;
  background: url(${MAIN_BANNER_URL}) no-repeat center/cover;
  border-radius: 16px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  }
`;

// ==========================================
// 4. 우측 사이드바 카드 컴포넌트들
// ==========================================

const EventCard = styled.div`
  width: 504px;
  height: 201px;
  background: url(${EVENT_BANNER_URL}) no-repeat center/cover;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  }
`;

const ShortcutRow = styled.div`
  display: flex;
  gap: 15px;
  width: 100%;
`;

const ShortcutButton = styled.div`
  flex: 1;
  width: 244px;
  height: 146px;
  background-image: url(${SHORTCUTS_BANNER_URL});
  background-repeat: no-repeat;
  background-size: 200% 100%;
  background-position: ${(props) =>
    props.$type === "store" ? "left center" : "right center"};
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  }
`;

const HealthCard = styled.div`
  width: 504px;
  height: 254px;
  background: url(${HEALTH_BANNER_URL}) no-repeat center/cover;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  }
`;

// ==========================================
// 5. 하단 대시보드 2열 그리드
// ==========================================

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  width: 1269px;
`;

const GridColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
