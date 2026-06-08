import { useEffect, useState } from "react";
import { getMyOrders } from "../api/mypageStoreApi";

export default function useOrderHistory() {
  const [orderList, setOrderList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  async function fetchOrders(page = currentPage) {
    try {
      setLoading(true);

      const response = await getMyOrders(page, 10);

      setOrderList(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);

      return response.data;
    } catch (err) {
      console.error(err);
      setOrderList([]);
      setTotalPages(0);
      return null;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  return {
    orderList,
    loading,
    currentPage,
    setCurrentPage,
    totalPages,
    fetchOrders,
  };
}
