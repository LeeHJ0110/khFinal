import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import BoardSubNavbar from "./components/BoardSubNavbar";
import { fetchBoardList } from "../../features/board/api/boardApi";
import {
  PopularPostsWidget,
  LatestFreePostsWidget,
  BestFacilityReviewsWidget,
  BestProductReviewsWidget,
  LatestNewsWidget,
} from "./components/BoardHomeWidgets";

export default function BoardHome() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("HOME");

  // 각 카테고리별 데이터 관리 상태
  const [freeList, setFreeList] = useState([]);
  const [facList, setFacList] = useState([]);
  const [prodList, setProdList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 백엔드 API로부터 실시간 데이터 일괄 Fetch
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        // 병렬로 세 가지 카테고리 데이터 로드
        const [freeRes, facRes, prodRes] = await Promise.all([
          fetchBoardList("FREE", 0),
          fetchBoardList("FAC_REVIEW", 0),
          fetchBoardList("PRODUCT_REVIEW", 0),
        ]);

        setFreeList(freeRes.data?.content || []);
        setFacList(facRes.data?.content || []);
        setProdList(prodRes.data?.content || []);
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
      {/* 상단 서브 내비게이션 바 */}
      <BoardSubNavbar
        activeTab="HOME"
        onTabChange={(tab) => {
          if (tab === "HOME") {
            navigate(`/community`);
          } else {
            navigate(`/community/list?category=${tab}`);
          }
        }}
      />

      <HomeContentWrapper>
        {/* ========================================== */}
        {/* 상단 메인 히어로 배너 & 사이드 프로모션 카드 */}
        {/* ========================================== */}
        <HeroSection>
          {/* 좌측 와이드 대형 슬라이더 배너 */}
          <HeroBanner>
            <HeroBannerContent>
              <HeroSubtitle>함께 나누고, 더 건강해지는 우리</HeroSubtitle>
              <HeroTitle>
                반려인들의 <br />
                <span>이야기</span>가 모이는 공간
              </HeroTitle>
              <HeroDesc>
                팁, 고민, 정보까지 <br />
                서로의 경험을 나누며 더 나은 반려 라이프를 만들어가요.
              </HeroDesc>
              <HeroButton
                onClick={() => navigate("/community/list?category=FREE")}
              >
                자유 게시판 보러가기 &gt;
              </HeroButton>
            </HeroBannerContent>
            {/* 임시 플레이스홀더 이미지 (강아지와 고양이 시안 완벽 재현) */}
            <HeroImageWrapper>
              <img
                src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80"
                alt="메인 배너 펫 이미지"
              />
            </HeroImageWrapper>
          </HeroBanner>

          {/* 우측 3단 퀵 프로모션 스택 */}
          <PromoStack>
            {/* 1단: 이벤트 카드 */}
            <EventCard onClick={() => alert("준비 중인 이벤트입니다.")}>
              <EventBadge>EVENT</EventBadge>
              <EventTitle>회원 감사 이벤트</EventTitle>
              <EventDesc>신규 가입만 해도 웰컴 포인트 지급</EventDesc>
              <EventSubText>
                포인트 즉시 사용 및 특별 할인쿠폰 제공
              </EventSubText>
              <EventPeriod>기간 | 2026.06.01 - 2026.07.31</EventPeriod>
              <EventButton>이벤트 보러가기 &gt;</EventButton>
            </EventCard>

            {/* 2단: 2분할 숏컷 버튼 */}
            <ShortcutRow>
              <ShortcutButton
                onClick={() => navigate("/store")}
                $bg="#ebfbee"
                $color="#099268"
              >
                <ShortcutTitle>PET&I SHOP</ShortcutTitle>
                <ShortcutLabel>쇼핑몰</ShortcutLabel>
                <ShortcutSubLabel>사료, 간식, 용품까지 완비!</ShortcutSubLabel>
                <ShortcutLinkText>바로가기 &gt;</ShortcutLinkText>
              </ShortcutButton>
              <ShortcutButton
                onClick={() => navigate("/mypage")}
                $bg="#fff9db"
                $color="#f08c00"
              >
                <ShortcutTitle>PET&I POINT</ShortcutTitle>
                <ShortcutLabel>포인트 샵</ShortcutLabel>
                <ShortcutSubLabel>모은 포인트로 특별 득템!</ShortcutSubLabel>
                <ShortcutLinkText>바로가기 &gt;</ShortcutLinkText>
              </ShortcutButton>
            </ShortcutRow>

            {/* 3단: 건강관리 카드 */}
            <HealthCard onClick={() => navigate("/healthcare/requesthome")}>
              <HealthContent>
                <HealthBadge>PET&I HEALTHCARE</HealthBadge>
                <HealthTitle>
                  반려동물 <br />
                  건강관리 시작하기
                </HealthTitle>
                <HealthDesc>
                  건강검진, 예방접종, 행동관리까지 <br />한 곳에서 간편하고
                  철저하게!
                </HealthDesc>
                <HealthButton>건강관리 바로가기 &gt;</HealthButton>
              </HealthContent>
              <HealthImage>
                <img
                  src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=200&q=80"
                  alt="건강관리 펫"
                />
              </HealthImage>
            </HealthCard>
          </PromoStack>
        </HeroSection>

        {/* ========================================== */}
        {/* 중단/하단 격자형 3열 대시보드 그리드 레이아웃 */}
        {/* ========================================== */}
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

          {/* 3열: 뉴스게시판 (Mock) */}
          <GridColumn>
            <LatestNewsWidget
              onMoreClick={() => navigate("/community/list?category=NEWS")}
            />
          </GridColumn>
        </DashboardGrid>
      </HomeContentWrapper>
    </Container>
  );
}

