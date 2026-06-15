import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import styled from "styled-components";

import useInsuranceProduct from "../../features/petInsurance/hooks/useInsuranceProduct";

import {
  calculateAgeFromBirthDate,
  formatPrice,
  getPetInsuranceStatus,
  getProductPriceInfo,
  getStatusBackground,
  getStatusColor,
} from "../../features/petInsurance/hooks/petInsuranceUtils";

function InsuranceProductSection() {
  const navigate = useNavigate();

  // =========================================================
  // 화면 전용 상태
  // =========================================================
  const [isPetMenuOpen, setIsPetMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // =========================================================
  // 펫보험 데이터 및 기능
  // =========================================================
  const {
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

    handleApplyInsurance,
    handleCancelInsurance,
  } = useInsuranceProduct();

  // =========================================================
  // 현재 화면에서 상세 내용을 보여 줄 상품
  // =========================================================
  const currentProduct = useMemo(() => {
    if (selectedProduct) {
      return selectedProduct;
    }

    return productList[0] || null;
  }, [selectedProduct, productList]);

  // =========================================================
  // 현재 상세 보기 중인 상품의 가격
  // =========================================================
  const selectedPriceInfo = useMemo(() => {
    if (!currentProduct) {
      return null;
    }

    return getProductPriceInfo({
      product: currentProduct,
      selectedPet,
      selectedPetAge,
      calculatedPriceMap,
    });
  }, [currentProduct, selectedPet, selectedPetAge, calculatedPriceMap]);

  // =========================================================
  // 상품 설명을 화면에서 읽기 쉽게 문장 단위로 분리
  // =========================================================
  const productBenefitList = useMemo(() => {
    if (!currentProduct?.productContent) {
      return [];
    }

    return currentProduct.productContent
      .split(".")
      .map((text) => text.trim())
      .filter(Boolean)
      .slice(0, 4);
  }, [currentProduct]);

  // =========================================================
  // 실제 신청·가입 상품과 현재 상세 보기 상품을 구분
  // =========================================================
  const hasInsuranceApplication = Boolean(selectedPet?.applicationId);

  const appliedProductId = selectedPet?.insuranceProductId;

  const isViewingAppliedProduct = Boolean(
    appliedProductId &&
    currentProduct &&
    String(appliedProductId) === String(currentProduct.productId),
  );

  const summaryProductName = hasInsuranceApplication
    ? selectedPet?.insuranceProductName || "-"
    : currentProduct?.productName || "-";

  const summaryMonthlyPrice = hasInsuranceApplication
    ? selectedPet?.insuranceProductMonthly
    : selectedPriceInfo?.monthlyPrice;

  const currentProductTone = useMemo(() => {
    const index = productList.findIndex(
      (product) => product.productId === currentProduct?.productId,
    );

    return index >= 0 ? index % 3 : 0;
  }, [productList, currentProduct]);

  // =========================================================
  // 모달이 열린 동안 배경 스크롤 차단
  // =========================================================
  useEffect(() => {
    if (!isModalOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isModalOpen]);

  // =========================================================
  // 상품 상세 보기
  //
  // 가입 또는 신청 완료 상태여도 다른 상품은 자유롭게 비교 가능
  // =========================================================
  function handleViewProduct(product) {
    if (!product) {
      return;
    }

    setSelectedProduct(product);
    setErrorMessage("");
  }

  // =========================================================
  // 신규 가입 신청 모달 열기
  // =========================================================
  function handleOpenApplyModal() {
    setErrorMessage("");

    if (!selectedPetId) {
      setErrorMessage("가입할 반려동물을 먼저 선택해 주세요.");
      return;
    }

    if (!selectedPetStatus.canApply) {
      return;
    }

    if (isBirthDateMissing) {
      setErrorMessage(
        "반려동물의 생년월일 정보가 없어 보험을 신청할 수 없습니다.",
      );
      return;
    }

    if (isAgeRestricted) {
      setErrorMessage("만 10세 이상인 반려동물은 보험에 가입할 수 없습니다.");
      return;
    }

    if (!currentProduct) {
      setErrorMessage("보험 상품을 선택해 주세요.");
      return;
    }

    setSelectedProduct(currentProduct);
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
  // 상태에 따른 액션 버튼
  //
  // 가입 가능                  → 가입 신청
  // 결제수단 미등록            → 결제수단 등록하기
  // 신청 중                    → 신청 취소
  // 가입 완료                  → 보험 해지
  // 다른 상품 상세 보기 중     → 비교 중 안내
  // =========================================================
  function renderActionButton() {
    if (!selectedPet) {
      return <DisabledActionBadge>펫을 먼저 선택해 주세요</DisabledActionBadge>;
    }

    if (isAgeRestricted) {
      return <DisabledActionBadge>만 10세 이상 가입 불가</DisabledActionBadge>;
    }

    if (isBirthDateMissing) {
      return <DisabledActionBadge>생년월일 확인 필요</DisabledActionBadge>;
    }

    if (hasInsuranceApplication && !isViewingAppliedProduct) {
      return (
        <CompareOnlyBadge>가입 중인 상품과 비교 중입니다</CompareOnlyBadge>
      );
    }

    if (selectedPetStatus.status === "PAYMENT_REQUIRED") {
      return (
        <PrimaryActionButton
          type="button"
          onClick={handleApplyInsurance}
          disabled={isLoading}
        >
          {isLoading ? "이동 중..." : "결제수단 등록하기"}
        </PrimaryActionButton>
      );
    }

    if (selectedPetStatus.canApply) {
      return (
        <PrimaryActionButton
          type="button"
          onClick={handleOpenApplyModal}
          disabled={isPriceLoading}
        >
          가입 신청
        </PrimaryActionButton>
      );
    }

    if (
      selectedPet.approveStatus === "WAITING" ||
      selectedPet.approveStatus === "REQUESTED"
    ) {
      return (
        <SecondaryActionButton
          type="button"
          onClick={handleCancelInsurance}
          disabled={isCancelling}
        >
          {isCancelling ? "처리 중..." : "신청 취소"}
        </SecondaryActionButton>
      );
    }

    if (selectedPet.approveStatus === "APPROVED") {
      return (
        <SecondaryActionButton
          type="button"
          onClick={handleCancelInsurance}
          disabled={isCancelling}
        >
          {isCancelling ? "처리 중..." : "보험 해지"}
        </SecondaryActionButton>
      );
    }

    return null;
  }

  // =========================================================
  // 로그인하지 않은 경우
  // =========================================================
  if (!isLoggedIn) {
    return (
      <ProductSection>
        <LoginRequiredWrapper>
          <LoginRequiredBox>
            <LoginBadge>LOGIN REQUIRED</LoginBadge>

            <LoginRequiredTitle>
              로그인이 필요한 서비스입니다
            </LoginRequiredTitle>

            <LoginRequiredDescription>
              펫보험 상품 확인과 가입 신청을 위해
              <br />
              로그인 후 이용해 주세요.
            </LoginRequiredDescription>

            <LoginButton
              type="button"
              onClick={() => navigate("/member/login")}
            >
              로그인하기
            </LoginButton>
          </LoginRequiredBox>
        </LoginRequiredWrapper>
      </ProductSection>
    );
  }

  return (
    <ProductSection>
      <SectionHeader>
        <PageSectionTitle>
          우리 아이에게 맞는 보험을 선택해 보세요
        </PageSectionTitle>

        <SectionDescription>
          등록된 반려동물 정보를 기준으로 월 보험료가 자동 계산됩니다.
        </SectionDescription>
      </SectionHeader>

      <MainLayout>
        {/* =====================================================
            상단 펫 정보 요약
        ===================================================== */}
        <PetSummaryCard>
          <PetSummaryContent>
            <SummaryLabelRow>
              <SummaryMiniLabel>가입 대상</SummaryMiniLabel>

              <SummaryStatusBadge
                $status={
                  isAgeRestricted ? "RESTRICTED" : selectedPetStatus.status
                }
              >
                {isAgeRestricted
                  ? "가입 불가"
                  : selectedPet
                    ? selectedPetStatus.label
                    : "펫 선택 필요"}
              </SummaryStatusBadge>
            </SummaryLabelRow>

            <SummaryPetRow>
              <SummaryPetName>
                {selectedPet ? selectedPet.petName : "반려동물을 선택해 주세요"}
              </SummaryPetName>

              {selectedPet && (
                <SummaryPetAge>
                  {selectedPetAge === null
                    ? "생년월일 확인 필요"
                    : `만 ${selectedPetAge}세`}
                </SummaryPetAge>
              )}
            </SummaryPetRow>

            <SummaryInfoRow>
              <SummaryInfoItem>
                <SummaryInfoLabel>
                  {hasInsuranceApplication ? "현재 가입 상품" : "선택 상품"}
                </SummaryInfoLabel>

                <SummaryInfoValue>{summaryProductName}</SummaryInfoValue>
              </SummaryInfoItem>

              <SummaryDivider />

              <SummaryInfoItem>
                <SummaryInfoLabel>
                  {hasInsuranceApplication ? "가입 보험료" : "예상 월 보험료"}
                </SummaryInfoLabel>

                <SummaryPrice>
                  {isAgeRestricted
                    ? "가입 불가"
                    : summaryMonthlyPrice
                      ? `${formatPrice(summaryMonthlyPrice)}원`
                      : "-"}
                </SummaryPrice>
              </SummaryInfoItem>
            </SummaryInfoRow>

            <SummaryGuide>
              신청 후 카카오페이 결제수단 등록이 진행되며, 관리자 승인 시 최초
              보험료가 결제됩니다.
            </SummaryGuide>
          </PetSummaryContent>

          <PetMenuWrapper>
            <PetMenuButton
              type="button"
              onClick={() => setIsPetMenuOpen((previous) => !previous)}
            >
              <span>펫 선택하기</span>
              <MenuArrow $isOpen={isPetMenuOpen}>⌄</MenuArrow>
            </PetMenuButton>

            {isPetMenuOpen && (
              <PetDropdown>
                {petList.length === 0 ? (
                  <EmptyPetMessage>등록된 반려동물이 없습니다.</EmptyPetMessage>
                ) : (
                  petList.map((pet) => {
                    const petStatus = getPetInsuranceStatus(pet);
                    const petAge = calculateAgeFromBirthDate(pet.birthDate);
                    const isPetAgeRestricted = petAge !== null && petAge >= 10;

                    const displayPetStatus = isPetAgeRestricted
                      ? {
                          status: "RESTRICTED",
                          label: "가입 불가",
                        }
                      : petStatus;

                    const isSelected =
                      String(pet.petId) === String(selectedPetId);

                    return (
                      <PetOptionButton
                        key={pet.petId}
                        type="button"
                        $isSelected={isSelected}
                        onClick={() => {
                          setSelectedPetId(String(pet.petId));
                          setErrorMessage("");
                          setIsPetMenuOpen(false);
                        }}
                      >
                        <PetOptionTop>
                          <PetName>{pet.petName}</PetName>
                          {isSelected && <SelectedPetDot />}
                        </PetOptionTop>

                        <PetOptionBottom>
                          <PetAgeText>
                            {petAge === null
                              ? "생년월일 확인 필요"
                              : `만 ${petAge}세`}
                          </PetAgeText>

                          <PetStatusText $status={displayPetStatus.status}>
                            {displayPetStatus.label}
                          </PetStatusText>
                        </PetOptionBottom>
                      </PetOptionButton>
                    );
                  })
                )}
              </PetDropdown>
            )}
          </PetMenuWrapper>
        </PetSummaryCard>

        {/* =====================================================
            상품 선택 탭
        ===================================================== */}
        <ProductTabArea>
          <ProductTabTitle>보험 상품을 선택해 주세요</ProductTabTitle>

          <ProductTabs>
            {productList.map((product, index) => {
              const isViewing = currentProduct?.productId === product.productId;

              const isAppliedProduct = Boolean(
                appliedProductId &&
                String(appliedProductId) === String(product.productId),
              );

              return (
                <ProductTabButton
                  key={product.productId}
                  type="button"
                  $tone={index % 3}
                  $isViewing={isViewing}
                  $isAppliedProduct={isAppliedProduct}
                  onClick={() => handleViewProduct(product)}
                >
                  <ProductTabTop>
                    <ProductTabName>{product.productName}</ProductTabName>

                    {isViewing && (
                      <ViewingCheck $tone={index % 3}>✓</ViewingCheck>
                    )}
                  </ProductTabTop>

                  <ProductTabBottom>
                    {isAppliedProduct ? (
                      <AppliedProductBadge>현재 가입 상품</AppliedProductBadge>
                    ) : isViewing ? (
                      <ViewingProductText $tone={index % 3}>
                        상세 보기 중
                      </ViewingProductText>
                    ) : (
                      <AvailableProductText>상품 보기</AvailableProductText>
                    )}
                  </ProductTabBottom>
                </ProductTabButton>
              );
            })}
          </ProductTabs>
        </ProductTabArea>

        {priceErrorMessage && <ErrorMessage>{priceErrorMessage}</ErrorMessage>}

        {errorMessage && !isModalOpen && (
          <ErrorMessage>{errorMessage}</ErrorMessage>
        )}

        {/* =====================================================
            선택 상품 상세
        ===================================================== */}
        {currentProduct && (
          <ProductDetailCard>
            <ProductDetailTop>
              <ProductMainContent>
                <DetailGuide>
                  {selectedPet
                    ? `${selectedPet.petName}에게 추천하는 보험`
                    : "보험 상품 상세"}
                </DetailGuide>

                <DetailProductName>
                  {currentProduct.productName}
                </DetailProductName>

                <DetailDescription>
                  반려동물 정보를 반영한 맞춤형 펫 보험 상품입니다.
                </DetailDescription>

                <BenefitList>
                  {productBenefitList.length > 0 ? (
                    productBenefitList.map((benefit, index) => (
                      <BenefitItem key={`${benefit}-${index}`}>
                        <BenefitDot $tone={currentProductTone} />
                        <span>{benefit}.</span>
                      </BenefitItem>
                    ))
                  ) : (
                    <BenefitItem>
                      <BenefitDot $tone={currentProductTone} />
                      <span>
                        반려동물의 건강 상태에 맞는 보장 내용을 제공합니다.
                      </span>
                    </BenefitItem>
                  )}
                </BenefitList>
              </ProductMainContent>

              <PricePanel $tone={currentProductTone}>
                <PricePanelLabel>
                  {hasInsuranceApplication && !isViewingAppliedProduct
                    ? "비교용 예상 월 보험료"
                    : "월 보험료"}
                </PricePanelLabel>

                <PricePanelPrice>
                  {isAgeRestricted ? (
                    "가입 불가"
                  ) : isPriceLoading && !selectedPet?.applicationId ? (
                    "계산 중..."
                  ) : selectedPriceInfo ? (
                    <>
                      {formatPrice(selectedPriceInfo.monthlyPrice)}원
                      <PriceUnit>/ 월</PriceUnit>
                    </>
                  ) : (
                    "-"
                  )}
                </PricePanelPrice>

                <PricePanelDescription>
                  반려동물 연령과 선택한 보험 상품을 기준으로 계산된 금액입니다.
                </PricePanelDescription>

                <PricePanelAction>{renderActionButton()}</PricePanelAction>
              </PricePanel>
            </ProductDetailTop>

            <CoverageSection>
              <CoverageTitle>보장 내용 한눈에 보기</CoverageTitle>

              <CoverageTable>
                <CoverageHeader>
                  <CoverageRow>
                    <CoverageHeaderCell>보장 항목</CoverageHeaderCell>
                    <CoverageHeaderCell>안내</CoverageHeaderCell>
                  </CoverageRow>
                </CoverageHeader>

                <CoverageBody>
                  <CoverageRow>
                    <CoverageName>기본 진료비</CoverageName>
                    <CoverageDescription>
                      통원 및 입원 치료비를 기본 보장합니다.
                    </CoverageDescription>
                  </CoverageRow>

                  <CoverageRow>
                    <CoverageName>수술비</CoverageName>
                    <CoverageDescription>
                      수술이 필요한 상황에 대비한 보장을 포함합니다.
                    </CoverageDescription>
                  </CoverageRow>

                  <CoverageRow>
                    <CoverageName>맞춤형 보험료</CoverageName>
                    <CoverageDescription>
                      등록된 반려동물 정보와 상품에 따라 월 보험료가 계산됩니다.
                    </CoverageDescription>
                  </CoverageRow>

                  <CoverageRow>
                    <CoverageName>가입 절차</CoverageName>
                    <CoverageDescription>
                      신청 후 결제수단 등록과 관리자 승인을 거쳐 가입이
                      완료됩니다.
                    </CoverageDescription>
                  </CoverageRow>
                </CoverageBody>
              </CoverageTable>
            </CoverageSection>
          </ProductDetailCard>
        )}
      </MainLayout>

      {/* =====================================================
          보험 가입 신청 모달
      ===================================================== */}
      {isModalOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <ModalOverlay onClick={handleCloseModal}>
            <ModalBox onClick={(event) => event.stopPropagation()}>
              <ModalHeader>
                <div>
                  <FormBadge>보험 가입 신청서</FormBadge>

                  <ModalTitle>펫 보험 가입 신청</ModalTitle>

                  <ModalDescription>
                    신청 정보를 확인하고 진료확인서를 첨부해 주세요. 신청 후
                    카카오페이 결제수단 등록 화면으로 이동합니다.
                  </ModalDescription>
                </div>

                <CloseButton
                  type="button"
                  aria-label="닫기"
                  onClick={handleCloseModal}
                >
                  ×
                </CloseButton>
              </ModalHeader>

              <ModalBody>
                <FormSection>
                  <ModalSectionTitle>신청 정보</ModalSectionTitle>

                  <InfoTable>
                    <InfoRow>
                      <InfoLabel>반려동물</InfoLabel>
                      <InfoValue>{selectedPet?.petName || "-"}</InfoValue>
                    </InfoRow>

                    <InfoRow>
                      <InfoLabel>현재 나이</InfoLabel>
                      <InfoValue>
                        {selectedPetAge === null
                          ? "-"
                          : `만 ${selectedPetAge}세`}
                      </InfoValue>
                    </InfoRow>

                    <InfoRow>
                      <InfoLabel>선택 상품</InfoLabel>
                      <InfoValue>
                        {currentProduct?.productName || "-"}
                      </InfoValue>
                    </InfoRow>

                    <InfoRow>
                      <InfoLabel>월 보험료</InfoLabel>
                      <PriceValue>
                        {selectedPriceInfo
                          ? `${formatPrice(selectedPriceInfo.monthlyPrice)}원`
                          : "-"}
                      </PriceValue>
                    </InfoRow>
                  </InfoTable>
                </FormSection>

                <FormSection>
                  <ModalSectionTitle>
                    진료확인서 첨부 <RequiredMark>*</RequiredMark>
                  </ModalSectionTitle>

                  <UploadCard>
                    <UploadGuide>
                      PDF 또는 JPG, PNG 형식의 진료확인서를 첨부해 주세요.
                    </UploadGuide>

                    <UploadRow>
                      <FileInputLabel htmlFor="medical-certificate">
                        파일 선택
                      </FileInputLabel>

                      <HiddenFileInput
                        id="medical-certificate"
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(event) =>
                          setMedicalCertificate(event.target.files?.[0] || null)
                        }
                      />

                      <SelectedFileName $hasFile={Boolean(medicalCertificate)}>
                        {medicalCertificate
                          ? medicalCertificate.name
                          : "선택된 파일이 없습니다."}
                      </SelectedFileName>
                    </UploadRow>
                  </UploadCard>
                </FormSection>

                {errorMessage && (
                  <ModalErrorMessage>{errorMessage}</ModalErrorMessage>
                )}

                <NoticeBox>
                  <NoticeTitle>신청 전 확인해 주세요</NoticeTitle>

                  <NoticeText>
                    신청 후 카카오페이 결제수단 등록 화면으로 이동합니다.
                    결제수단 등록 후 관리자 심사가 진행되며, 관리자 승인 시
                    표시된 월 보험료가 최초 결제됩니다.
                  </NoticeText>
                </NoticeBox>
              </ModalBody>

              <ModalFooter>
                <ModalCancelButton
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isLoading}
                >
                  닫기
                </ModalCancelButton>

                <SubmitButton
                  type="button"
                  onClick={handleApplyInsurance}
                  disabled={isLoading}
                >
                  {isLoading ? "신청 처리 중..." : "가입 신청하기"}
                </SubmitButton>
              </ModalFooter>
            </ModalBox>
          </ModalOverlay>,
          document.body,
        )}
    </ProductSection>
  );
}

