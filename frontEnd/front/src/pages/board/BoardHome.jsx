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
              <ShortcutButton onClick={() => navigate("/store")} $bg="#ebfbee">
                <ShortcutTitle $color="#099268">PET&I FOR</ShortcutTitle>
                <ShortcutLabel>쇼핑몰</ShortcutLabel>
                <ShortcutSubLabel>사료, 간식, 용품까지 완비!</ShortcutSubLabel>
                <ShortcutLinkText $color="#099268">
                  바로가기 &gt;
                </ShortcutLinkText>
              </ShortcutButton>
              <ShortcutButton onClick={() => navigate("/mypage")} $bg="#fff9db">
                <ShortcutTitle $color="#f08c00">PET&I FOR</ShortcutTitle>
                <ShortcutLabel>포인트 샵</ShortcutLabel>
                <ShortcutSubLabel>모은 포인트로 특별 득템!</ShortcutSubLabel>
                <ShortcutLinkText $color="#f08c00">
                  바로가기 &gt;
                </ShortcutLinkText>
              </ShortcutButton>
            </ShortcutRow>
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

          {/* 3열: 건강관리 + 뉴스게시판 */}
          <GridColumn>
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
  gap: 40px;
`;

// ==========================================
// 2. 상단 히어로 섹션 (좌측 와이드 메인 비주얼 배너)
// ==========================================

// 히어로 영역 가로 정렬 컨테이너
const HeroSection = styled.div`
  display: flex;
  gap: 30px;
  width: 100%;
  align-items: stretch;
`;

// 메인 비주얼 슬라이더/배너 본체
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

// 배너 텍스트 콘텐츠 영역
const HeroBannerContent = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 2;
  flex: 1;
`;

// 배너 상단 카테고리 서브타이틀
const HeroSubtitle = styled.span`
  font-size: 13px;
  font-weight: 800;
  color: var(--color-main, #00a97b);
  letter-spacing: 0.5px;
  margin-bottom: 12px;
`;

// 배너 굵은 메인 메시지
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

// 배너 소개 설명 텍스트
const HeroDesc = styled.p`
  font-size: 14px;
  color: #495057;
  line-height: 1.6;
  margin: 0 0 24px 0;
`;

// 배너 내 바로가기 액션 버튼
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

// 배너 내 메인 일러스트/사진 래퍼
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

// ==========================================
// 3. 우측 프로모션 스택 (이벤트 카드, 쇼핑몰/포인트 샵 숏컷 카드)
// ==========================================

// 우측 사이드바 성격의 세로형 컨텐츠 스택
const PromoStack = styled.div`
  width: 420px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// 이벤트 공지용 카드 레이아웃
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

// 이벤트 배지 라벨
const EventBadge = styled.span`
  font-size: 9px;
  font-weight: 800;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
`;

// 이벤트 메인 타이틀
const EventTitle = styled.h3`
  font-size: 16px;
  font-weight: 800;
  margin: 10px 0 6px 0;
`;

// 이벤트 설명 문구
const EventDesc = styled.p`
  font-size: 12px;
  opacity: 0.9;
  margin: 0 0 4px 0;
`;

// 이벤트 상세 부가 텍스트
const EventSubText = styled.p`
  font-size: 10px;
  opacity: 0.75;
  margin: 0 0 12px 0;
`;

// 이벤트 진행 기간 표시부
const EventPeriod = styled.span`
  font-size: 9px;
  opacity: 0.6;
  display: block;
  margin-bottom: 10px;
`;

// 이벤트 상세 링크 표시부
const EventButton = styled.span`
  font-size: 11px;
  font-weight: 700;
  border-bottom: 1px solid #ffffff;
  padding-bottom: 2px;
`;

// 쇼핑몰 & 포인트 샵의 2단 가로 정렬 로우
const ShortcutRow = styled.div`
  display: flex;
  gap: 15px;
`;

// 쇼핑몰/포인트 샵 바로가기 개별 카드 (우측 공간 확보로 패딩 및 텍스트 강조)
const ShortcutButton = styled.div`
  flex: 1;
  background-color: ${(props) => props.$bg};
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease;
  height: 210px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  }
`;

// 숏컷 최상단 영어 고유 서비스 로고 라벨
const ShortcutTitle = styled.span`
  font-size: 10px;
  font-weight: 800;
  color: ${(props) => props.$color || "#868e96"};
  opacity: 0.85;
  text-transform: uppercase;
`;

// 숏컷 한글 타이틀 (예: 쇼핑몰, 포인트 샵)
const ShortcutLabel = styled.h4`
  font-size: 18px;
  font-weight: 800;
  color: #212529;
  margin: 0;
`;

// 숏컷 한 줄 소개 설명부
const ShortcutSubLabel = styled.p`
  font-size: 11px;
  color: #868e96;
  margin: 0 0 4px 0;
  line-height: 1.4;
`;

// 숏컷 우측 하단 바로가기 링크
const ShortcutLinkText = styled.span`
  font-size: 12px;
  font-weight: 800;
  color: ${(props) => props.$color || "#495057"};
  display: inline-flex;
  align-items: center;
`;

// ==========================================
// 4. 반려동물 건강관리 카드 (대시보드 3열 상단 배치)
// ==========================================

// 메인 건강관리 안내 카드 본체
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

// 건강관리 텍스트 콘텐츠 영역
const HealthContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

// 건강관리 서비스 태그 배지
const HealthBadge = styled.span`
  font-size: 9px;
  font-weight: 800;
  background-color: rgba(255, 255, 255, 0.25);
  padding: 2px 6px;
  border-radius: 4px;
  align-self: flex-start;
  margin-bottom: 8px;
`;

// 건강관리 주요 제목 텍스트
const HealthTitle = styled.h3`
  font-size: 15px;
  font-weight: 800;
  line-height: 1.35;
  margin: 0 0 8px 0;
`;

// 건강관리 상세 설명 문구
const HealthDesc = styled.p`
  font-size: 10px;
  opacity: 0.85;
  line-height: 1.4;
  margin: 0 0 14px 0;
`;

// 건강관리 바로가기 버튼 표시부
const HealthButton = styled.span`
  font-size: 11px;
  font-weight: 700;
  border-bottom: 1px solid #ffffff;
  padding-bottom: 2px;
  align-self: flex-start;
`;

// 건강관리 카드 내부 동그란 시각 일러스트 영역
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

// ==========================================
// 5. 하단 대시보드 그리드 (3열 2단 배치 레이아웃 구조)
// ==========================================

// 게시판 위젯용 3개 균등분할(3열 1fr) 그리드 컨테이너
const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  width: 100%;
`;

// 각 열 단위의 수직 플렉스 컨테이너
const GridColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;
