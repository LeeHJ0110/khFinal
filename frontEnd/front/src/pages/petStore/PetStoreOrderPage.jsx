import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  fetchCartList,
  fetchMyDeliveryAddressList,
  readyStoreKakaoPay,
} from "../../features/petStore/api/petStoreOrderApi";

export default function PetStoreOrderPage() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [usedPoint, setUsedPoint] = useState(0);
  const [deliveryAddressList, setDeliveryAddressList] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [deliveryRequest, setDeliveryRequest] = useState("");

  const cartItemList = cart?.cartItemList ?? [];

  const selectedAddress = deliveryAddressList.find(
    (address) => address.deliveryAddressId === selectedAddressId,
  );

  const totalProductAmount = cart?.totalProductAmount ?? 0;
  const orderDeliveryFee = cart?.orderDeliveryFee ?? 0;

  const finalOrderAmount = useMemo(() => {
    const amount =
      totalProductAmount + orderDeliveryFee - Number(usedPoint || 0);
    return amount < 0 ? 0 : amount;
  }, [totalProductAmount, orderDeliveryFee, usedPoint]);

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
      navigate("/store/cart");
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
    loadCartList();
    loadDeliveryAddressList();
  }, []);

  if (isLoading) {
    return (
      <Wrapper>
        <PageInner>
          <LoadingBox>주문 정보를 불러오는 중입니다...</LoadingBox>
        </PageInner>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <PageInner>
        <PageTitle>주문/결제</PageTitle>

        <ContentGrid>
          <LeftArea>
            <SectionCard>
              <SectionTitle>주문자 정보</SectionTitle>

              <InfoRowGroup>
                <InfoItem>
                  <InfoLabel>이름</InfoLabel>
                  <InfoValue>order01 님</InfoValue>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>연락처</InfoLabel>
                  <InfoValue>010-1234-5678</InfoValue>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>이메일</InfoLabel>
                  <InfoValue>order01@petandifor.com</InfoValue>
                </InfoItem>
              </InfoRowGroup>
            </SectionCard>

            <DeliveryCard>
              <SectionTitle>
                배송지
                {selectedAddress?.defaultYn === "Y" && (
                  <DefaultBadge>기본 배송지</DefaultBadge>
                )}
              </SectionTitle>

              {selectedAddress ? (
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
                          <strong>{address.name}</strong>
                          {address.defaultYn === "Y" && (
                            <DefaultBadge>기본 배송지</DefaultBadge>
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
              ) : (
                <EmptyDeliveryBox>
                  등록된 배송지가 없습니다. 마이페이지에서 배송지를
                  등록해주세요.
                </EmptyDeliveryBox>
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
                        </ProductCell>

                        <td>{item.cartItemQty}개</td>

                        <td>{formatPrice(item.cartItemTotalPrice)}원</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </OrderTable>
            </SectionCard>

            <SectionCard>
              <SectionTitle>결제수단</SectionTitle>

              <PaymentMethodGrid>
                <PaymentMethodCard $active>
                  <KakaoBadge>pay</KakaoBadge>
                  <span>카카오페이 결제</span>
                </PaymentMethodCard>

                <PaymentMethodCard>
                  <span>신용/체크카드</span>
                </PaymentMethodCard>

                <PaymentMethodCard>
                  <span>무통장 입금</span>
                </PaymentMethodCard>
              </PaymentMethodGrid>
            </SectionCard>
          </LeftArea>

          <RightArea>
            <SummaryCard>
              <SummaryTitle>결제금액 요약</SummaryTitle>

              <SummaryRow>
                <span>주문 금액</span>
                <strong>{formatPrice(totalProductAmount)}원</strong>
              </SummaryRow>

              <SummaryRow>
                <span>배송비</span>
                <strong>{formatPrice(orderDeliveryFee)}원</strong>
              </SummaryRow>

              <PointRow>
                <span>사용 포인트</span>
                <PointInput
                  type="number"
                  min="0"
                  value={usedPoint}
                  onChange={(event) => setUsedPoint(event.target.value)}
                />
              </PointRow>

              <Divider />

              <FinalRow>
                <span>최종 결제 금액</span>
                <strong>{formatPrice(finalOrderAmount)}원</strong>
              </FinalRow>

              <PayButton
                type="button"
                onClick={handlePayClick}
                disabled={isPaying || cartItemList.length === 0}
              >
                {isPaying ? "결제 준비 중..." : "결제하기"}
              </PayButton>

              <SubButton type="button" onClick={() => navigate("/store/cart")}>
                장바구니로 돌아가기
              </SubButton>
            </SummaryCard>
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
  width: 1200px;
  margin: 0 auto;
  padding: 54px 0 80px;
`;

const PageTitle = styled.h1`
  margin: 0 0 28px;
  font-size: 34px;
  font-weight: 800;
  color: #111111;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 820px) 360px;
  gap: 32px;
  align-items: start;
`;

const LeftArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const RightArea = styled.aside`
  position: sticky;
  top: 110px;
`;

const SectionCard = styled.section`
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
  gap: 12px;
  margin: 0 0 20px;
  font-size: 18px;
  font-weight: 800;
  color: #111111;
`;

const DefaultBadge = styled.span`
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 9px;
  border: 1px solid #08aa7c;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  color: #08aa7c;
  background: #ffffff;
`;

const InfoRowGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.3fr 1.8fr;
  gap: 22px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const InfoLabel = styled.span`
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 800;
  color: #222222;
`;

const InfoValue = styled.span`
  font-size: 15px;
  color: #444444;
`;

const DeliveryInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  row-gap: 14px;
  column-gap: 24px;
`;

const DeliveryLabel = styled.div`
  font-size: 14px;
  font-weight: 800;
  color: #222222;
`;

const DeliveryValue = styled.div`
  font-size: 15px;
  color: #333333;
`;

const OrderTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background: #e4f7f1;
  }

  th {
    height: 36px;
    text-align: left;
    font-size: 14px;
    font-weight: 800;
    color: #222222;
  }

  th:nth-child(1) {
    padding-left: 14px;
  }

  th:nth-child(2),
  th:nth-child(3) {
    width: 160px;
  }

  td {
    height: 56px;
    border-bottom: 1px solid #eeeeee;
    font-size: 14px;
    color: #222222;
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }
`;

const ProductCell = styled.td`
  display: flex;
  align-items: center;
  gap: 14px;
  padding-left: 14px;
`;

const ProductImageBox = styled.div`
  width: 38px;
  height: 38px;
  border: 1px solid #eeeeee;
  border-radius: 4px;
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
  max-width: 430px;
  font-size: 14px;
  color: #333333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmptyCell = styled.td`
  height: 120px !important;
  text-align: center;
  color: #999999;
`;

const PaymentMethodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
`;

const PaymentMethodCard = styled.button`
  height: 54px;
  border: 1px solid ${({ $active }) => ($active ? "#00a878" : "#d4d4d4")};
  border-radius: 5px;
  background: ${({ $active }) => ($active ? "#eafff7" : "#ffffff")};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 700;
  color: #444444;
  cursor: pointer;
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

const SummaryCard = styled.section`
  border: 1px solid #d8d8d8;
  border-radius: 5px;
  background: #ffffff;
  padding: 28px 30px;
`;

const SummaryTitle = styled.h2`
  margin: 0 0 28px;
  font-size: 22px;
  font-weight: 800;
  color: #111111;
`;

const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  font-size: 15px;
  color: #222222;

  strong {
    font-size: 16px;
    font-weight: 800;
  }
`;

const PointRow = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  align-items: center;
  gap: 12px;
  margin-bottom: 26px;
  font-size: 15px;
  color: #222222;
`;

const PointInput = styled.input`
  height: 30px;
  border: 1px solid #d4d4d4;
  padding: 0 10px;
  text-align: right;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #00a878;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #dddddd;
  margin: 26px 0 24px;
`;

const FinalRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;

  span {
    font-size: 17px;
    font-weight: 800;
    color: #111111;
  }

  strong {
    font-size: 30px;
    font-weight: 900;
    color: #00a878;
  }
`;

const PayButton = styled.button`
  width: 100%;
  height: 54px;
  border: 0;
  border-radius: 7px;
  background: #00a878;
  color: #ffffff;
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const SubButton = styled.button`
  width: 100%;
  height: 48px;
  margin-top: 12px;
  border: 1px solid #d4d4d4;
  border-radius: 7px;
  background: #ffffff;
  color: #333333;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
`;

const LoadingBox = styled.div`
  height: 300px;
  display: grid;
  place-items: center;
  border: 1px solid #eeeeee;
  border-radius: 8px;
  font-size: 18px;
  color: #666666;
`;

const DeliveryRequestInput = styled.input`
  width: 100%;
  height: 34px;
  border: 1px solid #cfd8d5;
  border-radius: 4px;
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
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 22px;
`;

const DeliverySelectCard = styled.button`
  min-height: 88px;
  border: 1px solid ${({ $active }) => ($active ? "#00a878" : "#d8d8d8")};
  border-radius: 6px;
  background: ${({ $active }) => ($active ? "#ffffff" : "#ffffff")};
  padding: 14px 16px;
  text-align: left;
  cursor: pointer;
  box-shadow: ${({ $active }) =>
    $active ? "0 0 0 2px rgba(0, 168, 120, 0.08)" : "none"};

  &:hover {
    border-color: #00a878;
  }
`;

const DeliveryCardTop = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

  strong {
    font-size: 14px;
    font-weight: 800;
    color: #222222;
  }
`;

const DeliveryCardReceiver = styled.div`
  margin-bottom: 4px;
  font-size: 13px;
  font-weight: 700;
  color: #333333;
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
  min-height: 120px;
  display: grid;
  place-items: center;
  border: 1px dashed #bdebd9;
  border-radius: 6px;
  background: #ffffff;
  font-size: 14px;
  color: #777777;
`;
