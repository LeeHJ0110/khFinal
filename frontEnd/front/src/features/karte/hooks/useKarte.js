import { useState } from "react";
import {
  fetchKarteDelete,
  fetchKarteDetail,
  fetchKarteList,
  fetchKarteWrite,
} from "../api/karteApi";

export default function useKarte() {
  const [list, setList] = useState([]);
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
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

  async function asyncFetchKarteDetail(id) {
    setLoading(true);
    const resp = await fetchKarteDetail(id);
    setData(resp.data);

    setLoading(false);
  }

  //등록
  async function asyncFetchKarteWrite(vo) {
    setLoading(true);
    const resp = await fetchKarteWrite(vo);
    if (resp.status == 201) {
      setSuccess(true);
    }
  }

  //삭제
  async function asyncFetchKarteDelete(id) {
    setLoading(true);
    const rest = await fetchKarteDelete(id);
    setLoading(false);
  }

  return {
    asyncFetchKarteList,
    asyncFetchKarteWrite,
    asyncFetchKarteDelete,
    asyncFetchKarteDetail,
    isSuccess,
    data,
    list,
    currentPage,
    setCurrentPage,
    totalPages,
    totalElements,
    isLoading,
  };
}
