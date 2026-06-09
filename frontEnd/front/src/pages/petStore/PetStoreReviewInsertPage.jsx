import { useLocation, useParams } from "react-router-dom";
import styled from "styled-components";

export default function PetStoreReviewInsertPage() {
  const { orderItemId } = useParams();
  const location = useLocation();

  const reviewTarget = location.state;

  return (
    <Wrapper>
      <h1>리뷰 작성</h1>

      <InfoBox>
        <p>URL orderItemId: {orderItemId}</p>
        <p>state orderItemId: {reviewTarget?.orderItemId}</p>
        <p>상품명: {reviewTarget?.productName}</p>
        <p>수량: {reviewTarget?.qty}</p>
        <p>상품금액: {reviewTarget?.totalPrice}</p>

        {reviewTarget?.productImageUrl && (
          <img
            src={reviewTarget.productImageUrl}
            alt={reviewTarget.productName}
            width="120"
            height="120"
          />
        )}
      </InfoBox>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 40px;
`;

const InfoBox = styled.div`
  padding: 20px;
  border: 1px solid #ddd;
`;
