import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import PetStoreUserNav from "./PetStoreUserNav";
import usePetStoreProductDetail from "../../features/petStore/hooks/usePetStoreProudctDetail";

export default function PetStoreProductDetailPage() {
  const { productId } = useParams();

  const { product, isLoading, error } = usePetStoreProductDetail(productId);

  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [activeTab, setActiveTab] = useState("analysis");
  const [showBottomBar, setShowBottomBar] = useState(false);
  const [isBottomOrderOpen, setIsBottomOrderOpen] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isTabFixed, setIsTabFixed] = useState(false);

  const tabAnchorRef = useRef(null);
  const analysisRef = useRef(null);
  const detailRef = useRef(null);
  const reviewRef = useRef(null);

  const imageList = useMemo(() => {
    if (!product) {
      return [];
    }

    return [product.mainImageUrl, ...(product.subImageUrls ?? [])].filter(
      Boolean,
    );
  }, [product]);

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

      const nextBottomOffset =
        footerTop < window.innerHeight
          ? Math.max(0, window.innerHeight - footerTop + 12)
          : 0;

      setBottomOffset(nextBottomOffset);

      const isAfterAnalysis = scrollY > analysisTop + 120;
      setShowBottomBar(isAfterAnalysis);

      if (scrollY >= reviewTop - 150) {
        setActiveTab("review");
        return;
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

  if (isLoading) {
    return (
      <>
        <PetStoreUserNav />
        <Wrapper>
          <MessageBox>상품 정보를 불러오는 중입니다...</MessageBox>
        </Wrapper>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <PetStoreUserNav />
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

  const showNutritionAndFeeding = isNutritionAndFeedingCategory(
    product.productCategory,
  );

  return (
    <>
      <PetStoreUserNav
        targetPetType={product.productTargetPetType}
        activeCategory={product.productCategory}
      />

      <Wrapper>
        <TopSection>
          <TopInner>
            <ImageSection>
              <MainImageBox>
                {selectedImageUrl ? (
                  <MainImage src={selectedImageUrl} alt={product.productName} />
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
                    onClick={() => setSelectedImageUrl(url)}
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
                <WishButton type="button">♡</WishButton>
                <CartButton type="button">장바구니</CartButton>
                <BuyButton type="button">바로 구매하기</BuyButton>
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
            <TagAnalysisCard>
              <TagCardText>
                <TagCardEyebrow>상품 태그 분석</TagCardEyebrow>

                <TagCardTitle>#{tagName}</TagCardTitle>

                <TagCardDesc>{tagInfo.description}</TagCardDesc>
              </TagCardText>

              <TagCardIconBox>
                <TagCardIcon>{tagInfo.icon}</TagCardIcon>
              </TagCardIconBox>
            </TagAnalysisCard>

            {showNutritionAndFeeding && (
              <SectionBlock>
                <SectionTitleRow>
                  <SectionTitle>영양성분 / 주요성분</SectionTitle>
                  <SectionDesc>
                    상품 등록 시 입력한 영양 정보를 기준으로 표시됩니다.
                  </SectionDesc>
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
              <SectionBlock>
                <SectionTitleRow>
                  <SectionTitle>급여 기준 / 급여 추천</SectionTitle>
                  <SectionDesc>
                    반려동물 정보 연동 전까지는 상품 등록 기준 급여량을
                    표시합니다.
                  </SectionDesc>
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
                            <span>♟ {getFeedingWeightRange(guide)}</span>
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

                  <PetRecommendCard>
                    <RecommendArrowButton type="button" $left>
                      ‹
                    </RecommendArrowButton>

                    <RecommendPetInfoBox>
                      <RecommendCardLabel>
                        우리 아이 추천 급여량
                      </RecommendCardLabel>

                      <RecommendPetMain>
                        <RecommendPetImageBox>
                          {product.productTargetPetType === "D" ? "🐶" : "🐱"}
                        </RecommendPetImageBox>

                        <RecommendPetTextBox>
                          <RecommendPetName>깨깨</RecommendPetName>
                          <RecommendPetMeta>
                            비숑 프리제 · 5살 · 7kg
                          </RecommendPetMeta>
                        </RecommendPetTextBox>
                      </RecommendPetMain>
                    </RecommendPetInfoBox>

                    <RecommendAmountArea>
                      <span>1일 권장 급여량</span>
                      <strong>1일 80g</strong>
                    </RecommendAmountArea>

                    <RecommendArrowButton type="button" $right>
                      ›
                    </RecommendArrowButton>
                  </PetRecommendCard>
                </FeedingRecommendLayout>
              </SectionBlock>
            )}
          </AnalysisSection>

          <DetailContentSection ref={detailRef}>
            <PromoLongImageBox>
              <PromoPlaceholder>
                <PromoPlaceholderTitle>
                  {categoryLabel} 상세 홍보 이미지 영역
                </PromoPlaceholderTitle>

                <PromoPlaceholderDesc>
                  카테고리별 세로형 상세 이미지를 이 영역에 넣으면 됩니다.
                </PromoPlaceholderDesc>

                <PromoPlaceholderHint>
                  예: foodDetail.png / snackDetail.png / supplementDetail.png /
                  toiletDetail.png
                </PromoPlaceholderHint>
              </PromoPlaceholder>
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

          <ReviewSection ref={reviewRef}>
            <SectionTitleRow>
              <SectionTitle>구매자 리뷰</SectionTitle>
              <SectionDesc>리뷰 기능은 추후 연동 예정입니다.</SectionDesc>
            </SectionTitleRow>

            <ReviewSummaryBox>
              <ReviewScoreBox>
                <ReviewScore>4.9</ReviewScore>
                <ReviewStars>★★★★★</ReviewStars>
                <ReviewCount>리뷰 128개 기준</ReviewCount>
              </ReviewScoreBox>

              <ReviewGraphBox>
                {[5, 4, 3, 2, 1].map((score, index) => (
                  <ReviewGraphRow key={score}>
                    <span>{score}점</span>
                    <ReviewGraphTrack>
                      <ReviewGraphFill $width={`${80 - index * 15}%`} />
                    </ReviewGraphTrack>
                    <em>{80 - index * 15}%</em>
                  </ReviewGraphRow>
                ))}
              </ReviewGraphBox>
            </ReviewSummaryBox>

            <ReviewList>
              {Array.from({ length: 5 }).map((_, index) => (
                <ReviewItem key={index}>
                  <ReviewUserBox>
                    <ReviewAvatar>🐾</ReviewAvatar>
                    <div>
                      <ReviewUserName>구매자 {index + 1}</ReviewUserName>
                      <ReviewDate>2026.06.01</ReviewDate>
                    </div>
                  </ReviewUserBox>

                  <ReviewContentBox>
                    <ReviewStars>★★★★★</ReviewStars>
                    <ReviewText>
                      아직 리뷰 기능 연동 전입니다. 추후 실제 구매 리뷰가 이
                      영역에 표시됩니다.
                    </ReviewText>
                  </ReviewContentBox>

                  <ReviewThumbList>
                    {imageList.slice(0, 3).map((url, imgIndex) => (
                      <ReviewThumb
                        key={`${url}-${imgIndex}`}
                        src={url}
                        alt="리뷰 이미지"
                      />
                    ))}
                  </ReviewThumbList>
                </ReviewItem>
              ))}
            </ReviewList>
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
                      <BottomCartButton type="button">
                        장바구니
                      </BottomCartButton>
                      <BottomBuyButton type="button">
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

function getCategoryLabel(category) {
  const map = {
    FOOD: "사료",
    SNACK: "간식",
    SUPPLEMENT: "영양제",
    TOILET: "배변용품",
  };

  return map[category] ?? category;
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
      icon: "🥣",
      description:
        "매일 먹는 상품인 만큼 영양 균형과 기호성을 함께 고려한 상품입니다.",
    },
    SNACK: {
      icon: "🦴",
      description:
        "보상, 기호성, 관리 목적을 함께 고려하여 즐겁게 급여할 수 있는 상품입니다.",
    },
    SUPPLEMENT: {
      icon: "💊",
      description:
        "건강 관리를 위해 필요한 기능성 정보를 기준으로 선택할 수 있는 상품입니다.",
    },
    TOILET: {
      icon: "🧼",
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
    icon: defaultMap[category]?.icon ?? "🐾",
    description:
      tagMap[tagName] ??
      defaultMap[category]?.description ??
      "반려동물의 건강한 생활을 위한 상품입니다.",
  };
}

const Wrapper = styled.main`
  width: 100%;
  background-color: var(--color-white);
  padding-bottom: 190px;
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
  align-items: start;
`;

const ImageSection = styled.section``;

const MainImageBox = styled.div`
  width: 600px;
  height: 520px;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;
  border-radius: 4px;
  background-color: #f4faf7;
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const ImagePlaceholder = styled.div`
  color: var(--text-desc);
  font-size: 14px;
  font-weight: 800;
`;

const ThumbList = styled.div`
  margin-top: 38px;

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
  font-weight: 800;

  strong {
    color: var(--text-desc);
    font-size: 13px;
    font-weight: 900;
  }
`;

const ProductName = styled.h1`
  margin: 0 0 12px;

  color: var(--text-main);
  font-size: 32px;
  font-weight: 900;
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
  font-size: 34px;
  font-weight: 900;
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
  font-weight: 900;
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
    font-size: 14px;
    font-weight: 700;

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
  font-weight: 900;
`;

const DeliveryTextBox = styled.div`
  color: var(--text-sub);
  font-size: 14px;
  font-weight: 700;

  strong {
    margin-right: 4px;
    color: var(--text-main);
    font-weight: 900;
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
  font-weight: 900;
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
    font-weight: 900;
    cursor: pointer;
  }

  span {
    display: flex;
    align-items: center;
    justify-content: center;

    color: var(--text-main);
    font-size: 15px;
    font-weight: 800;
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
    font-weight: 800;
  }

  strong {
    color: var(--text-main);
    font-size: 34px;
    font-weight: 900;
    letter-spacing: -1.2px;
  }
`;

const ButtonRow = styled.div`
  display: grid;
  grid-template-columns: 144px 170px 1fr;
  gap: 12px;
`;

const WishButton = styled.button`
  height: 56px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #cfd8d3;
  border-radius: 4px;
  background-color: var(--color-white);
  color: var(--text-main);

  font-size: 36px;
  line-height: 1;
  cursor: pointer;
`;

const CartButton = styled.button`
  height: 56px;

  border: 2px solid var(--color-main);
  border-radius: 4px;
  background-color: var(--color-white);
  color: var(--color-main);

  font-size: 17px;
  font-weight: 900;
  cursor: pointer;
`;

const BuyButton = styled.button`
  height: 56px;

  border: 0;
  border-radius: 4px;
  background-color: var(--color-main);
  color: var(--color-white);

  font-size: 17px;
  font-weight: 900;
  cursor: pointer;
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
  font-weight: 900;
  cursor: pointer;
`;

const ContentInner = styled.div`
  width: 1300px;
  margin: 0 auto;
`;

const AnalysisSection = styled.section`
  padding-top: 28px;
`;

const TagAnalysisCard = styled.section`
  position: relative;
  min-height: 210px;
  padding: 38px 52px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  overflow: hidden;
  background: linear-gradient(120deg, #e9fff5 0%, #b7f0da 52%, #effaf5 100%);
`;

const TagCardText = styled.div`
  position: relative;
  z-index: 2;
`;

const TagCardEyebrow = styled.p`
  margin: 0 0 8px;

  color: var(--color-main);
  font-size: 16px;
  font-weight: 900;
`;

const TagCardTitle = styled.h2`
  margin: 0 0 14px;

  color: var(--text-main);
  font-size: 30px;
  font-weight: 900;
  letter-spacing: -1px;
`;

const TagCardDesc = styled.p`
  width: 520px;
  margin: 0;

  color: var(--text-sub);
  font-size: 15px;
  font-weight: 700;
  line-height: 1.65;
`;

const TagCardIconBox = styled.div`
  width: 180px;
  height: 180px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.45);
`;

const TagCardIcon = styled.span`
  font-size: 80px;
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
  font-weight: 900;
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
    font-weight: 900;
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
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: stretch;
`;

const FeedingGuideCard = styled.article`
  min-height: 210px;
  padding: 18px 22px;

  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 24px;

  border: 1px solid #d5e0dc;
  border-radius: 14px;
  background-color: var(--color-white);
`;

const FeedingGuideLeft = styled.div`
  padding-right: 22px;

  display: flex;
  flex-direction: column;
  justify-content: center;

  border-right: 1px solid #e2ebe7;
`;

const FeedingGuideTitle = styled.p`
  margin: 0 0 14px;

  color: var(--color-main);
  font-size: 14px;
  font-weight: 900;
`;

const FeedingMethodContent = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const FeedingMethodTextBox = styled.div`
  min-width: 0;
`;

const FeedingFoodImageBox = styled.div`
  width: 86px;
  height: 58px;
  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;
  border-radius: 10px;
  background-color: #f4faf7;
`;

const FeedingFoodImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const FeedingFoodEmoji = styled.span`
  font-size: 34px;
`;

const FeedingMethodName = styled.p`
  margin: 0 0 8px;

  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  color: var(--text-main);
  font-size: 14px;
  font-weight: 900;
  line-height: 1.45;
`;

const FeedingMethodDesc = styled.p`
  margin: 0;

  color: var(--text-desc);
  font-size: 11px;
  font-weight: 700;
`;

const FeedingGuideRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 14px;
`;

const FeedingPillRow = styled.div`
  height: 38px;
  padding: 0 18px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  border-radius: 6px;
  background-color: #c9f2e5;

  span {
    color: #4e7568;
    font-size: 13px;
    font-weight: 800;
  }

  strong {
    color: #4e7568;
    font-size: 13px;
    font-weight: 900;
  }
`;

const FeedingEmptyText = styled.div`
  min-height: 120px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--text-desc);
  font-size: 13px;
  font-weight: 800;
`;

const PetRecommendCard = styled.article`
  position: relative;
  min-height: 210px;
  padding: 26px 70px 26px 84px;

  display: grid;
  grid-template-columns: minmax(0, 1fr) 210px;
  align-items: center;
  gap: 28px;

  border: 1px solid #d5e0dc;
  border-radius: 14px;
  background-color: var(--color-white);
`;

const RecommendArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);

  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 0;
  border-radius: 50%;
  background-color: var(--color-white);
  box-shadow: 0 4px 16px rgba(18, 45, 46, 0.16);

  color: var(--text-main);
  font-size: 34px;
  font-weight: 400;
  line-height: 1;
  cursor: pointer;

  left: ${(props) => (props.$left ? "22px" : "auto")};
  right: ${(props) => (props.$right ? "22px" : "auto")};
`;

const RecommendPetInfoBox = styled.div`
  min-width: 0;
`;

const RecommendCardLabel = styled.p`
  margin: 0 0 18px;

  color: var(--color-main);
  font-size: 14px;
  font-weight: 900;
`;

const RecommendPetMain = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const RecommendPetImageBox = styled.div`
  width: 76px;
  height: 76px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;
  overflow: hidden;

  border-radius: 50%;
  background-color: #f4faf7;

  font-size: 42px;
`;

const RecommendPetTextBox = styled.div`
  min-width: 0;
`;

const RecommendPetName = styled.p`
  margin: 0 0 8px;

  color: var(--text-main);
  font-size: 26px;
  font-weight: 900;
  letter-spacing: -1px;
`;

const RecommendPetMeta = styled.p`
  margin: 0;

  color: var(--text-desc);
  font-size: 13px;
  font-weight: 800;
`;

const RecommendAmountArea = styled.div`
  text-align: left;

  span {
    display: block;
    margin-bottom: 6px;

    color: var(--text-sub);
    font-size: 13px;
    font-weight: 900;
  }

  strong {
    display: block;

    color: var(--color-main);
    font-size: 42px;
    font-weight: 900;
    letter-spacing: -1.8px;
    line-height: 1;
  }
`;

const DetailContentSection = styled.section`
  padding-top: 44px;
`;

const PromoLongImageBox = styled.section`
  width: 100%;
  min-height: 1120px;
  margin-bottom: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #dce7e2;
  background: linear-gradient(180deg, #effaf5 0%, #fffaf2 100%);
`;

const PromoPlaceholder = styled.div`
  text-align: center;
`;

const PromoPlaceholderTitle = styled.h2`
  margin: 0 0 12px;

  color: #005d4a;
  font-size: 34px;
  font-weight: 900;
`;

const PromoPlaceholderDesc = styled.p`
  margin: 0 0 8px;

  color: var(--text-sub);
  font-size: 15px;
  font-weight: 700;
`;

const PromoPlaceholderHint = styled.p`
  margin: 0;

  color: var(--text-desc);
  font-size: 12px;
  font-weight: 700;
`;

const ProductInfoBlock = styled.section`
  margin-top: 44px;
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
    font-weight: 900;
  }

  td {
    padding: 0 16px;
    color: var(--text-sub);
    font-weight: 700;
  }
`;

const ReviewSection = styled.section`
  padding-top: 48px;
`;

const ReviewSummaryBox = styled.section`
  padding: 28px 34px;
  margin-bottom: 26px;

  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 40px;

  border-top: 1px solid #dce7e2;
  border-bottom: 1px solid #dce7e2;
`;

const ReviewScoreBox = styled.div`
  text-align: center;
`;

const ReviewScore = styled.div`
  color: var(--text-main);
  font-size: 40px;
  font-weight: 900;
`;

const ReviewStars = styled.div`
  color: #ffc400;
  font-size: 17px;
  font-weight: 900;
`;

const ReviewCount = styled.p`
  margin: 8px 0 0;

  color: var(--text-sub);
  font-size: 12px;
  font-weight: 700;
`;

const ReviewGraphBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
`;

const ReviewGraphRow = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 42px;
  align-items: center;
  gap: 10px;

  span,
  em {
    color: var(--text-sub);
    font-size: 12px;
    font-weight: 700;
    font-style: normal;
  }
`;

const ReviewGraphTrack = styled.div`
  height: 8px;
  border-radius: 999px;
  background-color: #dff0e9;
`;

const ReviewGraphFill = styled.div`
  width: ${(props) => props.$width};
  height: 100%;

  border-radius: 999px;
  background-color: var(--color-main);
`;

const ReviewList = styled.div`
  border-top: 1px solid #dce7e2;
`;

const ReviewItem = styled.article`
  min-height: 112px;
  padding: 20px 0;

  display: grid;
  grid-template-columns: 180px 1fr 170px;
  gap: 20px;

  border-bottom: 1px solid #dce7e2;
`;

const ReviewUserBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ReviewAvatar = styled.div`
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  background-color: #f4faf7;
`;

const ReviewUserName = styled.p`
  margin: 0 0 4px;

  color: var(--text-main);
  font-size: 13px;
  font-weight: 900;
`;

const ReviewDate = styled.p`
  margin: 0;

  color: var(--text-desc);
  font-size: 11px;
  font-weight: 700;
`;

const ReviewContentBox = styled.div``;

const ReviewText = styled.p`
  margin: 8px 0 0;

  color: var(--text-sub);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.6;
`;

const ReviewThumbList = styled.div`
  display: flex;
  gap: 6px;
  justify-content: flex-end;
`;

const ReviewThumb = styled.img`
  width: 48px;
  height: 48px;

  border-radius: 4px;
  object-fit: cover;
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
  font-weight: 800;
`;

const BottomOrderBar = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: ${(props) => `${props.$bottomOffset}px`};
  z-index: 500;

  height: ${(props) => (props.$open ? "230px" : "42px")};

  border-top: 2px solid var(--color-main);
  background-color: var(--color-white);
  box-shadow: ${(props) =>
    props.$open ? "0 -6px 20px rgba(18, 45, 46, 0.08)" : "none"};

  transition: height 0.22s ease;
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
  font-weight: 900;
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
    font-weight: 900;
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
  font-weight: 900;
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
    font-weight: 900;
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
    font-weight: 800;
  }
`;

const BottomSelectPrice = styled.strong`
  text-align: right;

  color: var(--text-main);
  font-size: 16px;
  font-weight: 900;
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
    font-weight: 800;
  }

  strong {
    color: var(--text-main);
    font-size: 22px;
    font-weight: 900;
    letter-spacing: -0.7px;
  }
`;

const BottomButtonRow = styled.div`
  margin-top: 4px;

  display: grid;
  grid-template-columns: 1fr 1.55fr;
  gap: 12px;
`;

const BottomCartButton = styled.button`
  height: 44px;

  border: 2px solid var(--color-main);
  border-radius: 3px;
  background-color: var(--color-white);
  color: var(--color-main);

  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
`;

const BottomBuyButton = styled.button`
  height: 44px;

  border: 0;
  border-radius: 3px;
  background-color: var(--color-main);
  color: var(--color-white);

  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
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
  font-weight: 800;
`;
