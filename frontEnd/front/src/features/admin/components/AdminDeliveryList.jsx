import styled from "styled-components";

export default function AdminDeliveryList({
  status,
  deliveries,
  selectedIds,
  openId,
  details,
  onToggleSelect,
  onToggleSelectAll,
  onToggleOpen,
}) {
  const allChecked =
    deliveries.length > 0 && selectedIds.length === deliveries.length;

  if (!deliveries || deliveries.length === 0) {
    return <EmptyBox>조회된 배송건이 없습니다.</EmptyBox>;
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>
            {status === "READY" && (
              <input
                type="checkbox"
                checked={allChecked}
                onChange={onToggleSelectAll}
              />
            )}
          </th>
          <th>주문번호</th>
          <th>주문자</th>
          <th>수령인</th>
          <th>연락처</th>
          <th>배송상태</th>
          <th>결제금액</th>
          <th>주문일</th>
        </tr>
      </thead>

      <tbody>
        {deliveries.map((delivery) => (
          <>
            <tr key={delivery.deliveryId}>
              <td>
                {status === "READY" && (
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(delivery.deliveryId)}
                    onChange={() => onToggleSelect(delivery.deliveryId)}
                    onClick={(evt) => evt.stopPropagation()}
                  />
                )}
              </td>
              <td onClick={() => onToggleOpen(delivery.deliveryId)}>
                #{delivery.orderId}
              </td>
              <td onClick={() => onToggleOpen(delivery.deliveryId)}>
                {delivery.ordererNickname}
              </td>
              <td onClick={() => onToggleOpen(delivery.deliveryId)}>
                {delivery.receiverName}
              </td>
              <td onClick={() => onToggleOpen(delivery.deliveryId)}>
                {delivery.receiverPhone}
              </td>
              <td onClick={() => onToggleOpen(delivery.deliveryId)}>
                {getStatusText(delivery.deliveryStatus)}
              </td>
              <td onClick={() => onToggleOpen(delivery.deliveryId)}>
                {formatPrice(delivery.finalAmount)}원
              </td>
              <td onClick={() => onToggleOpen(delivery.deliveryId)}>
                {formatDate(delivery.createdAt)}
              </td>
            </tr>

            {openId === delivery.deliveryId && (
              <tr>
                <DetailTd colSpan={8}>
                  <DeliveryDetail detail={details[delivery.deliveryId]} />
                </DetailTd>
              </tr>
            )}
          </>
        ))}
      </tbody>
    </Table>
  );
}

function DeliveryDetail({ detail }) {
  if (!detail) {
    return <DetailBox>상세 정보를 불러오는 중입니다.</DetailBox>;
  }

  return (
    <DetailBox>
      <SectionTitle>배송지 정보</SectionTitle>
      <InfoText>
        수령인: {detail.receiverName} / {detail.receiverPhone}
      </InfoText>
      <InfoText>
        주소: ({detail.zipCode}) {detail.address} {detail.addressDetail}
      </InfoText>
      <InfoText>요청사항: {detail.requestMemo || "-"}</InfoText>

      <SectionTitle>상품 목록</SectionTitle>
      {detail.items.map((item) => (
        <ItemRow key={item.orderItemId}>
          <span>
            {item.productName} x {item.quantity}
          </span>
          <strong>{formatPrice(item.totalPrice)}원</strong>
        </ItemRow>
      ))}

      <PriceBox>
        <InfoText>배송비: {formatPrice(detail.deliveryFee)}원</InfoText>
        <InfoText>사용 포인트: {formatPrice(detail.usedPoint)}P</InfoText>
        <FinalPrice>
          총 결제금액: {formatPrice(detail.finalAmount)}원
        </FinalPrice>
      </PriceBox>
    </DetailBox>
  );
}

function getStatusText(status) {
  switch (status) {
    case "READY":
      return "배송 준비중";
    case "SHIPPING":
      return "배송중";
    case "DELIVERED":
      return "배송완료";
    default:
      return status || "-";
  }
}

function formatDate(value) {
  if (!value) return "-";
  return value.replace("T", " ").substring(0, 16);
}

function formatPrice(value) {
  if (value == null) return "0";
  return value.toLocaleString();
}

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;

  th,
  td {
    padding: 14px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    text-align: left;
  }

  th {
    background-color: #f8f8f8;
    font-weight: 800;
  }

  tbody tr:hover {
    background-color: #fafafa;
  }

  td {
    cursor: pointer;
  }
`;

const DetailTd = styled.td`
  background-color: #fafafa;
  cursor: default !important;
`;

const DetailBox = styled.div`
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 14px;
  background-color: white;
`;

const SectionTitle = styled.h3`
  margin: 16px 0 10px;

  &:first-child {
    margin-top: 0;
  }
`;

const InfoText = styled.p`
  margin: 4px 0;
  color: #555;
  font-size: 14px;
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f1f1f1;
`;

const PriceBox = styled.div`
  margin-top: 18px;
  text-align: right;
`;

const FinalPrice = styled.p`
  margin-top: 8px;
  font-size: 18px;
  font-weight: 800;
`;

const EmptyBox = styled.div`
  padding: 80px 0;
  text-align: center;
  background-color: white;
  border: 1px solid #eee;
  color: #777;
`;
