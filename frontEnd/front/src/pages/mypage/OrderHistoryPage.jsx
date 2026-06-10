import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import MyPageLayout from "./components/MyPageLayout";
import useOrderHistory from "../../features/mypage/store/hooks/useOrderHistory";

function getStatusLabel(status) {
  const map = {
    ORDERED: "주문완료",
    PAID: "결제완료",
    SHIPPING: "배송중",
    DELIVERED: "배송완료",
    CANCELED: "주문취소",
  };

  return map[status] || status;
}

function canCancel(status) {
  return status === "ORDERED" || status === "PAID";
}

function canReview(status) {
  return status === "DELIVERED";
}

function formatPrice(value) {
  return Number(value || 0).toLocaleString();
}

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const { orderList, loading, currentPage, setCurrentPage, totalPages } =
    useOrderHistory();

  const [openedOrderId, setOpenedOrderId] = useState(null);

  function handleToggle(orderId) {
    setOpenedOrderId((prev) => (prev === orderId ? null : orderId));
  }

  function handleCancelOrder(orderId) {
    alert(`주문취소 기능은 API 연결 후 처리됩니다. 주문번호: ${orderId}`);
  }

  function handleWriteReview(item) {
    if (item.reviewed) {
      alert("이미 리뷰를 작성한 상품입니다.");
      return;
    }

    if (!item.orderItemId) {
      alert(
        "주문상품 ID가 없습니다. 주문내역 응답에 orderItemId가 필요합니다.",
      );
      return;
    }

    navigate(`/store/review/insert/${item.orderItemId}`, {
      state: {
        orderItemId: item.orderItemId,
        productId: item.productId,
        productName: item.productName,
        productImageUrl: item.imageUrl,
        price: item.price,
        qty: item.qty,
        totalPrice: item.totalPrice,
      },
    });
  }

  return (
    <MyPageLayout>
      <Title>주문 내역</Title>

      {loading ? (
        <EmptyBox>주문 내역을 불러오는 중입니다...</EmptyBox>
      ) : orderList.length === 0 ? (
        <EmptyBox>주문 내역이 없습니다.</EmptyBox>
      ) : (
        <>
          <OrderList>
            {orderList.map((order) => (
              <OrderCard key={order.orderId}>
                <OrderTop onClick={() => handleToggle(order.orderId)}>
                  <LeftArea>
                    <OrderDate>{order.orderDate}</OrderDate>

                    <ProductSummary>
                      <Thumb>
                        {order.firstProductImageUrl ? (
                          <img
                            src={order.firstProductImageUrl}
                            alt={order.firstProductName}
                          />
                        ) : (
                          <span>📦</span>
                        )}
                      </Thumb>

                      <ProductText>
                        <ProductName>
                          {order.firstProductName}
                          {order.itemCount > 1 &&
                            ` 외 ${order.itemCount - 1}건`}
                        </ProductName>

                        <OrderNumber>주문번호 {order.orderId}</OrderNumber>
                      </ProductText>
                    </ProductSummary>
                  </LeftArea>

                  <RightArea>
                    <StatusBadge $status={order.orderStatus}>
                      {getStatusLabel(order.orderStatus)}
                    </StatusBadge>

                    <FinalAmount>
                      {formatPrice(order.finalAmount)}원
                    </FinalAmount>

                    <Arrow>{openedOrderId === order.orderId ? "▲" : "▼"}</Arrow>
                  </RightArea>
                </OrderTop>

                {openedOrderId === order.orderId && (
                  <OrderDetail>
                    <DetailTitle>주문 상품</DetailTitle>

                    {order.items?.map((item) => (
                      <ItemRow key={item.orderItemId ?? item.productId}>
                        <ItemThumb>
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.productName} />
                          ) : (
                            <span>📦</span>
                          )}
                        </ItemThumb>

                        <ItemInfo>
                          <h4>{item.productName}</h4>
                          <p>
                            {formatPrice(item.price)}원 × {item.qty}개
                          </p>
                        </ItemInfo>

                        <ItemRight>
                          <strong>{formatPrice(item.totalPrice)}원</strong>

                          {item.reviewed ? (
                            <ReviewDoneButton type="button" disabled>
                              리뷰완료
                            </ReviewDoneButton>
                          ) : (
                            <ReviewButton
                              type="button"
                              onClick={() => handleWriteReview(item)}
                            >
                              리뷰작성
                            </ReviewButton>
                          )}
                        </ItemRight>
                      </ItemRow>
                    ))}

                    <Divider />

                    <PaymentBox>
                      <PaymentLine>
                        <span>배송비</span>
                        <strong>{formatPrice(order.deliveryFee)}원</strong>
                      </PaymentLine>

                      <PaymentLine>
                        <span>사용 포인트</span>
                        <strong>-{formatPrice(order.usedPoint)}P</strong>
                      </PaymentLine>

                      <PaymentLine>
                        <span>최종 결제금액</span>
                        <FinalPrice>
                          {formatPrice(order.finalAmount)}원
                        </FinalPrice>
                      </PaymentLine>
                    </PaymentBox>

                    <Divider />

                    <DetailTitle>배송 정보</DetailTitle>

                    <DeliveryBox>
                      <p>수령인 : {order.receiverName}</p>
                      <p>연락처 : {order.receiverPhone}</p>
                      <p>
                        주소 : ({order.zipCode}) {order.address}{" "}
                        {order.addressDetail}
                      </p>
                      <p>요청사항 : {order.deliveryRequest || "없음"}</p>
                    </DeliveryBox>

                    <ButtonArea>
                      {canCancel(order.orderStatus) && (
                        <CancelButton
                          type="button"
                          onClick={() => handleCancelOrder(order.orderId)}
                        >
                          주문취소
                        </CancelButton>
                      )}
                    </ButtonArea>
                  </OrderDetail>
                )}
              </OrderCard>
            ))}
          </OrderList>

          {totalPages > 1 && (
            <Pagination>
              <PageBtn
                type="button"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                {"<"}
              </PageBtn>

              {Array.from({ length: totalPages }).map((_, idx) => (
                <PageBtn
                  key={idx}
                  type="button"
                  $active={currentPage === idx}
                  onClick={() => setCurrentPage(idx)}
                >
                  {idx + 1}
                </PageBtn>
              ))}

              <PageBtn
                type="button"
                disabled={currentPage === totalPages - 1}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                {">"}
              </PageBtn>
            </Pagination>
          )}
        </>
      )}
    </MyPageLayout>
  );
}

