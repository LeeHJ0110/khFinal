import api from "../../../../app/api/axios";

// 배송지 목록 조회
export function getDeliveryAddressList() {
  return api.get("/mypage/delivery");
}

// 배송지 추가
export function createDeliveryAddress(data) {
  return api.post("/mypage/delivery", data);
}

// 배송지 수정
export function updateDeliveryAddress(deliveryAddressId, data) {
  return api.put(`/mypage/delivery/${deliveryAddressId}`, data);
}

// 배송지 삭제
export function deleteDeliveryAddress(deliveryAddressId) {
  return api.delete(`/mypage/delivery/${deliveryAddressId}`);
}

// 대표 배송지 변경
export function changeDefaultDeliveryAddress(deliveryAddressId) {
  return api.put(`/mypage/delivery/${deliveryAddressId}/default`);
}
