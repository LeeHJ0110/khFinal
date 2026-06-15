import { useEffect, useState } from "react";
import {
  deleteReview,
  fetchMyReviewList,
  updateReview,
} from "../api/petStoreReviewApi";

export default function usePetStoreReviewList() {
  const [reviewPage, setReviewPage] = useState(null);
  const [reviewList, setReviewList] = useState([]);

  const [page, setPage] = useState(0);
  const [sort, setSort] = useState("latest");

  const [isLoading, setIsLoading] = useState(false);

  async function loadMyReviewList(nextPage = page, nextSort = sort) {
    setIsLoading(true);

    try {
      const response = await fetchMyReviewList({
        page: nextPage,
        sort: nextSort,
      });

      c;

      setReviewPage(response.data);
      setReviewList(response.data?.content ?? []);

      setPage(nextPage);
      setSort(nextSort);
    } catch (error) {
      alert("내 리뷰 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteReview(reviewId) {
    const ok = window.confirm("리뷰를 삭제하시겠습니까?");

    if (!ok) {
      return;
    }

    try {
      await deleteReview(reviewId);
      alert("리뷰가 삭제되었습니다.");

      await loadMyReviewList(page, sort);
    } catch (error) {
      alert("리뷰 삭제에 실패했습니다.");
    }
  }

  async function handleUpdateReview({
    reviewId,
    reviewTitle,
    reviewContent,
    reviewRating,
    fileList = [],
  }) {
    try {
      await updateReview({
        reviewId,
        reviewTitle,
        reviewContent,
        reviewRating,
        fileList,
      });

      alert("리뷰가 수정되었습니다.");

      await loadMyReviewList(page, sort);
    } catch (error) {
      alert("리뷰 수정에 실패했습니다.");
    }
  }

  function handleChangeSort(nextSort) {
    loadMyReviewList(0, nextSort);
  }

  function handleMovePage(nextPage) {
    loadMyReviewList(nextPage, sort);
  }

  useEffect(() => {
    loadMyReviewList(0, "latest");
  }, []);

  return {
    reviewPage,
    reviewList,

    page,
    sort,
    isLoading,

    loadMyReviewList,
    handleChangeSort,
    handleMovePage,

    handleDeleteReview,
    handleUpdateReview,
  };
}
