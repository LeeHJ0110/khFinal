import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import useBoardList from "../../features/board/hooks/useBoardList";
import NewsBoardList from "./components/NewsBoardList";
import FAQBoardList from "./components/FAQBoardList";
import ReviewBoardList from "./components/ReviewBoardList";
import FreeBoardList from "./components/FreeBoardList";
import BoardRightSidebar from "./components/BoardRightSidebar";
import BoardSubNavbar from "./components/BoardSubNavbar";

const Container = styled.div`
  width: var(--layout-width);
  margin: 0 auto;
  background-color: #fcfdfd;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Paperozi", "Noto Sans KR", sans-serif;
`;

// 상단 서브 내비게이션 바
const SubNavbar = styled.div`
  width: 100%;
  height: 48px;
  background-color: #ffffff;
  border-bottom: 1px solid #eef1f2;
  display: flex;
  justify-content: center;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
`;

const SubNavInner = styled.div`
  width: 1400px;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 0 20px;
`;

const SubNavItem = styled.button`
  height: 100%;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: ${(props) => (props.active ? "700" : "500")};
  color: ${(props) => (props.active ? "var(--color-main)" : "#555555")};
  position: relative;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-main);
  }

  ${(props) =>
    props.active &&
    `
    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background-color: var(--color-main);
      border-radius: 3px 3px 0 0;
    }
  `}
`;

// 메인 2단 레이아웃 콘텐츠 영역
const LayoutWrapper = styled.div`
  width: 1400px;
  margin: 40px auto 80px auto;
  display: flex;
  gap: 30px;
  padding: 0 20px;
  align-items: flex-start;
`;

// [중앙 1단] 게시판 본체 영역
const CenterColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

// 타이틀 섹션 (게시판 이름 + 글쓰기 버튼)
const BoardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 12px;
  border-bottom: 2px solid var(--color-dark);
  padding-bottom: 20px;
`;

const BoardTitleInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const BoardTitle = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: var(--color-dark);
  margin: 0;
`;

const BoardSubtitle = styled.p`
  font-size: 14px;
  color: var(--text-sub);
  margin: 0;
`;

const WriteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 20px;
  background-color: var(--color-main);
  color: #ffffff;
  border: none;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 4px 10px rgba(0, 169, 123, 0.15);
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--color-main-dark);
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(0, 169, 123, 0.25);
  }

  svg {
    width: 14px;
    height: 14px;
    fill: currentColor;
  }
`;

// 필터바 (최신순 / 인기순 / 댓글순 / 카테고리 드롭다운)
const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  border-bottom: 1px solid #eef1f2;
  margin-bottom: 10px;
`;

const TextFilters = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const TextFilterItem = styled.button`
  background: none;
  border: none;
  font-size: 13px;
  font-weight: ${(props) => (props.active ? "700" : "400")};
  color: ${(props) => (props.active ? "var(--color-main)" : "#888888")};
  cursor: pointer;
  transition: color 0.15s ease;

  &:hover {
    color: var(--color-main);
  }
`;

const FilterSeparator = styled.span`
  color: #dee2e6;
  font-size: 11px;
`;

// 서브카테고리 드롭다운 셀렉터
const CategoryDropdownWrapper = styled.div`
  position: relative;
`;

const CategoryDropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 500;
  color: #555555;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f1f3f5;
  }

  svg {
    width: 12px;
    height: 12px;
    transition: transform 0.2s ease;
    transform: ${(props) => (props.open ? "rotate(180deg)" : "rotate(0)")};
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 6px;
  background-color: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  width: 100px;
  z-index: 10;
  overflow: hidden;
  animation: fadeIn 0.15s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 10px 14px;
  background: none;
  border: none;
  font-size: 13px;
  text-align: center;
  color: ${(props) => (props.active ? "var(--color-main)" : "#555555")};
  font-weight: ${(props) => (props.active ? "700" : "400")};
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover {
    background-color: #f8f9fa;
  }
`;

// 하단 페이지네이션
const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 40px;
  margin-bottom: 30px;
`;

const PageArrowButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: var(--color-main);
    color: var(--color-main);
    background-color: #fafbfc;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  svg {
    width: 12px;
    height: 12px;
    fill: currentColor;
  }
