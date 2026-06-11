import { useEffect, useState } from "react";
import { getPointHistory, getPointSummary } from "../api/mypagePointApi";

export default function usePointHistory() {
  const [summary, setSummary] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  async function fetchSummary() {
    const response = await getPointSummary();
    setSummary(response.data);
  }

  async function fetchHistory(page = currentPage) {
    const response = await getPointHistory(page, 10);
    setHistoryList(response.data.content || []);
    setTotalPages(response.data.totalPages || 0);
  }

  async function fetchAll() {
    try {
      setLoading(true);
      await Promise.all([fetchSummary(), fetchHistory(currentPage)]);
    } catch (err) {
      console.error(err);
      setSummary(null);
      setHistoryList([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    function handleFocus() {
      fetchAll();
    }

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [currentPage]);

  return {
    summary,
    historyList,
    currentPage,
    setCurrentPage,
    totalPages,
    loading,
    fetchAll,
  };
}
