import { useEffect, useMemo, useState } from "react";

import {
  calculateInsurancePrice,
  cancelInsuranceApplication,
  fetchInsuranceProductList,
  fetchMyPetListForInsurance,
  readySubscriptionPayment,
  requestInsurance,
} from "../api/petInsuranceApi";

import {
  calculateAgeFromBirthDate,
  getErrorMessage,
  getPetInsuranceStatus,
} from "./petInsuranceUtils";

// =========================================================
// 사용자 펫보험 상품 화면 전용 hook
//
// 상품 조회
// 반려동물 조회
// 보험료 계산
// 상품 선택
// 보험 신청
// 카카오페이 결제수단 등록 이동
// 보험 신청 취소 또는 해지
// =========================================================
export default function useInsuranceProduct() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(localStorage.getItem("accessToken"));
  });

  const [productList, setProductList] = useState([]);
  const [petList, setPetList] = useState([]);

  const [selectedPetId, setSelectedPetId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [calculatedPriceMap, setCalculatedPriceMap] = useState({});

  const [medicalCertificate, setMedicalCertificate] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isPriceLoading, setIsPriceLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [priceErrorMessage, setPriceErrorMessage] = useState("");

  // =========================================================
  // 현재 선택한 반려동물
  // =========================================================
  const selectedPet = useMemo(() => {
    return petList.find((pet) => String(pet.petId) === String(selectedPetId));
  }, [petList, selectedPetId]);

  // =========================================================
  // 현재 선택한 반려동물의 만 나이
  // =========================================================
  const selectedPetAge = useMemo(() => {
    return calculateAgeFromBirthDate(selectedPet?.birthDate);
  }, [selectedPet]);

  // =========================================================
  // 현재 선택한 반려동물의 보험 상태
  // =========================================================
  const selectedPetStatus = useMemo(() => {
    return getPetInsuranceStatus(selectedPet);
  }, [selectedPet]);

  // =========================================================
  // 가입 제한 상태
  // =========================================================
  const isAgeRestricted =
    selectedPetAge !== null && selectedPetAge >= 10;

  const isBirthDateMissing =
    Boolean(selectedPet) && selectedPetAge === null;

  // =========================================================
  // 상품 목록 + 내 반려동물 목록 조회
  // =========================================================
  async function loadInitialData() {
    try {
      setErrorMessage("");

      const [productResponse, petResponse] = await Promise.all([
        fetchInsuranceProductList(),
        fetchMyPetListForInsurance(),
      ]);

      const productData = productResponse.data;
      const petData = petResponse.data;

      if (!Array.isArray(productData)) {
        throw new Error("보험 상품 목록 응답 형식이 올바르지 않습니다.");
      }

      if (!Array.isArray(petData)) {
        throw new Error("반려동물 목록 응답 형식이 올바르지 않습니다.");
      }

      setProductList(productData);
      setPetList(petData);

      setSelectedPetId((currentPetId) => {
        const exists = petData.some(
          (pet) => String(pet.petId) === String(currentPetId),
        );

        if (exists) {
          return String(currentPetId);
        }

        if (petData.length > 0) {
          return String(petData[0].petId);
        }

        return "";
      });
    } catch (error) {
      console.error("펫 보험 초기 데이터 조회 실패:", error);

      const status = error.response?.status;

      if (status === 401 || status === 403) {
        localStorage.removeItem("accessToken");

        setIsLoggedIn(false);

        return;
      }

      setErrorMessage(
        getErrorMessage(error, "보험 정보를 불러오지 못했습니다."),
      );
    }
  }

  // =========================================================
  // 로그인한 경우 최초 데이터 조회
  // =========================================================
  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    loadInitialData();
  }, [isLoggedIn]);

  // =========================================================
  // 펫 변경 시 선택 상품 동기화
  //
  // 기존 신청 또는 가입 내역이 있으면:
  // 실제 신청 상품 선택
  //
  // 가입 가능 상태이면:
  // 첫 번째 상품 선택
  // =========================================================
  useEffect(() => {
    if (!selectedPet) {
      setSelectedProduct(null);

      return;
    }

    if (isAgeRestricted) {
      setSelectedProduct(null);

      return;
    }

    if (selectedPet.insuranceProductId) {
      const appliedProduct = productList.find(
        (product) =>
          String(product.productId) ===
          String(selectedPet.insuranceProductId),
      );

      setSelectedProduct(appliedProduct || null);

      return;
    }

    setSelectedProduct(productList[0] || null);
  }, [selectedPet, productList, isAgeRestricted]);

  // =========================================================
  // 펫 변경 시 전체 상품 보험료 자동 계산
  //
  // 신청 또는 가입 내역이 있으면
  // DB에 저장된 확정 보험료 사용
  // =========================================================
  useEffect(() => {
    let isCancelled = false;

    async function loadCalculatedPriceMap() {
      setCalculatedPriceMap({});
      setPriceErrorMessage("");

      if (!selectedPet) {
        return;
      }

      if (selectedPet.applicationId) {
        return;
      }

      if (!selectedPet.birthDate) {
        setPriceErrorMessage(
          "반려동물의 생년월일 정보가 없어 보험료를 계산할 수 없습니다.",
        );

        return;
      }

      if (selectedPetAge === null) {
        setPriceErrorMessage(
          "반려동물의 생년월일 형식을 확인해 주세요.",
        );

        return;
      }

      if (selectedPetAge >= 10) {
        return;
      }

      if (productList.length === 0) {
        return;
      }

      try {
        setIsPriceLoading(true);

        const resultList = await Promise.all(
          productList.map(async (product) => {
            const response = await calculateInsurancePrice({
              productId: product.productId,
              birthDate: selectedPet.birthDate,
            });

            return [String(product.productId), response.data];
          }),
        );

        if (isCancelled) {
          return;
        }

        setCalculatedPriceMap(
          Object.fromEntries(resultList),
        );
      } catch (error) {
        console.error("보험료 자동 계산 실패:", error);

        if (isCancelled) {
          return;
        }

        setCalculatedPriceMap({});

        setPriceErrorMessage(
          getErrorMessage(
            error,
            "반려동물 나이 기준 보험료를 계산하지 못했습니다.",
          ),
        );
      } finally {
        if (!isCancelled) {
          setIsPriceLoading(false);
        }
      }
    }

    loadCalculatedPriceMap();

    return () => {
      isCancelled = true;
    };
  }, [selectedPet, selectedPetAge, productList]);

  // =========================================================
  // 상품 선택
  //
  // 신규 가입 가능한 상태에서만 변경 가능
  // 결제수단 등록 재시도 상태에서는 기존 신청 상품 유지
  // =========================================================
