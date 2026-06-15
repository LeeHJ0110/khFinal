import api from "../../../../app/api/axios";

export function getMyOrders(page = 0, size = 10) {
  return api.get("/mypage/store/orders", {
    params: {
      page,
      size,
    },
  });
}

export function cancelStoreOrder(orderId) {
  return api.patch(`/store/order/cancel/${orderId}`);
}