export default InsuranceProductSection;

// =========================================================
// 상품 탭 색상
//
// 0: 민트
// 1: 블루
// 2: 퍼플
// =========================================================
function getProductTabColor(tone) {
  if (tone === 1) {
    return {
      main: "#6f8fb8",
      border: "#ccd8e7",
      light: "#f4f7fb",
      hover: "#eef3f9",
    };
  }

  if (tone === 2) {
    return {
      main: "#c68c72",
      border: "#ead5cb",
      light: "#fcf7f4",
      hover: "#f9f1ed",
    };
  }

  return {
    main: "#5f9f8b",
    border: "#c8dfd8",
    light: "#f3f9f7",
    hover: "#edf6f3",
  };
}

/* =========================================================
   styled-components
========================================================= */

const ProductSection = styled.section`
  width: 100%;
  box-sizing: border-box;
`;

const MainLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const SectionHeader = styled.div`
  margin-bottom: 14px;
`;

const PageSectionTitle = styled.h2`
  margin: 0;
  font-size: 23px;
  font-weight: 900;
  letter-spacing: -0.8px;
  color: var(--text-main);

  @media (max-width: 768px) {
    font-size: 21px;
  }
`;

const SectionDescription = styled.p`
  margin: 6px 0 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-sub);
`;

/* =========================================================
   로그인 필요 화면
========================================================= */

const LoginRequiredWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 460px;
  padding: 34px 22px;
`;

const LoginRequiredBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: min(100%, 660px);
  min-height: 300px;
  padding: 42px 38px;
  border: 1px solid rgba(0, 169, 123, 0.16);
  border-radius: 18px;
  background: linear-gradient(145deg, var(--color-white) 0%, #f8fdfb 100%);
  box-shadow:
    0 14px 30px rgba(0, 169, 123, 0.07),
    0 3px 10px rgba(0, 0, 0, 0.025);
  text-align: center;
  box-sizing: border-box;
`;

const LoginBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  padding: 5px 10px;
  border-radius: 999px;
  background: var(--color-bg-light);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: var(--color-main-dark);
`;

const LoginRequiredTitle = styled.h3`
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: var(--text-main);
`;

const LoginRequiredDescription = styled.p`
  margin: 12px 0 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-desc);
`;

const LoginButton = styled.button`
  height: 40px;
  margin-top: 22px;
  padding: 0 20px;
  border: none;
  border-radius: 8px;
  background: var(--color-main);
  font-size: 13px;
  font-weight: 800;
  color: var(--color-white);
  cursor: pointer;

  &:hover {
    background: var(--color-main-dark);
  }
`;

/* =========================================================
   상단 펫 요약
========================================================= */

const PetSummaryCard = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 18px;
  padding: 18px 20px;
  border: 1px solid #e4ece8;
  border-radius: 16px;
  background: linear-gradient(180deg, #fcfefd 0%, #f6fbf9 100%);

  @media (max-width: 820px) {
    flex-direction: column;
  }
`;

const PetSummaryContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const SummaryLabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SummaryMiniLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #7b8883;
`;

const SummaryStatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 9px;
  border-radius: 999px;
  background: ${({ $status }) => getStatusBackground($status)};
  color: ${({ $status }) => getStatusColor($status)};
  font-size: 11px;
  font-weight: 800;
`;

const SummaryPetRow = styled.div`
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 8px;
`;

const SummaryPetName = styled.h3`
  margin: 0;
  font-size: 25px;
  font-weight: 900;
  letter-spacing: -0.8px;
  color: var(--text-main);
`;

const SummaryPetAge = styled.span`
  padding-bottom: 3px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-sub);
`;

const SummaryInfoRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
`;

const SummaryInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const SummaryInfoLabel = styled.span`
  font-size: 11px;
  color: #7b8883;
`;

const SummaryInfoValue = styled.span`
  font-size: 14px;
  font-weight: 800;
  color: var(--text-main);
`;

const SummaryPrice = styled.span`
  font-size: 19px;
  font-weight: 900;
  color: var(--color-main-dark);
`;

const SummaryDivider = styled.span`
  width: 1px;
  height: 30px;
  background: #dbe6e1;
`;

const SummaryGuide = styled.p`
  margin: 11px 0 0;
  font-size: 11px;
  line-height: 1.55;
  color: var(--text-desc);
