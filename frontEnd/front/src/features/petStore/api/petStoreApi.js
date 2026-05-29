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

//7. 사용자 : 베스트 상품 4개 목록 조회 (공통홈/ 강아지 홈/ 고양이 홈)
export async function fetchBestProductList(targetPetType) {
  const requestParam = targetPetType ? `?targetPetType=${targetPetType}` : "";

  return await api.get(`/store/product/best${requestParam}`);
}

//8. 사용자 : 목록조회
// targetPetType : D(강아지), C(고양이)
// category      : FOOD, SNACK, SUPPLEMENT, TOILET -> StoreProductCategory enum 값
// keyword       : 상품명 검색어
// tagId         : 태그 번호
// tagName       : 태그 이름
// sort          : latest, popular, lowPrice, highPrice
export async function fetchProductList({
  targetPetType,
  category,
  keyword,
  tagId,
  tagName,
  sort = "latest",
} = {}) {
  const params = new URLSearchParams();

  if (targetPetType) {
    params.append("targetPetType", targetPetType);
  }

  if (category) {
    params.append("category", category);
  }

  if (keyword) {
    params.append("keyword", keyword);
  }

  if (tagId) {
    params.append("tagId", tagId);
  }

  if (tagName) {
    params.append("tagName", tagName);
  }

  if (sort) {
    params.append("sort", sort);
  }

  const queryString = params.toString();

  return await api.get(`/store/product${queryString ? `?${queryString}` : ""}`);
}
