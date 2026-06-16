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
  // 상품 상세 JSON 파싱
  //
  // productContent가 JSON이면 실제 보장표/특약/혜택으로 사용하고,
  // 기존 문장형 데이터면 기존처럼 문장 단위 혜택으로 표시
  // =========================================================
  const productContentData = useMemo(() => {
    return parseProductContent(currentProduct?.productContent);
  }, [currentProduct]);

  // =========================================================
  // 상품 설명을 화면에서 읽기 쉽게 문장 단위로 분리
  // =========================================================
  const productBenefitList = useMemo(() => {
    if (productContentData.benefits.length > 0) {
      return productContentData.benefits.slice(0, 4);
    }

    if (!currentProduct?.productContent) {
      return [];
    }

    return currentProduct.productContent
      .split(".")
      .map((text) => text.trim())
      .filter(Boolean)
      .slice(0, 4);
  }, [currentProduct, productContentData]);

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
                  {productContentData.tagline ||
                    (selectedPet
                      ? `${selectedPet.petName}에게 추천하는 보험`
                      : "보험 상품 상세")}
                </DetailGuide>

                <DetailProductName>
                  {currentProduct.productName}
                </DetailProductName>

                <DetailDescription>
                  {productContentData.summary ||
                    "반려동물 정보를 반영한 맞춤형 펫 보험 상품입니다."}
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

                <PricePanelPrice $tone={currentProductTone}>
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
                  {productContentData.coverages.length > 0 ? (
                    productContentData.coverages.map((coverage, index) => (
                      <CoverageRow key={`${coverage.title}-${index}`}>
                        <CoverageName>
                          {coverage.title}

                          <CoverageMeta>
                            {coverage.rate && (
                              <CoverageMetaChip>
                                {coverage.rate}
                              </CoverageMetaChip>
                            )}

                            {coverage.limit && (
                              <CoverageMetaChip>
                                {coverage.limit}
                              </CoverageMetaChip>
                            )}

                            {coverage.deductible && (
                              <CoverageMetaChip>
                                자기부담 {coverage.deductible}
                              </CoverageMetaChip>
                            )}
                          </CoverageMeta>
                        </CoverageName>

                        <CoverageDescription>
                          {coverage.description}
                        </CoverageDescription>
                      </CoverageRow>
                    ))
                  ) : (
                    <CoverageRow>
                      <CoverageName>상품 보장 안내</CoverageName>

                      <CoverageDescription>
                        {productContentData.summary ||
                          "선택한 상품의 보장 내용을 확인해 주세요."}
                      </CoverageDescription>
                    </CoverageRow>
                  )}
                </CoverageBody>
              </CoverageTable>

              {productContentData.riders.length > 0 && (
                <RiderSection>
                  <CoverageTitle>선택 특약</CoverageTitle>

                  <CoverageTable>
                    <CoverageHeader>
                      <CoverageRow>
                        <CoverageHeaderCell>특약 항목</CoverageHeaderCell>
                        <CoverageHeaderCell>안내</CoverageHeaderCell>
                      </CoverageRow>
                    </CoverageHeader>

                    <CoverageBody>
                      {productContentData.riders.map((rider, index) => (
                        <CoverageRow key={`${rider.title}-${index}`}>
                          <CoverageName>
                            {rider.title}

                            <CoverageMeta>
                              {rider.limit && (
                                <CoverageMetaChip>
                                  {rider.limit}
                                </CoverageMetaChip>
                              )}

                              <CoverageMetaChip $included={rider.included}>
                                {rider.included ? "포함" : "선택"}
                              </CoverageMetaChip>
                            </CoverageMeta>
                          </CoverageName>

                          <CoverageDescription>
                            {rider.description}
                          </CoverageDescription>
                        </CoverageRow>
                      ))}
                    </CoverageBody>
                  </CoverageTable>
                </RiderSection>
              )}
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

