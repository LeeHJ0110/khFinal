import { useState } from "react";
import { fetchBoardList, fetchNaverNewsApi } from "../api/boardApi";

export default function useBoardList() {
  const [list, setList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  async function asyncFetchBoardList(category, page = 0, condition = {}) {
    setLoading(true);
    try {
      let resp;
      if (category === "NEWS") {
        const searchKeyword =
          condition.title || condition.content || "반려동물";
        resp = await fetchNaverNewsApi(page, searchKeyword);
      } else {
        resp = await fetchBoardList(category, page, condition);
      }
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
  };
}
