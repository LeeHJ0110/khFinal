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

    handleSelectProduct,
    handleApplyInsurance,
    handleCancelInsurance,
  } = useInsuranceProduct();

  // 가입 여부와 관계없이 전체 상품 표시
  const visibleProductList = productList;

  // =========================================================
  // 현재 선택 상품의 최종 표시 가격
  // =========================================================
  const selectedPriceInfo = useMemo(() => {
    if (!selectedProduct) {
      return null;
    }

    return getProductPriceInfo({
      product: selectedProduct,
      selectedPet,
      selectedPetAge,
      calculatedPriceMap,
    });
  }, [selectedProduct, selectedPet, selectedPetAge, calculatedPriceMap]);

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
  // 가입 신청 모달 열기
  // =========================================================
  function handleOpenApplyModal(event, product) {
    event.stopPropagation();

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

    setSelectedProduct(product);
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

      <ProductToolbar>
        <ToolbarGuide>
          <GuideDot />

          <span>가입할 반려동물을 선택한 뒤 원하는 상품을 확인해 주세요.</span>
        </ToolbarGuide>

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
      </ProductToolbar>

      {selectedPet && (
        <SelectedSummary>
          <SummaryInfoGroup>
            <SummaryItem>
              <SummaryLabel>반려동물</SummaryLabel>

              <SummaryText>{selectedPet.petName}</SummaryText>
            </SummaryItem>

            <SummaryDivider />

            <SummaryItem>
              <SummaryLabel>나이</SummaryLabel>

              <SummaryText>
                {selectedPetAge === null
                  ? "생년월일 확인 필요"
                  : `만 ${selectedPetAge}세`}
              </SummaryText>
            </SummaryItem>

            <SummaryDivider />

            <SummaryItem>
              <SummaryLabel>보험 상태</SummaryLabel>

              <SummaryStatus
                $status={
                  isAgeRestricted ? "RESTRICTED" : selectedPetStatus.status
                }
              >
                {isAgeRestricted
                  ? "만 10세 이상 가입 불가"
                  : selectedPetStatus.label}
              </SummaryStatus>
            </SummaryItem>

            <SummaryDivider />

            <SummaryItem>
              <SummaryLabel>선택 상품</SummaryLabel>

              <SummaryText>
                {isAgeRestricted
                  ? "선택 불가"
                  : selectedProduct?.productName || "상품을 선택해 주세요"}
              </SummaryText>
            </SummaryItem>

            {!isAgeRestricted && (
              <>
                <SummaryDivider />

                <SummaryItem>
                  <SummaryLabel>월 보험료</SummaryLabel>

                  <SummaryPrice>
                    {selectedPriceInfo
                      ? `${formatPrice(selectedPriceInfo.monthlyPrice)}원`
                      : "-"}
                  </SummaryPrice>
                </SummaryItem>
              </>
            )}
          </SummaryInfoGroup>

          {!selectedPetStatus.canApply && selectedPet.applicationId && (
            <CancelInsuranceButton
              type="button"
              onClick={handleCancelInsurance}
              disabled={isCancelling}
            >
              {isCancelling
                ? "처리 중..."
                : selectedPet.approveStatus === "APPROVED"
                  ? "보험 해지"
                  : "신청 취소"}
            </CancelInsuranceButton>
          )}
        </SelectedSummary>
      )}

      {priceErrorMessage && <ErrorMessage>{priceErrorMessage}</ErrorMessage>}

      {errorMessage && !isModalOpen && (
        <ErrorMessage>{errorMessage}</ErrorMessage>
      )}

      <ProductGrid $isSingleProduct={visibleProductList.length === 1}>
        {visibleProductList.map((product) => {
          const isSelected = selectedProduct?.productId === product.productId;

          const isAppliedProduct =
            selectedPet?.insuranceProductId &&
            String(selectedPet.insuranceProductId) ===
              String(product.productId);

          const priceInfo = getProductPriceInfo({
            product,

            selectedPet,

            selectedPetAge,

            calculatedPriceMap,
          });

          return (
            <ProductCard
              key={product.productId}
              $isSelected={
                selectedPetStatus.canApply
                  ? isSelected
                  : Boolean(isAppliedProduct)
              }
              $isLocked={!selectedPetStatus.canApply || isAgeRestricted}
              $isSingleProduct={visibleProductList.length === 1}
              onClick={() => handleSelectProduct(product)}
            >
              <CardHeader>
                <ProductName
                  $isSelected={
                    selectedPetStatus.canApply
                      ? isSelected
                      : Boolean(isAppliedProduct)
                  }
                >
                  {product.productName}
                </ProductName>

                {selectedPetStatus.canApply && !isAgeRestricted && (
                  <SelectedCheckbox
                    $isSelected={isSelected}
                    aria-label={
                      isSelected ? "선택된 상품" : "선택되지 않은 상품"
                    }
                    title={isSelected ? "선택된 상품" : "상품 선택"}
                  >
                    {isSelected && "✓"}
                  </SelectedCheckbox>
                )}
              </CardHeader>

              <ProductDescription>
                반려동물 정보를 반영한 맞춤형 펫 보험 상품입니다.
              </ProductDescription>

              <Divider />

              <ProductContent
                $isSingleProduct={visibleProductList.length === 1}
              >
                {product.productContent}
              </ProductContent>

              <ProductBottom>
                {!isAgeRestricted && (
                  <PriceArea>
                    <ProductPrice>
                      {isPriceLoading && !selectedPet?.applicationId
                        ? "계산 중..."
                        : `${formatPrice(priceInfo.monthlyPrice)}원`}

                      {!isPriceLoading && <PriceUnit>/ 월</PriceUnit>}
                    </ProductPrice>

                    {!isBirthDateMissing && (
                      <PriceDescription>
                        반려동물 정보를 반영한 최종 월 보험료입니다.
                      </PriceDescription>
                    )}
                  </PriceArea>
                )}

                {selectedPetStatus.canApply ? (
                  isAgeRestricted ? (
                    <UnavailableBadge>만 10세 이상 가입 불가</UnavailableBadge>
                  ) : isBirthDateMissing ? (
                    <UnavailableBadge>생년월일 확인 필요</UnavailableBadge>
                  ) : (
                    <ApplyButton
                      type="button"
                      disabled={isPriceLoading}
                      onClick={(event) => handleOpenApplyModal(event, product)}
                    >
                      가입 신청
                    </ApplyButton>
                  )
                ) : isAppliedProduct ? (
                  <CurrentProductStatus $status={selectedPetStatus.status}>
                    {selectedPetStatus.label}
                  </CurrentProductStatus>
                ) : null}
              </ProductBottom>
            </ProductCard>
          );
        })}
      </ProductGrid>

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
                    카카오페이 카드 등록 화면으로 이동합니다.
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
                        {selectedProduct?.productName || "-"}
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
                    신청 후 카카오페이 카드 등록 화면으로 이동합니다. 카드 등록
                    완료 후 관리자 심사가 진행되며, 관리자 승인 시 표시된 월
                    보험료가 최초 결제됩니다.
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
// styled-components
// =========================================================
const ProductSection = styled.section`
  width: 100%;

  margin: 0;

  box-sizing: border-box;
`;
const LoginRequiredWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  min-height: 580px;
  padding: 44px 28px;
`;

const LoginRequiredBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: min(100%, 760px);
  min-height: 360px;

  padding: 52px 48px;

  border: 1px solid rgba(0, 169, 123, 0.16);
  border-radius: 22px;

  background: linear-gradient(145deg, var(--color-white) 0%, #f8fdfb 100%);

  box-shadow:
    0 16px 36px rgba(0, 169, 123, 0.08),
    0 4px 12px rgba(0, 0, 0, 0.025);

  text-align: center;

  box-sizing: border-box;
`;

const LoginBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 16px;
  padding: 6px 11px;

  border-radius: 999px;

  background: var(--color-bg-light);

  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.5px;

  color: var(--color-main-dark);
`;

const LoginRequiredTitle = styled.h3`
  margin: 0;

  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.7px;

  color: var(--text-main);
`;

const LoginRequiredDescription = styled.p`
  margin: 14px 0 0;

  font-size: 14px;
  line-height: 1.75;

  color: var(--text-desc);
`;

const LoginButton = styled.button`
  height: 46px;

  margin-top: 26px;
  padding: 0 24px;

  border: none;
  border-radius: 10px;

  background: var(--color-main);

  font-size: 14px;
  font-weight: 800;

  color: var(--color-white);

  cursor: pointer;

  transition:
    background-color 0.18s ease,
    transform 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    background: var(--color-main-dark);

    transform: translateY(-2px);

    box-shadow: 0 9px 20px rgba(0, 169, 123, 0.2);
  }
