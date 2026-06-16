import { useState } from "react";
import {
  fetchKarteDelete,
  fetchKarteDetail,
  fetchKarteList,
  fetchKarteWrite,
} from "../api/karteApi";
import { useNavigate } from "react-router-dom";

export default function useKarte() {
  const navigation = useNavigate();
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
    try {
      const resp = await fetchKarteDetail(id);
      setData(resp.data);
    } catch (err) {
      alert(err.response?.data.message);
      navigation("/");
    } finally {
      setLoading(false);
    }
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
