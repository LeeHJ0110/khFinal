import api from "../../../../app/api/axios";

export async function getHomeSummary() {
  return await api.get("/mypage/home/summary");
}
