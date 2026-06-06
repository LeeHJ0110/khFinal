import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  fetchCartList,
  fetchMyDeliveryAddressList,
  readyStoreKakaoPay,
} from "../../features/petStore/api/petStoreOrderApi";
import PetStoreUserNav from "./PetStoreUserNav";
import StorePaymentSummaryCard from "../../features/petStore/components/PetStorePaymentSummaryCard";

export default function PetStoreOrderPage() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const [ordererName, setOrdererName] = useState("회원");

  const [deliveryAddressList, setDeliveryAddressList] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [deliveryRequest, setDeliveryRequest] = useState("");

  const cartItemList = cart?.cartItemList ?? [];

  const selectedAddress = deliveryAddressList.find(
    (address) => address.deliveryAddressId === selectedAddressId,
  );

  const totalProductAmount = cart?.totalProductAmount ?? 0;
  const orderDeliveryFee = cart?.orderDeliveryFee ?? 0;

  // 포인트는 아직 백엔드 결제금액에 반영되지 않으므로 cart 응답 금액 기준으로 고정
  const finalOrderAmount = useMemo(() => {
    return cart?.finalOrderAmount ?? totalProductAmount + orderDeliveryFee;
  }, [cart?.finalOrderAmount, totalProductAmount, orderDeliveryFee]);

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

    setIsPaying(true);

    try {
      const response = await readyStoreKakaoPay({
        deliveryAddressId: selectedAddressId,
        deliveryRequest,
      });

      const redirectUrl = response.data.nextRedirectPcUrl;

      if (!redirectUrl) {
        alert("카카오페이 결제 페이지를 불러오지 못했습니다.");
        setIsPaying(false);
        return;
      }

      window.location.href = redirectUrl;
    } catch (error) {
      console.error(error);
      alert("결제 준비 중 오류가 발생했습니다.");
      setIsPaying(false);
    }
  }

  useEffect(() => {
    loadOrdererNameFromToken();
    loadCartList();
    loadDeliveryAddressList();
  }, []);

  if (isLoading && !cart) {
    return (
      <Wrapper>
        <PageInner>
          <PageTitle>주문/결제</PageTitle>
          <LoadingBox>주문 정보를 불러오는 중입니다.</LoadingBox>
        </PageInner>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <PetStoreUserNav />
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
                    <DeliveryRequestInput
                      value={deliveryRequest}
                      onChange={(event) =>
                        setDeliveryRequest(event.target.value)
                      }
                      placeholder="배송 요청사항을 입력해주세요."
                    />
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
                            <SmallDefaultBadge>기본</SmallDefaultBadge>
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

                <PaymentMethodCard type="button">
                  <span>신용/체크카드</span>
                </PaymentMethodCard>

                <PaymentMethodCard type="button">
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

const Wrapper = styled.main`
  width: 100%;
  min-height: 100vh;
  background: #ffffff;
`;

const PageInner = styled.div`
  width: 1360px;
  margin: 0 auto;
  padding: 44px 0 80px;
`;

const PageTitle = styled.h1`
  margin: 0 0 24px;
  font-size: 34px;
  font-weight: 800;
  color: #111111;
  letter-spacing: -1.2px;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 400px;
  gap: 32px;
  align-items: start;
`;

const LeftArea = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const RightArea = styled.aside`
  position: sticky;
  top: 120px;
`;

const SectionCard = styled.section`
  box-sizing: border-box;
  width: 100%;
  border: 1px solid #d8d8d8;
  border-radius: 6px;
  background: #ffffff;
  padding: 24px 30px;
`;

const DeliveryCard = styled(SectionCard)`
  background: #eafff7;
  border-color: #bdebd9;
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 24px;
  margin: 0 0 22px;
  font-size: 19px;
  font-weight: 800;
  color: #111111;
`;

const OrdererBox = styled.div`
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr);
  align-items: center;
  column-gap: 12px;
  height: 28px;
`;

const OrdererLabel = styled.span`
  font-size: 14px;
  font-weight: 800;
  color: #222222;
  white-space: nowrap;
`;

const OrdererValue = styled.span`
  min-width: 0;
  font-size: 15px;
  color: #333333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DefaultBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 22px;
  padding: 0 9px;
  border: 1px solid #08aa7c;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 800;
  color: #08aa7c;
  background: #ffffff;
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
  row-gap: 14px;
  column-gap: 22px;
  align-items: center;
`;

const DeliveryLabel = styled.div`
  font-size: 14px;
  font-weight: 800;
  color: #222222;
  white-space: nowrap;
`;

const DeliveryValue = styled.div`
  min-width: 0;
  font-size: 15px;
  line-height: 1.5;
  color: #333333;
`;

const DeliveryRequestInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 38px;
  border: 1px solid #cfd8d5;
  border-radius: 5px;
  padding: 0 12px;
  background: #ffffff;
  font-size: 14px;
  color: #333333;

  &:focus {
    outline: none;
    border-color: #00a878;
  }
`;

const DeliveryCardList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 22px;
`;

const DeliverySelectCard = styled.button`
  box-sizing: border-box;
  width: 100%;
  height: 104px;
  border: 1px solid ${({ $active }) => ($active ? "#00a878" : "#d8d8d8")};
  border-radius: 8px;
  background: ${({ $active }) => ($active ? "#f8fffc" : "#ffffff")};
  padding: 14px 16px;
  text-align: left;
  cursor: pointer;
  overflow: hidden;
  outline: none;

  display: flex;
  flex-direction: column;
  justify-content: center;

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
  font-size: 14px;
  font-weight: 800;
  color: #222222;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DeliveryCardReceiver = styled.div`
  margin-bottom: 5px;
  font-size: 13px;
  font-weight: 700;
  color: #333333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DeliveryCardAddress = styled.div`
  font-size: 12px;
  line-height: 1.4;
  color: #666666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmptyDeliveryBox = styled.div`
  min-height: 122px;
  display: grid;
  place-items: center;
  border: 1px dashed #bdebd9;
  border-radius: 8px;
  background: #ffffff;
  font-size: 14px;
  line-height: 1.7;
  color: #777777;
  text-align: center;
`;

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
    font-size: 14px;
    font-weight: 800;
    color: #222222;
  }

  th:nth-child(1) {
    padding-left: 14px;
  }

  th:nth-child(2) {
    width: 160px;
    text-align: center;
  }

  th:nth-child(3) {
    width: 180px;
    text-align: right;
    padding-right: 18px;
  }

  td {
    height: 62px;
    border-bottom: 1px solid #eeeeee;
    font-size: 14px;
    color: #222222;
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
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
`;

const ProductImageBox = styled.div`
  width: 42px;
  height: 42px;
  border: 1px solid #eeeeee;
  border-radius: 5px;
  overflow: hidden;
  background: #f7f7f7;
  flex-shrink: 0;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const NoImage = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  font-size: 10px;
  color: #999999;
`;

const ProductName = styled.div`
  min-width: 0;
  max-width: 560px;
  font-size: 14px;
  color: #333333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const QtyCell = styled.td`
  text-align: center;
`;

const PriceCell = styled.td`
  text-align: right;
  padding-right: 18px;
  font-weight: 700;
`;

const EmptyCell = styled.td`
  height: 120px !important;
  text-align: center;
  color: #999999;
`;

const PaymentMethodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
`;

const PaymentMethodCard = styled.button`
  box-sizing: border-box;
  height: 56px;
  border: 1px solid ${({ $active }) => ($active ? "#00a878" : "#d4d4d4")};
  border-radius: 6px;
  background: ${({ $active }) => ($active ? "#eafff7" : "#ffffff")};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 800;
  color: #444444;
  cursor: pointer;
  outline: none;

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
  font-size: 12px;
  font-weight: 900;
  color: #111111;
`;

const LoadingBox = styled.div`
  height: 300px;
  display: grid;
  place-items: center;
  border: 1px solid #d8d8d8;
  border-radius: 6px;
  font-size: 16px;
  color: #777777;
`;
