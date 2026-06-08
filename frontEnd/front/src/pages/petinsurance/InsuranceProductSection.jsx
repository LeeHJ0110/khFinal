import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

import {
  calculateInsurancePrice,
  cancelInsuranceApplication,
  fetchInsuranceProductList,
  fetchMyPetListForInsurance,
  readySubscriptionPayment,
  requestInsurance,
} from "../../features/petInsurance/api/petInsuranceApi";

function InsuranceProductSection() {
  const [productList, setProductList] = useState([]);
  const [petList, setPetList] = useState([]);

  const [selectedPetId, setSelectedPetId] = useState("");

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [calculatedPriceMap, setCalculatedPriceMap] = useState({});

  const [medicalCertificate, setMedicalCertificate] = useState(null);

  const [isPetMenuOpen, setIsPetMenuOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

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
  // 저장된 생년월일 기준 현재 만 나이
  // =========================================================
  const selectedPetAge = useMemo(() => {
    return calculateAgeFromBirthDate(selectedPet?.birthDate);
  }, [selectedPet]);

  // =========================================================
  // 만 10세 이상 또는 생년월일 누락 여부
  // =========================================================
  const isAgeRestricted = selectedPetAge !== null && selectedPetAge >= 10;

  const isBirthDateMissing = Boolean(selectedPet) && selectedPetAge === null;

  // =========================================================
  // 현재 선택한 반려동물의 보험 상태
  // =========================================================
  const selectedPetStatus = useMemo(() => {
    return getPetInsuranceStatus(selectedPet);
  }, [selectedPet]);

  // =========================================================
  // 화면에 보여줄 상품 목록
  //
  // 보험 미가입: 판매 상품 전체 표시
  // 신청 중 또는 가입 완료: 실제 신청 상품 하나만 표시
  // =========================================================
  const visibleProductList = useMemo(() => {
    if (!selectedPet?.insuranceProductId) {
      return productList;
    }

    return productList.filter(
      (product) =>
        String(product.productId) === String(selectedPet.insuranceProductId),
    );
  }, [productList, selectedPet]);

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
  // 페이지 진입 시 초기 데이터 조회
  // =========================================================
  useEffect(() => {
    loadInitialData();
  }, []);

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
  // 펫 변경 시 상품 선택 동기화
  //
  // 신청 중 또는 가입 완료: 실제 신청 상품으로 고정
  // 미가입: 첫 번째 상품을 기본 선택
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
          String(product.productId) === String(selectedPet.insuranceProductId),
      );

      setSelectedProduct(appliedProduct || null);

      return;
    }

    setSelectedProduct(productList[0] || null);
  }, [selectedPet, productList, isAgeRestricted]);

  // =========================================================
  // 펫 변경 시 전체 상품 월 보험료 자동 계산
  //
  // 신청 또는 가입 내역이 있으면 DB에 저장된 확정 금액을 사용
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
        setPriceErrorMessage("반려동물의 생년월일 형식을 확인해 주세요.");

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

        setCalculatedPriceMap(Object.fromEntries(resultList));
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

      if (petData.length > 0) {
        setSelectedPetId((currentPetId) => {
          const exists = petData.some(
            (pet) => String(pet.petId) === String(currentPetId),
          );

          return exists ? String(currentPetId) : String(petData[0].petId);
        });
      } else {
        setSelectedPetId("");
      }
    } catch (error) {
      console.error("펫 보험 초기 데이터 조회 실패:", error);

      setErrorMessage(
        getErrorMessage(error, "보험 정보를 불러오지 못했습니다."),
      );
    }
  }

  // =========================================================
  // 가입 내역이 없는 경우에만 상품 선택 허용
  // =========================================================
  function handleSelectProduct(product) {
    if (!selectedPetStatus.canApply || isAgeRestricted) {
      return;
    }

    setSelectedProduct(product);
    setErrorMessage("");
  }

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

  // =========================================================
  // 가입 신청 후 카카오페이 카드 등록 화면으로 이동
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

    if (!medicalCertificate) {
      setErrorMessage("진료확인서를 첨부해 주세요.");

      return;
    }

    try {
      setIsLoading(true);

      const applicationResponse = await requestInsurance({
        petId: Number(selectedPetId),

        productId: selectedProduct.productId,

        medicalCertificate,
      });

      const applicationId = applicationResponse.data?.applicationId;

      if (!applicationId) {
        throw new Error("보험 가입 신청 번호를 확인할 수 없습니다.");
      }

      const paymentReadyResponse =
        await readySubscriptionPayment(applicationId);

      const paymentReadyData = paymentReadyResponse.data;

      const redirectUrl =
        paymentReadyData?.nextRedirectPcUrl ||
        paymentReadyData?.next_redirect_pc_url;

      if (!redirectUrl) {
        throw new Error("카카오페이 카드 등록 화면 주소를 확인할 수 없습니다.");
      }

      window.location.href = redirectUrl;
    } catch (error) {
      console.error("보험 가입 신청 실패:", error);

      setErrorMessage(getErrorMessage(error, "보험 가입 신청에 실패했습니다."));
    } finally {
      setIsLoading(false);
    }
  }

  // =========================================================
  // 보험 신청 취소 또는 가입 완료 보험 해지
  // =========================================================
  async function handleCancelInsurance() {
    if (!selectedPet?.applicationId) {
      setErrorMessage("취소할 보험 신청 정보를 찾을 수 없습니다.");

      return;
    }

    const isApproved = selectedPet.approveStatus === "APPROVED";

    const confirmMessage = isApproved
      ? `${selectedPet.petName}의 보험을 해지하시겠습니까?\n\n해지 후에도 현재 결제 기간이 끝날 때까지 보험 혜택은 유지됩니다.\n다음 결제일부터 자동 결제가 중단됩니다.`
      : `${selectedPet.petName}의 보험 가입 신청을 취소하시겠습니까?`;

    const isConfirmed = window.confirm(confirmMessage);

    if (!isConfirmed) {
      return;
    }

    try {
      setIsCancelling(true);
      setErrorMessage("");

      await cancelInsuranceApplication(selectedPet.applicationId);

      window.alert(
        isApproved
          ? "보험 해지가 신청되었습니다.\n현재 결제 기간이 끝날 때까지 보험 혜택은 유지됩니다."
          : "보험 가입 신청이 취소되었습니다.",
      );

      await loadInitialData();
    } catch (error) {
      console.error("보험 신청 취소 또는 해지 실패:", error);

      setErrorMessage(
        getErrorMessage(error, "보험 신청 취소 또는 해지 처리에 실패했습니다."),
      );
    } finally {
      setIsCancelling(false);
    }
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

      <ProductGrid $isSingle={visibleProductList.length === 1}>
        {visibleProductList.map((product) => {
          const isSelected = selectedProduct?.productId === product.productId;

          const priceInfo = getProductPriceInfo({
            product,

            selectedPet,

            selectedPetAge,

            calculatedPriceMap,
          });

          return (
            <ProductCard
              key={product.productId}
              $isSelected={isSelected}
              $isLocked={!selectedPetStatus.canApply || isAgeRestricted}
              onClick={() => handleSelectProduct(product)}
            >
              <CardHeader>
                <ProductName $isSelected={isSelected}>
                  {product.productName}
                </ProductName>

                {!isAgeRestricted && (
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

              <ProductContent>{product.productContent}</ProductContent>

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
                      onClick={(event) =>
                        handleOpenApplyModal(
                          event,

                          product,
                        )
                      }
                    >
                      가입 신청
                    </ApplyButton>
                  )
                ) : (
                  <CurrentProductStatus $status={selectedPetStatus.status}>
                    {selectedPetStatus.label}
                  </CurrentProductStatus>
                )}
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
// 보험 상태 표시
// =========================================================
function getPetInsuranceStatus(pet) {
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
function getProductPriceInfo({
  product,
  selectedPet,
  selectedPetAge,
  calculatedPriceMap,
}) {
  const baseMonthlyPrice = Number(product?.productMonthly || 0);

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

  const calculatedPrice = calculatedPriceMap[String(product?.productId)];

  if (calculatedPrice) {
    return {
      monthlyPrice: Number(calculatedPrice.monthlyPrice) || baseMonthlyPrice,
    };
  }

  const additionalPrice = calculateAdditionalPriceFromAge(selectedPetAge);

  return {
    monthlyPrice: baseMonthlyPrice + additionalPrice,
  };
}

// =========================================================
// 프론트 fallback용 연령 기준 보험료 계산
// =========================================================
function calculateAdditionalPriceFromAge(age) {
  if (age === null || age < 3) {
    return 0;
  }

  return (Math.floor((age - 3) / 2) + 1) * 10000;
}

// =========================================================
// 저장된 생년월일 기준 만 나이 계산
// =========================================================
function calculateAgeFromBirthDate(birthDateValue) {
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
// 공통 유틸
// =========================================================
function getErrorMessage(error, defaultMessage) {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
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
  width: 85%;
  margin: auto;
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
  gap: 16px;

  margin-bottom: 12px;
`;

const ToolbarGuide = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;

  font-size: 12px;
  line-height: 1.5;

  color: var(--text-desc);
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
  padding: 6px;

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
  gap: 16px;

  margin-bottom: 18px;
  padding: 11px 14px;

  border: 1px solid #e2eee9;
  border-radius: 12px;

  background: #f7fcfa;
`;

const SummaryInfoGroup = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 11px;
`;

const SummaryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`;

const SummaryLabel = styled.span`
  font-size: 11px;

  color: #7d8a85;
`;

const SummaryText = styled.span`
  font-size: 12px;
  font-weight: 800;

  color: var(--text-main);
`;

const SummaryDivider = styled.span`
  width: 1px;
  height: 14px;

  background: #d8e9e3;
`;

const SummaryStatus = styled.span`
  padding: 4px 8px;

  border-radius: 999px;

  background: ${({ $status }) => getStatusBackground($status)};

  font-size: 11px;
  font-weight: 700;

  color: ${({ $status }) => getStatusColor($status)};
`;

const SummaryPrice = styled.span`
  font-size: 13px;
  font-weight: 800;

  color: var(--color-main-dark);
`;

const CancelInsuranceButton = styled.button`
  flex-shrink: 0;

  height: 32px;
  padding: 0 11px;

  border: 1px solid #e3b7b2;
  border-radius: 7px;

  background: var(--color-white);

  font-size: 11px;
  font-weight: 700;

  color: #d45a4d;

  cursor: pointer;

  &:hover {
    background: #fff6f5;
  }

  &:disabled {
    opacity: 0.6;

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

  grid-template-columns: ${({ $isSingle }) =>
    $isSingle ? "minmax(0, 540px)" : "repeat(3, minmax(0, 1fr))"};

  gap: 20px;

  @media (max-width: 1100px) {
    grid-template-columns: ${({ $isSingle }) =>
      $isSingle ? "minmax(0, 540px)" : "repeat(2, minmax(0, 1fr))"};
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const ProductCard = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;

  min-height: 450px;
  padding: 26px 24px 24px;

  overflow: hidden;

  border: 1px solid
    ${({ $isSelected }) => ($isSelected ? "#bfe8d9" : "#e2e7e5")};

  border-radius: 18px;

  background: var(--color-white);

  cursor: ${({ $isLocked }) => ($isLocked ? "default" : "pointer")};

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
  gap: 12px;

  margin-top: 24px;
`;

const PriceArea = styled.div`
  min-width: 0;
`;

const ProductPrice = styled.p`
  margin: 0;

  font-size: 29px;
  font-weight: 800;
  letter-spacing: -0.7px;

  color: var(--text-main);
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

  font-size: 12px;
  font-weight: 700;

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

// =========================================================
// 상태별 스타일
// =========================================================
function getStatusColor(status) {
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

function getStatusBackground(status) {
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
