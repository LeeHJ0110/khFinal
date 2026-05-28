import { useState } from "react";
import { fetchBoardList } from "../api/boardApi";

export default function useBoardList(initialCategory = "FREE") {
  const [list, setList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [category, setCategory] = useState(initialCategory);

  // 검색 조건 상태
  const [searchType, setSearchType] = useState("title"); // title, writer, title_content
  const [searchKeyword, setSearchKeyword] = useState("");
  const [subCategory, setSubCategory] = useState(""); // 전체, 잡담, 정보, 유머 등

  async function asyncFetchBoardList(page = 0, activeCategory = category, currentSubCategory = subCategory, currentKeyword = searchKeyword, currentSearchType = searchType) {
    setLoading(true);

    // 백엔드 BoardSearchCondition 스펙에 맞춰 매핑
    const condition = {
      boardSubCategory: currentSubCategory && currentSubCategory !== "ALL" ? currentSubCategory : null,
    };

    if (currentKeyword.trim()) {
      if (currentSearchType === "title") {
        condition.title = currentKeyword.trim();
      } else if (currentSearchType === "content") {
        condition.content = currentKeyword.trim();
      } else if (currentSearchType === "title_content") {
        condition.title = currentKeyword.trim();
        condition.content = currentKeyword.trim();
      }
    }

    try {
      const resp = await fetchBoardList(activeCategory, page, condition);
      setList(resp.data.content || []);
      setTotalPages(resp.data.totalPages || 0);
      setTotalElements(resp.data.totalElements || 0);
      setCurrentPage(page);
    } catch (err) {
      console.error("Failed to fetch board list:", err);
      setList([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }

  return {
    asyncFetchBoardList,
    list,
    currentPage,
    setCurrentPage,
    totalPages,
    totalElements,
    isLoading,
    category,
    setCategory,
    searchType,
    setSearchType,
    searchKeyword,
    setSearchKeyword,
    subCategory,
    setSubCategory,
  };
}

