import { useState } from "react";
import { fetchPetCareList } from "../api/petCareApi";

export default function usePetCareList() {
  const [list, setList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  async function asyncFetchPetCareList(pno = currentPage) {
    try {
      setLoading(true);

      const resp = await fetchPetCareList(pno);

      console.log("진단목록 응답:", resp.data);

      setList(resp.data.content ?? []);
      setTotalPages(resp.data.totalPages ?? 0);
      setTotalElements(resp.data.totalElements ?? 0);
    } catch (err) {
      console.error("진단목록 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  }

  return {
    asyncFetchPetCareList,
    list,
    currentPage,
    setCurrentPage,
    totalPages,
    totalElements,
    isLoading,
  };
}
