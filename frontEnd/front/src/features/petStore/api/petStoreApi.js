import api from "../../../app/api/axios";

// 1. 관리자 : 상품 등록
export async function insertStoreProduct(formData) {
  return await api.post(`/store/product/admin/insert`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// 2. 관리자 : 상품 목록조회
export async function fetchAdminProductList(page = 0) {
  return await api.get(`/store/product/admin?page=${page}`);
}

// 3. 관리자 : 상품 상세조회
export async function fetchAdminProductDetail(productId) {
  return await api.get(`/store/product/admin/${productId}`);
}

// 4. 관리자 : 상품 수정
export async function updateStoreProduct(productId, formData) {
  return await api.put(`/store/product/admin/${productId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// 5. 관리자 : 상품 판매중지
export async function stopStoreProduct(productId) {
  return await api.patch(`/store/product/admin/${productId}/stop`);
}

// 6. 관리자 : 상품 판매재개
export async function resumeStoreProduct(productId) {
  return await api.patch(`/store/product/admin/${productId}/resume`);
}