`;

const SectionHeader = styled.div`
  margin-bottom: 18px;
`;

const PageSectionTitle = styled.h2`
  margin: 0;

  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.7px;

  color: var(--text-main);
`;

const SectionDescription = styled.p`
  margin: 7px 0 0;

  font-size: 14px;

  color: var(--text-sub);
`;

const ProductToolbar = styled.div`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  margin-bottom: 12px;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ToolbarGuide = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;

  min-width: 0;

  color: var(--text-desc);

  font-size: 12px;
  line-height: 1.5;

  word-break: keep-all;
`;

const GuideDot = styled.span`
  width: 5px;
  height: 5px;

  border-radius: 50%;

  background: var(--color-main);
`;

const PetMenuWrapper = styled.div`
  position: relative;

  flex-shrink: 0;

  @media (max-width: 700px) {
    align-self: flex-end;
  }
`;
const PetMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  min-width: 116px;
  height: 34px;

  padding: 0 13px;

  border: none;
  border-radius: 7px;

  background: var(--color-main);

  font-size: 12px;
  font-weight: 700;

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

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: rgba(0, 169, 123, 0.25);
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
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

  width: 100%;
`;

const PetOptionBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  width: 100%;
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

const SelectedSummary = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;

  width: 100%;
  height: 52px;

  margin-bottom: 18px;
  padding: 0 14px;

  box-sizing: border-box;

  border: 1px solid #e2eee9;
  border-radius: 12px;

  background: #f7fcfa;

  @media (max-width: 900px) {
    height: auto;
    min-height: 52px;
    padding: 11px 14px;
  }

  @media (max-width: 760px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SummaryInfoGroup = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 10px 11px;

  min-width: 0;

  @media (max-width: 900px) {
    flex-wrap: wrap;
  }
`;

const SummaryText = styled.span`
  min-width: 0;

  color: var(--text-main);

  font-size: 12px;
  font-weight: 800;

  white-space: nowrap;
`;

const SummaryStatus = styled.span`
  flex-shrink: 0;

  padding: 4px 8px;

  border-radius: 999px;

  background: ${({ $status }) => getStatusBackground($status)};

  font-size: 11px;
  font-weight: 700;

  color: ${({ $status }) => getStatusColor($status)};

  white-space: nowrap;
`;
const CancelInsuranceButton = styled.button`
  flex-shrink: 0;

  height: 32px;
  padding: 0 11px;

  border: 1px solid #e3b7b2;
  border-radius: 7px;

  background: var(--color-white);

  color: #d45a4d;

  font-size: 11px;
  font-weight: 700;

  white-space: nowrap;

  cursor: pointer;

  &:hover {
    background: #fff6f5;
  }

  &:disabled {
    opacity: 0.6;

    cursor: default;
  }

  @media (max-width: 760px) {
    align-self: flex-end;
  }
`;

const SummaryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;

  min-width: 0;
`;
const SummaryLabel = styled.span`
  font-size: 11px;

  color: #7d8a85;
`;

const SummaryDivider = styled.span`
  width: 1px;
  height: 14px;

  flex-shrink: 0;

  background: #d8e9e3;

  @media (max-width: 620px) {
    display: none;
  }
`;

const SummaryPrice = styled.span`
  font-size: 13px;
  font-weight: 800;

  color: var(--color-main-dark);
`;

const ErrorMessage = styled.p`
  margin: 0 0 14px;

  font-size: 13px;

  color: #e74c3c;
`;
///가입완료 카드
const ProductGrid = styled.div`
  display: grid;

  grid-template-columns: ${({ $isSingleProduct }) =>
    $isSingleProduct
      ? "1fr"
      : "repeat(auto-fit, minmax(min(100%, 280px), 1fr))"};

  width: ${({ $isSingleProduct }) =>
    $isSingleProduct ? "min(100%, 460px)" : "100%"};

  gap: 20px;
`;
const ProductCard = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;

  min-width: 0;
  min-height: 500px;

  padding: 26px 24px 24px;

  overflow: hidden;

  border: 1px solid
    ${({ $isSelected }) => ($isSelected ? "#bfe8d9" : "#e2e7e5")};

  border-radius: 18px;

  background: var(--color-white);

  cursor: ${({ $isLocked }) => ($isLocked ? "default" : "pointer")};

  box-sizing: border-box;

  box-shadow: ${({ $isSelected }) =>
    $isSelected
      ? `
        0 0 0 3px rgba(0, 169, 123, 0.05),
        0 12px 28px rgba(0, 169, 123, 0.08)
      `
      : `
        0 4px 14px rgba(0, 0, 0, 0.025)
      `};

  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    transform: ${({ $isLocked }) => ($isLocked ? "none" : "translateY(-3px)")};

    border-color: ${({ $isLocked }) => ($isLocked ? "#e2e7e5" : "#b6dfd1")};

    box-shadow: ${({ $isLocked }) =>
      $isLocked
        ? `
          0 4px 14px rgba(0, 0, 0, 0.025)
        `
        : `
          0 11px 25px rgba(0, 169, 123, 0.08)
        `};
  }

  @media (max-width: 500px) {
    min-height: ${({ $isSingleProduct }) =>
      $isSingleProduct ? "260px" : "420px"};

    padding: 22px 18px 20px;
  }