`;

/* =========================================================
   펫 선택 드롭다운
========================================================= */

const PetMenuWrapper = styled.div`
  position: relative;
  align-self: flex-start;
  flex-shrink: 0;
`;

const PetMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  min-width: 116px;
  height: 36px;
  padding: 0 13px;
  border: none;
  border-radius: 8px;
  background: var(--color-main);
  font-size: 12px;
  font-weight: 800;
  color: var(--color-white);
  cursor: pointer;

  &:hover {
    background: var(--color-main-dark);
  }
`;

const MenuArrow = styled.span`
  display: inline-block;
  font-size: 15px;
  line-height: 1;
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  transition: transform 0.18s ease;
`;

const PetDropdown = styled.div`
  position: absolute;
  top: calc(100% + 7px);
  right: 0;
  z-index: 30;
  width: 220px;
  max-height: 260px;
  padding: 6px;
  overflow-y: auto;
  border: 1px solid #e2e2e2;
  border-radius: 10px;
  background: var(--color-white);
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.1);
`;

const PetOptionButton = styled.button`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
  padding: 10px 11px;
  border: none;
  border-radius: 7px;
  background: ${({ $isSelected }) =>
    $isSelected ? "var(--color-bg-light)" : "var(--color-white)"};
  text-align: left;
  cursor: pointer;

  &:hover {
    background: var(--color-bg-light);
  }
`;

const PetOptionTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const PetOptionBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const PetName = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: var(--text-main);
`;

const SelectedPetDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-main);
`;

const PetAgeText = styled.span`
  font-size: 11px;
  color: var(--text-desc);
`;

const PetStatusText = styled.span`
  font-size: 11px;
  color: ${({ $status }) => getStatusColor($status)};
`;

const EmptyPetMessage = styled.p`
  margin: 0;
  padding: 12px 10px;
  font-size: 12px;
  color: var(--text-desc);
`;

/* =========================================================
   상품 탭
========================================================= */

const ProductTabArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProductTabTitle = styled.h3`
  margin: 0;
  font-size: 19px;
  font-weight: 900;
  letter-spacing: -0.6px;
  color: var(--text-main);
`;

const ProductTabs = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const ProductTabButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  min-height: 62px;

  padding: 9px 11px;

  border: 1.5px solid
    ${({ $tone, $isViewing, $isAppliedProduct }) => {
      if ($isViewing) {
        return getProductTabColor($tone).main;
      }

      if ($isAppliedProduct) {
        return "#b8d8ce";
      }

      return "#e7ecea";
    }};

  border-radius: 10px;

  background:
    ${({ $tone, $isViewing, $isAppliedProduct }) => {
      if ($isViewing) {
        return getProductTabColor($tone).light;
      }

      if ($isAppliedProduct) {
        return "#f6fbf9";
      }

      return "#ffffff";
    }};

  text-align: left;

  cursor: pointer;

  box-shadow:
    ${({ $tone, $isViewing }) =>
      $isViewing
        ? `0 4px 12px ${getProductTabColor($tone).main}18`
        : "none"};

  transform:
    ${({ $isViewing }) =>
      $isViewing
        ? "translateY(-1px)"
        : "translateY(0)"};

  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;

  &:hover {
    background:
      ${({ $tone }) =>
        getProductTabColor($tone).hover};

    border-color:
      ${({ $tone }) =>
        getProductTabColor($tone).main};

    transform: translateY(-1px);
  }
`;

const ProductTabTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 8px;

  width: 100%;
`;

const ProductTabName = styled.span`
  min-width: 0;

  overflow: hidden;

  font-size: 13px;
  font-weight: 800;

  color: #28332f;

  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ViewingCheck = styled.span`
  flex-shrink: 0;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 18px;
  height: 18px;

  border-radius: 50%;

  background:
    ${({ $tone }) =>
      getProductTabColor($tone).main};

  color: #ffffff;

  font-size: 11px;
  font-weight: 900;
`;

const ProductTabBottom = styled.div`
  display: flex;
  align-items: center;

  min-height: 20px;

  margin-top: 5px;
