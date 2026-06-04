import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import usePetStoreCartList from "../../features/petStore/hooks/usePetStoreCartList";
import PetStoreUserNav from "./PetStoreUserNav";

export default function PetStoreCartListPage() {
  const navigate = useNavigate();

  const { cart, handleDeleteCartItem, handleUpdateQty, isLoading } =
    usePetStoreCartList();

  const cartItemList = cart?.cartItemList ?? [];
  const totalProductAmount = cart?.totalProductAmount ?? 0;
  const orderDeliveryFee = cart?.orderDeliveryFee ?? 0;
  const finalOrderAmount = cart?.finalOrderAmount ?? 0;

  const [selectedCartItemIds, setSelectedCartItemIds] = useState([]);

  const isAllSelected =
    cartItemList.length > 0 &&
    selectedCartItemIds.length === cartItemList.length;

  function formatPrice(value) {
    return `${Number(value ?? 0).toLocaleString()}원`;
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

  function handleOrderClick() {
    if (selectedCartItemIds.length === 0) {
      alert("주문할 상품을 선택해주세요.");
      return;
    }

    // 나중에 주문서 페이지 만들면 여기서 선택한 cartItemId들을 넘기면 됩니다.
    // 예: navigate("/store/order/checkout", { state: { cartItemIds: selectedCartItemIds } });
    navigate("/store/order/checkout", {
      state: {
        cartItemIds: selectedCartItemIds,
      },
    });
  }

  function handleGoProductDetail(productId) {
    navigate(`/store/product/${productId}`);
  }

  if (isLoading && !cart) {
    return (
      <Wrapper>
        <Inner>
          <PageTitle>장바구니</PageTitle>
          <LoadingBox>장바구니를 불러오는 중입니다.</LoadingBox>
        </Inner>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <PetStoreUserNav />
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

            <RecommendSection>
              <SectionTitle>함께 보면 좋은 상품</SectionTitle>

              <RecommendGrid>
                <RecommendCard>
                  <RecommendImageBox>
                    <RecommendPlaceholder>추천상품</RecommendPlaceholder>
                  </RecommendImageBox>
                  <RecommendInfo>
                    <RecommendName>
                      강아지 브레스 기관지 영양제 100g
                    </RecommendName>
                    <RecommendPrice>23,100원</RecommendPrice>
                    <RecommendActions>
                      <WishButton type="button">♡</WishButton>
                      <RecommendCartButton type="button">
                        장바구니에 담기
                      </RecommendCartButton>
                    </RecommendActions>
                  </RecommendInfo>
                </RecommendCard>

                <RecommendCard>
                  <RecommendImageBox>
                    <RecommendPlaceholder>추천상품</RecommendPlaceholder>
                  </RecommendImageBox>
                  <RecommendInfo>
                    <RecommendName>탐사 실속형 배변패드</RecommendName>
                    <RecommendPrice>19,700원</RecommendPrice>
                    <RecommendActions>
                      <WishButton type="button">♡</WishButton>
                      <RecommendCartButton type="button">
                        장바구니에 담기
                      </RecommendCartButton>
                    </RecommendActions>
                  </RecommendInfo>
                </RecommendCard>

                <RecommendCard>
                  <RecommendImageBox>
                    <RecommendPlaceholder>추천상품</RecommendPlaceholder>
                  </RecommendImageBox>
                  <RecommendInfo>
                    <RecommendName>강아지 가수분해 덴탈껌</RecommendName>
                    <RecommendPrice>15,600원</RecommendPrice>
                    <RecommendActions>
                      <WishButton type="button">♡</WishButton>
                      <RecommendCartButton type="button">
                        장바구니에 담기
                      </RecommendCartButton>
                    </RecommendActions>
                  </RecommendInfo>
                </RecommendCard>
              </RecommendGrid>
            </RecommendSection>
          </LeftArea>

          <SummaryCard>
            <SummaryTitle>결제금액 요약</SummaryTitle>

            <SummaryRow>
              <SummaryLabel>주문 금액</SummaryLabel>
              <SummaryValue>{formatPrice(totalProductAmount)}</SummaryValue>
            </SummaryRow>

            <SummaryRow>
              <SummaryLabel>
                배송비 <HelpIcon>?</HelpIcon>
              </SummaryLabel>
              <SummaryValue>{formatPrice(orderDeliveryFee)}</SummaryValue>
            </SummaryRow>

            <PointRow>
              <SummaryLabel>사용 포인트</SummaryLabel>
              <PointInputWrap>
                <PointInput value="0" readOnly />
                <PointSubText>현재 보유 포인트 : 0P</PointSubText>
              </PointInputWrap>
            </PointRow>

            <Divider />

            <FinalRow>
              <FinalLabel>최종 결제 금액</FinalLabel>
              <FinalValue>{formatPrice(finalOrderAmount)}</FinalValue>
            </FinalRow>

            <Divider />

            <OrderButton type="button" onClick={handleOrderClick}>
              주문하기
            </OrderButton>

            <ContinueButton type="button" onClick={() => navigate("/store")}>
              쇼핑 계속하기
            </ContinueButton>
          </SummaryCard>
        </ContentLayout>
      </Inner>
    </Wrapper>
  );
}

const Wrapper = styled.main`
  width: 100%;
  background-color: #ffffff;
`;

const Inner = styled.div`
  width: 1360px;
  margin: 0 auto;
  padding: 44px 0 32px;
`;

const PageTitle = styled.h1`
  margin: 0 0 24px;
  font-size: 34px;
  font-weight: 800;
  color: #222;
  letter-spacing: -1.2px;
`;

const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 32px;
  align-items: flex-start;
`;

const LeftArea = styled.div`
  min-width: 0;
`;

const CartBox = styled.section`
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  background-color: #fff;
  overflow: hidden;
`;

const CartHeader = styled.div`
  height: 48px;
  padding: 0 18px;
  border-bottom: 1px solid #d8d8d8;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CheckArea = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #222;
  cursor: pointer;
`;

const CheckIcon = styled.span`
  width: 16px;
  height: 16px;
  border-radius: 2px;
  border: 1px solid ${({ $checked }) => ($checked ? "#05a77b" : "#cfcfcf")};
  background-color: ${({ $checked }) => ($checked ? "#05a77b" : "#fff")};
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
`;

const SelectedDeleteButton = styled.button`
  height: 28px;
  padding: 0 12px;
  border: 1px solid #cfcfcf;
  border-radius: 3px;
  background-color: #fff;
  color: #333;
  font-size: 13px;
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
  min-height: 128px;
  display: grid;
  grid-template-columns: 48px 1.4fr 380px 250px 40px;
  align-items: center;
  border-bottom: 1px solid #d8d8d8;

  &:last-child {
    border-bottom: none;
  }
`;

const ItemSelectButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  display: flex;
  justify-content: center;
  cursor: pointer;
`;

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;
  min-width: 0;
`;

const ProductImageBox = styled.div`
  width: 74px;
  height: 74px;
  border-radius: 4px;
  overflow: hidden;
  background-color: #f7f7f7;
  border: 1px solid #eeeeee;
  flex: 0 0 auto;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const NoImage = styled.div`
  width: 100%;
  height: 100%;
  font-size: 10px;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProductTextArea = styled.div`
  min-width: 0;
`;

const ProductNameButton = styled.button`
  max-width: 100%;
  margin: 0 0 8px;
  padding: 0;
  border: none;
  background: transparent;

  display: block;

  font-size: 20px;
  font-weight: 700;
  color: #202020;
  line-height: 1.35;
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
  font-size: 20px;
  font-weight: 500;
  color: #333;
  margin-bottom: 14px;
`;

const DeliveryNotice = styled.div`
  font-size: 12px;
  color: #777;
`;

const QtyArea = styled.div`
  height: 100%;
  border-left: 1px solid #d8d8d8;
  border-right: 1px solid #d8d8d8;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const QtyBox = styled.div`
  width: 210px;
  height: 38px;
  border: 1px solid #e1e1e1;
  border-radius: 19px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 52px 1fr 52px;
  background-color: #fff;
`;

const QtyButton = styled.button`
  border: none;
  background-color: #fff;
  font-size: 24px;
  font-weight: 700;
  color: #111;
  cursor: pointer;

  &:hover {
    background-color: #f8f8f8;
  }
`;

const QtyValue = styled.div`
  border-left: 1px solid #e1e1e1;
  border-right: 1px solid #e1e1e1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 600;
  color: #111;
`;

const ItemAmountArea = styled.div`
  padding-left: 70px;
`;

const AmountLabel = styled.div`
  font-size: 14px;
  color: #777;
  margin-bottom: 4px;
`;

const AmountValue = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: #111;
  letter-spacing: -0.5px;
`;

const DeleteOneButton = styled.button`
  width: 18px;
  height: 18px;
  border: 1px solid #aaa;
  background-color: #fff;
  color: #777;
  font-size: 15px;
  line-height: 14px;
  cursor: pointer;
  padding: 0;

  &:hover {
    border-color: #05a77b;
    color: #05a77b;
  }
`;

const SummaryCard = styled.aside`
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  background-color: #fff;
  padding: 26px 30px 28px;
  position: sticky;
  top: 120px;
`;

const SummaryTitle = styled.h2`
  margin: 0 0 28px;
  font-size: 20px;
  font-weight: 800;
  color: #222;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 26px;
`;

const SummaryLabel = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const SummaryValue = styled.div`
  font-size: 17px;
  font-weight: 500;
  color: #111;
`;

const HelpIcon = styled.span`
  width: 14px;
  height: 14px;
  border: 1px solid #aaa;
  border-radius: 50%;
  color: #777;
  font-size: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const PointRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
`;

const PointInputWrap = styled.div`
  width: 150px;
  text-align: right;
`;

const PointInput = styled.input`
  width: 100%;
  height: 22px;
  border: 1px solid #d7d7d7;
  text-align: right;
  padding: 0 8px;
  font-size: 14px;
  color: #222;
`;

const PointSubText = styled.div`
  margin-top: 6px;
  font-size: 11px;
  color: #05a77b;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #d8d8d8;
  margin: 22px 0;
`;

const FinalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FinalLabel = styled.div`
  font-size: 17px;
  font-weight: 700;
  color: #111;
`;

const FinalValue = styled.div`
  font-size: 28px;
  font-weight: 900;
  color: #05a77b;
  letter-spacing: -1px;
`;

const OrderButton = styled.button`
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 8px;
  background-color: #05a77b;
  color: #fff;
  font-size: 17px;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    background-color: #04966f;
  }
`;

const ContinueButton = styled.button`
  width: 100%;
  height: 52px;
  border: 1px solid #d8d8d8;
  border-radius: 8px;
  background-color: #fff;
  color: #333;
  font-size: 16px;
  font-weight: 700;
  margin-top: 12px;
  cursor: pointer;

  &:hover {
    background-color: #f8f8f8;
  }
`;

const RecommendSection = styled.section`
  margin-top: 18px;
`;

const SectionTitle = styled.h2`
  margin: 0 0 14px;
  font-size: 20px;
  font-weight: 800;
  color: #222;
`;

const RecommendGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  overflow: hidden;
`;

const RecommendCard = styled.div`
  min-height: 156px;
  display: flex;
  gap: 22px;
  align-items: center;
  padding: 14px 22px;
  border-right: 1px solid #d8d8d8;

  &:last-child {
    border-right: none;
  }
`;

const RecommendImageBox = styled.div`
  width: 130px;
  height: 130px;
  border: 1px solid #d8d8d8;
  border-radius: 6px;
  background-color: #fafafa;
  flex: 0 0 auto;
`;

const RecommendPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  color: #aaa;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RecommendInfo = styled.div`
  min-width: 0;
  flex: 1;
`;

const RecommendName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #222;
  line-height: 1.35;
  margin-bottom: 16px;
  min-height: 42px;
`;

const RecommendPrice = styled.div`
  font-size: 22px;
  font-weight: 800;
  color: #333;
  margin-bottom: 12px;
`;

const RecommendActions = styled.div`
  display: flex;
  gap: 12px;
`;

const WishButton = styled.button`
  width: 42px;
  height: 38px;
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  background-color: #fff;
  font-size: 22px;
  color: #444;
  cursor: pointer;
`;

const RecommendCartButton = styled.button`
  flex: 1;
  height: 38px;
  border: 1px solid #05a77b;
  border-radius: 4px;
  background-color: #fff;
  color: #05a77b;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background-color: #ecfff9;
  }
`;

const EmptyCart = styled.div`
  height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const EmptyTitle = styled.div`
  font-size: 22px;
  font-weight: 800;
  color: #222;
  margin-bottom: 8px;
`;

const EmptyDesc = styled.div`
  font-size: 15px;
  color: #777;
  margin-bottom: 24px;
`;

const ShoppingButton = styled.button`
  width: 180px;
  height: 44px;
  border: none;
  border-radius: 6px;
  background-color: #05a77b;
  color: #fff;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
`;

const LoadingBox = styled.div`
  height: 300px;
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777;
  font-size: 16px;
`;