`;
const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
`;

const SelectedCheckbox = styled.span`
  flex-shrink: 0;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 22px;
  height: 22px;

  border: 2px solid
    ${({ $isSelected }) => ($isSelected ? "var(--color-main)" : "#cfdad6")};

  border-radius: 6px;

  background: ${({ $isSelected }) =>
    $isSelected ? "var(--color-main)" : "var(--color-white)"};

  color: var(--color-white);

  font-size: 14px;
  font-weight: 900;
  line-height: 1;

  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    transform 0.18s ease;

  ${({ $isSelected }) =>
    $isSelected &&
    `
      transform: scale(1.04);
    `}
`;

const ProductName = styled.h3`
  margin: 0;

  font-size: 20px;
  font-weight: 800;

  color: ${({ $isSelected }) =>
    $isSelected ? "var(--color-main)" : "var(--color-main-dark)"};

  transition: color 0.18s ease;
`;

const ProductDescription = styled.p`
  margin: 10px 0 0;

  font-size: 13px;
  line-height: 1.55;

  color: var(--text-desc);
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;

  margin: 20px 0;

  background: #eeeeee;
`;

const ProductContent = styled.p`
  flex: 1;

  margin: 0;

  font-size: 14px;
  line-height: 1.9;

  color: var(--text-sub);
`;

