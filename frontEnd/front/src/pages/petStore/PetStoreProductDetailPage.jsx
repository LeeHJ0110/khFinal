import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import usePetStoreProductDetail from "../../features/petStore/hooks/usePetStoreProudctDetail";
import { insertCartProduct } from "../../features/petStore/api/petStoreOrderApi";
import usePetStoreWishToggle from "../../features/petStore/hooks/usePetStoreWishToggle";
import PetStoreProductReviewSection from "../../features/petStore/components/PetStoreProductReviewSection";

import foodImg from "../../assets/images/petStore/사료홍보.png";
import snackImg from "../../assets/images/petStore/간식홍보.png";
import supplementImg from "../../assets/images/petStore/영양제홍보.png";
import toiletImg from "../../assets/images/petStore/배변홍보.png";
PetStoreProductReviewSection;
import tagCard from "../../assets/images/petStore/상품태그카드.png";
import PetStoreNavGate from "./PetStoreNavGate";

export default function PetStoreProductDetailPage() {
  const { productId } = useParams();

  const {
    product: productDetail,
    isLoading,
    error,
  } = usePetStoreProductDetail(productId);

  const [product, setProduct] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [imageFadeKey, setImageFadeKey] = useState(0);
  const [activeTab, setActiveTab] = useState("analysis");
  const [showBottomBar, setShowBottomBar] = useState(false);
  const [isBottomOrderOpen, setIsBottomOrderOpen] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isCartSubmitting, setIsCartSubmitting] = useState(false);
  const [showCartBubble, setShowCartBubble] = useState(false);
  const [isTabFixed, setIsTabFixed] = useState(false);
  const [recommendPetIndex, setRecommendPetIndex] = useState(0);

  const tabAnchorRef = useRef(null);
  const analysisRef = useRef(null);
  const detailRef = useRef(null);
  const reviewRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { wishSubmittingId, handleToggleWishlist } = usePetStoreWishToggle();

  useEffect(() => {
    setProduct(productDetail ?? null);
  }, [productDetail]);

  const imageList = useMemo(() => {
    if (!product) {
      return [];
    }

    return [product.mainImageUrl, ...(product.subImageUrls ?? [])].filter(
      Boolean,
    );
  }, [product]);

  const recommendPetList = product?.recommendPetList ?? [];
  const recommendStatus = product?.feedingRecommendStatus ?? "NEED_LOGIN";
  const currentRecommendPet = recommendPetList[recommendPetIndex] ?? null;
  const hasRecommendPet = recommendPetList.length > 0;
  const canMoveRecommendPet = recommendPetList.length > 1;

  useEffect(() => {
    setRecommendPetIndex(0);
  }, [productId]);

  useEffect(() => {
    if (product?.mainImageUrl) {
      setSelectedImageUrl(product.mainImageUrl);
    }
  }, [product]);

  useEffect(() => {
    function handleScroll() {
      if (
        !tabAnchorRef.current ||
        !analysisRef.current ||
        !detailRef.current ||
        !reviewRef.current
      ) {
        return;
      }

      const scrollY = window.scrollY;

      const tabTop = tabAnchorRef.current.offsetTop;
      const analysisTop = analysisRef.current.offsetTop;
      const detailTop = detailRef.current.offsetTop;
      const reviewTop = reviewRef.current.offsetTop;

      setIsTabFixed(scrollY >= tabTop);

      const footer = document.querySelector("footer");
      const footerTop = footer ? footer.getBoundingClientRect().top : Infinity;

      // footer가 화면 아래쪽에 들어오기 시작하면 구매바를 올리지 말고 아예 숨김
      const isFooterNear = footerTop < window.innerHeight + 40;

      setBottomOffset(0);

      const isAfterAnalysis = scrollY > analysisTop + 120;
      setShowBottomBar(isAfterAnalysis && !isFooterNear);

      if (isFooterNear) {
        setIsBottomOrderOpen(false);
      }

      if (scrollY >= detailTop - 150) {
        setActiveTab("detail");
        return;
      }

      setActiveTab("analysis");
    }

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    const revealItems = document.querySelectorAll("[data-reveal]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -60px 0px",
      },
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [product]);

  function handleRecommendActionClick() {
    if (recommendStatus === "NEED_LOGIN") {
      const currentPath = location.pathname + location.search + location.hash;
      navigate(`/member/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (
      recommendStatus === "NEED_PET_REGISTER" ||
      recommendStatus === "NO_MATCHED_PET"
    ) {
      navigate("/mypage/pet-manage");
    }
  }

  function scrollToSection(sectionName) {
    const sectionMap = {
      analysis: analysisRef,
      detail: detailRef,
      review: reviewRef,
    };

    const targetRef = sectionMap[sectionName];

    if (!targetRef.current) {
      return;
    }

    setActiveTab(sectionName);

    const top =
      targetRef.current.getBoundingClientRect().top + window.scrollY - 74;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  }

  function handleDecreaseQuantity() {
    setQuantity((prev) => Math.max(1, prev - 1));
  }

  function handleIncreaseQuantity() {
    setQuantity((prev) => prev + 1);
  }
  function moveToLoginWithRedirect() {
    const currentPath = location.pathname + location.search + location.hash;

    alert("로그인이 필요한 서비스입니다.");
    navigate(`/member/login?redirect=${encodeURIComponent(currentPath)}`);
  }

  /*
  로그인 여부를 특정 key 하나만 보고 판단하면 또 꼬입니다.

  예전에는 loginMember만 봐서 로그인했는데도 튕겼고,
  지금은 서버 응답만 봐서 비로그인인데도 일반 실패로 빠지고 있습니다.

  그래서 localStorage/sessionStorage 안에서
  token, jwt, accessToken, Authorization, loginMember 등
  로그인 흔적을 넓게 확인합니다.
*/
  function hasLoginInfo() {
    const storageList = [localStorage, sessionStorage];

    for (const storage of storageList) {
      for (let i = 0; i < storage.length; i += 1) {
        const key = storage.key(i);
        const value = storage.getItem(key);

        if (!key || !value) {
          continue;
        }

        const lowerKey = key.toLowerCase();
        const lowerValue = value.toLowerCase();

        const keyLooksLikeLogin =
          lowerKey.includes("token") ||
          lowerKey.includes("jwt") ||
          lowerKey.includes("authorization") ||
          lowerKey.includes("auth") ||
          lowerKey.includes("login") ||
          lowerKey.includes("member") ||
          lowerKey.includes("user");

        const valueLooksLikeLogin =
          lowerValue.includes("bearer ") ||
          lowerValue.includes("access") ||
          lowerValue.includes("refresh") ||
          lowerValue.includes("token") ||
          lowerValue.includes("jwt") ||
          lowerValue.includes("role") ||
          lowerValue.includes("username") ||
          lowerValue.includes("nickname");

        // JWT 형태: xxxxx.yyyyy.zzzzz
        const valueLooksLikeJwt =
          /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(value);

        if (keyLooksLikeLogin || valueLooksLikeLogin || valueLooksLikeJwt) {
          return true;
        }
      }
    }

    return false;
  }

  function isAuthError(error) {
    const status =
      error?.response?.status ??
      error?.status ??
      error?.response?.data?.status ??
      "";

    const code =
      error?.response?.data?.code ??
      error?.response?.data?.errorCode ??
      error?.response?.data?.error ??
      "";

    const message =
      error?.response?.data?.message ??
      error?.response?.data ??
      error?.message ??
      "";

    const statusText = String(status);
    const codeText = String(code).toUpperCase();
    const messageText = String(message).toUpperCase();

    return (
      statusText === "401" ||
      statusText === "403" ||
      codeText.includes("401") ||
      codeText.includes("403") ||
      codeText.includes("UNAUTHORIZED") ||
      codeText.includes("FORBIDDEN") ||
      messageText.includes("401") ||
      messageText.includes("403") ||
      messageText.includes("UNAUTHORIZED") ||
      messageText.includes("FORBIDDEN") ||
      messageText.includes("LOGIN") ||
      messageText.includes("로그인")
    );
  }

  function updateProductWishState(nextProductId, wished, wishlistId = null) {
    setProduct((prev) => {
      if (!prev || prev.productId !== nextProductId) {
        return prev;
      }

      return {
        ...prev,
        wished,
        wishlistId,
      };
    });
  }

  async function handleWishClick(evt) {
    await handleToggleWishlist(evt, product, (updatedProduct) => {
      updateProductWishState(
        updatedProduct.productId,
        updatedProduct.wished,
        updatedProduct.wishlistId,
      );
    });
  }

  async function handleAddCart() {
    if (!product?.productId) {
      alert("상품 정보를 찾을 수 없습니다.");
      return;
    }

    if (quantity < 1) {
      alert("수량은 1개 이상이어야 합니다.");
      return;
    }

    /*
    핵심:
    비로그인 상태에서 서버가 401/403을 안 주고 일반 실패로 떨어지는 상황이라
    API 호출 전에 로그인 정보가 아예 없으면 바로 로그인으로 보냅니다.

    로그인 상태라면 기존처럼 insertCartProduct를 그대로 실행합니다.
  */
    if (!hasLoginInfo()) {
      moveToLoginWithRedirect();
      return;
    }

    try {
      setIsCartSubmitting(true);

      await insertCartProduct({
        productId: product.productId,
        qty: quantity,
      });

      setShowCartBubble(true);
    } catch (error) {
      if (isAuthError(error)) {
        moveToLoginWithRedirect();
        return;
      }

      alert("장바구니 담기에 실패했습니다.");
    } finally {
      setIsCartSubmitting(false);
    }
  }

  function handleCloseCartBubble() {
    setShowCartBubble(false);
  }

  function handleGoCart() {
    navigate("/store/cart/list");
  }

  function handleReadyDirectBuy() {
    if (!product?.productId) {
      alert("상품 정보를 찾을 수 없습니다.");
      return;
    }

    if (quantity < 1) {
      alert("수량은 1개 이상이어야 합니다.");
      return;
    }

    if (!hasLoginInfo()) {
      moveToLoginWithRedirect();
      return;
    }

    navigate("/store/order", {
      state: {
        orderType: "DIRECT",
        directItem: {
          productId: product.productId,
          productName: product.productName,
          productPrice: product.productPrice,
          mainImageUrl: product.mainImageUrl,
          qty: quantity,
        },
      },
    });
  }

  function handleSelectImage(url) {
    if (selectedImageUrl === url) {
      return;
    }

    setSelectedImageUrl(url);
    setImageFadeKey((prev) => prev + 1);
  }

  function handlePrevRecommendPet() {
    if (!hasRecommendPet) {
      return;
    }

    setRecommendPetIndex((prev) =>
      prev === 0 ? recommendPetList.length - 1 : prev - 1,
    );
  }

  function handleNextRecommendPet() {
    if (!hasRecommendPet) {
      return;
    }

    setRecommendPetIndex((prev) =>
      prev === recommendPetList.length - 1 ? 0 : prev + 1,
    );
  }

  if (isLoading) {
    return (
      <>
        <PetStoreNavGate />
        <Wrapper>
          <MessageBox>상품 정보를 불러오는 중입니다...</MessageBox>
        </Wrapper>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <PetStoreNavGate />
        <Wrapper>
          <MessageBox>상품 정보를 불러오지 못했습니다.</MessageBox>
        </Wrapper>
      </>
    );
  }

  function formatNutritionValue(type, value) {
    if (value === null || value === undefined || value === "") {
      return "-";
    }

    const textValue = String(value);

    if (textValue.includes("%") || /[a-zA-Zㄱ-ㅎ가-힣]/.test(textValue)) {
      return textValue;
    }

    if (type === "calorie") {
      return `${textValue} kcal`;
    }

    if (type === "percent") {
      return `${textValue}%`;
    }

    return textValue;
  }

  const categoryLabel = getCategoryLabel(product.productCategory);
  const tagName = product.tagName ?? "기본";
  const tagInfo = getTagInfo(product.productCategory, product.tagName);
  const totalPrice = (product.productPrice ?? 0) * quantity;
  const bottomToggleText = "구매하기";
  const promoImage = getPromoImageByCategory(product.productCategory);

  const showNutritionAndFeeding = isNutritionAndFeedingCategory(
    product.productCategory,
  );

  return (
    <>
      <PetStoreNavGate
        targetPetType={product.productTargetPetType}
        activeCategory={product.productCategory}
      />

      <Wrapper>
        <TopSection>
          <TopInner>
            <ImageSection>
              <MainImageBox>
                {selectedImageUrl ? (
                  <MainImage
                    key={`${selectedImageUrl}-${imageFadeKey}`}
                    src={selectedImageUrl}
                    alt={product.productName}
                  />
                ) : (
                  <ImagePlaceholder>상품 이미지</ImagePlaceholder>
                )}
              </MainImageBox>

              <ThumbList>
                {imageList.map((url, index) => (
                  <ThumbButton
                    key={`${url}-${index}`}
                    type="button"
                    $active={selectedImageUrl === url}
                    onClick={() => handleSelectImage(url)}
                  >
                    <ThumbImage
                      src={url}
                      alt={`${product.productName} ${index + 1}`}
                    />
                  </ThumbButton>
                ))}
              </ThumbList>
            </ImageSection>

            <InfoSection>
              <CategoryPath>
                <span>{categoryLabel}</span>
                <strong>&gt;</strong>
                <span>{tagName}</span>
              </CategoryPath>

              <ProductName>{product.productName}</ProductName>

              <ReviewMiniLine>
                <ReviewStar>★</ReviewStar>
                <span>4.9 (128)</span>
              </ReviewMiniLine>

              <Price>{product.productPrice?.toLocaleString()}원</Price>

              <BenefitBox>
                <BenefitTitle>구매혜택</BenefitTitle>

                <BenefitList>
                  <li>30,000원 이상 구매 시 무료배송</li>
                  <li>구매 시 펫앤아이포 사료 샘플 증정</li>
                </BenefitList>
              </BenefitBox>

              <DeliveryRow>
                <DeliveryTitle>배송정보</DeliveryTitle>

                <DeliveryTextBox>
                  <strong>3,000원</strong>
                  <span>(30,000원 이상 구매시 무료배송)</span>
                  <p>평일 오후 2시 이전 주문 시, 당일 출고</p>
                </DeliveryTextBox>
              </DeliveryRow>

              <Divider />

              <QuantityArea>
                <QuantityLabel>수량</QuantityLabel>

                <QuantityControl>
                  <button type="button" onClick={handleDecreaseQuantity}>
                    -
                  </button>
                  <span>{quantity}</span>
                  <button type="button" onClick={handleIncreaseQuantity}>
                    +
                  </button>
                </QuantityControl>
              </QuantityArea>

              <Divider />

              <TopTotalRow>
                <span>총 상품금액</span>
                <strong>{totalPrice.toLocaleString()}원</strong>
              </TopTotalRow>

              <ButtonRow>
                <WishButton
                  type="button"
                  $active={!!product.wished}
                  disabled={wishSubmittingId === product.productId}
                  onClick={(evt) =>
                    handleToggleWishlist(evt, product, (updatedProduct) => {
                      setProduct((prev) => ({
                        ...prev,
                        wished: updatedProduct.wished,
                        wishlistId: updatedProduct.wishlistId,
                      }));
                    })
                  }
                >
                  {product.wished ? "♥" : "♡"}
                </WishButton>

                <CartButtonWrap>
                  {showCartBubble && (
                    <CartBubble>
                      <CartBubbleMessage>
                        장바구니에 상품이 담겼습니다.
                      </CartBubbleMessage>

                      <CartBubbleButtonRow>
                        <CartBubbleSubButton
                          type="button"
                          onClick={handleCloseCartBubble}
                        >
                          쇼핑 계속하기
                        </CartBubbleSubButton>

                        <CartBubbleMainButton
                          type="button"
                          onClick={handleGoCart}
                        >
                          장바구니 가기 ›
                        </CartBubbleMainButton>
                      </CartBubbleButtonRow>
                    </CartBubble>
                  )}

                  <CartButton
                    type="button"
                    onClick={handleAddCart}
                    disabled={isCartSubmitting}
                  >
                    {isCartSubmitting ? "담는 중..." : "장바구니"}
                  </CartButton>
                </CartButtonWrap>

                <BuyButton type="button" onClick={handleReadyDirectBuy}>
                  바로 구매하기
                </BuyButton>
              </ButtonRow>
            </InfoSection>
          </TopInner>
        </TopSection>

        <TabAnchor ref={tabAnchorRef}>
          <StickyTabBar $fixed={isTabFixed}>
            <TabInner>
              <TabButton
                type="button"
                $active={activeTab === "analysis"}
                onClick={() => scrollToSection("analysis")}
              >
                상품분석
              </TabButton>

              <TabButton
                type="button"
                $active={activeTab === "detail"}
                onClick={() => scrollToSection("detail")}
              >
                상세내용
              </TabButton>

              <TabButton
                type="button"
                $active={activeTab === "review"}
                onClick={() => scrollToSection("review")}
              >
                리뷰
              </TabButton>
            </TabInner>
          </StickyTabBar>
        </TabAnchor>

        <ContentInner>
          <AnalysisSection ref={analysisRef}>
            <TagAnalysisCard data-reveal>
              <TagCardImage src={tagCard} alt="상품 태그 카드" />

              <TagCardText>
                <TagCardEyebrow>상품 태그</TagCardEyebrow>
                <TagCardTitle>#{tagName}</TagCardTitle>
                <TagCardDesc>{tagInfo.description}</TagCardDesc>
              </TagCardText>
            </TagAnalysisCard>

            {showNutritionAndFeeding && (
              <SectionBlock data-reveal>
                <SectionTitleRow>
                  <SectionTitle>영양성분 / 주요성분</SectionTitle>
                </SectionTitleRow>

                {product.nutrition ? (
                  <NutritionTable>
                    <thead>
                      <tr>
                        <th>주요 성분</th>
                        <th>함량</th>
                        <th>주요 성분</th>
                        <th>함량</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td>칼로리</td>
                        <td>
                          {formatNutritionValue(
                            "calorie",
                            product.nutrition.nutritionCalorie,
                          )}
                        </td>
                        <td>수분</td>
                        <td>
                          {formatNutritionValue(
                            "percent",
                            product.nutrition.nutritionMoisture,
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td>단백질</td>
                        <td>
                          {formatNutritionValue(
                            "percent",
                            product.nutrition.nutritionProtein,
                          )}
                        </td>
                        <td>칼슘</td>
                        <td>
                          {formatNutritionValue(
                            "percent",
                            product.nutrition.nutritionCalcium,
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td>지방</td>
                        <td>
                          {formatNutritionValue(
                            "percent",
                            product.nutrition.nutritionFat,
                          )}
                        </td>
                        <td>인</td>
                        <td>
                          {formatNutritionValue(
                            "percent",
                            product.nutrition.nutritionPhosphorus,
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td>식이섬유</td>
                        <td>
                          {formatNutritionValue(
                            "percent",
                            product.nutrition.nutritionFiber,
                          )}
                        </td>
                        <td>기타</td>
                        <td>{displayValue(product.nutrition.nutritionEtc)}</td>
                      </tr>
                    </tbody>
                  </NutritionTable>
                ) : (
                  <EmptyPanel>등록된 영양성분 정보가 없습니다.</EmptyPanel>
                )}
              </SectionBlock>
            )}

            {showNutritionAndFeeding && (
              <SectionBlock data-reveal>
                <SectionTitleRow>
                  <SectionTitle>급여 기준 / 급여 추천</SectionTitle>
                </SectionTitleRow>

                <FeedingRecommendLayout>
                  <FeedingGuideCard>
                    <FeedingGuideLeft>
                      <FeedingGuideTitle>급여 방법</FeedingGuideTitle>

                      <FeedingMethodContent>
                        <FeedingFoodImageBox>
                          {selectedImageUrl ? (
                            <FeedingFoodImage
                              src={selectedImageUrl}
                              alt={product.productName}
                            />
                          ) : (
                            <FeedingFoodEmoji>
                              {product.productTargetPetType === "D"
                                ? "🐶"
                                : "🐱"}
                            </FeedingFoodEmoji>
                          )}
                        </FeedingFoodImageBox>

                        <FeedingMethodTextBox>
                          <FeedingMethodName>
                            {product.productName}
                          </FeedingMethodName>
                          <FeedingMethodDesc>
                            권장량에 따라 급여해주세요.
                          </FeedingMethodDesc>
                        </FeedingMethodTextBox>
                      </FeedingMethodContent>
                    </FeedingGuideLeft>

                    <FeedingGuideRight>
                      {product.feedingGuideList?.length > 0 ? (
                        product.feedingGuideList.map((guide, index) => (
                          <FeedingPillRow key={guide.feedingGuideId ?? index}>
                            <span>{getFeedingWeightRange(guide)}</span>
                            <strong>1일 {getFeedingAmount(guide)}</strong>
                          </FeedingPillRow>
                        ))
                      ) : (
                        <FeedingEmptyText>
                          등록된 급여 기준이 없습니다.
                        </FeedingEmptyText>
                      )}
                    </FeedingGuideRight>
                  </FeedingGuideCard>

                  <PetRecommendCard $disabled={recommendStatus !== "SUCCESS"}>
                    <RecommendArrowButton
                      type="button"
                      $left
                      disabled={!canMoveRecommendPet}
                      onClick={handlePrevRecommendPet}
                    >
                      ‹
                    </RecommendArrowButton>

                    {recommendStatus === "SUCCESS" && currentRecommendPet ? (
                      <RecommendSlideContent key={currentRecommendPet.petId}>
                        <RecommendPetInfoBox>
                          <RecommendCardLabel>
                            우리 아이 추천 급여량
                          </RecommendCardLabel>

                          <RecommendPetMain>
                            <RecommendPetImageBox>
                              {currentRecommendPet.petImageUrl ? (
                                <RecommendPetImage
                                  src={currentRecommendPet.petImageUrl}
                                  alt={currentRecommendPet.petName}
                                />
                              ) : (
                                getPetEmoji(
                                  currentRecommendPet.petType,
                                  product.productTargetPetType,
                                )
                              )}
                            </RecommendPetImageBox>

                            <RecommendPetTextBox>
                              <RecommendPetName>
                                {currentRecommendPet.petName}
                              </RecommendPetName>
                              <RecommendPetMeta>
                                {getRecommendPetMeta(currentRecommendPet)}
                              </RecommendPetMeta>
                            </RecommendPetTextBox>
                          </RecommendPetMain>
                        </RecommendPetInfoBox>

                        <RecommendAmountArea>
                          <span>1일 권장 급여량</span>
                          <strong>
                            {getRecommendAmountText(currentRecommendPet)}
                          </strong>
                        </RecommendAmountArea>
                      </RecommendSlideContent>
                    ) : (
                      <>
                        <RecommendDisabledContent>
                          <RecommendPetInfoBox>
                            <RecommendCardLabel>
                              우리 아이 추천 급여량
                            </RecommendCardLabel>

                            <RecommendPetMain>
                              <RecommendPetImageBox>
                                {product.productTargetPetType === "D"
                                  ? "🐶"
                                  : "🐱"}
                              </RecommendPetImageBox>

                              <RecommendPetTextBox>
                                <RecommendPetName>깨깨</RecommendPetName>
                                <RecommendPetMeta>
                                  비숑 프리제 · 7kg
                                </RecommendPetMeta>
                              </RecommendPetTextBox>
                            </RecommendPetMain>
                          </RecommendPetInfoBox>

                          <RecommendAmountArea>
                            <span>1일 권장 급여량</span>
                            <strong>1일 80g</strong>
                          </RecommendAmountArea>
                        </RecommendDisabledContent>

                        <RecommendLockOverlay>
                          <RecommendLockTitle>
                            {getRecommendOverlayTitle(recommendStatus)}
                          </RecommendLockTitle>
                          <RecommendLockDesc>
                            맞춤형 추천 급여량을 확인하세요!
                          </RecommendLockDesc>
                          <RecommendActionButton
                            type="button"
                            onClick={handleRecommendActionClick}
                          >
                            {getRecommendActionText(recommendStatus)}
                          </RecommendActionButton>
                        </RecommendLockOverlay>
                      </>
                    )}

                    <RecommendArrowButton
                      type="button"
                      $right
                      disabled={!canMoveRecommendPet}
                      onClick={handleNextRecommendPet}
                    >
                      ›
                    </RecommendArrowButton>
                  </PetRecommendCard>
                </FeedingRecommendLayout>
              </SectionBlock>
            )}
          </AnalysisSection>

          <DetailContentSection ref={detailRef} data-reveal>
            <PromoLongImageBox>
              <PromoLongImage
                src={promoImage}
                alt={`${categoryLabel} 상세 홍보 이미지`}
              />
            </PromoLongImageBox>

            <ProductInfoBlock>
              <SectionTitle>상품정보</SectionTitle>

              <ProductInfoTable>
                <tbody>
                  <tr>
                    <th>상품명</th>
                    <td>{product.productName}</td>
                  </tr>

                  <tr>
                    <th>제조국 또는 원산지</th>
                    <td>대한민국</td>
                  </tr>

                  <tr>
                    <th>소비자 상담관련</th>
                    <td>페이지 하단 참조</td>
                  </tr>
                </tbody>
              </ProductInfoTable>
            </ProductInfoBlock>
          </DetailContentSection>

          <ReviewSection ref={reviewRef} data-reveal>
            <PetStoreProductReviewSection productId={product.productId} />
          </ReviewSection>
        </ContentInner>

        {showBottomBar && (
          <BottomOrderBar
            $bottomOffset={bottomOffset}
            $open={isBottomOrderOpen}
          >
            <BottomOrderHeader>
              <BottomOrderHeaderInner>
                <BottomOpenButton
                  type="button"
                  onClick={() => setIsBottomOrderOpen((prev) => !prev)}
                >
                  <span>{bottomToggleText}</span>
                  <em>{isBottomOrderOpen ? "⌃" : "⌄"}</em>
                </BottomOpenButton>
              </BottomOrderHeaderInner>
            </BottomOrderHeader>

            {isBottomOrderOpen && (
              <BottomOrderBody>
                <BottomOrderBodyInner>
                  <BottomOrderSpacer />

                  <BottomOrderPanel>
                    <BottomSelectBox>
                      <BottomSelectTitle>
                        {product.productName}
                      </BottomSelectTitle>

                      <BottomSelectControl>
                        <button type="button" onClick={handleDecreaseQuantity}>
                          -
                        </button>
                        <span>{quantity}</span>
                        <button type="button" onClick={handleIncreaseQuantity}>
                          +
                        </button>
                      </BottomSelectControl>

                      <BottomSelectPrice>
                        {totalPrice.toLocaleString()}원
                      </BottomSelectPrice>
                    </BottomSelectBox>

                    <BottomTotalRow>
                      <span>총 금액</span>
                      <strong>{totalPrice.toLocaleString()}원</strong>
                    </BottomTotalRow>

                    <BottomButtonRow>
                      <BottomCartButtonWrap>
                        {showCartBubble && (
                          <BottomCartBubble>
                            <CartBubbleMessage>
                              장바구니에 상품이 담겼습니다.
                            </CartBubbleMessage>

                            <CartBubbleButtonRow>
                              <CartBubbleSubButton
                                type="button"
                                onClick={handleCloseCartBubble}
                              >
                                쇼핑 계속하기
                              </CartBubbleSubButton>

                              <CartBubbleMainButton
                                type="button"
                                onClick={handleGoCart}
                              >
                                장바구니 가기 ›
                              </CartBubbleMainButton>
                            </CartBubbleButtonRow>
                          </BottomCartBubble>
                        )}

                        <BottomCartButton
                          type="button"
                          onClick={handleAddCart}
                          disabled={isCartSubmitting}
                        >
                          {isCartSubmitting ? "담는 중..." : "장바구니"}
                        </BottomCartButton>
                      </BottomCartButtonWrap>

                      <BottomBuyButton
                        type="button"
                        onClick={handleReadyDirectBuy}
                      >
                        바로 구매하기
                      </BottomBuyButton>
                    </BottomButtonRow>
                  </BottomOrderPanel>
                </BottomOrderBodyInner>
              </BottomOrderBody>
            )}
          </BottomOrderBar>
        )}
      </Wrapper>
    </>
  );
}

function displayValue(value) {
  return value === null || value === undefined || value === "" ? "-" : value;
}

function getPetEmoji(petType, productTargetPetType) {
  const type = petType ?? productTargetPetType;

  if (type === "D") {
    return "🐶";
  }

  if (type === "C") {
    return "🐱";
  }

  return "🐾";
}

function formatPetWeight(weight) {
  if (weight === null || weight === undefined || weight === "") {
    return "-";
  }

  return `${weight}kg`;
}

function getRecommendPetMeta(pet) {
  if (!pet) {
    return "";
  }

  const breedName = pet.breedName ?? "품종 정보 없음";
  const weight = formatPetWeight(pet.petWeight);

  return `${breedName} · ${weight}`;
}

function getRecommendAmountText(pet) {
  if (!pet) {
    return "-";
  }

  if (pet.dailyAmountText) {
    return pet.dailyAmountText;
  }

  const guide = pet.matchedFeedingGuide;

  if (!guide || guide.feedingDailyAmount == null) {
    return "-";
  }

  return `1일 ${guide.feedingDailyAmount}${guide.feedingUnit ?? "g"}`;
}

function getRecommendOverlayTitle(status) {
  if (status === "NEED_LOGIN") {
    return "로그인 하고";
  }

  return "반려동물을 등록하고";
}

function getRecommendActionText(status) {
  if (status === "NEED_LOGIN") {
    return "로그인/회원가입";
  }

  return "반려동물 등록";
}

function getCategoryLabel(category) {
  const map = {
    FOOD: "사료",
    SNACK: "간식",
    SUPPLEMENT: "영양제",
    TOILET: "배변용품",
  };

  return map[category] ?? category;
}

function getPromoImageByCategory(category) {
  const imageMap = {
    FOOD: foodImg,
    SNACK: snackImg,
    SUPPLEMENT: supplementImg,
    TOILET: toiletImg,
  };

  return imageMap[category] ?? foodImg;
}

function isNutritionAndFeedingCategory(category) {
  return ["FOOD", "SNACK", "SUPPLEMENT"].includes(category);
}

function getFeedingWeightRange(guide) {
  const min = guide.feedingMinWeight;
  const max = guide.feedingMaxWeight;

  if (min == null && max != null) {
    return `${max}kg 미만`;
  }

  if (min != null && max != null) {
    return `${min}kg 이상 ~ ${max}kg 미만`;
  }

  if (min != null && max == null) {
    return `${min}kg 이상`;
  }

  return "-";
}

function getFeedingAmount(guide) {
  if (guide.feedingDailyAmount == null) {
    return "-";
  }

  return `${guide.feedingDailyAmount}${guide.feedingUnit ?? "g"}`;
}

function getTagInfo(category, tagName) {
  const defaultMap = {
    FOOD: {
      description:
        "매일 먹는 상품인 만큼 영양 균형과 기호성을 함께 고려한 상품입니다.",
    },
    SNACK: {
      description:
        "보상, 기호성, 관리 목적을 함께 고려하여 즐겁게 급여할 수 있는 상품입니다.",
    },
    SUPPLEMENT: {
      description:
        "건강 관리를 위해 필요한 기능성 정보를 기준으로 선택할 수 있는 상품입니다.",
    },
    TOILET: {
      description:
        "실내 생활의 청결과 편의성을 높이기 위한 배변 관련 상품입니다.",
    },
  };

  const tagMap = {
    성장: "성장기 반려동물의 균형 잡힌 발달을 고려한 상품 태그입니다.",
    체중관리: "체중 관리가 필요한 반려동물을 위해 부담을 줄인 상품 태그입니다.",
    피부: "피부와 모질 관리가 필요한 반려동물을 위한 상품 태그입니다.",
    소화: "소화 부담과 장 건강을 고려한 상품 태그입니다.",
    치아: "치아와 구강 관리가 필요한 반려동물을 위한 상품 태그입니다.",
    칼로리: "칼로리 부담을 줄여 가볍게 급여할 수 있는 상품 태그입니다.",
    보상: "훈련이나 산책 후 보상으로 활용하기 좋은 상품 태그입니다.",
    기호성: "입맛이 까다로운 반려동물을 고려한 상품 태그입니다.",
    관절: "관절과 연골 관리가 필요한 반려동물을 위한 상품 태그입니다.",
    면역: "기초 체력과 면역 관리를 고려한 상품 태그입니다.",
    눈: "눈 건강과 눈물 관리가 필요한 반려동물을 위한 상품 태그입니다.",
    탈취: "배변 냄새를 줄여 쾌적한 실내 환경을 돕는 상품 태그입니다.",
    흡수: "소변 흡수력과 사용 편의성을 고려한 상품 태그입니다.",
    위생: "청결하고 위생적인 생활 관리를 위한 상품 태그입니다.",
    대용량:
      "여러 마리 반려동물을 키우거나 자주 사용하는 보호자에게 적합한 상품 태그입니다.",
  };

  return {
    description:
      tagMap[tagName] ??
      defaultMap[category]?.description ??
      "반려동물의 건강한 생활을 위한 상품입니다.",
  };
}

const Wrapper = styled.main`
  width: 100%;
  background-color: var(--color-white);
  padding-bottom: 56px;

  [data-reveal] {
    opacity: 0;
    transform: translateY(28px);
    filter: blur(6px);
    transition:
      opacity 0.62s ease,
      transform 0.62s cubic-bezier(0.18, 0.89, 0.32, 1.05),
      filter 0.62s ease;
  }

  [data-reveal].is-visible {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
`;

const TopSection = styled.section`
  padding: 32px 0 38px;
  background-color: var(--color-white);
`;

const TopInner = styled.div`
  width: 1300px;
  margin: 0 auto;

  display: grid;
  grid-template-columns: 600px 560px;
  gap: 70px;
  align-items: stretch;
`;

const ImageSection = styled.section`
  min-height: 586px;

  display: flex;
  flex-direction: column;
`;

const MainImageBox = styled.div`
  width: 600px;
  height: 520px;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;
  border-radius: 4px;
  background-color: transparent;
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;

  animation: mainImageFadeIn 0.32s ease both;
  will-change: opacity, transform, filter;

  @keyframes mainImageFadeIn {
    0% {
      opacity: 0;
      transform: scale(0.985);
      filter: blur(5px);
    }

    100% {
      opacity: 1;
      transform: scale(1);
      filter: blur(0);
    }
  }
`;

const ImagePlaceholder = styled.div`
  color: var(--text-desc);
  font-size: 14px;
  font-weight: 600;
`;

const ThumbList = styled.div`
  margin-top: auto;
  padding-top: 18px;

  display: flex;
  justify-content: center;
  gap: 8px;
`;

const ThumbButton = styled.button`
  width: 58px;
  height: 58px;
  padding: 3px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 2px solid
    ${(props) => (props.$active ? "var(--color-main)" : "#dce7e2")};
  border-radius: 5px;
  background-color: var(--color-white);

  transition:
    border-color 0.16s ease,
    transform 0.16s ease;

  &:hover {
    border-color: var(--color-main);
    transform: translateY(-1px);
  }
`;

const ThumbImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const InfoSection = styled.section`
  padding-top: 0;
`;

const CategoryPath = styled.div`
  height: 24px;
  margin-bottom: 14px;

  display: inline-flex;
  align-items: center;
  gap: 8px;

  color: var(--text-sub);
  font-size: 14px;
  font-weight: 700;

  strong {
    color: var(--text-desc);
    font-size: 13px;
    font-weight: 600;
  }
`;

const ProductName = styled.h1`
  margin: 0 0 12px;

  color: var(--text-main);
  font-size: 32px;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -1.2px;
`;

const ReviewMiniLine = styled.div`
  margin-bottom: 24px;

  display: flex;
  align-items: center;
  gap: 5px;

  color: var(--text-sub);
  font-size: 14px;
  font-weight: 700;
`;

const ReviewStar = styled.span`
  color: #ffc400;
  font-size: 15px;
`;

const Price = styled.p`
  margin: 0 0 18px;

  color: var(--text-main);
  font-size: 33px;
  font-weight: 700;
  letter-spacing: -1.3px;
`;

const BenefitBox = styled.div`
  width: 100%;
  padding: 18px 20px;
  margin-bottom: 18px;

  border-radius: 5px;
  background-color: #eeeeee;
`;

const BenefitTitle = styled.p`
  margin: 0 0 13px;

  color: var(--text-main);
  font-size: 14px;
  font-weight: 700;
`;

const BenefitList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    position: relative;

    padding-left: 18px;
    margin-bottom: 9px;

    color: var(--text-sub);
    font-size: 13px;
    font-weight: 500;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 8px;

      width: 5px;
      height: 5px;

      background-color: var(--color-main);
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const DeliveryRow = styled.div`
  display: grid;
  grid-template-columns: 76px 1fr;
  gap: 10px;

  margin-bottom: 20px;
`;

const DeliveryTitle = styled.strong`
  color: var(--text-main);
  font-size: 15px;
  font-weight: 700;
`;

const DeliveryTextBox = styled.div`
  color: var(--text-sub);
  font-size: 14px;
  font-weight: 700;

  strong {
    margin-right: 4px;
    color: var(--text-main);
    font-weight: 700;
  }

  p {
    margin: 8px 0 0;
    color: var(--text-sub);
    font-size: 14px;
    font-weight: 700;
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  margin: 0 0 24px;

  background-color: #e5ece8;
`;

const QuantityArea = styled.div`
  display: flex;
  align-items: center;
  gap: 74px;

  margin-bottom: 26px;
`;

const QuantityLabel = styled.span`
  color: var(--text-main);
  font-size: 15px;
  font-weight: 700;
`;

const QuantityControl = styled.div`
  width: 112px;
  height: 34px;

  display: grid;
  grid-template-columns: 34px 1fr 34px;
  align-items: center;

  button {
    border: 1px solid #dce7e2;
    background-color: var(--color-white);
    color: var(--text-main);
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
  }

  span {
    display: flex;
    align-items: center;
    justify-content: center;

    color: var(--text-main);
    font-size: 15px;
    font-weight: 700;
  }
`;

const TopTotalRow = styled.div`
  padding: 8px 0 34px;

  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 34px;

  span {
    color: var(--text-sub);
    font-size: 16px;
    font-weight: 700;
  }

  strong {
    color: var(--text-main);
    font-size: 34px;
    font-weight: 700;
    letter-spacing: -1.2px;
  }
`;

const ButtonRow = styled.div`
  position: relative;

  display: grid;
  grid-template-columns: 116px 1fr 1fr;
  gap: 12px;
  align-items: stretch;
`;

const WishButton = styled.button`
  width: 116px;
  height: 56px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid
    ${({ $active }) => ($active ? "var(--color-main)" : "#cfd8d3")};
  border-radius: 4px;
  background-color: ${({ $active }) =>
    $active ? "var(--color-main-soft)" : "var(--color-white)"};
  color: ${({ $active }) =>
    $active ? "var(--color-main)" : "var(--text-main)"};

  font-size: 31px;
  line-height: 1;
  cursor: pointer;

  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease,
    border-color 0.16s ease,
    color 0.16s ease,
    background-color 0.16s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: var(--color-main);
    color: var(--color-main);
    background-color: #f8fffc;
    box-shadow: 0 8px 18px rgba(18, 45, 46, 0.08);
  }

  &:disabled {
    opacity: 0.55;
    cursor: wait;
    transform: none;
    box-shadow: none;
  }
`;

const CartButtonWrap = styled.div`
  position: relative;
  width: 100%;
  height: 56px;
`;

const CartButton = styled.button`
  width: 100%;
  height: 56px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 2px solid var(--color-main);
  border-radius: 4px;
  background-color: var(--color-white);
  color: var(--color-main);

  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.3px;
  cursor: pointer;

  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease,
    background-color 0.16s ease,
    color 0.16s ease;

  &:hover {
    transform: translateY(-1px);
    background-color: #f0fff8;
    box-shadow: 0 8px 18px rgba(0, 174, 142, 0.12);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const BuyButton = styled.button`
  width: 100%;
  height: 56px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 0;
  border-radius: 4px;
  background-color: var(--color-main);
  color: var(--color-white);

  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.3px;
  cursor: pointer;

  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease,
    filter 0.16s ease;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.02);
    box-shadow: 0 10px 22px rgba(0, 174, 142, 0.2);
  }
`;

const CartBubble = styled.div`
  position: absolute;
  left: 50%;
  bottom: calc(100% + 18px);
  transform: translateX(-50%);

  width: 270px;
  padding: 18px 18px 16px;

  border: 1px solid rgba(0, 174, 142, 0.35);
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 12px 28px rgba(18, 45, 46, 0.14);

  z-index: 20;
  text-align: center;

  animation: cartBubbleIn 0.22s ease both;

  &::before {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -9px;

    width: 16px;
    height: 16px;

    transform: translateX(-50%) rotate(45deg);

    border-right: 1px solid rgba(0, 174, 142, 0.35);
    border-bottom: 1px solid rgba(0, 174, 142, 0.35);
    background-color: #ffffff;
  }

  @keyframes cartBubbleIn {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(8px);
    }

    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
`;

const CartBubbleMessage = styled.p`
  margin: 0 0 14px;
  color: var(--text-main);
  font-size: 14px;
  font-weight: 700;
`;

const CartBubbleButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
`;

const CartBubbleSubButton = styled.button`
  height: 32px;
  padding: 0 13px;
  border: 1px solid var(--color-main);
  border-radius: 999px;
  background-color: #ffffff;
  color: var(--color-main);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background-color: #f0fff8;
  }
`;

const CartBubbleMainButton = styled.button`
  height: 32px;
  padding: 0 14px;
  border: 1px solid var(--color-main);
  border-radius: 999px;
  background-color: var(--color-main);
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    filter: brightness(0.98);
  }
`;

const TabAnchor = styled.div`
  width: 100%;
  height: 54px;
`;

const StickyTabBar = styled.nav`
  position: ${(props) => (props.$fixed ? "fixed" : "relative")};
  top: 0;
  left: 0;
  right: 0;
  z-index: 600;

  width: 100%;
  height: 54px;

  border-top: 1px solid #dce7e2;
  border-bottom: 1px solid #dce7e2;
  background-color: #e9fff5;
  box-shadow: ${(props) =>
    props.$fixed ? "0 3px 10px rgba(18, 45, 46, 0.08)" : "none"};
`;

const TabInner = styled.div`
  width: 1300px;
  height: 100%;
  margin: 0 auto;

  display: flex;
  align-items: center;
`;

const TabButton = styled.button`
  width: 132px;
  height: 100%;

  border: 0;
  border-bottom: 3px solid
    ${(props) => (props.$active ? "var(--color-main)" : "transparent")};
  background-color: transparent;
  color: ${(props) =>
    props.$active ? "var(--color-main)" : "var(--text-main)"};

  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`;

const ContentInner = styled.div`
  width: 1300px;
  margin: 0 auto;
`;

const AnalysisSection = styled.section`
  padding-top: 28px;
`;

const TagAnalysisCard = styled.article`
  position: relative;

  width: 100%;
  min-height: 230px;
  padding: 0;

  display: flex;
  align-items: center;

  overflow: hidden;
  border-radius: 24px;
  background-color: #f6fbf8;
  box-shadow: 0 16px 34px rgba(18, 45, 46, 0.08);
`;

const TagCardImage = styled.img`
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: cover;
  object-position: center;
`;

const TagCardText = styled.div`
  position: relative;
  z-index: 2;

  width: 520px;
  padding-left: 56px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const TagCardEyebrow = styled.p`
  margin: 0 0 12px;

  color: var(--color-main);
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.3px;
`;

const TagCardTitle = styled.h3`
  margin: 0 0 16px;

  color: #151918;
  font-size: 42px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -1.6px;
`;

const TagCardDesc = styled.p`
  width: 460px;
  margin: 0;

  color: #465451;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.7;
  letter-spacing: -0.35px;
`;

const SectionBlock = styled.section`
  margin-top: 38px;
`;

const SectionTitleRow = styled.div`
  margin-bottom: 20px;

  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  border-bottom: 1px solid #dce7e2;
  padding-bottom: 10px;
`;

const SectionTitle = styled.h2`
  margin: 0;

  color: var(--text-main);
  font-size: 18px;
  font-weight: 700;
`;

const SectionDesc = styled.p`
  margin: 0;

  color: var(--text-desc);
  font-size: 12px;
  font-weight: 700;
`;

const NutritionTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;

  overflow: hidden;
  border: 1px solid #dce7e2;
  border-radius: 12px;

  th,
  td {
    height: 44px;
    text-align: center;
    font-size: 14px;
  }

  th {
    background-color: #dff5eb;
    color: var(--text-main);
    font-weight: 700;
    border-bottom: 1px solid #cfe5dc;
  }

  td {
    background-color: var(--color-white);
    color: var(--text-main);
    font-weight: 700;
  }

  th:nth-child(2),
  td:nth-child(2) {
    border-right: 1px solid #dce7e2;
  }

  tbody tr + tr td {
    border-top: 1px solid #eef5f1;
  }
`;
const FeedingRecommendLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  align-items: stretch;
`;

const FeedingGuideCard = styled.article`
  min-height: 176px;
  padding: 24px 24px 24px 28px;

  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 30px;
  align-items: center;

  border: 1px solid #d8dedb;
  border-radius: 14px;
  background-color: #ffffff;
`;

const FeedingGuideLeft = styled.div`
  min-width: 0;
  height: 100%;
  padding-right: 30px;

  display: grid;
  grid-template-rows: auto 1fr;
  align-content: center;
  row-gap: 18px;

  border-right: 1px solid #d8dedb;
`;

const FeedingGuideTitle = styled.h3`
  margin: 0;

  color: var(--color-main);
  font-size: 15px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.35px;
`;

const FeedingMethodContent = styled.div`
  min-width: 0;

  display: grid;
  grid-template-columns: 76px minmax(0, 1fr);
  gap: 16px;
  align-items: center;
`;

const FeedingFoodImageBox = styled.div`
  width: 76px;
  height: 76px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;
  overflow: hidden;
  border-radius: 10px;
  background-color: #f7faf8;
`;

const FeedingFoodImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const FeedingFoodEmoji = styled.span`
  font-size: 34px;
`;

const FeedingMethodTextBox = styled.div`
  min-width: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const FeedingMethodName = styled.strong`
  display: block;
  max-width: 100%;
  margin-bottom: 8px;

  color: #202423;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.42;
  letter-spacing: -0.45px;

  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const FeedingMethodDesc = styled.p`
  margin: 0;

  color: #64716d;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: -0.2px;
`;

const FeedingGuideRight = styled.div`
  min-width: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
`;

const FeedingPillRow = styled.div`
  width: 100%;
  min-height: 36px;
  padding: 0 18px;

  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 16px;

  border-radius: 5px;
  background-color: #c9f0dd;

  span {
    min-width: 0;

    color: #43504d;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.25px;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  strong {
    color: #43504d;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.25px;
    white-space: nowrap;
  }
`;

const FeedingEmptyText = styled.p`
  margin: 0;

  color: #64716d;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
`;

const PetRecommendCard = styled.article`
  position: relative;

  min-height: 176px;
  padding: 0;

  border: 1px solid #d8dedb;
  border-radius: 14px;
  background-color: #ffffff;

  overflow: hidden;
`;

const RecommendPetInfoBox = styled.div`
  min-width: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const RecommendCardLabel = styled.p`
  margin: 0 0 16px;

  color: var(--color-main);
  font-size: 15px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.35px;
`;

const RecommendPetMain = styled.div`
  display: grid;
  grid-template-columns: 76px minmax(0, 1fr);
  gap: 18px;
  align-items: center;
`;

const RecommendPetImageBox = styled.div`
  width: 76px;
  height: 76px;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;
  border-radius: 50%;
  background-color: #f4f8f6;

  color: #222;
  font-size: 34px;
  font-weight: 700;
`;

const RecommendPetImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RecommendPetTextBox = styled.div`
  min-width: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const RecommendPetName = styled.strong`
  display: block;
  margin-bottom: 7px;

  color: #151918;
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -1px;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const RecommendPetMeta = styled.span`
  color: #64716d;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.25px;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const RecommendAmountArea = styled.div`
  min-width: 0;
  margin: 0;
  padding: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  text-align: left;

  span {
    display: block;
    margin-bottom: 8px;

    color: #43504d;
    font-size: 13px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.25px;
    white-space: nowrap;
  }

  strong {
    display: block;

    color: var(--color-main);
    font-size: 44px;
    font-weight: 700;
    line-height: 0.95;
    letter-spacing: -1.8px;
    white-space: nowrap;
  }
`;

const RecommendSlideContent = styled.div`
  width: 100%;
  min-height: 176px;
  padding: 28px 78px 28px 86px;

  display: grid;
  grid-template-columns: minmax(0, 1fr) 210px;
  gap: 34px;
  align-items: center;

  animation: petSlideIn 0.34s cubic-bezier(0.18, 0.89, 0.32, 1.18);

  @keyframes petSlideIn {
    0% {
      opacity: 0;
      transform: translateX(14px);
      filter: blur(3px);
    }

    100% {
      opacity: 1;
      transform: translateX(0);
      filter: blur(0);
    }
  }
`;

const RecommendDisabledContent = styled.div`
  width: 100%;
  min-height: 176px;
  padding: 28px 78px 28px 86px;

  display: grid;
  grid-template-columns: minmax(0, 1fr) 210px;
  gap: 34px;
  align-items: center;

  ${RecommendPetInfoBox},
  ${RecommendAmountArea} {
    opacity: 0.9;
    filter: grayscale(1) blur(2px);
  }
`;

const RecommendArrowButton = styled.button`
  position: absolute;
  top: 50%;
  ${({ $left }) => ($left ? "left: 18px;" : "right: 18px;")}

  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 0;
  border-radius: 50%;
  background-color: #ffffff;
  color: #202423;

  font-size: 30px;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;

  transform: translateY(-50%);
  z-index: 4;

  box-shadow: 0 5px 16px rgba(18, 45, 46, 0.18);

  transition:
    transform 0.16s ease,
    background-color 0.16s ease,
    color 0.16s ease,
    opacity 0.16s ease;

  &:hover {
    background-color: var(--color-main);
    color: #ffffff;
    transform: translateY(-50%) scale(1.04);
  }

  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
    transform: translateY(-50%);
  }
`;

const RecommendLockOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 3;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding-top: 4px;

  background-color: rgba(32, 32, 32, 0.62);
  backdrop-filter: blur(2.5px);

  text-align: center;
`;

const RecommendLockTitle = styled.p`
  margin: 0 0 3px;

  color: var(--color-white);
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.25px;
`;

const RecommendLockDesc = styled.p`
  margin: 0 0 12px;

  color: var(--color-white);
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.35px;
`;

const RecommendActionButton = styled.button`
  min-width: 138px;
  height: 34px;
  padding: 0 20px;

  border: 0;
  border-radius: 999px;
  background-color: var(--color-main);
  color: var(--color-white);

  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  box-shadow: 0 8px 18px rgba(0, 174, 142, 0.24);

  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease,
    filter 0.16s ease;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.03);
    box-shadow: 0 10px 22px rgba(0, 174, 142, 0.32);
  }
`;

const DetailContentSection = styled.section`
  padding-top: 28px;
`;

const PromoLongImageBox = styled.section`
  width: 100%;
  margin-bottom: 28px;

  display: flex;
  justify-content: center;

  overflow: hidden;
  border: 1px solid #dce7e2;
  border-radius: 2px;
  background-color: #f7faf7;
`;

const PromoLongImage = styled.img`
  width: 100%;
  display: block;
  object-fit: cover;
`;

const ProductInfoBlock = styled.section`
  margin-top: 28px;
`;

const ProductInfoTable = styled.table`
  width: 100%;
  margin-top: 16px;
  border-collapse: collapse;

  th,
  td {
    height: 46px;
    border: 1px solid #dce7e2;
    font-size: 13px;
  }

  th {
    width: 220px;
    background-color: #f4faf7;
    color: var(--text-main);
    font-weight: 700;
  }

  td {
    padding: 0 16px;
    color: var(--text-sub);
    font-weight: 700;
  }
`;

const ReviewSection = styled.section`
  padding-top: 14px;
`;

const EmptyPanel = styled.div`
  min-height: 100px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #dce7e2;
  background-color: var(--color-white);

  color: var(--text-sub);
  font-size: 13px;
  font-weight: 700;
`;

const BottomOrderBar = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 500;

  height: ${(props) => (props.$open ? "230px" : "42px")};

  border-top: 2px solid var(--color-main);
  background-color: var(--color-white);
  box-shadow: ${(props) =>
    props.$open ? "0 -6px 20px rgba(18, 45, 46, 0.08)" : "none"};

  transition:
    height 0.22s ease,
    transform 0.22s ease;
`;

const BottomOrderHeader = styled.div`
  width: 100%;
  height: 42px;
  position: relative;
`;

const BottomOrderHeaderInner = styled.div`
  width: 1300px;
  height: 100%;
  margin: 0 auto;

  position: relative;
`;

const BottomOpenButton = styled.button`
  position: absolute;
  right: 0px;
  top: -44px;

  width: 120px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  border: 0;
  border-radius: 3px 3px 0 0;
  background-color: var(--color-main);
  color: var(--color-white);

  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.04);

  span {
    display: inline-flex;
    align-items: center;
    height: 100%;
  }

  em {
    display: inline-flex;
    align-items: center;
    height: 100%;

    font-style: normal;
    font-size: 13px;
    font-weight: 700;
    line-height: 1;
  }
`;

const BottomOrderBody = styled.div`
  width: 100%;
  height: 188px;
  background-color: var(--color-white);
`;

const BottomOrderBodyInner = styled.div`
  width: 1300px;
  height: 100%;
  margin: 0 auto;

  display: grid;
  grid-template-columns: 1fr 520px;
  align-items: start;
`;

const BottomOrderSpacer = styled.div``;

const BottomOrderPanel = styled.div`
  width: 520px;
  padding-top: 22px;
`;

const BottomSelectBox = styled.div`
  height: 68px;
  padding: 0 18px;

  display: grid;
  grid-template-columns: minmax(0, 1fr) 104px 126px;
  align-items: center;
  gap: 16px;

  border-radius: 3px;
  background-color: #eeeeee;
`;

const BottomSelectTitle = styled.p`
  margin: 0;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  color: var(--text-main);
  font-size: 13px;
  font-weight: 700;
`;

const BottomSelectControl = styled.div`
  width: 104px;
  height: 30px;

  display: grid;
  grid-template-columns: 30px 1fr 30px;

  border: 1px solid #dce7e2;
  background-color: var(--color-white);

  button {
    border: 0;
    background-color: var(--color-white);
    color: var(--text-main);
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
  }

  span {
    display: flex;
    align-items: center;
    justify-content: center;

    border-left: 1px solid #dce7e2;
    border-right: 1px solid #dce7e2;

    color: var(--text-main);
    font-size: 13px;
    font-weight: 700;
  }
`;

const BottomSelectPrice = styled.strong`
  text-align: right;

  color: var(--text-main);
  font-size: 16px;
  font-weight: 700;
`;

const BottomTotalRow = styled.div`
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;

  span {
    color: var(--text-sub);
    font-size: 13px;
    font-weight: 700;
  }

  strong {
    color: var(--text-main);
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.7px;
  }
`;

const BottomButtonRow = styled.div`
  margin-top: 4px;

  display: grid;
  grid-template-columns: 1fr 1.55fr;
  gap: 12px;
`;

const BottomCartButtonWrap = styled.div`
  position: relative;
  width: 100%;
`;

const BottomCartButton = styled.button`
  width: 100%;
  height: 44px;

  border: 2px solid var(--color-main);
  border-radius: 3px;
  background-color: var(--color-white);
  color: var(--color-main);

  font-size: 14px;
  font-weight: 700;
  cursor: pointer;

  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease,
    background-color 0.16s ease;

  &:hover {
    transform: translateY(-1px);
    background-color: #f0fff8;
    box-shadow: 0 8px 18px rgba(0, 174, 142, 0.12);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const BottomBuyButton = styled.button`
  height: 44px;

  border: 0;
  border-radius: 3px;
  background-color: var(--color-main);
  color: var(--color-white);

  font-size: 14px;
  font-weight: 700;
  cursor: pointer;

  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease,
    filter 0.16s ease;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.02);
    box-shadow: 0 10px 22px rgba(0, 174, 142, 0.2);
  }
`;

const BottomCartBubble = styled(CartBubble)`
  left: 50%;
  right: auto;
  bottom: calc(100% + 14px);
  transform: translateX(-50%);

  &::before {
    left: 50%;
    right: auto;
    transform: translateX(-50%) rotate(45deg);
  }
`;

const MessageBox = styled.div`
  width: 1300px;
  min-height: 300px;
  margin: 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--text-sub);
  font-size: 16px;
  font-weight: 700;
`;