// ==========================================
// Styled Components (Premium Aesthetics)
// ==========================================
const Container = styled.div`
  width: 100%;
  background-color: #fafbfc;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Paperozi", "Noto Sans KR", sans-serif;
`;

const HomeContentWrapper = styled.div`
  width: var(--layout-width);
  max-width: 100%;
  margin: 0 auto;
  padding: 40px var(--layout-padding-x) 80px var(--layout-padding-x);
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

// 메인 히어로 섹션
const HeroSection = styled.div`
  display: flex;
  gap: 30px;
  width: 100%;
  align-items: stretch;
`;

const HeroBanner = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #ebfbee 0%, #d3f9d8 100%);
  border-radius: 16px;
  border: 1px solid #c3fae8;
  padding: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 169, 123, 0.04);
`;

const HeroBannerContent = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 2;
  flex: 1;
`;

const HeroSubtitle = styled.span`
  font-size: 13px;
  font-weight: 800;
  color: var(--color-main, #00a97b);
  letter-spacing: 0.5px;
  margin-bottom: 12px;
`;

const HeroTitle = styled.h1`
  font-size: 34px;
  font-weight: 900;
  color: #2d2d3a;
  line-height: 1.35;
  margin: 0 0 16px 0;

  span {
    color: var(--color-main, #00a97b);
    position: relative;

    &::after {
      content: "";
      position: absolute;
      bottom: 2px;
      left: 0;
      width: 100%;
      height: 8px;
      background-color: rgba(0, 169, 123, 0.15);
      z-index: -1;
    }
  }
`;

const HeroDesc = styled.p`
  font-size: 14px;
  color: #495057;
  line-height: 1.6;
  margin: 0 0 24px 0;
`;

const HeroButton = styled.button`
  align-self: flex-start;
  height: 44px;
  padding: 0 24px;
  background-color: var(--color-main, #00a97b);
  color: #ffffff;
  border: none;
  border-radius: 22px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 169, 123, 0.2);
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--color-main-dark, #008963);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 169, 123, 0.3);
  }
`;

const HeroImageWrapper = styled.div`
  width: 320px;
  height: 320px;
  border-radius: 50%;
  overflow: hidden;
  border: 8px solid #ffffff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
  z-index: 2;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// 우측 3단 프로모션 스택
const PromoStack = styled.div`
  width: 420px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const EventCard = styled.div`
  background: linear-gradient(135deg, #228be6 0%, #1c7ed6 100%);
  border-radius: 12px;
  padding: 20px;
  color: #ffffff;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(34, 139, 230, 0.15);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 26px rgba(34, 139, 230, 0.25);
  }
`;

const EventBadge = styled.span`
  font-size: 9px;
  font-weight: 800;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
`;

const EventTitle = styled.h3`
  font-size: 16px;
  font-weight: 800;
  margin: 10px 0 6px 0;
`;

const EventDesc = styled.p`
  font-size: 12px;
  opacity: 0.9;
  margin: 0 0 4px 0;
`;

const EventSubText = styled.p`
  font-size: 10px;
  opacity: 0.75;
  margin: 0 0 12px 0;
`;

const EventPeriod = styled.span`
  font-size: 9px;
  opacity: 0.6;
  display: block;
  margin-bottom: 10px;
`;

const EventButton = styled.span`
  font-size: 11px;
  font-weight: 700;
  border-bottom: 1px solid #ffffff;
  padding-bottom: 2px;
`;

const ShortcutRow = styled.div`
  display: flex;
  gap: 15px;
`;

const ShortcutButton = styled.div`
  flex: 1;
  background-color: ${(props) => props.$bg};
  border-radius: 10px;
  padding: 16px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
  }
`;

const ShortcutTitle = styled.span`
  font-size: 8px;
  font-weight: 800;
  opacity: 0.65;
  margin-bottom: 6px;
`;

const ShortcutLabel = styled.h4`
  font-size: 13px;
  font-weight: 800;
  color: #212529;
  margin: 0 0 4px 0;
`;

const ShortcutSubLabel = styled.p`
  font-size: 9px;
  color: #868e96;
  margin: 0 0 12px 0;
  line-height: 1.3;
`;

const ShortcutLinkText = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: ${(props) => props.theme.color || "#495057"};
`;

const HealthCard = styled.div`
  background: linear-gradient(135deg, #12b886 0%, #0ca678 100%);
  border-radius: 12px;
  padding: 20px;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(18, 184, 134, 0.15);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 26px rgba(18, 184, 134, 0.25);
  }
`;

const HealthContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const HealthBadge = styled.span`
  font-size: 9px;
  font-weight: 800;
  background-color: rgba(255, 255, 255, 0.25);
  padding: 2px 6px;
  border-radius: 4px;
  align-self: flex-start;
  margin-bottom: 8px;
`;

const HealthTitle = styled.h3`
  font-size: 15px;
  font-weight: 800;
  line-height: 1.35;
  margin: 0 0 8px 0;
`;

const HealthDesc = styled.p`
  font-size: 10px;
  opacity: 0.85;
  line-height: 1.4;
  margin: 0 0 14px 0;
`;

const HealthButton = styled.span`
  font-size: 11px;
  font-weight: 700;
  border-bottom: 1px solid #ffffff;
  padding-bottom: 2px;
  align-self: flex-start;
`;

const HealthImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #ffffff;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// 대시보드 3열 그리드
const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  width: 100%;
`;

const GridColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;