const Title = styled.h1`
  font-size: 32px;
  color: #00a982;
  margin-bottom: 24px;
`;

const EmptyBox = styled.div`
  height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777;
  font-weight: 700;
`;

const OrderList = styled.div`
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const OrderCard = styled.section`
  background: white;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #e9ecef;
`;

const OrderTop = styled.div`
  padding: 22px 24px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  cursor: pointer;

  &:hover {
    background: #fafdfc;
  }
`;

const LeftArea = styled.div`
  flex: 1;
`;

const OrderDate = styled.div`
  font-size: 14px;
  font-weight: 800;
  color: #222;
  margin-bottom: 14px;
`;

const ProductSummary = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Thumb = styled.div`
  width: 86px;
  height: 86px;
  border-radius: 12px;
  background: #f1f3f5;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  span {
    font-size: 32px;
  }
`;

const ProductText = styled.div`
  flex: 1;
`;

const ProductName = styled.h3`
  font-size: 18px;
  margin-bottom: 8px;
`;

const OrderNumber = styled.p`
  font-size: 13px;
  color: #888;
`;

const RightArea = styled.div`
  width: 160px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 800;
  color: ${({ $status }) => ($status === "CANCELED" ? "#fa5252" : "#00a982")};
  background: ${({ $status }) =>
    $status === "CANCELED" ? "#fff0f0" : "#d9f6ec"};
`;

const FinalAmount = styled.strong`
  margin-top: 12px;
  font-size: 19px;
`;

const Arrow = styled.span`
  margin-top: 8px;
  color: #999;
`;

const OrderDetail = styled.div`
  padding: 24px;
  border-top: 1px solid #edf2f7;
  background: #fcfffd;
`;

const DetailTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 14px;
  color: #222;
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid #f1f3f4;
`;

const ItemThumb = styled(Thumb)`
  width: 64px;
  height: 64px;
`;

const ItemInfo = styled.div`
  flex: 1;

  h4 {
    font-size: 15px;
    margin-bottom: 6px;
  }

  p {
    font-size: 13px;
    color: #777;
  }
`;

const ItemRight = styled.div`
  min-width: 120px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
`;

const ReviewButton = styled.button`
  border: 1px solid #00b894;
  border-radius: 999px;
  padding: 7px 14px;
  background: white;
  color: #00a982;
  font-weight: 700;
  cursor: pointer;
`;

const Divider = styled.hr`
  margin: 22px 0;
  border: none;
  border-top: 1px solid #e9ecef;
`;

const PaymentBox = styled.div`
  background: #f8fffc;
  border-radius: 12px;
  padding: 18px;
`;

const PaymentLine = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FinalPrice = styled.strong`
  color: #00a982;
  font-size: 19px;
`;

const DeliveryBox = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 18px;
  line-height: 1.9;
  color: #555;
`;

const ButtonArea = styled.div`
  margin-top: 22px;
  display: flex;
  justify-content: flex-end;
`;

const CancelButton = styled.button`
  border: none;
  border-radius: 999px;
  padding: 10px 24px;
  background: #ff6b6b;
  color: white;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    background: #fa5252;
  }
`;

const Pagination = styled.div`
  width: 100%;
  max-width: 900px;
  margin-top: 24px;
  display: flex;
  justify-content: center;
  gap: 8px;
`;

const PageBtn = styled.button`
  width: 34px;
  height: 34px;
  border: 1px solid ${({ $active }) => ($active ? "#00a982" : "#dee2e6")};
  border-radius: 6px;
  background: ${({ $active }) => ($active ? "#00a982" : "white")};
  color: ${({ $active }) => ($active ? "white" : "#555")};
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const ReviewDoneButton = styled.button`
  border: 1px solid #d6d6d6;
  border-radius: 999px;
  padding: 7px 14px;
  background: #f1f3f5;
  color: #999;
  font-weight: 700;
  cursor: not-allowed;
`;
