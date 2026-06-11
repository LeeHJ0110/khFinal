import api from "../../../app/api/axios";

// 1. 사용자 : 장바구니 상품 등록
// productId : 상품 ID
// qty       : 담을 수량
export async function insertCartProduct({ productId, qty = 1 }) {
  return await api.post(`/store/order/cart/insert`, {
    productId,
    qty,
  });
}

// 2. 사용자 : 장바구니 목록 조회
export async function fetchCartList() {
  return await api.get(`/store/order/cart/list`);
}

// 3. 사용자 : 장바구니 상품 삭제
// cartItemId : 장바구니 항목 ID
export async function deleteCartProduct(cartItemId) {
  return await api.delete(`/store/order/cart/delete/${cartItemId}`);
}

// 4. 사용자 : 장바구니 상품 수량 변경
// cartItemId : 장바구니 항목 ID
// qty        : 변경할 수량
export async function updateCartProductQty({ cartItemId, qty }) {
  return await api.patch(`/store/order/cart/update/${cartItemId}`, {
    qty,
  });
}

// 5. 사용자 : 내 배송지 목록 조회
// 마이페이지 배송지 API 재사용
export async function fetchMyDeliveryAddressList() {
  return await api.get(`/mypage/delivery`);
}

// 6. 사용자 : 카카오페이 결제 준비
// 선택한 배송지 기준으로 주문 생성 + 카카오페이 결제 URL 발급
export async function readyStoreKakaoPay({
  deliveryAddressId,
  deliveryRequest = "",
  usedPoint = 0,
}) {
  return await api.post(`/store/order/checkout/ready`, {
    deliveryAddressId,
    deliveryRequest,
    usedPoint,
  });
}
