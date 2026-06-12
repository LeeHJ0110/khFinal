import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchCartList,
  fetchMyDeliveryAddressList,
  readyStoreKakaoPay,
} from "../../features/petStore/api/petStoreOrderApi";

import StorePaymentSummaryCard from "../../features/petStore/components/PetStorePaymentSummaryCard";

//포인트 관련
import useStorePaymentPoint from "../../features/petStore/hooks/useStorePaymentPoint";
import PetStoreNavGate from "./PetStoreNavGate";

const deliveryRequestOptions = [
  {
    label: "배송 요청사항을 선택해주세요.",
    value: "",
  },
  {
    label: "문 앞에 놓아주세요.",
    value: "문 앞에 놓아주세요.",
  },
  {
    label: "부재 시 경비실에 맡겨주세요.",
    value: "부재 시 경비실에 맡겨주세요.",
  },
  {
    label: "배송 전 연락 부탁드립니다.",
    value: "배송 전 연락 부탁드립니다.",
  },
  {
    label: "직접 입력",
    value: "DIRECT",
  },
];
export default function PetStoreOrderPage() {
  const deliveryRequestOptions = [
    {
      label: "배송 요청사항을 선택해주세요.",
      value: "",
    },
    {
      label: "문 앞에 놓아주세요.",
      value: "문 앞에 놓아주세요.",
    },
    {
      label: "부재 시 경비실에 맡겨주세요.",
      value: "부재 시 경비실에 맡겨주세요.",
    },
    {
      label: "배송 전 연락 부탁드립니다.",
      value: "배송 전 연락 부탁드립니다.",
    },
    {
      label: "직접 입력",
      value: "DIRECT",
    },
  ];
  const navigate = useNavigate();
  const location = useLocation();

  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const [ordererName, setOrdererName] = useState("회원");

  const [deliveryAddressList, setDeliveryAddressList] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [deliveryRequest, setDeliveryRequest] = useState("");
  const [deliveryRequestOption, setDeliveryRequestOption] = useState("");

  const cartItemList = cart?.cartItemList ?? [];

  const selectedAddress = deliveryAddressList.find(
    (address) => address.deliveryAddressId === selectedAddressId,
  );

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
    initialUsedPoint: getInitialUsedPoint(),
  });

  function getInitialUsedPoint() {
    const stateUsedPoint = location.state?.usedPoint;

    if (stateUsedPoint !== undefined && stateUsedPoint !== null) {
      return Number(stateUsedPoint || 0);
    }

    const savedUsedPoint = sessionStorage.getItem("storeCheckoutUsedPoint");

    return Number(savedUsedPoint || 0);
  }

  function loadOrdererNameFromToken() {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setOrdererName("회원");
      return;
    }

    try {
      const payloadBase64Url = accessToken.split(".")[1];

      const payloadBase64 = payloadBase64Url
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const paddedPayloadBase64 =
        payloadBase64 + "=".repeat((4 - (payloadBase64.length % 4)) % 4);

      const binaryString = atob(paddedPayloadBase64);

      const bytes = Uint8Array.from(binaryString, (char) => char.charCodeAt(0));

      const decodedPayload = new TextDecoder("utf-8").decode(bytes);

      const payload = JSON.parse(decodedPayload);

      setOrdererName(payload.nickname || payload.username || "회원");
    } catch (error) {
      console.error("accessToken 파싱 실패:", error);
      setOrdererName("회원");
    }
  }

  async function loadCartList() {
    setIsLoading(true);

    try {
      const response = await fetchCartList();
      setCart(response.data);
    } catch (error) {
      console.error(error);
      alert("주문 정보를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }

  async function loadDeliveryAddressList() {
    try {
      const response = await fetchMyDeliveryAddressList();
      const list = response.data ?? [];

      setDeliveryAddressList(list);

      const defaultAddress = list.find((address) => address.defaultYn === "Y");
      const firstAddress = list[0];

      setSelectedAddressId(
        defaultAddress?.deliveryAddressId ??
          firstAddress?.deliveryAddressId ??
          null,
      );
    } catch (error) {
      console.error(error);
      alert("배송지 정보를 불러오지 못했습니다.");
    }
  }

  function handleUnavailablePaymentMethod() {
    alert("현재 결제서비스 도입 중입니다.");
  }

  async function handlePayClick() {
    if (isPaying) {
      return;
    }

    if (!cartItemList.length) {
      alert("주문할 상품이 없습니다.");
      navigate("/store/cart/list");
      return;
    }

    if (!selectedAddressId) {
      alert("배송지를 선택해주세요.");
      return;
    }

    if (!validateUsedPointUnit()) {
      return;
    }

    setIsPaying(true);

    try {
      const response = await readyStoreKakaoPay({
        deliveryAddressId: selectedAddressId,
        deliveryRequest,
        usedPoint,
      });

      const redirectUrl = response.data.nextRedirectPcUrl;

      if (!redirectUrl) {
        alert("카카오페이 결제 페이지를 불러오지 못했습니다.");
        setIsPaying(false);
        return;
      }

      sessionStorage.removeItem("storeCheckoutUsedPoint");
      window.location.href = redirectUrl;
    } catch (error) {
      console.error(error);
      alert("결제 준비 중 오류가 발생했습니다.");
      setIsPaying(false);
    }
  }

  function handleChangeDeliveryRequestOption(event) {
    const selectedValue = event.target.value;

    setDeliveryRequestOption(selectedValue);

    if (selectedValue === "DIRECT") {
      setDeliveryRequest("");
      return;
    }

    setDeliveryRequest(selectedValue);
  }

  useEffect(() => {
    loadOrdererNameFromToken();
    loadCartList();
    loadDeliveryAddressList();
    loadMyPoint();
  }, []);

  if (isLoading && !cart) {
    return (
      <Wrapper>
        <PetStoreNavGate />

        <PageInner>
          <PageTitle>주문/결제</PageTitle>
          <LoadingBox>주문 정보를 불러오는 중입니다.</LoadingBox>
        </PageInner>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <PetStoreNavGate />

      <PageInner>
        <PageTitle>주문/결제</PageTitle>

        <ContentGrid>
          <LeftArea>
            <SectionCard>
              <SectionTitle>주문자 정보</SectionTitle>

              <OrdererBox>
                <OrdererLabel>이름</OrdererLabel>
                <OrdererValue>{ordererName} 님</OrdererValue>
              </OrdererBox>
            </SectionCard>

            <DeliveryCard>
              <SectionTitle>
                배송지
                {selectedAddress?.defaultYn === "Y" && (
                  <DefaultBadge>기본 배송지</DefaultBadge>
                )}
              </SectionTitle>

              {deliveryAddressList.length === 0 ? (
                <EmptyDeliveryBox>
                  등록된 배송지가 없습니다. 마이페이지에서 배송지를
                  등록해주세요.
                </EmptyDeliveryBox>
              ) : !selectedAddress ? (
                <EmptyDeliveryBox>배송지를 선택해주세요.</EmptyDeliveryBox>
              ) : (
                <>
                  <DeliveryInfoGrid>
                    <DeliveryLabel>받으시는 분</DeliveryLabel>
                    <DeliveryValue>
                      {selectedAddress.receiverName} 님
                    </DeliveryValue>

                    <DeliveryLabel>연락처</DeliveryLabel>
                    <DeliveryValue>
                      {formatPhone(selectedAddress.phone)}
                    </DeliveryValue>

                    <DeliveryLabel>주소</DeliveryLabel>
                    <DeliveryValue>
                      {selectedAddress.zipCode} {selectedAddress.address}{" "}
                      {selectedAddress.addressDetail}
                    </DeliveryValue>

                    <DeliveryLabel>요청사항</DeliveryLabel>

                    <DeliveryRequestBox>
                      <DeliveryRequestSelect
                        value={deliveryRequestOption}
                        onChange={handleChangeDeliveryRequestOption}
                      >
                        {deliveryRequestOptions.map((option) => (
                          <option
                            key={option.value || "EMPTY"}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ))}
                      </DeliveryRequestSelect>

                      {deliveryRequestOption === "DIRECT" && (
                        <DeliveryRequestInput
                          value={deliveryRequest}
                          onChange={(event) =>
                            setDeliveryRequest(event.target.value)
                          }
                          placeholder="배송 요청사항을 직접 입력해주세요."
                        />
                      )}
                    </DeliveryRequestBox>
                  </DeliveryInfoGrid>

                  <DeliveryCardList>
                    {deliveryAddressList.map((address) => (
                      <DeliverySelectCard
                        key={address.deliveryAddressId}
                        type="button"
                        $active={
                          selectedAddressId === address.deliveryAddressId
                        }
                        onClick={() =>
                          setSelectedAddressId(address.deliveryAddressId)
                        }
                      >
                        <DeliveryCardTop>
                          <DeliveryCardName>{address.name}</DeliveryCardName>

                          {address.defaultYn === "Y" && (
                            <SmallDefaultBadge>기본 배송지</SmallDefaultBadge>
                          )}
                        </DeliveryCardTop>

                        <DeliveryCardReceiver>
                          {address.receiverName} 님 ·{" "}
                          {formatPhone(address.phone)}
                        </DeliveryCardReceiver>

                        <DeliveryCardAddress>
                          {address.address} {address.addressDetail}
                        </DeliveryCardAddress>
                      </DeliverySelectCard>
                    ))}
                  </DeliveryCardList>
                </>
              )}
            </DeliveryCard>

            <SectionCard>
              <SectionTitle>주문내역</SectionTitle>

              <OrderTable>
                <thead>
                  <tr>
                    <th>상품정보</th>
                    <th>수량</th>
                    <th>상품금액</th>
                  </tr>
                </thead>

                <tbody>
                  {cartItemList.length === 0 ? (
                    <tr>
                      <EmptyCell colSpan={3}>주문할 상품이 없습니다.</EmptyCell>
                    </tr>
                  ) : (
                    cartItemList.map((item) => (
                      <tr key={item.cartItemId}>
                        <ProductCell>
                          <ProductCellInner>
                            <ProductImageBox>
                              {item.mainImageUrl ? (
                                <ProductImage
                                  src={item.mainImageUrl}
                                  alt={item.productName}
                                />
                              ) : (
                                <NoImage>이미지</NoImage>
                              )}
                            </ProductImageBox>

                            <ProductName>{item.productName}</ProductName>
                          </ProductCellInner>
                        </ProductCell>

                        <QtyCell>{item.cartItemQty}개</QtyCell>

                        <PriceCell>
                          {formatPrice(item.cartItemTotalPrice)}원
                        </PriceCell>
                      </tr>
                    ))
                  )}
                </tbody>
              </OrderTable>
            </SectionCard>

            <SectionCard>
              <SectionTitle>결제수단</SectionTitle>

              <PaymentMethodGrid>
                <PaymentMethodCard type="button" $active>
                  <KakaoBadge>pay</KakaoBadge>
                  <span>카카오페이 결제</span>
                </PaymentMethodCard>

                <PaymentMethodCard
                  type="button"
                  onClick={handleUnavailablePaymentMethod}
                >
                  <span>신용/체크카드</span>
                </PaymentMethodCard>

                <PaymentMethodCard
                  type="button"
                  onClick={handleUnavailablePaymentMethod}
                >
                  <span>무통장 입금</span>
                </PaymentMethodCard>
              </PaymentMethodGrid>
            </SectionCard>
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
              primaryButtonText="결제하기"
              secondaryButtonText="장바구니로 돌아가기"
              onPrimaryClick={handlePayClick}
              onSecondaryClick={() => navigate("/store/cart/list")}
              primaryDisabled={
                cartItemList.length === 0 || deliveryAddressList.length === 0
              }
              isProcessing={isPaying}
            />
          </RightArea>
        </ContentGrid>
      </PageInner>
    </Wrapper>
  );
}

function formatPrice(value) {
  return Number(value || 0).toLocaleString();
}

function formatPhone(phone) {
  if (!phone) {
    return "-";
  }

  const onlyNumber = String(phone).replaceAll("-", "");

  if (onlyNumber.length === 11) {
    return onlyNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  }

  if (onlyNumber.length === 10) {
    return onlyNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  }

  return phone;
}

/* ================================
   Layout
================================ */

const Wrapper = styled.main`
  width: 100%;
  min-height: 100vh;
  background: #ffffff;
`;

const PageInner = styled.div`
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

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1102px) 400px;
  gap: 30px;
  align-items: flex-start;
`;

const LeftArea = styled.div`
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RightArea = styled.aside`
  position: sticky;
  top: 96px;
  align-self: start;
  height: fit-content;
  z-index: 5;
`;

/* ================================
   Common Card
================================ */

const SectionCard = styled.section`
  box-sizing: border-box;
  width: 100%;

  border: 1px solid #d8d8d8;
  border-radius: 4px;
  background: #ffffff;
  padding: 22px 28px;
`;

const DeliveryCard = styled(SectionCard)`
  background: #eafff7;
  border-color: #bdebd9;
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 10px;

  min-height: 24px;
  margin: 0 0 20px;

  color: #111111;
  font-size: 19px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.35px;
`;

/* ================================
   Orderer
================================ */

const OrdererBox = styled.div`
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  align-items: center;
  column-gap: 12px;
  height: 30px;
`;

const OrdererLabel = styled.span`
  color: #222222;
  font-size: 14px;
  font-weight: 800;
  white-space: nowrap;
`;

const OrdererValue = styled.span`
  min-width: 0;

  color: #222222;
  font-size: 15px;
  font-weight: 700;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/* ================================
   Delivery
================================ */

const DefaultBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  height: 22px;
  padding: 0 9px;

  border: 1px solid #08aa7c;
  border-radius: 4px;
  background: #ffffff;

  color: #08aa7c;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
`;

const SmallDefaultBadge = styled(DefaultBadge)`
  height: 20px;
  padding: 0 7px;

  font-size: 11px;
`;

const DeliveryInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr);
  row-gap: 13px;
  column-gap: 22px;
  align-items: center;
`;

const DeliveryLabel = styled.div`
  color: #222222;
  font-size: 14px;
  font-weight: 800;
  white-space: nowrap;
`;

const DeliveryValue = styled.div`
  min-width: 0;

  color: #333333;
  font-size: 15px;
  line-height: 1.45;
`;

const DeliveryRequestBox = styled.div`
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DeliveryRequestSelect = styled.select`
  box-sizing: border-box;
  width: 100%;
  height: 36px;

  border: 1px solid #cfd8d5;
  border-radius: 5px;
  padding: 0 12px;
  background: #ffffff;

  color: #333333;
  font-size: 14px;
  font-weight: 500;

  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #00a878;
  }
`;

const DeliveryRequestInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 36px;

  border: 1px solid #cfd8d5;
  border-radius: 5px;
  padding: 0 12px;
  background: #ffffff;

  color: #333333;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #00a878;
  }
`;

const DeliveryCardList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 20px;
`;

const DeliverySelectCard = styled.button`
  box-sizing: border-box;
  width: 100%;
  height: 100px;
  padding: 13px 16px;

  display: flex;
  flex-direction: column;
  justify-content: center;

  border: 1px solid ${({ $active }) => ($active ? "#00a878" : "#d8d8d8")};
  border-radius: 6px;
  background: ${({ $active }) => ($active ? "#f8fffc" : "#ffffff")};

  text-align: left;
  cursor: pointer;
  overflow: hidden;
  outline: none;

  box-shadow: ${({ $active }) =>
    $active ? "inset 0 0 0 1px rgba(0, 168, 120, 0.3)" : "none"};

  &:hover {
    border-color: #00a878;
    background: #f8fffc;
  }

  &:focus {
    outline: none;
  }
`;

const DeliveryCardTop = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  min-width: 0;
  margin-bottom: 8px;
`;

const DeliveryCardName = styled.strong`
  min-width: 0;

  color: #222222;
  font-size: 16px;
  font-weight: 800;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DeliveryCardReceiver = styled.div`
  margin-bottom: 5px;

  color: #333333;
  font-size: 13px;
  font-weight: 600;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DeliveryCardAddress = styled.div`
  color: #666666;
  font-size: 12px;
  line-height: 1.4;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmptyDeliveryBox = styled.div`
  min-height: 120px;

  display: grid;
  place-items: center;

  border: 1px dashed #bdebd9;
  border-radius: 8px;
  background: #ffffff;

  color: #777777;
  font-size: 14px;
  line-height: 1.7;
  text-align: center;
`;

/* ================================
   Order Table
================================ */

const OrderTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  thead {
    background: #e4f7f1;
  }

  th {
    height: 38px;
    text-align: left;

    color: #222222;
    font-size: 14px;
    font-weight: 700;
  }

  th:nth-child(1) {
    padding-left: 14px;
  }

  th:nth-child(2) {
    width: 170px;
    text-align: center;
  }

  th:nth-child(3) {
    width: 210px;
    text-align: right;
    padding-right: 18px;
  }

  td {
    height: 66px;
    border-bottom: 1px solid #eeeeee;

    color: #222222;
    font-size: 14px;
    vertical-align: middle;
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }
`;

const ProductCell = styled.td`
  padding-left: 14px;
`;

const ProductCellInner = styled.div`
  min-width: 0;

  display: flex;
  align-items: center;
  gap: 14px;
`;

const ProductImageBox = styled.div`
  width: 50px;
  height: 50px;

  flex-shrink: 0;
  overflow: hidden;

  border: 1px solid #eeeeee;
  border-radius: 5px;
  background: #f7f7f7;
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

  display: grid;
  place-items: center;

  color: #999999;
  font-size: 10px;
`;

const ProductName = styled.div`
  min-width: 0;
  max-width: 710px;

  color: #333333;
  font-size: 15px;
  font-weight: 500;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const QtyCell = styled.td`
  text-align: center;

  color: #222222;
  font-size: 14px;
  font-weight: 500;
`;

const PriceCell = styled.td`
  text-align: right;
  padding-right: 18px;

  color: #111111;
  font-size: 16px;
  font-weight: 600;
`;

const EmptyCell = styled.td`
  height: 120px !important;
  text-align: center;
  color: #999999;
`;

/* ================================
   Payment
================================ */

const PaymentMethodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
`;

const PaymentMethodCard = styled.button`
  box-sizing: border-box;
  height: 56px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  border: 1px solid ${({ $active }) => ($active ? "#00a878" : "#d4d4d4")};
  border-radius: 6px;
  background: ${({ $active }) => ($active ? "#eafff7" : "#ffffff")};

  color: #444444;
  font-size: 14px;
  font-weight: 600;

  cursor: pointer;
  outline: none;

  transition:
    border-color 0.16s ease,
    background-color 0.16s ease,
    transform 0.16s ease,
    box-shadow 0.16s ease;

  &:hover {
    border-color: #00a878;
    background: #f8fffc;
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(0, 168, 120, 0.1);
  }

  &:focus {
    outline: none;
  }
`;

const KakaoBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 58px;
  height: 30px;

  border-radius: 4px;
  background: #ffe812;

  color: #111111;
  font-size: 12px;
  font-weight: 900;
`;

/* ================================
   Loading
================================ */

const LoadingBox = styled.div`
  height: 300px;

  display: grid;
  place-items: center;

  border: 1px solid #d8d8d8;
  border-radius: 4px;

  color: #777777;
  font-size: 16px;
`;
