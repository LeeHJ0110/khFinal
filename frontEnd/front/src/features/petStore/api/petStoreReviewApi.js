import api from "../../../app/api/axios";

// 공통 FormData 생성 함수
function createReviewFormData(data, fileList = []) {
  const formData = new FormData();

  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" }),
  );

  fileList.forEach((file) => {
    formData.append("fileList", file);
  });

  return formData;
}

// 1. 사용자 : 리뷰 작성
export async function insertReview({
  orderItemId,
  reviewTitle,
  reviewContent,
  reviewRating,
  fileList = [],
}) {
  const formData = createReviewFormData(
    {
      orderItemId,
      reviewTitle,
      reviewContent,
      reviewRating,
    },
    fileList,
  );

  return await api.post("/store/review/insert", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// 2. 사용자 : 상품별 리뷰 목록 조회
export async function fetchProductReviewList({
  productId,
  page = 0,
  sort = "latest",
}) {
  return await api.get(`/store/review/product/${productId}`, {
    params: {
      page,
      sort,
    },
  });
}

// 3. 사용자 : 본인 리뷰내역 모아보기
export async function fetchMyReviewList({ page = 0, sort = "latest" } = {}) {
  return await api.get("/store/review/my", {
    params: {
      page,
      sort,
    },
  });
}

// 4. 사용자 : 리뷰 수정
export async function updateReview({
  reviewId,
  reviewTitle,
  reviewContent,
  reviewRating,
  fileList = [],
}) {
  const formData = createReviewFormData(
    {
      reviewTitle,
      reviewContent,
      reviewRating,
    },
    fileList,
  );

  return await api.put(`/store/review/edit/${reviewId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// 5. 리뷰 삭제
export async function deleteReview(reviewId) {
  return await api.delete(`/store/review/${reviewId}`);
}
