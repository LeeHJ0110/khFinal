import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import {
  fetchInsuranceProductList,
  fetchMyPetListForInsurance,
  requestInsurance,
  readySubscriptionPayment,
} from "../../features/petInsurance/api/petInsuranceApi";

function InsuranceProductSection() {
  const [productList, setProductList] = useState([]);
  const [petList, setPetList] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPetId, setSelectedPetId] = useState("");

  const [medicalCertificate, setMedicalCertificate] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  // =========================================================
  // 현재 선택된 반려동물
  // =========================================================
  const selectedPet = useMemo(() => {
    return petList.find((pet) => String(pet.petId) === String(selectedPetId));
  }, [petList, selectedPetId]);

  // =========================================================
  // 선택된 반려동물의 보험 상태
  // =========================================================
  const selectedPetStatus = useMemo(() => {
    return getPetInsuranceStatus(selectedPet);
  }, [selectedPet]);

  // =========================================================
  // 페이지 진입 시 상품 목록 + 반려동물 목록 조회
  // =========================================================
  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      setErrorMessage("");

      const [productResponse, petResponse] = await Promise.all([
        fetchInsuranceProductList(),
        fetchMyPetListForInsurance(),
      ]);

      const productData = productResponse.data;
      const petData = petResponse.data;

      console.log("보험 상품 목록:", productData);
      console.log("보험 신청용 반려동물 목록:", petData);

      if (!Array.isArray(productData)) {
        throw new Error("보험 상품 목록 응답 형식이 올바르지 않습니다.");
      }

      if (!Array.isArray(petData)) {
        throw new Error("반려동물 목록 응답 형식이 올바르지 않습니다.");
      }

      setProductList(productData);
      setPetList(petData);

      // 첫 번째 상품 기본 선택
      if (productData.length > 0) {
        setSelectedProduct(productData[0]);
      }

      // 첫 번째 반려동물 기본 선택
      if (petData.length > 0) {
        setSelectedPetId(String(petData[0].petId));
      }
    } catch (error) {
      console.error("펫 보험 초기 데이터 조회 실패:", error);

      setErrorMessage(
        getErrorMessage(error, "보험 정보를 불러오지 못했습니다."),
      );
    }
  }

  // =========================================================
  // 상품 선택
  // =========================================================
  function handleSelectProduct(product) {
    setSelectedProduct(product);
    setErrorMessage("");
  }

  // =========================================================
  // 가입 신청 모달 열기
  // =========================================================
  function handleOpenModal() {
    setErrorMessage("");

    if (!selectedPetId) {
      setErrorMessage("가입할 반려동물을 선택해 주세요.");
      return;
    }

    if (!selectedProduct) {
      setErrorMessage("보험 상품을 선택해 주세요.");
      return;
    }

    if (!selectedPetStatus.canApply) {
      setErrorMessage(
        "선택한 반려동물은 이미 보험을 신청했거나 가입이 완료된 상태입니다.",
      );
      return;
    }

    setMedicalCertificate(null);
    setIsModalOpen(true);
  }

  // =========================================================
  // 가입 신청 모달 닫기
  // =========================================================
  function handleCloseModal() {
    if (isLoading) {
      return;
    }

    setIsModalOpen(false);
    setMedicalCertificate(null);
    setErrorMessage("");
  }

  // =========================================================
  // 보험 가입 신청
  // 가입 신청 후 카카오페이 결제수단 등록 화면으로 이동
  // =========================================================
  async function handleApplyInsurance() {
    setErrorMessage("");

    if (!selectedPetId) {
      setErrorMessage("가입할 반려동물을 선택해 주세요.");
      return;
    }

    if (!selectedProduct) {
      setErrorMessage("보험 상품을 선택해 주세요.");
      return;
    }

    if (!medicalCertificate) {
      setErrorMessage("진료확인서를 첨부해 주세요.");
      return;
    }

    try {
      setIsLoading(true);

      // 보험 가입 신청
      const applicationResponse = await requestInsurance({
        petId: Number(selectedPetId),
        productId: selectedProduct.productId,
        medicalCertificate,
      });

      console.log("보험 가입 신청 응답:", applicationResponse.data);

      const applicationId = applicationResponse.data?.applicationId;

      if (!applicationId) {
        throw new Error("보험 가입 신청 번호를 확인할 수 없습니다.");
      }

      // 카카오페이 정기결제 수단 등록 준비
      const paymentReadyResponse =
        await readySubscriptionPayment(applicationId);

      console.log("카카오페이 등록 준비 응답:", paymentReadyResponse.data);

      const paymentReadyData = paymentReadyResponse.data;

      const redirectUrl =
        paymentReadyData?.nextRedirectPcUrl ||
        paymentReadyData?.next_redirect_pc_url;

      if (!redirectUrl) {
        throw new Error("카카오페이 결제창 주소를 확인할 수 없습니다.");
      }

      window.location.href = redirectUrl;
    } catch (error) {
      console.error("보험 가입 신청 실패:", error);

      setErrorMessage(getErrorMessage(error, "보험 가입 신청에 실패했습니다."));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ProductSection>
      <SectionHeader>
        <div>
          <SectionTitle>우리 아이에게 맞는 보험을 선택해 보세요</SectionTitle>

          <SectionDescription>
            반려동물을 선택하고 보험 상품을 비교한 뒤 가입을 신청할 수 있습니다.
          </SectionDescription>
        </div>
      </SectionHeader>

      <ControlBar>
        <ControlGroup>
          <ControlLabel htmlFor="pet-select">반려동물 선택</ControlLabel>

          <PetSelect
            id="pet-select"
            value={selectedPetId}
            onChange={(event) => {
              setSelectedPetId(event.target.value);
              setErrorMessage("");
            }}
          >
            <option value="">반려동물을 선택해 주세요</option>

            {petList.map((pet) => (
              <option key={pet.petId} value={pet.petId}>
                {pet.petName}
              </option>
            ))}
          </PetSelect>
        </ControlGroup>

        <StatusGroup>
          <ControlLabel>현재 보험 상태</ControlLabel>

          <StatusBadge $status={selectedPetStatus.status}>
            {selectedPetStatus.label}
          </StatusBadge>
        </StatusGroup>

        <TopApplyButton
          type="button"
          onClick={handleOpenModal}
          disabled={
            !selectedPetId || !selectedProduct || !selectedPetStatus.canApply
          }
        >
          가입 신청하기
        </TopApplyButton>
      </ControlBar>

      {errorMessage && !isModalOpen && (
        <ErrorMessage>{errorMessage}</ErrorMessage>
      )}

      <ProductGrid>
        {productList.map((product, index) => {
          const isSelected = selectedProduct?.productId === product.productId;

          return (
            <ProductCard
              key={product.productId}
              type="button"
              $isSelected={isSelected}
              $isPopular={index === 1}
              onClick={() => handleSelectProduct(product)}
            >
              {index === 1 && <PopularBadge>가장 인기 있는 상품</PopularBadge>}

              {isSelected && <SelectedBadge>선택됨</SelectedBadge>}

              <ProductName>{product.productName}</ProductName>

              <ProductPrice>
                {formatPrice(product.productMonthly)}

                <PriceUnit>원 / 월</PriceUnit>
              </ProductPrice>

              <Divider />

              <ProductContent>{product.productContent}</ProductContent>
            </ProductCard>
          );
        })}
      </ProductGrid>

      {isModalOpen && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalBox onClick={(event) => event.stopPropagation()}>
            <ModalHeader>
              <div>
                <ModalTitle>펫 보험 가입 신청</ModalTitle>

                <ModalDescription>
                  선택한 반려동물과 보험 상품을 확인하고 진료확인서를 첨부해
                  주세요.
                </ModalDescription>
              </div>

              <CloseButton type="button" onClick={handleCloseModal}>
                ×
              </CloseButton>
            </ModalHeader>

            <SelectedInfoBox>
              <SelectedInfoRow>
                <SelectedInfoLabel>반려동물</SelectedInfoLabel>

                <SelectedInfoValue>
                  {selectedPet?.petName || "-"}
                </SelectedInfoValue>
              </SelectedInfoRow>

              <SelectedInfoRow>
                <SelectedInfoLabel>보험 상태</SelectedInfoLabel>

                <SelectedInfoValue>{selectedPetStatus.label}</SelectedInfoValue>
              </SelectedInfoRow>

              <SelectedInfoRow>
                <SelectedInfoLabel>선택 상품</SelectedInfoLabel>

                <SelectedInfoValue>
                  {selectedProduct?.productName || "-"}
                </SelectedInfoValue>
              </SelectedInfoRow>

              <SelectedInfoRow>
                <SelectedInfoLabel>월 보험료</SelectedInfoLabel>

                <SelectedInfoValue>
                  {formatPrice(selectedProduct?.productMonthly)}원
                </SelectedInfoValue>
              </SelectedInfoRow>
            </SelectedInfoBox>

            <InputGroup>
              <Label htmlFor="medical-certificate">진료확인서 첨부</Label>

              <FileInput
                id="medical-certificate"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(event) =>
                  setMedicalCertificate(event.target.files?.[0] || null)
                }
              />

              <HelperText>PDF 또는 이미지 파일을 첨부해 주세요.</HelperText>
            </InputGroup>

            {errorMessage && (
              <ModalErrorMessage>{errorMessage}</ModalErrorMessage>
            )}

            <ModalButtonGroup>
              <CancelButton
                type="button"
                onClick={handleCloseModal}
                disabled={isLoading}
              >
                닫기
              </CancelButton>

              <SubmitButton
                type="button"
                onClick={handleApplyInsurance}
                disabled={isLoading}
              >
                {isLoading ? "처리 중..." : "가입 신청하기"}
              </SubmitButton>
            </ModalButtonGroup>
          </ModalBox>
        </ModalOverlay>
      )}
    </ProductSection>
  );
}

