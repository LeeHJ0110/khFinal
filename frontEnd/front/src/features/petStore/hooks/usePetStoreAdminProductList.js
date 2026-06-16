import { useEffect, useState } from "react";
import {
  fetchAdminProductList,
  stopStoreProduct,
  resumeStoreProduct,
} from "../api/petStoreApi";

const initialSearchCondition = {
  saleYn: "",
  keyword: "",
  targetPetType: "",
  category: "",
  sort: "latest",
};

export default function usePetStoreAdminProductList() {
  const [productList, setProductList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setLoading] = useState(false);

  const [searchCondition, setSearchCondition] = useState(
    initialSearchCondition,
  );

  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    selling: 0,
    stopped: 0,
  });

  async function loadStatusCounts() {
    try {
      const [allResp, sellingResp, stoppedResp] = await Promise.all([
        fetchAdminProductList({ page: 0 }),
        fetchAdminProductList({ page: 0, saleYn: "Y" }),
        fetchAdminProductList({ page: 0, saleYn: "N" }),
      ]);

      setStatusCounts({
        all: allResp.data.totalElements,
        selling: sellingResp.data.totalElements,
        stopped: stoppedResp.data.totalElements,
      });
    } catch (error) {}
  }

  async function loadProductList(page = 0, condition = searchCondition) {
    setLoading(true);

    try {
      const resp = await fetchAdminProductList({
        page,
        saleYn: condition.saleYn,
        keyword: condition.keyword,
        targetPetType: condition.targetPetType,
        category: condition.category,
        sort: condition.sort,
      });

      setProductList(resp.data.content);
      setCurrentPage(resp.data.number);
      setTotalPages(resp.data.totalPages);
      setTotalElements(resp.data.totalElements);
    } catch (error) {
      setProductList([]);
      setCurrentPage(0);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }

  function handleChangeSearchCondition(evt) {
    const { name, value } = evt.target;

    setSearchCondition((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSearch() {
    loadProductList(0, searchCondition);
  }

  function handleClickSaleFilter(nextSaleYn) {
    const nextCondition = {
      ...searchCondition,
      saleYn: nextSaleYn,
    };

    setSearchCondition(nextCondition);
    loadProductList(0, nextCondition);
  }

  function handleResetFilter() {
    setSearchCondition(initialSearchCondition);
    loadProductList(0, initialSearchCondition);
  }

  async function handleStop(productId) {
    if (!window.confirm("이 상품을 판매중지하시겠습니까?")) {
      return;
    }

    await stopStoreProduct(productId);
    await loadProductList(currentPage, searchCondition);
    await loadStatusCounts();
  }

  async function handleResume(productId) {
    if (!window.confirm("이 상품을 판매재개하시겠습니까?")) {
      return;
    }

    await resumeStoreProduct(productId);
    await loadProductList(currentPage, searchCondition);
    await loadStatusCounts();
  }

  useEffect(() => {
    loadProductList(0, initialSearchCondition);
    loadStatusCounts();
  }, []);

  return {
    productList,
    currentPage,
    totalPages,
    totalElements,
    isLoading,

    searchCondition,
    statusCounts,

    handleChangeSearchCondition,
    handleSearch,
    handleClickSaleFilter,
    handleResetFilter,

    loadProductList,
    loadStatusCounts,
    handleStop,
    handleResume,
  };
}
