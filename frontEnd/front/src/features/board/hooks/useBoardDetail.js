import { useEffect, useState } from "react";
import { fetchBoardDetail } from "../api/boardApi";

export const useBoardDetail = (boardId) => {
  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!boardId) return;

    const getDetail = async () => {
      try {
        setIsLoading(true);
        const data = await fetchBoardDetail(boardId);
        setDetail(data);
      } catch (err) {
        console.error("게시글 상세 조회 실패:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    getDetail();
  }, [boardId]);

  return { detail, isLoading, error };
};