`;

const PageNumberButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid
    ${(props) => (props.active ? "var(--color-main)" : "#dee2e6")};
  background-color: ${(props) =>
    props.active ? "var(--color-main)" : "#ffffff"};
  color: ${(props) => (props.active ? "#ffffff" : "#555555")};
  font-weight: ${(props) => (props.active ? "700" : "500")};
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--color-main);
    color: ${(props) => (props.active ? "#ffffff" : "var(--color-main)")};
    background-color: ${(props) =>
      props.active ? "var(--color-main)" : "#fafbfc"};
  }
`;

// 하단 검색 영역
const SearchContainer = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const SearchTypeToggleGroup = styled.div`
  display: flex;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  overflow: hidden;
  background-color: #ffffff;
  height: 36px;
`;

const SearchTypeButton = styled.button`
  padding: 0 16px;
  height: 100%;
  font-size: 13px;
  font-weight: ${(props) => (props.active ? "700" : "500")};
  background-color: ${(props) => (props.active ? "#ecfdf6" : "#ffffff")};
  color: ${(props) => (props.active ? "var(--color-main)" : "#555555")};
  border: none;
  border-right: 1px solid #dee2e6;
  cursor: pointer;
  transition: all 0.15s;

  &:last-child {
    border-right: none;
  }

  &:hover {
    background-color: #f8f9fa;
  }
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 420px;
  height: 36px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background-color: #ffffff;
  overflow: hidden;
  padding-right: 2px;
`;

const SearchInputField = styled.input`
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  padding: 0 14px;
  font-size: 13px;

  &::placeholder {
    color: var(--text-soft);
  }
`;

const SearchSubmitButton = styled.button`
  width: 50px;
  height: 32px;
  background-color: var(--color-main);
  border-radius: 4px;
  border: none;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--color-main-dark);
  }

  svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }
`;

const SvgPencil = () => (
  <svg viewBox="0 0 24 24">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
);

const SvgChevronDown = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const SvgChevronLeft = () => (
  <svg viewBox="0 0 24 24">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
  </svg>
);

const SvgChevronRight = () => (
  <svg viewBox="0 0 24 24">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
  </svg>
);