`;

const AppliedProductBadge = styled.span`
  display: inline-flex;
  align-items: center;

  padding: 3px 7px;

  border-radius: 999px;

  background: #4f8f7d;

  color: #ffffff;

  font-size: 10px;
  font-weight: 800;
`;

const ViewingProductText = styled.span`
  color:
    ${({ $tone }) =>
      getProductTabColor($tone).main};

  font-size: 11px;
  font-weight: 800;
`;

const AvailableProductText = styled.span`
  color: #a1aaa7;

  font-size: 11px;
  font-weight: 700;
`;
/* =========================================================
   선택 상품 상세
========================================================= */

const ProductDetailCard = styled.div`
  overflow: hidden;
  border: 1px solid #edf0ef;
  border-radius: 17px;
  background: var(--color-white);
  box-shadow:
    0 10px 24px rgba(0, 0, 0, 0.035),
    0 2px 7px rgba(0, 0, 0, 0.018);
`;

const ProductDetailTop = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) minmax(240px, 0.75fr);
  gap: 16px;
  padding: 20px;
  background: linear-gradient(180deg, #fffdf9 0%, #ffffff 100%);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ProductMainContent = styled.div`
  min-width: 0;
`;

const DetailGuide = styled.p`
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  color: #7c867f;
`;

const DetailProductName = styled.h3`
  margin: 7px 0 0;
  font-size: 26px;
  font-weight: 900;
  letter-spacing: -0.8px;
  color: var(--text-main);
`;

const DetailDescription = styled.p`
  margin: 7px 0 0;
  font-size: 13px;
  line-height: 1.55;
  color: var(--text-sub);
`;

const BenefitList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
`;

const BenefitItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  line-height: 1.55;
  color: var(--text-main);
  word-break: keep-all;
`;

const BenefitDot = styled.span`
  width: 6px;
  height: 6px;
  margin-top: 7px;
  border-radius: 50%;
  background: ${({ $tone }) => getProductTabColor($tone).main};
  flex-shrink: 0;
`;

/* =========================================================
   가격 박스
========================================================= */

const PricePanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 17px;
  border: 1px solid ${({ $tone }) => getProductTabColor($tone).border};
  border-radius: 15px;
  background: ${({ $tone }) => getProductTabColor($tone).light};
`;

const PricePanelLabel = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #6e756f;
`;

const PricePanelPrice = styled.div`
  margin-top: 7px;
  font-size: 30px;
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -1px;
  color: var(--text-main);
`;

const PriceUnit = styled.span`
  margin-left: 5px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-sub);
`;

const PricePanelDescription = styled.p`
  margin: 9px 0 0;
  font-size: 11px;
  line-height: 1.5;
  color: #6e756f;
`;

const PricePanelAction = styled.div`
  margin-top: 14px;
`;

/* =========================================================
   상태별 버튼
========================================================= */

const PrimaryActionButton = styled.button`
  width: 100%;
  height: 36px;
  padding: 0 13px;
  border: none;
  border-radius: 8px;
  background: var(--color-main);
  color: var(--color-white);
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    background: var(--color-main-dark);
  }

  &:disabled {
    opacity: 0.7;
    cursor: default;
  }
`;

const SecondaryActionButton = styled.button`
  width: 100%;
  height: 36px;
  padding: 0 13px;
  border: 1px solid #e2c7c1;
  border-radius: 8px;
  background: var(--color-white);
  color: #d45a4d;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    background: #fff8f7;
  }

  &:disabled {
    opacity: 0.7;
    cursor: default;
  }
`;

const DisabledActionBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 36px;
  padding: 0 13px;
  border-radius: 8px;
  background: #f0f0f0;
  color: var(--text-desc);
  font-size: 12px;
  font-weight: 800;
  box-sizing: border-box;
`;

const CompareOnlyBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid #e1e5e4;
  border-radius: 8px;
  background: #f7f8f8;
  color: #7f8a87;
  font-size: 11px;
  font-weight: 800;
  text-align: center;
  box-sizing: border-box;
`;

/* =========================================================
   보장 내용 표
========================================================= */

const CoverageSection = styled.div`
  padding: 0 20px 20px;
`;

const CoverageTitle = styled.h4`
  margin: 0 0 10px;
  font-size: 17px;
  font-weight: 900;
  letter-spacing: -0.5px;
  color: var(--text-main);
`;

const CoverageTable = styled.div`
  overflow: hidden;
  border: 1px solid #ecefef;
  border-radius: 13px;
`;

const CoverageHeader = styled.div`
  background: #f7f8fa;
`;

const CoverageBody = styled.div`
  background: var(--color-white);
