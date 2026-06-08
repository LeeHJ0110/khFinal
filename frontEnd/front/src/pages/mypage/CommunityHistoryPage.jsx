import { useState } from "react";
import styled from "styled-components";
import MyPageLayout from "./components/MyPageLayout";
import useCommunityHistory from "../../features/mypage/community/hooks/useCommunityHistory";
import FreeBoardList from "../board/components/FreeBoardList";
import ReviewBoardList from "../board/components/ReviewBoardList";
import { useNavigate } from "react-router-dom";

const tabs = [
  { label: "자유게시판", value: "FREE" },
  { label: "상품후기게시판", value: "PRODUCT_REVIEW" },
  { label: "시설후기", value: "FAC_REVIEW" },
  { label: "댓글", value: "COMMENT" },
];

export default function CommunityHistoryPage() {
  const [activeTab, setActiveTab] = useState("FREE");
  const navigate = useNavigate();
  const { list, loading, currentPage, setCurrentPage, totalPages } =
    useCommunityHistory(activeTab);

  function handleTabClick(tabValue) {
    setActiveTab(tabValue);
    setCurrentPage(0);
  }

  function renderList() {
    if (activeTab === "FREE") {
      return (
        <FreeBoardList
          list={list}
          isLoading={loading}
          onItemClick={(item) => {
            navigate(`/community/detail/${item.boardId}`);
          }}
        />
      );
    }

    if (activeTab === "PRODUCT_REVIEW") {
      return (
        <ReviewBoardList
          category="PRODUCT_REVIEW"
          list={list}
          isLoading={loading}
          onItemClick={(item) => {
            navigate(`/community/detail/${item.boardId}`);
          }}
        />
      );
    }

    if (activeTab === "FAC_REVIEW") {
      return (
        <ReviewBoardList
          category="FAC_REVIEW"
          list={list}
          isLoading={loading}
          onItemClick={(item) => {
            navigate(`/community/detail/${item.boardId}`);
          }}
        />
      );
    }

    return (
      <FreeBoardList
        list={list}
        isLoading={loading}
        onItemClick={(item) => {
          navigate(`/community/detail/${item.boardId}`);
        }}
      />
    );
  }

  return (
    <MyPageLayout>
      <Title>커뮤니티 이력</Title>

      <HistoryBox>
        <TabList>
          {tabs.map((tab) => (
            <TabButton
              key={tab.value}
              type="button"
              $active={activeTab === tab.value}
              onClick={() => handleTabClick(tab.value)}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabList>

        <ListArea>{renderList()}</ListArea>
      </HistoryBox>

      {totalPages > 1 && (
        <Pagination>
          <ArrowBtn
            type="button"
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 0}
          >
            {"<"}
          </ArrowBtn>

          {Array.from({ length: totalPages }).map((_, idx) => (
            <PageBtn
              key={idx}
              type="button"
              $active={currentPage === idx}
              onClick={() => setCurrentPage(idx)}
            >
              {idx + 1}
            </PageBtn>
          ))}

          <ArrowBtn
            type="button"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages - 1}
          >
            {">"}
          </ArrowBtn>
        </Pagination>
      )}
    </MyPageLayout>
  );
}

const Title = styled.h1`
  font-size: 32px;
  color: #00a982;
  margin-bottom: 22px;
`;

const HistoryBox = styled.section`
  width: 100%;
  max-width: 900px;
  background: white;
  border: 2px solid #00a3ff;
  padding: 18px 24px 24px;
`;

const TabList = styled.div`
  display: flex;
  gap: 28px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
`;

const TabButton = styled.button`
  border: none;
  background: none;
  padding: 0 0 12px;
  font-size: 16px;
  font-weight: ${({ $active }) => ($active ? 800 : 500)};
  color: ${({ $active }) => ($active ? "#00a982" : "#333")};
  border-bottom: ${({ $active }) =>
    $active ? "3px solid #00a982" : "3px solid transparent"};
  cursor: pointer;
`;

const ListArea = styled.div`
  min-height: 520px;
`;

const EmptyBox = styled.div`
  height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777;
  font-weight: 700;
`;

const Pagination = styled.div`
  width: 100%;
  max-width: 900px;
  margin-top: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const PageBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid
    ${({ $active }) => ($active ? "var(--color-main)" : "#dee2e6")};
  background-color: ${({ $active }) =>
    $active ? "var(--color-main)" : "#ffffff"};
  color: ${({ $active }) => ($active ? "#ffffff" : "#555555")};
  font-weight: ${({ $active }) => ($active ? "700" : "500")};
  font-size: 13px;
  cursor: pointer;

  &:hover {
    border-color: var(--color-main);
    color: ${({ $active }) => ($active ? "#ffffff" : "var(--color-main)")};
    background-color: ${({ $active }) =>
      $active ? "var(--color-main)" : "#fafbfc"};
  }
`;

const ArrowBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  background-color: #ffffff;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: var(--color-main);
    color: var(--color-main);
    background-color: #fafbfc;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
