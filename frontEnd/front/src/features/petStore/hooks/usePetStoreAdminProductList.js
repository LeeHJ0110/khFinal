import { useEffect, useState } from "react";
import {
  fetchAdminProductList,
  stopStoreProduct,
  resumeStoreProduct,
} from "../api/petStoreApi";

export default function usePetStoreAdminProductList() {
  const [productList, setProductList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setLoading] = useState(false);

  async function loadProductList(page = 0) {
    setLoading(true);

    try {
      const resp = await fetchAdminProductList(page);

      setProductList(resp.data.content);
      setCurrentPage(resp.data.number);
      setTotalPages(resp.data.totalPages);
      setTotalElements(resp.data.totalElements);
    } finally {
      setLoading(false);
    }
  }

  async function handleStop(productId) {
    if (!window.confirm("이 상품을 판매중지하시겠습니까?")) {
      return;
    }

    await stopStoreProduct(productId);
    await loadProductList(currentPage);
  }

  async function handleResume(productId) {
    if (!window.confirm("이 상품을 판매재개하시겠습니까?")) {
      return;
    }

    await resumeStoreProduct(productId);
    await loadProductList(currentPage);
  }

  useEffect(() => {
    loadProductList(0);
  }, []);

  return {
    productList,
    currentPage,
    totalPages,
    totalElements,
    isLoading,
    loadProductList,
    handleStop,
    handleResume,
  };
}
