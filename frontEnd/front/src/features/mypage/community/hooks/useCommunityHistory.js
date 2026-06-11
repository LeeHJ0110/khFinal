import { useEffect, useState } from "react";
import {
  getMyCommentList,
  getMyFacilityReviewList,
  getMyFreeBoardList,
  getMyProductReviewList,
} from "../api/communityHistoryApi";

export default function useCommunityHistory(activeTab) {
  const [list, setList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  async function fetchHistory(page = currentPage) {
    try {
      setLoading(true);

      let response;

      if (activeTab === "FREE") {
        response = await getMyFreeBoardList(page);
      }

      if (activeTab === "PRODUCT_REVIEW") {
        response = await getMyProductReviewList(page);
      }

      if (activeTab === "FAC_REVIEW") {
        response = await getMyFacilityReviewList(page);
      }

      if (activeTab === "COMMENT") {
        response = await getMyCommentList(page);
      }

      setList(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);

      return response.data;
    } catch (err) {
      console.error(err);
      setList([]);
      setTotalPages(0);
      return null;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setCurrentPage(0);
  }, [activeTab]);

  useEffect(() => {
    fetchHistory(currentPage);
  }, [activeTab, currentPage]);

  return {
    list,
    loading,
    currentPage,
    setCurrentPage,
    totalPages,
    fetchHistory,
  };
}