const ProductBottom = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;

  margin-top: 24px;
`;

const PriceArea = styled.div`
  min-width: 0;
`;

const ProductPrice = styled.p`
  margin: 0;

  color: var(--text-main);

  font-size: clamp(23px, 2.2vw, 29px);
  font-weight: 800;
  letter-spacing: -0.7px;

  word-break: keep-all;
`;

const PriceUnit = styled.span`
  margin-left: 5px;

  font-size: 12px;
  font-weight: 600;

  color: var(--text-desc);
`;

const PriceDescription = styled.p`
  margin: 7px 0 0;

  font-size: 11px;
  line-height: 1.45;

  color: var(--text-desc);
`;

const ApplyButton = styled.button`
  flex-shrink: 0;

  height: 36px;
  padding: 0 14px;

  border: none;
  border-radius: 8px;

  background: var(--color-main);

  color: var(--color-white);

  font-size: 12px;
  font-weight: 700;

  white-space: nowrap;

  cursor: pointer;

  &:hover {
    background: var(--color-main-dark);
  }

  &:disabled {
    background: var(--color-mint);

    cursor: default;
  }
`;

const CurrentProductStatus = styled.span`
  flex-shrink: 0;

  padding: 6px 10px;

  border-radius: 999px;

  background: ${({ $status }) => getStatusBackground($status)};

  font-size: 11px;
  font-weight: 700;

  color: ${({ $status }) => getStatusColor($status)};
`;

const UnavailableBadge = styled.span`
  flex-shrink: 0;

  padding: 6px 10px;

  border-radius: 999px;

  background: #f3f3f3;

  font-size: 11px;
  font-weight: 700;

  color: var(--text-desc);
`;

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

  width: min(560px, 100%);
  max-height: 86vh;

  overflow: hidden;

  border-radius: 20px;

  background: var(--color-white);

  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;

  padding: 24px 24px 18px;

  border-bottom: 1px solid #eeeeee;
`;

const FormBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 5px 10px;

  border-radius: 999px;

  background: var(--color-bg-light);

  font-size: 11px;
  font-weight: 700;

  color: var(--color-main-dark);