const SvgSearch = () => (
  <svg viewBox="0 0 24 24">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

export default function BoardListPage() {
  const navigate = useNavigate();

  // 카테고리별 메타 정보
  const boardMeta = {
    FREE: {
      title: "자유게시판",
      subtitle: "반려동물에 대한 자유로운 이야기와 정보를 나눠보세요.",
      subCategories: ["ALL", "TALK", "INFORMATION", "JOKE"],
      subCategoryLabels: {
        ALL: "전체",
        TALK: "잡담",
        INFORMATION: "정보",
        JOKE: "유머",
      },
    },
    PRODUCT_REVIEW: {
      title: "상품후기게시판",
      subtitle: "직접 사용한 용품 및 사료에 대한 솔직한 목소리입니다.",
      subCategories: ["ALL"],
      subCategoryLabels: { ALL: "전체" },
    },
    FAC_REVIEW: {
      title: "시설후기게시판",
      subtitle:
        "반려동물과 함께 방문한 병원, 카페, 펜션 등의 생생한 후기를 확인하세요.",
      subCategories: ["ALL"],
      subCategoryLabels: { ALL: "전체" },
    },
    FAQ: {
      title: "FAQ게시판",
      subtitle: "자주 묻는 질문 게시판",
      subCategories: ["ALL"],
      subCategoryLabels: { ALL: "전체" },
    },
    NEWS: {
      title: "뉴스게시판",
      subtitle: "동물뉴스들을 한눈에 확인하세요~!",
      subCategories: ["ALL"],
      subCategoryLabels: { ALL: "전체" },
    },
  };

  const [activeTab, setActiveTab] = useState("FREE");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchType, setSearchType] = useState("title");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [subCategory, setSubCategory] = useState("ALL");
  const [activeSort, setActiveSort] = useState("latest");

  const {
    asyncFetchBoardList,
    list,
    currentPage,
    setCurrentPage,
    totalPages,
    isLoading,
  } = useBoardList();

  const buildSearchCondition = (
    keyword = searchKeyword,
    type = searchType,
    sub = subCategory,
  ) => {
    const condition = {
      boardSubCategory: sub && sub !== "ALL" ? sub : null,
    };

    if (keyword.trim()) {
      if (type === "title") {
        condition.title = keyword.trim();
      } else if (type === "content") {
        condition.content = keyword.trim();
      } else if (type === "title_content") {
        condition.title = keyword.trim();
        condition.content = keyword.trim();
      }
    }
    return condition;
  };

  useEffect(() => {
    const condition = buildSearchCondition();
    asyncFetchBoardList(activeTab, currentPage, condition);
  }, [currentPage, activeTab]);

  // 카테고리 탭 스위칭 핸들러
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setSubCategory("ALL");
    setSearchKeyword("");
    setCurrentPage(0);
  };

  // 말머리 서브 카테고리 선택 핸들러
  const handleSubCategorySelect = (subKey) => {
    setSubCategory(subKey);
    setDropdownOpen(false);
    setCurrentPage(0);
    const condition = buildSearchCondition(searchKeyword, searchType, subKey);
    asyncFetchBoardList(activeTab, 0, condition);
  };

  // 검색 폼 서브밋 핸들러
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    const condition = buildSearchCondition();
    asyncFetchBoardList(activeTab, 0, condition);
  };

  // 최신순/인기순/댓글순 정렬 순서 필터 핸들러
  const handleSortChange = (sortType) => {
    setActiveSort(sortType);
    setCurrentPage(0);
    const condition = buildSearchCondition();
    asyncFetchBoardList(activeTab, 0, condition);
  };

  return (
    <Container>
      {/* 상단 서브 내비게이션 바 */}
      {/* <SubNavbar>
        <SubNavInner>
          <SubNavItem
            active={activeTab === "FREE"}
            onClick={() => handleTabChange("FREE")}
          >
            자유게시판
          </SubNavItem>
          <SubNavItem
            active={activeTab === "PRODUCT_REVIEW"}
            onClick={() => handleTabChange("PRODUCT_REVIEW")}
          >
            상품후기게시판
          </SubNavItem>
          <SubNavItem
            active={activeTab === "FAC_REVIEW"}
            onClick={() => handleTabChange("FAC_REVIEW")}
          >
            시설후기게시판
          </SubNavItem>
          <SubNavItem
            active={activeTab === "FAQ"}
            onClick={() => handleTabChange("FAQ")}
          >
            FAQ게시판
          </SubNavItem>
          <SubNavItem
            active={activeTab === "NEWS"}
            onClick={() => handleTabChange("NEWS")}
          >
            뉴스게시판
          </SubNavItem>
        </SubNavInner>
      </SubNavbar> */}
      <BoardSubNavbar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 2단 레이아웃 콘텐츠 */}
      <LayoutWrapper>
        {/* [중앙 1단] 게시판 본체 */}
        <CenterColumn>
          {/* 게시판 타이틀 및 글쓰기 버튼 */}
          <BoardHeader>
            <BoardTitleInfo>
              <BoardTitle>{boardMeta[activeTab].title}</BoardTitle>
              <BoardSubtitle>{boardMeta[activeTab].subtitle}</BoardSubtitle>
            </BoardTitleInfo>

            {activeTab !== "FAQ" && activeTab !== "NEWS" && (
              <WriteButton
                onClick={() => {
                  const accessToken = localStorage.getItem("accessToken");
                  if (!accessToken) {
                    alert(
                      "로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.",
                    );
                    navigate("/member/login");
                    return;
                  }
                  navigate("/community/write", {
                    state: { defaultCategory: activeTab },
                  });
                }}
              >
                <SvgPencil />
                글쓰기
              </WriteButton>
            )}
          </BoardHeader>

          <FilterBar>
            <TextFilters>
              <TextFilterItem
                active={activeSort === "latest"}
                onClick={() => handleSortChange("latest")}
              >
                최신순
              </TextFilterItem>
              <FilterSeparator>|</FilterSeparator>
              <TextFilterItem
                active={activeSort === "popular"}
                onClick={() => handleSortChange("popular")}
              >
                인기순
              </TextFilterItem>
              <FilterSeparator>|</FilterSeparator>
              <TextFilterItem
                active={activeSort === "comments"}
                onClick={() => handleSortChange("comments")}
              >
                댓글순
              </TextFilterItem>
            </TextFilters>

            {activeTab === "FREE" && (
              <CategoryDropdownWrapper>
                <CategoryDropdownButton
                  open={dropdownOpen}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  카테고리 : {boardMeta.FREE.subCategoryLabels[subCategory]}
                  <SvgChevronDown />
                </CategoryDropdownButton>

                {dropdownOpen && (
                  <DropdownMenu>
                    {boardMeta.FREE.subCategories.map((subKey) => (
                      <DropdownItem
                        key={subKey}
                        active={subCategory === subKey}
                        onClick={() => handleSubCategorySelect(subKey)}
                      >
                        {boardMeta.FREE.subCategoryLabels[subKey]}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                )}
              </CategoryDropdownWrapper>
            )}
          </FilterBar>

          {/* 카테고리별 특화 리스트 컴포넌트 호출 */}
          {activeTab === "FREE" && (
            <FreeBoardList
              list={list}
              isLoading={isLoading}
              onItemClick={(item) =>
                alert("상세 조회 API 개발 시 상세 이동 예정!")
              }
            />
          )}

          {(activeTab === "PRODUCT_REVIEW" || activeTab === "FAC_REVIEW") && (
            <ReviewBoardList
              category={activeTab}
              list={list}
              isLoading={isLoading}
              onItemClick={(item) =>
                alert("상세 조회 API 개발 시 상세 이동 예정!")
              }
            />
          )}

          {activeTab === "FAQ" && (
            <FAQBoardList
              list={list}
              isLoading={isLoading}
              onItemClick={(item) =>
                alert("상세 조회 API 개발 시 상세 이동 예정!")
              }
            />
          )}

          {activeTab === "NEWS" && (
            <NewsBoardList
              list={list}
              isLoading={isLoading}
              onItemClick={(item) =>
                alert("상세 조회 API 개발 시 상세 이동 예정!")
              }
            />
          )}

          {/* 하단 페이지네이션 */}
          {totalPages > 1 && (
            <PaginationWrapper>
              <PageArrowButton
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 0}
              >
                <SvgChevronLeft />
              </PageArrowButton>

              {Array.from({ length: totalPages }).map((_, idx) => (
                <PageNumberButton
                  key={idx}
                  active={currentPage === idx}
                  onClick={() => setCurrentPage(idx)}
                >
                  {idx + 1}
                </PageNumberButton>
              ))}

              <PageArrowButton
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages - 1}
              >
                <SvgChevronRight />
              </PageArrowButton>
            </PaginationWrapper>
          )}

          {/* 검색 바 */}
          <SearchContainer onSubmit={handleSearchSubmit}>
            <SearchTypeToggleGroup>
              <SearchTypeButton
                type="button"
                active={searchType === "title"}
                onClick={() => setSearchType("title")}
              >
                제목
              </SearchTypeButton>
              <SearchTypeButton
                type="button"
                active={searchType === "writer"}
                onClick={() => setSearchType("writer")}
              >
                작성자
              </SearchTypeButton>
              <SearchTypeButton
                type="button"
                active={searchType === "title_content"}
                onClick={() => setSearchType("title_content")}
              >
                제목+내용
              </SearchTypeButton>
            </SearchTypeToggleGroup>

            <SearchInputWrapper>
              <SearchInputField
                type="text"
                placeholder="검색어를 입력하세요"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <SearchSubmitButton type="submit">
                <SvgSearch />
              </SearchSubmitButton>
            </SearchInputWrapper>
          </SearchContainer>
        </CenterColumn>

        {/* [우측 2단] 위젯 사이드바 컴포넌트 */}
        <BoardRightSidebar onNewsTabSelect={handleTabChange} />
      </LayoutWrapper>
    </Container>
  );
}