export default InsuranceProductSection;

// =========================================================
// 반려동물 보험 상태 표시
// =========================================================
function getPetInsuranceStatus(pet) {
  if (!pet) {
    return {
      status: "EMPTY",
      label: "반려동물을 선택해 주세요",
      canApply: false,
    };
  }

  // 백엔드 DTO에 approveStatus가 추가된 경우
  if (pet.approveStatus === "WAITING") {
    return {
      status: "WAITING",
      label: "심사 대기",
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

  if (pet.approveStatus === "REJECTED") {
    return {
      status: "AVAILABLE",
      label: "가입 가능",
      canApply: true,
    };
  }

  // 현재 백엔드가 insuranceInProgress boolean만 반환하는 경우
  if (pet.insuranceInProgress) {
    return {
      status: "IN_PROGRESS",
      label: "신청 또는 가입 중",
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
// 유틸 함수
// =========================================================
function getErrorMessage(error, defaultMessage) {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    defaultMessage
  );
}

function formatPrice(price) {
  return Number(price || 0).toLocaleString("ko-KR");
}

// =========================================================
// styled-components
// =========================================================
const ProductSection = styled.section`
  width: 100%;
`;

const SectionHeader = styled.div`
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  margin: 0;

  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.7px;
  color: var(--color-black);
`;

const SectionDescription = styled.p`
  margin: 7px 0 0;

  font-size: 14px;
  color: var(--color-font2);
`;

const ControlBar = styled.div`
  display: grid;
  grid-template-columns:
    minmax(220px, 1fr)
    minmax(150px, auto)
    150px;

  gap: 16px;

  align-items: end;

  margin-bottom: 22px;
  padding: 16px 18px;

  border: 1px solid #e6e6e6;
  border-radius: 12px;

  background: var(--color-white);
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StatusGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ControlLabel = styled.label`
  font-size: 13px;
  font-weight: 700;
  color: var(--color-font1);
`;

const PetSelect = styled.select`
  width: 100%;
  height: 42px;

  padding: 0 12px;

  border: 1px solid #dddddd;
  border-radius: 8px;

  background: var(--color-white);

  font-size: 13px;
  color: var(--color-font1);

  outline: none;

  &:focus {
    border-color: var(--color-primary);
  }
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  min-width: 150px;
  height: 42px;

  padding: 0 14px;

  border-radius: 8px;

  background: ${({ $status }) => {
    if ($status === "AVAILABLE") {
      return "#effbf8";
    }

    if ($status === "WAITING") {
      return "#fff8e8";
    }

    if ($status === "APPROVED") {
      return "#eaf3ff";
    }

    return "#f5f5f5";
  }};

  font-size: 13px;
  font-weight: 700;

  color: ${({ $status }) => {
    if ($status === "AVAILABLE") {
      return "var(--color-primary)";
    }

    if ($status === "WAITING") {
      return "#c98500";
    }

    if ($status === "APPROVED") {
      return "#2b70c9";
    }

    return "#777777";
  }};
`;

const TopApplyButton = styled.button`
  height: 42px;

  border: none;
  border-radius: 8px;

  background: var(--color-primary);

  font-size: 13px;
  font-weight: 700;
  color: var(--color-white);

  cursor: pointer;

  &:hover {
    opacity: 0.86;
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const ErrorMessage = styled.p`
  margin: 0 0 14px;

  font-size: 13px;
  color: #e74c3c;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  gap: 18px;
`;

const ProductCard = styled.button`
  position: relative;

  display: flex;
  flex-direction: column;

  min-height: 320px;
  padding: 24px 22px 20px;

  border: 2px solid
    ${({ $isSelected }) => ($isSelected ? "var(--color-primary)" : "#e4e4e4")};

  border-radius: 14px;

  background: ${({ $isSelected }) =>
    $isSelected
      ? "color-mix(in srgb, var(--color-bg-soft) 30%, var(--color-white))"
      : "var(--color-white)"};

  text-align: left;

  cursor: pointer;

  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;

  &:hover {
    transform: translateY(-4px);

    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  }
`;

const PopularBadge = styled.span`
  position: absolute;
  top: -11px;
  left: 18px;

  padding: 5px 10px;

  border-radius: 20px;

  background: var(--color-primary);

  font-size: 10px;
  font-weight: 700;
  color: var(--color-white);
`;

const SelectedBadge = styled.span`
  position: absolute;
  top: 14px;
  right: 14px;

  padding: 5px 9px;

  border-radius: 20px;

  background: var(--color-primary);

  font-size: 10px;
  font-weight: 700;
  color: var(--color-white);
`;

const ProductName = styled.h3`
  margin: 0;

  font-size: 18px;
  font-weight: 800;
  color: var(--color-black);
`;

const ProductPrice = styled.p`
  margin: 13px 0 0;

  font-size: 27px;
  font-weight: 800;
  color: var(--color-primary);
`;

const PriceUnit = styled.span`
  margin-left: 4px;

  font-size: 12px;
  font-weight: 600;
  color: var(--color-font2);
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;

  margin: 17px 0;

  background: #eeeeee;
`;

const ProductContent = styled.p`
  flex: 1;

  margin: 0;

  font-size: 13px;
  line-height: 1.75;
  color: var(--color-font2);
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(0, 0, 0, 0.42);
`;

const ModalBox = styled.div`
  width: min(480px, 100%);
  padding: 24px;

  border-radius: 16px;

  background: var(--color-white);

  box-shadow: 0 18px 46px rgba(0, 0, 0, 0.18);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const ModalTitle = styled.h2`
  margin: 0;

  font-size: 20px;
  font-weight: 800;
  color: var(--color-black);
`;

const ModalDescription = styled.p`
  margin: 8px 0 0;

  font-size: 12px;
  line-height: 1.6;
  color: var(--color-font2);
`;

const CloseButton = styled.button`
  border: none;

  background: transparent;

  font-size: 27px;
  line-height: 1;
  color: #888888;

  cursor: pointer;
`;

const SelectedInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  margin-top: 20px;
  padding: 15px;

  border-radius: 10px;

  background: color-mix(in srgb, var(--color-bg-soft) 50%, var(--color-white));
`;

const SelectedInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 18px;
`;

const SelectedInfoLabel = styled.span`
  font-size: 12px;
  color: var(--color-font2);
`;

const SelectedInfoValue = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: var(--color-font1);
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;

  margin-top: 18px;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 700;
  color: var(--color-font1);
`;

const FileInput = styled.input`
  width: 100%;

  font-size: 12px;
  color: var(--color-font2);

  &::file-selector-button {
    margin-right: 10px;
    padding: 8px 11px;

    border: 1px solid #dddddd;
    border-radius: 7px;

    background: var(--color-white);

    font-size: 11px;
    color: var(--color-font2);

    cursor: pointer;
  }
`;

const HelperText = styled.p`
  margin: 0;

  font-size: 11px;
  line-height: 1.5;
  color: #888888;
`;

const ModalErrorMessage = styled.p`
  margin: 14px 0 0;

  font-size: 12px;
  line-height: 1.5;
  color: #e74c3c;
`;

const ModalButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;

  margin-top: 24px;
`;

const CancelButton = styled.button`
  height: 42px;

  border: 1px solid #dddddd;
  border-radius: 8px;

  background: var(--color-white);

  font-size: 12px;
  font-weight: 700;
  color: var(--color-font2);

  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
`;

const SubmitButton = styled.button`
  height: 42px;

  border: none;
  border-radius: 8px;

  background: var(--color-primary);

  font-size: 12px;
  font-weight: 700;
  color: var(--color-white);

  cursor: pointer;

  &:hover {
    opacity: 0.86;
  }

  &:disabled {
    opacity: 0.55;
    cursor: default;
  }
`;
