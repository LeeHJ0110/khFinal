import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import api from "../../app/api/axios";

import usePetStoreCartList from "../../features/petStore/hooks/usePetStoreCartList";
import { insertCartProduct } from "../../features/petStore/api/petStoreOrderApi";
import useStorePaymentPoint from "../../features/petStore/hooks/useStorePaymentPoint";

import StorePaymentSummaryCard from "../../features/petStore/components/PetStorePaymentSummaryCard";
import PetStoreNavGate from "./PetStoreNavGate";

export default function PetStoreCartListPage() {
  const navigate = useNavigate();

  const {
    cart,
    handleDeleteCartItem,
    handleUpdateQty,
    loadCartList,
    isLoading,
  } = usePetStoreCartList();

  const cartItemList = useMemo(() => {
    return cart?.cartItemList ?? [];
  }, [cart]);

  const totalProductAmount = cart?.totalProductAmount ?? 0;
  const orderDeliveryFee = cart?.orderDeliveryFee ?? 0;

  const {
    currentPoint,
    usedPoint,
    finalOrderAmount,
    loadMyPoint,
    handleChangeUsedPoint,
    handleBlurUsedPoint,
    handleUseAllPoint,
    validateUsedPointUnit,
  } = useStorePaymentPoint({
    totalProductAmount,
    orderDeliveryFee,
  });

  const [selectedCartItemIds, setSelectedCartItemIds] = useState([]);
  const [recommendProductList, setRecommendProductList] = useState([]);
  const [isRecommendLoading, setIsRecommendLoading] = useState(false);
  const [recommendCartSubmittingId, setRecommendCartSubmittingId] =
    useState(null);

  const isAllSelected =
    cartItemList.length > 0 &&
    selectedCartItemIds.length === cartItemList.length;

  const topCartItem = cartItemList[0];

  const recommendTargetPetType = useMemo(() => {
    return (
      topCartItem?.productTargetPetType ??
      topCartItem?.targetPetType ??
      topCartItem?.petType ??
      ""
    );
  }, [topCartItem]);

  function formatPrice(value) {
    return `${Number(value ?? 0).toLocaleString()}원`;
  }

  function normalizeProductList(responseData) {
    if (Array.isArray(responseData)) {
      return responseData;
    }

    if (Array.isArray(responseData?.content)) {
      return responseData.content;
    }

    if (Array.isArray(responseData?.productList)) {
      return responseData.productList;
    }

    if (Array.isArray(responseData?.data)) {
      return responseData.data;
    }

    return [];
  }

  async function loadRecommendProductList() {
    if (!cartItemList.length || !recommendTargetPetType) {
      setRecommendProductList([]);
      return;
    }

    setIsRecommendLoading(true);

    try {
      const response = await api.get("/store/product", {
        params: {
          targetPetType: recommendTargetPetType,
          sort: "popular",
        },
      });

      const cartProductIdSet = new Set(
        cartItemList.map((item) => item.productId),
      );

      const list = normalizeProductList(response.data)
        .filter((product) => !cartProductIdSet.has(product.productId))
        .slice(0, 3);

      setRecommendProductList(list);
    } catch (error) {
      setRecommendProductList([]);
    } finally {
      setIsRecommendLoading(false);
    }
  }

  function handleToggleAll() {
    if (isAllSelected) {
      setSelectedCartItemIds([]);
      return;
    }

    setSelectedCartItemIds(cartItemList.map((item) => item.cartItemId));
  }

  function handleToggleItem(cartItemId) {
    setSelectedCartItemIds((prev) => {
      if (prev.includes(cartItemId)) {
        return prev.filter((id) => id !== cartItemId);
      }

      return [...prev, cartItemId];
    });
  }

  async function handleDecreaseQty(item) {
    if (item.cartItemQty <= 1) {
      const ok = window.confirm(
        "수량이 1개입니다. 해당 상품을 장바구니에서 삭제할까요?",
      );

      if (!ok) {
        return;
      }

      await handleDeleteCartItem(item.cartItemId);
      setSelectedCartItemIds((prev) =>
        prev.filter((id) => id !== item.cartItemId),
      );
      return;
    }

    await handleUpdateQty(item.cartItemId, item.cartItemQty - 1);
  }

  async function handleIncreaseQty(item) {
    await handleUpdateQty(item.cartItemId, item.cartItemQty + 1);
  }

  async function handleDeleteOne(cartItemId) {
    const ok = window.confirm("해당 상품을 장바구니에서 삭제할까요?");

    if (!ok) {
      return;
    }

    await handleDeleteCartItem(cartItemId);
    setSelectedCartItemIds((prev) => prev.filter((id) => id !== cartItemId));
  }

  async function handleDeleteSelected() {
    if (selectedCartItemIds.length === 0) {
      alert("삭제할 상품을 선택해주세요.");
      return;
    }

    const ok = window.confirm("선택한 상품을 장바구니에서 삭제할까요?");

    if (!ok) {
      return;
    }

    for (const cartItemId of selectedCartItemIds) {
      await handleDeleteCartItem(cartItemId);
    }

    setSelectedCartItemIds([]);
  }

  function handleGoOrderPage() {
    if (!cart || !cart.cartItemList || cart.cartItemList.length === 0) {
      alert("장바구니가 비어 있습니다.");
      return;
    }

    if (!validateUsedPointUnit()) {
      return;
    }

    sessionStorage.setItem("storeCheckoutUsedPoint", String(usedPoint));

    navigate("/store/order", {
      state: {
        usedPoint,
      },
    });
  }

  function handleGoProductDetail(productId) {
    navigate(`/store/product/${productId}`, {
      state: {
        from: "cart",
      },
    });
  }

  async function handleAddRecommendCart(event, product) {
    event.stopPropagation();

    if (!product?.productId) {
      alert("상품 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      setRecommendCartSubmittingId(product.productId);

      await insertCartProduct({
        productId: product.productId,
        qty: 1,
      });

      alert("장바구니에 상품이 담겼습니다.");
      await loadCartList();
    } catch (error) {
      alert("장바구니 담기에 실패했습니다.");
    } finally {
      setRecommendCartSubmittingId(null);
    }
  }

  useEffect(() => {
    setSelectedCartItemIds((prev) =>
      prev.filter((cartItemId) =>
        cartItemList.some((item) => item.cartItemId === cartItemId),
      ),
    );
  }, [cartItemList]);

  useEffect(() => {
    loadRecommendProductList();
  }, [cartItemList.length, recommendTargetPetType]);

  useEffect(() => {
    function handlePageShow() {
      loadCartList();
      loadMyPoint();
    }

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  if (isLoading && !cart) {
    return (
      <Wrapper>
        <PetStoreNavGate />

        <Inner>
          <PageTitle>장바구니</PageTitle>
          <LoadingBox>장바구니를 불러오는 중입니다.</LoadingBox>
        </Inner>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <PetStoreNavGate />

      <Inner>
        <PageTitle>장바구니</PageTitle>

        <ContentLayout>
          <LeftArea>
            <CartBox>
              <CartHeader>
                <CheckArea type="button" onClick={handleToggleAll}>
                  <CheckIcon $checked={isAllSelected}>✓</CheckIcon>
                  <span>
                    전체선택 ({selectedCartItemIds.length}/{cartItemList.length}
                    )
                  </span>
                </CheckArea>

                <SelectedDeleteButton
                  type="button"
                  onClick={handleDeleteSelected}
                >
                  🗑 선택한 상품 삭제
                </SelectedDeleteButton>
              </CartHeader>

              {cartItemList.length === 0 ? (
                <EmptyCart>
                  <EmptyTitle>장바구니가 비어 있습니다.</EmptyTitle>
                  <EmptyDesc>
                    마음에 드는 상품을 장바구니에 담아보세요.
                  </EmptyDesc>

                  <ShoppingButton
                    type="button"
                    onClick={() => navigate("/store")}
                  >
                    쇼핑하러 가기
                  </ShoppingButton>
                </EmptyCart>
              ) : (
                <CartItemList>
                  {cartItemList.map((item) => {
                    const checked = selectedCartItemIds.includes(
                      item.cartItemId,
                    );

                    return (
                      <CartItemRow key={item.cartItemId}>
                        <ItemSelectButton
                          type="button"
                          onClick={() => handleToggleItem(item.cartItemId)}
                          aria-label="상품 선택"
                        >
                          <CheckIcon $checked={checked}>✓</CheckIcon>
                        </ItemSelectButton>

                        <ProductInfo>
                          <ProductImageBox>
                            {item.mainImageUrl ? (
                              <ProductImage
                                src={item.mainImageUrl}
                                alt={item.productName}
                              />
                            ) : (
                              <NoImage>NO IMAGE</NoImage>
                            )}
                          </ProductImageBox>

                          <ProductTextArea>
                            <ProductNameButton
                              type="button"
                              onClick={() =>
                                handleGoProductDetail(item.productId)
                              }
                            >
                              {item.productName}
                            </ProductNameButton>

                            <ProductPrice>
                              {formatPrice(item.productPrice)}
                            </ProductPrice>

                            <DeliveryNotice>
                              30,000원 이상 구매 시 무료 배송
                            </DeliveryNotice>
                          </ProductTextArea>
                        </ProductInfo>

                        <QtyArea>
                          <QtyBox>
                            <QtyButton
                              type="button"
                              onClick={() => handleDecreaseQty(item)}
                            >
                              -
                            </QtyButton>

                            <QtyValue>{item.cartItemQty}</QtyValue>

                            <QtyButton
                              type="button"
                              onClick={() => handleIncreaseQty(item)}
                            >
                              +
                            </QtyButton>
                          </QtyBox>
                        </QtyArea>

                        <ItemAmountArea>
                          <AmountLabel>상품금액</AmountLabel>
                          <AmountValue>
                            {formatPrice(item.cartItemTotalPrice)}
                          </AmountValue>
                        </ItemAmountArea>

                        <DeleteOneButton
                          type="button"
                          onClick={() => handleDeleteOne(item.cartItemId)}
                          aria-label="상품 삭제"
                        >
                          ×
                        </DeleteOneButton>
                      </CartItemRow>
                    );
                  })}
                </CartItemList>
              )}
            </CartBox>

            {cartItemList.length > 0 && (
              <RecommendSection>
                <SectionTitle>함께 보면 좋은 상품</SectionTitle>

                {isRecommendLoading ? (
                  <RecommendLoadingBox>
                    추천 상품을 불러오는 중입니다.
                  </RecommendLoadingBox>
                ) : recommendProductList.length > 0 ? (
                  <RecommendGrid>
                    {recommendProductList.map((product) => (
                      <RecommendCard key={product.productId}>
                        <RecommendImageBox
                          type="button"
                          onClick={() =>
                            handleGoProductDetail(product.productId)
                          }
                        >
                          {product.mainImageUrl ? (
                            <RecommendImage
                              src={product.mainImageUrl}
                              alt={product.productName}
                            />
                          ) : (
                            <RecommendPlaceholder>
                              상품 이미지
                            </RecommendPlaceholder>
                          )}
                        </RecommendImageBox>

                        <RecommendInfo>
                          <RecommendNameButton
                            type="button"
                            onClick={() =>
                              handleGoProductDetail(product.productId)
                            }
                          >
                            {product.productName}
                          </RecommendNameButton>

                          <RecommendPrice>
                            {formatPrice(product.productPrice)}
                          </RecommendPrice>

                          <RecommendActions>
                            <RecommendCartButton
                              type="button"
                              onClick={(event) =>
                                handleAddRecommendCart(event, product)
                              }
                              disabled={
                                recommendCartSubmittingId === product.productId
                              }
                            >
                              {recommendCartSubmittingId === product.productId
                                ? "담는 중..."
                                : "장바구니에 담기"}
                            </RecommendCartButton>
                          </RecommendActions>
                        </RecommendInfo>
                      </RecommendCard>
                    ))}
                  </RecommendGrid>
                ) : null}
              </RecommendSection>
            )}
          </LeftArea>

          <RightArea>
            <StorePaymentSummaryCard
              totalProductAmount={totalProductAmount}
              orderDeliveryFee={orderDeliveryFee}
              finalOrderAmount={finalOrderAmount}
              pointEnabled
              currentPoint={currentPoint}
              usedPoint={usedPoint}
              onChangeUsedPoint={handleChangeUsedPoint}
              onBlurUsedPoint={handleBlurUsedPoint}
              onUseAllPoint={handleUseAllPoint}
              primaryButtonText="주문하기"
              secondaryButtonText="쇼핑 계속하기"
              onPrimaryClick={handleGoOrderPage}
              onSecondaryClick={() => navigate("/store")}
              primaryDisabled={cartItemList.length === 0}
            />
          </RightArea>
        </ContentLayout>
      </Inner>
    </Wrapper>
  );
}

/* ================================
   Layout
================================ */

const Wrapper = styled.main`
  width: 100%;
  background-color: #ffffff;
`;

const Inner = styled.div`
  width: 1532px;
  margin: 0 auto;
  padding: 24px 0 30px;
`;

const PageTitle = styled.h1`
  margin: 0 0 18px;

  color: #222222;
  font-size: 34px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -1.2px;
`;

const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1102px) 400px;
  gap: 30px;
  align-items: flex-start;
`;

const LeftArea = styled.div`
  min-width: 0;
`;

const RightArea = styled.aside`
  position: sticky;
  top: 96px;
  align-self: start;
  height: fit-content;
  z-index: 3;
`;

/* ================================
   Cart Table
================================ */

const CartBox = styled.section`
  width: 100%;
  overflow: hidden;

  border: 1px solid #d8d8d8;
  border-radius: 4px;
  background-color: #ffffff;
`;

const CartHeader = styled.div`
  height: 44px;
  padding: 0 18px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  border-bottom: 1px solid #d8d8d8;
`;

const CheckArea = styled.button`
  padding: 0;

  display: inline-flex;
  align-items: center;
  gap: 8px;

  border: none;
  background: transparent;

  color: #222222;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`;

const CheckIcon = styled.span`
  width: 16px;
  height: 16px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border: 1px solid ${({ $checked }) => ($checked ? "#05a77b" : "#cfcfcf")};
  border-radius: 2px;
  background-color: ${({ $checked }) => ($checked ? "#05a77b" : "#ffffff")};

  color: #ffffff;
  font-size: 12px;
  font-weight: 800;
  line-height: 1;
`;

const SelectedDeleteButton = styled.button`
  height: 28px;
  padding: 0 12px;

  border: 1px solid #cfcfcf;
  border-radius: 3px;
  background-color: #ffffff;

  color: #333333;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #f7f7f7;
  }
`;

const CartItemList = styled.div`
  display: flex;
  flex-direction: column;
`;

const CartItemRow = styled.div`
  min-height: 118px;

  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) 246px 274px 54px;
  align-items: stretch;

  border-bottom: 1px solid #d8d8d8;

  &:last-child {
    border-bottom: none;
  }
`;

const ItemSelectButton = styled.button`
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  background: transparent;
  cursor: pointer;
`;

const ProductInfo = styled.div`
  min-width: 0;
  padding: 0 32px 0 4px;

  display: flex;
  align-items: center;
  gap: 22px;
`;

const ProductImageBox = styled.div`
  width: 74px;
  height: 74px;

  flex: 0 0 auto;
  overflow: hidden;

  border: 1px solid #eeeeee;
  border-radius: 5px;
  background-color: #f7f7f7;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  padding: 4px;
  object-fit: contain;
`;

const NoImage = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #999999;
  font-size: 10px;
`;

const ProductTextArea = styled.div`
  min-width: 0;
  transform: translateY(1px);
`;

const ProductNameButton = styled.button`
  max-width: 100%;
  margin: 0 0 9px;
  padding: 0;

  display: block;

  border: none;
  background: transparent;

  color: #202020;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.28;
  letter-spacing: -0.55px;
  text-align: left;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  cursor: pointer;

  &:hover {
    color: #05a77b;
    text-decoration: underline;
    text-underline-offset: 4px;
  }
`;

const ProductPrice = styled.div`
  margin-bottom: 13px;

  color: #222222;
  font-size: 20px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.25px;
`;

const DeliveryNotice = styled.div`
  color: #777777;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
`;

const QtyArea = styled.div`
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  border-left: 1px solid #d8d8d8;
  border-right: 1px solid #d8d8d8;
`;

const QtyBox = styled.div`
  width: 156px;
  height: 32px;

  display: grid;
  grid-template-columns: 42px 1fr 42px;

  overflow: hidden;
  border: 1px solid #e1e1e1;
  border-radius: 999px;
  background-color: #ffffff;
`;

const QtyButton = styled.button`
  border: none;
  background-color: #ffffff;

  color: #111111;
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;

  &:hover {
    background-color: #f8f8f8;
  }
`;

const QtyValue = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  border-left: 1px solid #e1e1e1;
  border-right: 1px solid #e1e1e1;

  color: #111111;
  font-size: 14px;
  font-weight: 400;
  line-height: 1;
`;

const ItemAmountArea = styled.div`
  height: 100%;
  padding-left: 64px;

  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const AmountLabel = styled.div`
  margin-bottom: 6px;

  color: #777777;
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
`;

const AmountValue = styled.div`
  color: #111111;
  font-size: 28px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.75px;
`;

const DeleteOneButton = styled.button`
  width: 18px;
  height: 18px;
  padding: 0;
  margin: auto;

  justify-self: center;
  align-self: center;

  border: 1px solid #aaaaaa;
  background-color: #ffffff;

  color: #777777;
  font-size: 15px;
  line-height: 14px;
  cursor: pointer;

  &:hover {
    border-color: #05a77b;
    color: #05a77b;
  }
`;

/* ================================
   Recommend
================================ */

const RecommendSection = styled.section`
  margin-top: 16px;
`;

const SectionTitle = styled.h2`
  margin: 0 0 14px;

  color: #222222;
  font-size: 20px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.45px;
`;

const RecommendGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  overflow: hidden;
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  background-color: #ffffff;
`;

const RecommendCard = styled.article`
  min-height: 156px;
  padding: 14px 20px;

  display: grid;
  grid-template-columns: 130px minmax(0, 1fr);
  gap: 24px;
  align-items: center;

  border-right: 1px solid #d8d8d8;
  background-color: #ffffff;

  &:last-child {
    border-right: none;
  }
`;

const RecommendImageBox = styled.button`
  width: 120px;
  height: 120px;
  padding: 0;

  overflow: hidden;

  border: 1px solid #d8d8d8;
  border-radius: 6px;
  background-color: #fafafa;

  cursor: pointer;

  &:hover {
    border-color: #05a77b;
  }
`;

const RecommendImage = styled.img`
  width: 80%;
  height: 80%;
  padding: 8px;
  object-fit: contain;
`;

const RecommendPlaceholder = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #aaaaaa;
  font-size: 13px;
`;

const RecommendInfo = styled.div`
  min-width: 0;
`;

const RecommendNameButton = styled.button`
  width: 100%;
  min-height: 42px;
  margin: 0 0 14px;
  padding: 0;

  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  border: 0;
  background: transparent;

  color: #222222;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: -0.25px;
  text-align: left;
  cursor: pointer;

  &:hover {
    color: #05a77b;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

const RecommendPrice = styled.div`
  margin-bottom: 12px;

  color: #333333;
  font-size: 18px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.55px;
`;

const RecommendActions = styled.div`
  display: grid;
  grid-template-columns: 1fr;
`;

const RecommendCartButton = styled.button`
  height: 38px;
  padding: 0 14px;

  border: 1px solid #05a77b;
  border-radius: 4px;
  background-color: #ffffff;

  color: #05a77b;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background-color: #ecfff9;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const RecommendLoadingBox = styled.div`
  height: 156px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #d8d8d8;
  border-radius: 4px;

  color: #777777;
  font-size: 14px;
  font-weight: 700;
`;

/* ================================
   Empty / Loading
================================ */

const EmptyCart = styled.div`
  height: 280px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const EmptyTitle = styled.div`
  margin-bottom: 8px;

  color: #222222;
  font-size: 22px;
  font-weight: 800;
`;

const EmptyDesc = styled.div`
  margin-bottom: 24px;

  color: #777777;
  font-size: 15px;
`;

const ShoppingButton = styled.button`
  width: 180px;
  height: 44px;

  border: none;
  border-radius: 6px;
  background-color: #05a77b;

  color: #ffffff;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
`;

const LoadingBox = styled.div`
  height: 300px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #d8d8d8;
  border-radius: 4px;

  color: #777777;
  font-size: 16px;
`;
