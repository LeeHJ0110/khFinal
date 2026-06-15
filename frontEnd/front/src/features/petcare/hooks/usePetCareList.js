import { useState } from "react";
import { fetchPetCareList } from "../api/petCareApi";

export default function usePetCareList() {
  const [list, setList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // =========================================================
  // 건강진단 신청 목록 조회
  //
  // pno: 현재 페이지 번호
  // petType: ALL / D / C
  // =========================================================
  async function asyncFetchPetCareList(pno = currentPage, petType = "ALL") {
    try {
      setLoading(true);

      const resp = await fetchPetCareList(pno, petType);

      setList(resp.data.content ?? []);
      setTotalPages(resp.data.totalPages ?? 0);
      setTotalElements(resp.data.totalElements ?? 0);
    } catch (err) {
      setList([]);
      setTotalPages(0);
      setTotalElements(0);
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