function parseProductContent(productContent) {
  if (!productContent) {
    return {
      tagline: "",
      summary: "",
      benefits: [],
      coverages: [],
      riders: [],
    };
  }

  try {
    const parsed = JSON.parse(productContent);

    return {
      tagline: parsed.tagline || "",
      summary: parsed.summary || "",
      benefits: Array.isArray(parsed.benefits) ? parsed.benefits : [],
      coverages: Array.isArray(parsed.coverages) ? parsed.coverages : [],
      riders: Array.isArray(parsed.riders) ? parsed.riders : [],
    };
  } catch (error) {
    const fallbackBenefits = productContent
      .split(".")
      .map((text) => text.trim())
      .filter(Boolean);

    return {
      tagline: "",
      summary: productContent,
      benefits: fallbackBenefits,
      coverages: [],
      riders: [],
    };
  }
}

// =========================================================
// 상품 탭 색상
//
// 기능 로직에는 영향 없는 화면 색상 설정
// =========================================================
function getProductTabColor(tone) {
  if (tone === 1) {
    return {
      main: "#6f8fb8",
      deep: "#3f6385",
      border: "#ccdceb",
      light: "rgba(244, 248, 252, 0.72)",
      hover: "#eef5fb",
      glow: "rgba(111, 143, 184, 0.18)",
    };
  }

  if (tone === 2) {
    return {
      main: "#9c8fb8",
      deep: "#6d5f91",
      border: "#ded6ec",
      light: "rgba(249, 247, 253, 0.72)",
      hover: "#f3effa",
      glow: "rgba(156, 143, 184, 0.16)",
    };
  }

  return {
    main: "#58aa8d",
    deep: "#2f7f67",
    border: "#c8e5da",
    light: "rgba(241, 250, 246, 0.72)",
    hover: "#eaf7f1",
    glow: "rgba(88, 170, 141, 0.18)",
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
  gap: 18px;
`;

const SectionHeader = styled.div`
  position: relative;
  margin-bottom: 18px;
  padding-left: 2px;

  &::after {
    content: "✦";
    position: absolute;
    top: 2px;
    left: 330px;
    color: rgba(88, 170, 141, 0.28);
    font-size: 24px;
    font-weight: 900;
  }

  @media (max-width: 768px) {
    &::after {
      display: none;
    }
  }
`;

const PageSectionTitle = styled.h2`
  margin: 0;
  color: #17211f;
  font-size: 26px;
  font-weight: 950;
  letter-spacing: -1px;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const SectionDescription = styled.p`
  margin: 7px 0 0;
  color: #71807a;
  font-size: 13px;
  line-height: 1.6;
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

  border: 1px solid rgba(100, 178, 148, 0.2);
  border-radius: 28px;

  background:
    radial-gradient(
      circle at 18% 0%,
      rgba(100, 178, 148, 0.13),
      transparent 34%
    ),
    radial-gradient(
      circle at 92% 92%,
      rgba(232, 121, 103, 0.1),
      transparent 30%
    ),
    #ffffff;

  box-shadow: 0 20px 48px rgba(31, 62, 54, 0.08);

  text-align: center;
  box-sizing: border-box;
`;

const LoginBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 14px;
  padding: 6px 11px;

  border-radius: 999px;

  background: #f2fbf7;
  color: #3f9275;

  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.5px;
`;

const LoginRequiredTitle = styled.h3`
  margin: 0;
  color: #17211f;
  font-size: 22px;
  font-weight: 950;
`;

const LoginRequiredDescription = styled.p`
  margin: 12px 0 0;
  color: #71807a;
  font-size: 13px;
  line-height: 1.7;
`;

const LoginButton = styled.button`
  height: 42px;
  margin-top: 24px;
  padding: 0 22px;

  border: none;
  border-radius: 14px;

  background: linear-gradient(180deg, #76c5a6 0%, #58aa8d 100%);

  color: #ffffff;

  font-size: 13px;
  font-weight: 900;

  cursor: pointer;

  box-shadow: 0 12px 22px rgba(88, 170, 141, 0.24);

  &:hover {
    filter: brightness(0.98);
  }
`;

/* =========================================================
   상단 펫 요약
========================================================= */

const PetSummaryCard = styled.div`
  position: relative;
  overflow: visible;

  display: flex;
  justify-content: space-between;
  gap: 22px;

  padding: 24px 26px;

  border: 1px solid rgba(100, 178, 148, 0.22);
  border-radius: 28px;

  background:
    radial-gradient(
      circle at 86% 18%,
      rgba(88, 170, 141, 0.14),
      transparent 30%
    ),
    radial-gradient(
      circle at 0% 100%,
      rgba(205, 238, 225, 0.45),
      transparent 34%
    ),
    linear-gradient(135deg, #ffffff 0%, #fffdfb 50%, #f2fbf7 100%);

  box-shadow:
    0 20px 44px rgba(31, 62, 54, 0.08),
    inset 0 0 0 1px rgba(255, 255, 255, 0.7);

  &::before {
    content: "✦";
    position: absolute;
    top: 24px;
    right: 155px;
    color: rgba(108, 180, 154, 0.3);
    font-size: 28px;
  }

  &::after {
    content: "♡";
    position: absolute;
    right: 34px;
    bottom: 28px;
    color: rgba(108, 180, 154, 0.28);
    font-size: 34px;
    font-weight: 900;
  }

  @media (max-width: 820px) {
    flex-direction: column;
  }
`;

const PetSummaryContent = styled.div`
  position: relative;
  z-index: 2;
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
  color: #6f817a;

  &::before {
    content: "";
    display: inline-flex;
    width: 6px;
    height: 6px;
    margin-right: 6px;
    border-radius: 50%;
    background: #6cb49a;
  }
`;

const SummaryStatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 5px 10px;

  border-radius: 999px;

  background: ${({ $status }) => getStatusBackground($status)};
  color: ${({ $status }) => getStatusColor($status)};

  font-size: 11px;
  font-weight: 900;
`;

const SummaryPetRow = styled.div`
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 9px;

  margin-top: 10px;
`;

const SummaryPetName = styled.h3`
  margin: 0;

  color: #14211d;

  font-size: 31px;
  font-weight: 950;
  letter-spacing: -1.2px;
`;

const SummaryPetAge = styled.span`
  padding-bottom: 5px;

  color: #71807a;

  font-size: 13px;
  font-weight: 800;
`;

const SummaryInfoRow = styled.div`
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;

  margin-top: 17px;
  padding: 14px 16px;

  border: 1px solid rgba(100, 178, 148, 0.18);
  border-radius: 20px;

  background: rgba(255, 255, 255, 0.78);

  box-shadow: 0 10px 22px rgba(31, 62, 54, 0.055);

  backdrop-filter: blur(8px);
`;

const SummaryInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const SummaryInfoLabel = styled.span`
  color: #7d8b86;

  font-size: 11px;
  font-weight: 800;
`;

const SummaryInfoValue = styled.span`
  color: #17211f;

  font-size: 15px;
  font-weight: 950;
`;

const SummaryPrice = styled.span`
  font-size: 19px;
  font-weight: 900;
  color: #3f9d7f;
`;

const SummaryDivider = styled.span`
  width: 1px;
  height: 34px;

  background: rgba(100, 178, 148, 0.24);
`;

const SummaryGuide = styled.p`
  max-width: 620px;
  margin: 13px 0 0;

  color: #6f7b77;

  font-size: 12px;
  line-height: 1.65;
`;

/* =========================================================
   펫 선택 드롭다운
========================================================= */

const PetMenuWrapper = styled.div`
  position: relative;
  z-index: 8;

  align-self: flex-start;
  flex-shrink: 0;
`;

const PetMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  min-width: 122px;
  height: 40px;
  padding: 0 15px;

  border: none;
  border-radius: 15px;

  background: linear-gradient(180deg, #76c5a6 0%, #58aa8d 100%);

  color: #ffffff;

  font-size: 12px;
  font-weight: 950;

  cursor: pointer;

  box-shadow: 0 12px 22px rgba(88, 170, 141, 0.24);

  &:hover {
    filter: brightness(0.98);
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
  top: calc(100% + 9px);
  right: 0;
  z-index: 30;

  width: 240px;
  max-height: 280px;
  padding: 8px;

  overflow-y: auto;

  border: 1px solid rgba(100, 178, 148, 0.22);
  border-radius: 18px;

  background: #ffffff;

  box-shadow: 0 18px 38px rgba(31, 62, 54, 0.15);
`;

const PetOptionButton = styled.button`
  display: flex;
  flex-direction: column;
  gap: 6px;

  width: 100%;
  padding: 11px 12px;

  border: 1px solid
    ${({ $isSelected }) =>
      $isSelected ? "rgba(100, 178, 148, 0.28)" : "transparent"};
  border-radius: 13px;

  background: ${({ $isSelected }) => ($isSelected ? "#f1faf6" : "#ffffff")};

  text-align: left;

  cursor: pointer;

  &:hover {
    background: #f7fbfa;
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
  color: #17211f;

  font-size: 13px;
  font-weight: 900;
`;

const SelectedPetDot = styled.span`
  width: 8px;
  height: 8px;

  border-radius: 50%;

  background: #58aa8d;
`;

const PetAgeText = styled.span`
  color: #7c8682;

  font-size: 11px;
`;

const PetStatusText = styled.span`
  color: ${({ $status }) => getStatusColor($status)};

  font-size: 11px;
  font-weight: 800;
`;

const EmptyPetMessage = styled.p`
  margin: 0;
  padding: 12px 10px;

  color: #7c8682;

  font-size: 12px;
`;

/* =========================================================
   상품 탭
========================================================= */

const ProductTabArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ProductTabTitle = styled.h3`
  margin: 0;

  color: #17211f;

  font-size: 19px;
  font-weight: 950;
  letter-spacing: -0.6px;
`;

const ProductTabs = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 11px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const ProductTabButton = styled.button`
  position: relative;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  min-height: 78px;
  padding: 14px 15px;

  border: 1.5px solid
    ${({ $tone, $isViewing, $isAppliedProduct }) => {
      if ($isViewing) {
        return getProductTabColor($tone).main;
      }

      if ($isAppliedProduct) {
        return "#9bd1c1";
      }

      return "#e4ebe8";
    }};

  border-radius: 18px;

  background: ${({ $tone, $isViewing, $isAppliedProduct }) => {
    if ($isViewing) {
      return `
      linear-gradient(
        135deg,
        ${getProductTabColor($tone).light} 0%,
        rgba(255, 255, 255, 0.92) 100%
      )
    `;
    }

    if ($isAppliedProduct) {
      return "linear-gradient(135deg, rgba(241, 250, 246, 0.72) 0%, rgba(255, 255, 255, 0.92) 100%)";
    }

    return "rgba(255, 255, 255, 0.72)";
  }};

  text-align: left;

  cursor: pointer;

  box-shadow: ${({ $tone, $isViewing, $isAppliedProduct }) =>
    $isViewing || $isAppliedProduct
      ? `0 12px 24px ${getProductTabColor($tone).glow}`
      : "0 5px 14px rgba(31, 62, 54, 0.035)"};

  transform: ${({ $isViewing }) =>
    $isViewing ? "translateY(-2px)" : "translateY(0)"};

  transition:
    border-color 0.18s ease,
    background-color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;

  &::after {
    content: "";
    position: absolute;
    right: -28px;
    bottom: -34px;

    width: 88px;
    height: 88px;

    border-radius: 50%;

    background: ${({ $tone }) => getProductTabColor($tone).glow};

    opacity: ${({ $isViewing, $isAppliedProduct }) =>
      $isViewing || $isAppliedProduct ? 1 : 0};
  }

  &:hover {
    background: ${({ $tone }) => getProductTabColor($tone).hover};
    border-color: ${({ $tone }) => getProductTabColor($tone).main};
    transform: translateY(-2px);
  }
`;

const ProductTabTop = styled.div`
  position: relative;
  z-index: 1;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  width: 100%;
`;

const ProductTabName = styled.span`
  min-width: 0;

  overflow: hidden;

  color: #182320;

  font-size: 14px;
  font-weight: 950;

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

  background: #6cb49a;

  color: #ffffff;

  font-size: 11px;
  font-weight: 900;
`;

const ProductTabBottom = styled.div`
  position: relative;
  z-index: 1;

  display: flex;
  align-items: center;

  min-height: 22px;
  margin-top: 8px;
`;

const AppliedProductBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;

  padding: 5px 9px;

  border-radius: 999px;

  background: linear-gradient(180deg, #7cc3a8 0%, #57a98c 100%);

  color: #ffffff;

  font-size: 10px;
  font-weight: 950;

  box-shadow: 0 6px 12px rgba(87, 169, 140, 0.22);

  &::before {
    content: "✓";
    font-size: 10px;
    font-weight: 950;
  }
`;

const ViewingProductText = styled.span`
  color: ${({ $tone }) => getProductTabColor($tone).deep};

  font-size: 11px;
  font-weight: 900;
`;

const AvailableProductText = styled.span`
  color: #91a19b;

  font-size: 11px;
  font-weight: 800;
`;

/* =========================================================
   선택 상품 상세
========================================================= */

const ProductDetailCard = styled.div`
  overflow: hidden;

  border: 1px solid rgba(31, 62, 54, 0.08);
  border-radius: 26px;

  background: #ffffff;

  box-shadow:
    0 18px 44px rgba(31, 62, 54, 0.07),
    0 4px 12px rgba(31, 62, 54, 0.035);
`;

const ProductDetailTop = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.72fr) minmax(260px, 0.78fr);
  gap: 20px;

  padding: 26px;

  background:
    radial-gradient(circle at 0% 0%, rgba(88, 170, 141, 0.08), transparent 34%),
    linear-gradient(180deg, #fffdfb 0%, #ffffff 100%);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ProductMainContent = styled.div`
  min-width: 0;
`;

const DetailGuide = styled.p`
  margin: 0;

  color: #6f7f79;

  font-size: 12px;
  font-weight: 900;
`;

const DetailProductName = styled.h3`
  margin: 8px 0 0;

  color: #111b19;

  font-size: 29px;
  font-weight: 950;
  letter-spacing: -1.1px;
`;

const DetailDescription = styled.p`
  margin: 9px 0 0;

  color: #65746f;

  font-size: 13px;
  line-height: 1.65;
`;

const BenefitList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 9px;

  margin: 18px 0 0;
  padding: 0;

  list-style: none;
`;

const BenefitItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 9px;

  color: #23302c;

  font-size: 13px;
  line-height: 1.65;

  word-break: keep-all;
`;

const BenefitDot = styled.span`
  width: 7px;
  height: 7px;
  margin-top: 7px;

  border-radius: 50%;

  background: ${({ $tone }) => getProductTabColor($tone).main};

  flex-shrink: 0;
`;

/* =========================================================
   가격 박스
========================================================= */

const PricePanel = styled.div`
  position: relative;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 20px;

  border: 1px solid ${({ $tone }) => getProductTabColor($tone).border};
  border-radius: 22px;

  background:
    radial-gradient(
      circle at 100% 0%,
      ${({ $tone }) => getProductTabColor($tone).glow},
      transparent 42%
    ),
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.92) 0%,
      ${({ $tone }) => getProductTabColor($tone).light} 100%
    );

  box-shadow: 0 14px 30px ${({ $tone }) => getProductTabColor($tone).glow};

  &::after {
    content: "♡";
    position: absolute;
    right: 16px;
    top: 12px;

    color: ${({ $tone }) => getProductTabColor($tone).main};
    opacity: 0.22;

    font-size: 26px;
    font-weight: 900;
  }
`;

const PricePanelLabel = styled.span`
  position: relative;
  z-index: 1;

  color: #66756f;

  font-size: 12px;
  font-weight: 900;
`;

const PricePanelPrice = styled.div`
  position: relative;
  z-index: 1;

  margin-top: 10px;

  color: ${({ $tone }) => getProductTabColor($tone).deep};

  font-size: 32px;
  font-weight: 950;
  line-height: 1.05;
  letter-spacing: -1.2px;
`;
const PriceUnit = styled.span`
  margin-left: 6px;

  color: #697a74;

  font-size: 13px;
  font-weight: 800;
`;

const PricePanelDescription = styled.p`
  position: relative;
  z-index: 1;

  margin: 11px 0 0;

  color: #697a74;

  font-size: 11px;
  line-height: 1.6;
`;

const PricePanelAction = styled.div`
  position: relative;
  z-index: 1;

  margin-top: 18px;
`;

/* =========================================================
   상태별 버튼
========================================================= */

const PrimaryActionButton = styled.button`
  width: 100%;
  height: 46px;

  border: none;
  border-radius: 15px;

  background: linear-gradient(180deg, #75c7a9 0%, #4fa98b 100%);

  color: #ffffff;

  font-size: 14px;
  font-weight: 900;

  cursor: pointer;

  box-shadow: 0 12px 22px rgba(88, 170, 141, 0.24);

  &:hover {
    background: linear-gradient(180deg, #67bc9e 0%, #429a7e 100%);
  }

  &:disabled {
    opacity: 0.7;
    cursor: default;
  }
`;

const SecondaryActionButton = styled.button`
  width: 100%;
  height: 40px;
  padding: 0 14px;

  border: 1px solid #cfe4dc;
  border-radius: 14px;

  background: #f7fbfa;

  color: #5f7f72;

  font-size: 12px;
  font-weight: 950;

  cursor: pointer;

  &:hover {
    background: #eef8f4;
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
  height: 40px;
  padding: 0 13px;

  border-radius: 14px;

  background: #eef1f0;

  color: #87938f;

  font-size: 12px;
  font-weight: 900;

  box-sizing: border-box;
`;

const CompareOnlyBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  min-height: 40px;
  padding: 0 12px;

  border: 1px solid #dce6e2;
  border-radius: 14px;

  background: #f7fbfa;

  color: #73827c;

  font-size: 11px;
  font-weight: 900;
  text-align: center;

  box-sizing: border-box;
`;

/* =========================================================
   보장 내용 표
========================================================= */

const CoverageSection = styled.div`
  padding: 0 26px 26px;
`;

const CoverageTitle = styled.h4`
  margin: 0 0 12px;

  color: #17211f;

  font-size: 18px;
  font-weight: 950;
  letter-spacing: -0.6px;
`;

const CoverageTable = styled.div`
  overflow: hidden;

  border: 1px solid #e7efeb;
  border-radius: 18px;
`;

const CoverageHeader = styled.div`
  background: #f4f8f6;
`;

const CoverageBody = styled.div`
  background: #ffffff;
`;

const CoverageRow = styled.div`
  display: grid;
  grid-template-columns: minmax(140px, 190px) 1fr;

  &:not(:last-child) {
    border-bottom: 1px solid #edf2f0;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const CoverageHeaderCell = styled.div`
  padding: 12px 15px;

  color: #66756f;

  font-size: 12px;
  font-weight: 900;

  &:not(:last-child) {
    border-right: 1px solid #e7efeb;
  }
`;

const CoverageName = styled.div`
  padding: 14px 15px;

  background: #fbfdfc;

  color: #17211f;

  font-size: 13px;
  font-weight: 950;
`;

const CoverageDescription = styled.div`
  padding: 14px 15px;

  color: #64736e;

  font-size: 13px;
  line-height: 1.6;
`;

const CoverageMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;

  margin-top: 7px;
`;

const CoverageMetaChip = styled.span`
  display: inline-flex;
  align-items: center;

  padding: 4px 7px;

  border-radius: 999px;

  background: ${({ $included }) => ($included ? "#eaf7f1" : "#f4f7f6")};
  color: ${({ $included }) => ($included ? "#2f7f67" : "#6f7f79")};

  font-size: 10px;
  font-weight: 800;
`;

const RiderSection = styled.div`
  margin-top: 18px;
`;

const ErrorMessage = styled.p`
  margin: 0;
  padding: 11px 13px;

  border: 1px solid #d9eae3;
  border-radius: 12px;

  background: #f7fbfa;

  color: #5f7f72;

  font-size: 13px;
  font-weight: 800;
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

  background: rgba(10, 22, 18, 0.52);
`;

const ModalBox = styled.div`
  display: flex;
  flex-direction: column;

  width: min(540px, 100%);
  max-height: 86vh;

  overflow: hidden;

  border-radius: 24px;

  background: #ffffff;

  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.24);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  padding: 22px 22px 17px;

  border-bottom: 1px solid #edf2f0;
`;

const FormBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 5px 10px;

  border-radius: 999px;

  background: #f0faf6;

  color: #24876d;

  font-size: 11px;
  font-weight: 900;
`;

const ModalTitle = styled.h2`
  margin: 10px 0 0;

  color: #17211f;

  font-size: 20px;
  font-weight: 950;
`;

const ModalDescription = styled.p`
  margin: 7px 0 0;

  color: #697a74;

  font-size: 12px;
  line-height: 1.6;
`;

const CloseButton = styled.button`
  border: none;

  background: transparent;

  color: #8a9691;

  font-size: 26px;
  line-height: 1;

  cursor: pointer;
`;

const ModalBody = styled.div`
  overflow-y: auto;

  padding: 20px 22px;
`;

const FormSection = styled.section`
  margin-bottom: 18px;
`;

const ModalSectionTitle = styled.h3`
  margin: 0 0 10px;

  color: #17211f;

  font-size: 13px;
  font-weight: 950;
`;

const RequiredMark = styled.span`
  color: #58aa8d;
`;

const InfoTable = styled.div`
  overflow: hidden;

  border: 1px solid #e7efeb;
  border-radius: 14px;

  background: #ffffff;
`;

const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 112px 1fr;

  min-height: 42px;

  border-bottom: 1px solid #edf2f0;

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  display: flex;
  align-items: center;

  padding: 0 13px;

  background: #f7fbfa;

  color: #6f7f79;

  font-size: 12px;
  font-weight: 900;
`;

const InfoValue = styled.span`
  display: flex;
  align-items: center;

  padding: 0 13px;

  color: #17211f;

  font-size: 12px;
  font-weight: 800;
`;

const PriceValue = styled.span`
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-size: 15px;
  font-weight: 800;
  color: #3f9d7f;
`;

const UploadCard = styled.div`
  padding: 14px;

  border: 1px solid #e7efeb;
  border-radius: 14px;

  background: #fbfdfc;
`;

const UploadGuide = styled.p`
  margin: 0 0 11px;

  color: #697a74;

  font-size: 12px;
  line-height: 1.6;
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

  height: 36px;
  padding: 0 12px;

  border: 1px solid #c3e2d7;
  border-radius: 10px;

  background: #f0faf6;

  color: #24876d;

  font-size: 12px;
  font-weight: 900;

  cursor: pointer;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const SelectedFileName = styled.div`
  flex: 1;
  min-width: 0;
  overflow: hidden;

  padding: 10px 11px;

  border: 1px solid ${({ $hasFile }) => ($hasFile ? "#b7dfd2" : "#e2e7e5")};
  border-radius: 10px;

  background: ${({ $hasFile }) => ($hasFile ? "#f0faf6" : "#ffffff")};

  color: ${({ $hasFile }) => ($hasFile ? "#24876d" : "#8a9691")};

  font-size: 12px;

  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ModalErrorMessage = styled.p`
  margin: 0 0 12px;
  padding: 10px 11px;

  border: 1px solid #d9eae3;
  border-radius: 10px;

  background: #f7fbfa;

  color: #5f7f72;

  font-size: 12px;
  line-height: 1.5;
`;

const NoticeBox = styled.div`
  padding: 13px 14px;

  border-radius: 14px;

  background: #f7fbfa;
`;

const NoticeTitle = styled.h4`
  margin: 0 0 7px;

  color: #17211f;

  font-size: 12px;
  font-weight: 950;
`;

const NoticeText = styled.p`
  margin: 0;

  color: #64736e;

  font-size: 12px;
  line-height: 1.6;
`;

const ModalFooter = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 10px;

  padding: 15px 22px 20px;

  border-top: 1px solid #edf2f0;

  background: #ffffff;
`;

const ModalCancelButton = styled.button`
  height: 43px;

  border: 1px solid #dde6e2;
  border-radius: 11px;

  background: #ffffff;

  color: #64736e;

  font-size: 12px;
  font-weight: 900;

  cursor: pointer;

  &:hover {
    background: #f7fbfa;
  }
`;

const SubmitButton = styled.button`
  height: 44px;

  border: none;
  border-radius: 12px;

  background: linear-gradient(180deg, #75c7a9 0%, #4fa98b 100%);

  color: #ffffff;

  font-size: 13px;
  font-weight: 900;

  cursor: pointer;

  box-shadow: 0 10px 18px rgba(88, 170, 141, 0.22);

  &:hover {
    background: linear-gradient(180deg, #67bc9e 0%, #429a7e 100%);
  }

  &:disabled {
    opacity: 0.7;
    cursor: default;
  }
`;
