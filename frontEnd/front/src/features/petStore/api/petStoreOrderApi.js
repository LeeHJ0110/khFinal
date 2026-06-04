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