`;

const ModalTitle = styled.h2`
  margin: 11px 0 0;

  font-size: 21px;
  font-weight: 800;

  color: var(--text-main);
`;

const ModalDescription = styled.p`
  margin: 7px 0 0;

  font-size: 12px;
  line-height: 1.6;

  color: var(--text-desc);
`;

const CloseButton = styled.button`
  border: none;

  background: transparent;

  font-size: 27px;
  line-height: 1;

  color: var(--text-desc);

  cursor: pointer;

  &:hover {
    color: var(--text-main);
  }
`;

const ModalBody = styled.div`
  overflow-y: auto;

  padding: 20px 24px;
`;

const FormSection = styled.section`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ModalSectionTitle = styled.h3`
  margin: 0 0 10px;

  font-size: 14px;
  font-weight: 800;

  color: var(--text-main);
`;

const RequiredMark = styled.span`
  color: #e74c3c;
`;

const InfoTable = styled.div`
  overflow: hidden;

  border: 1px solid #e8eeeb;

  border-radius: 13px;

  background: var(--color-white);
`;

const InfoRow = styled.div`
  display: grid;

  grid-template-columns: 120px 1fr;

  min-height: 44px;

  border-bottom: 1px solid #eeeeee;

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  display: flex;
  align-items: center;

  padding: 0 14px;

  background: #f8fbfa;

  font-size: 12px;
  font-weight: 700;

  color: #71807a;
`;

const InfoValue = styled.span`
  display: flex;
  align-items: center;

  padding: 0 14px;

  font-size: 13px;
  font-weight: 700;

  color: var(--text-main);
`;

const PriceValue = styled.span`
  display: flex;
  align-items: center;

  padding: 0 14px;

  font-size: 16px;
  font-weight: 800;

  color: var(--color-main-dark);
`;

const UploadCard = styled.div`
  padding: 15px;

  border: 1px solid #eeeeee;
  border-radius: 12px;

  background: var(--color-white);
`;

const UploadGuide = styled.p`
  margin: 0 0 12px;

  font-size: 12px;
  line-height: 1.6;

  color: #7c867f;
`;

const UploadRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FileInputLabel = styled.label`
  flex-shrink: 0;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  height: 38px;
  padding: 0 12px;

  border: 1px solid #cfe5dc;

  border-radius: 8px;

  background: #f5fbf8;

  font-size: 12px;
  font-weight: 700;

  color: var(--color-main-dark);

  cursor: pointer;

  &:hover {
    background: var(--color-bg-light);
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const SelectedFileName = styled.div`
  flex: 1;
  min-width: 0;

  overflow: hidden;

  padding: 10px 12px;

  border: 1px solid ${({ $hasFile }) => ($hasFile ? "#b9e2d3" : "#e3e3e3")};

  border-radius: 8px;

  background: ${({ $hasFile }) => ($hasFile ? "#f4fbf8" : "#fafafa")};

  font-size: 12px;

  color: ${({ $hasFile }) =>
    $hasFile ? "var(--color-main-dark)" : "var(--text-desc)"};

  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ModalErrorMessage = styled.p`
  margin: 0 0 14px;

  font-size: 12px;
  line-height: 1.5;

  color: #e74c3c;
`;

const NoticeBox = styled.div`
  padding: 14px 15px;

  border-radius: 12px;

  background: #f7f8fa;
`;

const NoticeTitle = styled.h4`
  margin: 0 0 7px;

  font-size: 13px;
  font-weight: 800;

  color: var(--text-main);
`;

const NoticeText = styled.p`
  margin: 0;

  font-size: 12px;
  line-height: 1.65;

  color: var(--text-sub);
`;

const ModalFooter = styled.div`
  display: grid;

  grid-template-columns: 1fr 1.5fr;

  gap: 10px;

  padding: 16px 24px 20px;

  border-top: 1px solid #eeeeee;

  background: var(--color-white);
`;

const ModalCancelButton = styled.button`
  height: 46px;

  border: 1px solid #dddddd;
  border-radius: 10px;

  background: var(--color-white);

  font-size: 13px;
  font-weight: 700;

  color: var(--text-sub);

  cursor: pointer;

  &:hover {
    background: #fafafa;
  }
`;

const SubmitButton = styled.button`
  height: 46px;

  border: none;
  border-radius: 10px;

  background: var(--color-main);

  font-size: 13px;
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
