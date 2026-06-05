import api from "../../../app/api/axios";

// =========================================================
// 보험 상품 목록 조회
// =========================================================
export async function fetchInsuranceProductList() {
  return api.get("/petinsurance/products");
}

// =========================================================
// 생년월일과 선택 상품 기준 예상 보험료 계산
// =========================================================
export async function calculateInsurancePrice({ productId, birthDate }) {
  return api.post("/petinsurance/calculate", {
    productId,
    birthDate,
  });
}

// =========================================================
// 보험 가입 신청 화면용 내 반려동물 목록 조회
// =========================================================
export async function fetchMyPetListForInsurance() {
  return api.get("/petinsurance/application/pets");
}

// =========================================================
// 보험 가입 신청
// JSON 데이터와 진료확인서를 multipart/form-data로 전송
// =========================================================
export async function requestInsurance({
  petId,
  productId,
  medicalCertificate,
}) {
  const fd = new FormData();

  const data = {
    petId,
    productId,
  };

  console.log("백엔드로 전송할 보험 가입 데이터:", data);

  fd.append("data", JSON.stringify(data));

  fd.append("medicalCertificate", medicalCertificate);

  return api.post("/petinsurance/application", fd);
}

// =========================================================
// 카카오페이 정기결제 수단 등록 준비
// =========================================================
export async function readySubscriptionPayment(applicationId) {
  return api.post(`/petinsurance/payment/ready/${applicationId}`);
}

// =========================================================
// 보험 신청 취소 또는 가입 완료 보험 해지
// =========================================================
export async function cancelInsurance(applicationId) {
  return api.patch(`/petinsurance/application/${applicationId}/cancel`);
}