`;

const CoverageRow = styled.div`
  display: grid;
  grid-template-columns: minmax(140px, 190px) 1fr;

  &:not(:last-child) {
    border-bottom: 1px solid #eeeeee;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const CoverageHeaderCell = styled.div`
  padding: 11px 14px;
  font-size: 12px;
  font-weight: 800;
  color: #67736f;

  &:not(:last-child) {
    border-right: 1px solid #ecefef;
  }
`;

const CoverageName = styled.div`
  padding: 13px 14px;
  background: #fcfdfd;
  font-size: 13px;
  font-weight: 800;
  color: var(--text-main);
`;

const CoverageDescription = styled.div`
  padding: 13px 14px;
  font-size: 13px;
  line-height: 1.55;
  color: var(--text-sub);
`;

const ErrorMessage = styled.p`
  margin: 0;
  font-size: 13px;
  color: #e74c3c;
`;

/* =========================================================
   모달
========================================================= */

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.45);
`;

const ModalBox = styled.div`
  display: flex;
  flex-direction: column;
  width: min(540px, 100%);
  max-height: 86vh;
  overflow: hidden;
  border-radius: 18px;
  background: var(--color-white);
  box-shadow: 0 22px 54px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 20px 16px;
  border-bottom: 1px solid #eeeeee;
`;

const FormBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 9px;
  border-radius: 999px;
  background: var(--color-bg-light);
  font-size: 11px;
  font-weight: 700;
  color: var(--color-main-dark);
`;

const ModalTitle = styled.h2`
  margin: 9px 0 0;
  font-size: 19px;
  font-weight: 800;
  color: var(--text-main);
`;

const ModalDescription = styled.p`
  margin: 6px 0 0;
  font-size: 12px;
  line-height: 1.55;
  color: var(--text-desc);
`;

const CloseButton = styled.button`
  border: none;
  background: transparent;
  font-size: 25px;
  line-height: 1;
  color: var(--text-desc);
  cursor: pointer;
`;

const ModalBody = styled.div`
  overflow-y: auto;
  padding: 18px 20px;
`;

const FormSection = styled.section`
  margin-bottom: 18px;
`;

const ModalSectionTitle = styled.h3`
  margin: 0 0 9px;
  font-size: 13px;
  font-weight: 800;
  color: var(--text-main);
`;

const RequiredMark = styled.span`
  color: #e74c3c;
`;

const InfoTable = styled.div`
  overflow: hidden;
  border: 1px solid #e8eeeb;
  border-radius: 11px;
  background: var(--color-white);
`;

const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 110px 1fr;
  min-height: 40px;
  border-bottom: 1px solid #eeeeee;

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  display: flex;
  align-items: center;
  padding: 0 12px;
  background: #f8fbfa;
  font-size: 12px;
  font-weight: 700;
  color: #71807a;
`;

const InfoValue = styled.span`
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-main);
`;

const PriceValue = styled.span`
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-size: 15px;
  font-weight: 800;
  color: var(--color-main-dark);
`;

const UploadCard = styled.div`
  padding: 13px;
  border: 1px solid #eeeeee;
  border-radius: 10px;
  background: var(--color-white);
`;

const UploadGuide = styled.p`
  margin: 0 0 10px;
  font-size: 12px;
  line-height: 1.55;
  color: #7c867f;
`;

const UploadRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FileInputLabel = styled.label`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  padding: 0 11px;
  border: 1px solid #cfe5dc;
  border-radius: 7px;
  background: #f5fbf8;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-main-dark);
  cursor: pointer;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const SelectedFileName = styled.div`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  padding: 9px 10px;
  border: 1px solid ${({ $hasFile }) => ($hasFile ? "#b9e2d3" : "#e3e3e3")};
  border-radius: 7px;
  background: ${({ $hasFile }) => ($hasFile ? "#f4fbf8" : "#fafafa")};
  font-size: 12px;
  color: ${({ $hasFile }) =>
    $hasFile ? "var(--color-main-dark)" : "var(--text-desc)"};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ModalErrorMessage = styled.p`
  margin: 0 0 12px;
  font-size: 12px;
  line-height: 1.5;
  color: #e74c3c;
`;

const NoticeBox = styled.div`
  padding: 12px 13px;
  border-radius: 10px;
  background: #f7f8fa;
`;

const NoticeTitle = styled.h4`
  margin: 0 0 6px;
  font-size: 12px;
  font-weight: 800;
  color: var(--text-main);
`;

const NoticeText = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 1.55;
  color: var(--text-sub);
`;

const ModalFooter = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 9px;
  padding: 14px 20px 18px;
  border-top: 1px solid #eeeeee;
  background: var(--color-white);
`;

const ModalCancelButton = styled.button`
  height: 42px;
  border: 1px solid #dddddd;
  border-radius: 8px;
  background: var(--color-white);
  font-size: 12px;
  font-weight: 700;
  color: var(--text-sub);
  cursor: pointer;
`;

const SubmitButton = styled.button`
  height: 42px;
  border: none;
  border-radius: 8px;
  background: var(--color-main);
  font-size: 12px;
  font-weight: 800;
  color: var(--color-white);
  cursor: pointer;

  &:hover {
    background: var(--color-main-dark);
  }

  &:disabled {
    background: var(--color-mint);
    cursor: default;
  }
`;
