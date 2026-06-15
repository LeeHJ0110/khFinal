import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { insertReview } from "../api/petStoreReviewApi";

// 포인트 관련
import usePointEffect from "../../point/hooks/usePointEffect";
import { POINT_ACTION_TYPE } from "../../point/utils/pointPolicy";

export default function usePetStoreReviewForm() {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 포인트 관련
  const { startPointAction } = usePointEffect();

  async function submitReview({
    orderItemId,
    reviewTitle,
    reviewContent,
    reviewRating,
    fileList = [],
  }) {
    try {
      setIsSubmitting(true);

      // 포인트 관련: 리뷰 작성 전 포인트 저장
      const pointWatcher = await startPointAction(
        POINT_ACTION_TYPE.REVIEW_WRITE,
      );

      await insertReview({
        orderItemId,
        reviewTitle,
        reviewContent,
        reviewRating,
        fileList,
      });

      // 포인트 관련: 리뷰 작성 후 포인트 비교 + 적립됐을 때만 알림
      await pointWatcher.finish();

      alert("리뷰가 등록되었습니다.");
      navigate("/mypage/orders");
    } catch (error) {
      alert(error?.response?.data?.message ?? "리뷰 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    isSubmitting,
    submitReview,
  };
}
