import api from "../../../../app/api/axios";

export function getMyFreeBoardList(page = 0, size = 5) {
  return api.get("/mypage/community/free", {
    params: { page, size },
  });
}

export function getMyProductReviewList(page = 0, size = 5) {
  return api.get("/mypage/community/product-review", {
    params: { page, size },
  });
}

export function getMyFacilityReviewList(page = 0, size = 5) {
  return api.get("/mypage/community/facility-review", {
    params: { page, size },
  });
}

export function getMyCommentList(page = 0, size = 5) {
  return api.get("/mypage/community/comment", {
    params: { page, size },
  });
}
