import { useCallback, useEffect, useState } from "react";
import { getPointHistory, getPointSummary } from "../api/mypagePointApi";

export default function usePointHistory() {
  const [summary, setSummary] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchAll = useCallback(
    async (page = currentPage) => {
      try {
        setLoading(true);

        const [summaryResp, historyResp] = await Promise.all([
          getPointSummary(),
          getPointHistory(page, 10),
        ]);

        setSummary(summaryResp.data);
        setHistoryList(historyResp.data.content || []);
        setTotalPages(historyResp.data.totalPages || 0);
      } catch (err) {
        console.error(err);
        setSummary(null);
        setHistoryList([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    },
    [currentPage],
  );

  useEffect(() => {
    fetchAll(currentPage);
  }, [currentPage, fetchAll]);

  useEffect(() => {
    function handleFocus() {
      fetchAll(currentPage);
    }

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [currentPage, fetchAll]);

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
