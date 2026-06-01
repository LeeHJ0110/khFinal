import { useState } from "react";
import { fetchKarteList } from "../api/karteApi";

export default function useKarteList() {
  const [list, setList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  async function asyncFetchKarteList() {
    setLoading(true);
    const resp = await fetchKarteList(currentPage);
    setList(resp.data.content);

    setTotalPages(resp.data.totalPages);
    setTotalElements(resp.data.totalElements);

    setLoading(false);
  }

  return {
    asyncFetchKarteList,
    list,
    currentPage,
    setCurrentPage,
    totalPages,
    totalElements,
    isLoading,
  };
}
