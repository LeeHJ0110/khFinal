import api from "../../../../app/api/axios";

export function getPointSummary() {
  return api.get("/mypage/point/summary");
}

export function getPointHistory(page = 0, size = 10) {
  return api.get("/mypage/point/history", {
    params: {
      page,
      size,
    },
  });
}
