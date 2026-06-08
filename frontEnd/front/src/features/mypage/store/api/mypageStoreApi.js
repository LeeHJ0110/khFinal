import api from "../../../../app/api/axios";

export function getMyOrders(page = 0, size = 10) {
  return api.get("/mypage/store/orders", {
    params: {
      page,
      size,
    },
  });
}
