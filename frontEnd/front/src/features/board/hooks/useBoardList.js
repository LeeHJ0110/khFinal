import { useState } from "react";

export default function useBoardList() {
  const [list, setList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  async function asyncFetchBoardList() {
    setLoading(true);

    const resp = await fetchBoardList(currentPage);
    console.log(resp);
    console.log(resp.data);
    console.log(resp.data.content);

    setList(resp.data.content);
    setTotalPages(resp.data.totalPages);
    setTotalElements(resp.data.totalElements);

    setLoading(false);
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