function handleSelectProduct(product) {
  if (!product) {
    return;
  }

  setSelectedProduct(product);
  setErrorMessage("");
}

  // =========================================================
  // 카카오페이 결제수단 등록 화면으로 이동
  // =========================================================
  async function moveToPaymentRegistration(applicationId) {
    if (!applicationId) {
      throw new Error("보험 가입 신청 번호를 확인할 수 없습니다.");
    }

    const paymentReadyResponse =
      await readySubscriptionPayment(applicationId);

    const paymentReadyData =
      paymentReadyResponse.data;

    const redirectUrl =
      paymentReadyData?.nextRedirectPcUrl ||
      paymentReadyData?.next_redirect_pc_url;

    if (!redirectUrl) {
      throw new Error(
        "카카오페이 결제수단 등록 화면 주소를 확인할 수 없습니다.",
      );
    }

    window.location.href = redirectUrl;
  }

  // =========================================================
  // 보험 가입 신청 또는 결제수단 등록 재시도
  //
  // 1. 기존 WAITING 신청 + SID 없음:
  //    신규 신청을 만들지 않고 기존 applicationId로
  //    카카오페이 등록만 다시 요청
  //
  // 2. 신청 내역 없음:
  //    진료확인서 업로드 후 신규 신청 생성
  //    이후 카카오페이 등록 요청
  // =========================================================
  async function handleApplyInsurance() {
    setErrorMessage("");

    if (!selectedPetId) {
      setErrorMessage(
        "가입할 반려동물을 선택해 주세요.",
      );

      return;
    }

    if (
      selectedPet?.paymentRegistrationRequired &&
      selectedPet?.applicationId
    ) {
      try {
        setIsLoading(true);

        await moveToPaymentRegistration(
          selectedPet.applicationId,
        );
      } catch (error) {
        console.error(
          "카카오페이 결제수단 등록 재시도 실패:",
          error,
        );

        setErrorMessage(
          getErrorMessage(
            error,
            "카카오페이 결제수단 등록 화면으로 이동하지 못했습니다.",
          ),
        );
      } finally {
        setIsLoading(false);
      }

      return;
    }

    if (!selectedProduct) {
      setErrorMessage(
        "보험 상품을 선택해 주세요.",
      );

      return;
    }

    if (isBirthDateMissing) {
      setErrorMessage(
        "반려동물의 생년월일 정보가 없어 보험을 신청할 수 없습니다.",
      );

      return;
    }

    if (isAgeRestricted) {
      setErrorMessage(
        "만 10세 이상인 반려동물은 보험에 가입할 수 없습니다.",
      );

      return;
    }

    if (!medicalCertificate) {
      setErrorMessage(
        "진료확인서를 첨부해 주세요.",
      );

      return;
    }

    try {
      setIsLoading(true);

      const applicationResponse =
        await requestInsurance({
          petId: Number(selectedPetId),
          productId: selectedProduct.productId,
          medicalCertificate,
        });

      const applicationId =
        applicationResponse.data?.applicationId;

      if (!applicationId) {
        throw new Error(
          "보험 가입 신청 번호를 확인할 수 없습니다.",
        );
      }

      try {
        await moveToPaymentRegistration(
          applicationId,
        );
      } catch (paymentError) {
        /*
         * 신청 저장은 성공했지만 카카오페이 등록 준비 요청이 실패한 상태
         *
         * 목록을 다시 불러와서
         * paymentRegistrationRequired = true 상태를 화면에 반영
         */
        await loadInitialData();

        throw paymentError;
      }
    } catch (error) {
      console.error(
        "보험 가입 신청 또는 결제수단 등록 실패:",
        error,
      );

      setErrorMessage(
        getErrorMessage(
          error,
          "보험 가입 신청 처리에 실패했습니다.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }

  // =========================================================
  // 보험 신청 취소 또는 가입 완료 보험 해지
  // =========================================================
  async function handleCancelInsurance() {
    if (!selectedPet?.applicationId) {
      setErrorMessage(
        "취소할 보험 신청 정보를 찾을 수 없습니다.",
      );

      return;
    }

    const isApproved =
      selectedPet.approveStatus === "APPROVED";

    const confirmMessage =
      isApproved
        ? `${selectedPet.petName}의 보험을 해지하시겠습니까?\n\n해지 후에도 현재 결제 기간이 끝날 때까지 보험 혜택은 유지됩니다.\n다음 결제일부터 자동 결제가 중단됩니다.`
        : `${selectedPet.petName}의 보험 가입 신청을 취소하시겠습니까?`;

    const isConfirmed =
      window.confirm(
        confirmMessage,
      );

    if (!isConfirmed) {
      return;
    }

    try {
      setIsCancelling(true);
      setErrorMessage("");

      await cancelInsuranceApplication(
        selectedPet.applicationId,
      );

      window.alert(
        isApproved
          ? "보험 해지가 신청되었습니다.\n현재 결제 기간이 끝날 때까지 보험 혜택은 유지됩니다."
          : "보험 가입 신청이 취소되었습니다.",
      );

      await loadInitialData();
    } catch (error) {
      console.error(
        "보험 신청 취소 또는 해지 실패:",
        error,
      );

      setErrorMessage(
        getErrorMessage(
          error,
          "보험 신청 취소 또는 해지 처리에 실패했습니다.",
        ),
      );
    } finally {
      setIsCancelling(false);
    }
  }

  return {
    isLoggedIn,

    productList,
    petList,

    selectedPetId,
    setSelectedPetId,

    selectedPet,
    selectedPetAge,
    selectedPetStatus,

    selectedProduct,
    setSelectedProduct,

    calculatedPriceMap,

    medicalCertificate,
    setMedicalCertificate,

    isAgeRestricted,
    isBirthDateMissing,

    isLoading,
    isCancelling,
    isPriceLoading,

    errorMessage,
    setErrorMessage,

    priceErrorMessage,

    loadInitialData,

    handleSelectProduct,
    handleApplyInsurance,
    handleCancelInsurance,
  };
}