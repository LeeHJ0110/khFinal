// =========================================================
// 보험 상태 표시
// =========================================================
export function getPetInsuranceStatus(pet) {
  if (!pet) {
    return {
      status: "EMPTY",
      label: "반려동물을 선택해 주세요",
      canApply: false,
    };
  }

  if (pet.approveStatus === "WAITING" || pet.approveStatus === "REQUESTED") {
    return {
      status: "WAITING",
      label: "신청 중",
      canApply: false,
    };
  }

  if (pet.approveStatus === "APPROVED") {
    return {
      status: "APPROVED",
      label: "가입 완료",
      canApply: false,
    };
  }

  return {
    status: "AVAILABLE",
    label: "가입 가능",
    canApply: true,
  };
}

// =========================================================
// 상품별 화면 표시 가격
// =========================================================
export function getProductPriceInfo({
  product,
  selectedPet,
  selectedPetAge,
  calculatedPriceMap,
}) {
  const baseMonthlyPrice = Number(product?.productMonthly || 0);

  // 신청 또는 가입 완료 상태라면
  // DB에 저장된 확정 보험료 사용
  if (
    selectedPet?.insuranceProductId &&
    String(selectedPet.insuranceProductId) === String(product?.productId)
  ) {
    const monthlyPrice =
      Number(selectedPet.insuranceProductMonthly) || baseMonthlyPrice;

    return {
      monthlyPrice,
    };
  }

  // 백엔드에서 계산한 보험료가 있으면 사용
  const calculatedPrice = calculatedPriceMap[String(product?.productId)];

  if (calculatedPrice) {
    return {
      monthlyPrice: Number(calculatedPrice.monthlyPrice) || baseMonthlyPrice,
    };
  }

  // 백엔드 응답 전 화면 fallback 계산
  const additionalPrice = calculateAdditionalPriceFromAge(selectedPetAge);

  return {
    monthlyPrice: baseMonthlyPrice + additionalPrice,
  };
}

// =========================================================
// 프론트 fallback용 연령 기준 추가 보험료 계산
//
// 만 0 ~ 2세 : 0원
// 만 3 ~ 4세 : 10,000원
// 만 5 ~ 6세 : 20,000원
// 만 7 ~ 8세 : 30,000원
// 만 9세     : 40,000원
// =========================================================
export function calculateAdditionalPriceFromAge(age) {
  if (age === null || age < 3) {
    return 0;
  }

  return (Math.floor((age - 3) / 2) + 1) * 10000;
}

// =========================================================
// 저장된 생년월일 기준 만 나이 계산
//
// 지원 형식
// - YYYYMMDD
// - YYYY-MM-DD
// =========================================================
export function calculateAgeFromBirthDate(birthDateValue) {
  if (!birthDateValue) {
    return null;
  }

  const value = String(birthDateValue).trim();

  let year;
  let month;
  let day;

  if (/^\d{8}$/.test(value)) {
    year = Number(value.slice(0, 4));
    month = Number(value.slice(4, 6));
    day = Number(value.slice(6, 8));
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const parts = value.split("-");

    year = Number(parts[0]);
    month = Number(parts[1]);
    day = Number(parts[2]);
  } else {
    return null;
  }

  const birthDate = new Date(year, month - 1, day);

  // 잘못된 날짜 방어
  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) {
    return null;
  }

  const today = new Date();

  let age = today.getFullYear() - year;

  const birthdayPassed =
    today.getMonth() > month - 1 ||
    (today.getMonth() === month - 1 && today.getDate() >= day);

  if (!birthdayPassed) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}

// =========================================================
// 에러 메시지 추출
// =========================================================
export function getErrorMessage(error, defaultMessage) {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    defaultMessage
  );
}

// =========================================================
// 금액 포맷팅
// =========================================================
export function formatPrice(price) {
  return Number(price || 0).toLocaleString("ko-KR");
}

// =========================================================
// 보험 상태별 글자 색상
// =========================================================
export function getStatusColor(status) {
  if (status === "AVAILABLE") {
    return "var(--color-main-dark)";
  }

  if (status === "WAITING" || status === "IN_PROGRESS") {
    return "#c98500";
  }

  if (status === "APPROVED") {
    return "#2b70c9";
  }

  if (status === "RESTRICTED") {
    return "#d45a4d";
  }

  return "var(--text-desc)";
}

// =========================================================
// 보험 상태별 배경 색상
// =========================================================
export function getStatusBackground(status) {
  if (status === "AVAILABLE") {
    return "var(--color-bg-light)";
  }

  if (status === "WAITING" || status === "IN_PROGRESS") {
    return "#fff6e4";
  }

  if (status === "APPROVED") {
    return "#eaf2ff";
  }

  if (status === "RESTRICTED") {
    return "#fff3f1";
  }

  return "#f3f3f3";
}
