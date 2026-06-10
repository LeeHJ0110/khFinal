import styled from "styled-components";
import usePetStoreProductList from "../../petStore/hooks/usePetStoreProductList";
import usePetStoreWishToggle from "../../petStore/hooks/usePetStoreWishToggle";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useStoreForKarte from "../hooks/useStoreForKarte";

function getTempReviewInfo(index) {
  const tempReviewList = [
    { rating: "4.9", count: 128 },
    { rating: "4.8", count: 92 },
    { rating: "4.7", count: 76 },
    { rating: "4.6", count: 54 },
    { rating: "4.5", count: 31 },
  ];

  return tempReviewList[index % tempReviewList.length];
}

export default function StoreList({ targetPetType, category, tagId }) {
  const navigate = useNavigate();
  const { updateProductWishState } = usePetStoreProductList(
    targetPetType,
    category,
  );
  const { productList, isLoading, loadProductList } = useStoreForKarte();

  useEffect(() => {
    loadProductList({ targetPetType, category, tagId });
  }, [targetPetType, category, tagId]);

  return (
    <CardContainer>
      <CardTitle>추천상품</CardTitle>
      <CardContent>
        {isLoading ? (
          <EmptyBox>상품 목록을 불러오는 중입니다...</EmptyBox>
        ) : productList.length === 0 ? (
          <EmptyBox>조건에 맞는 상품이 없습니다.</EmptyBox>
        ) : (
          <ProductGrid>
            {productList.map((product, index) => {
              const tempReview = getTempReviewInfo(index);

              return (
                <ProductCard
                  key={product.productId}
                  onClick={() =>
                    navigate(`/store/product/${product.productId}`)
                  }
                >
                  <ProductImageBox>
                    {product.mainImageUrl ? (
                      <ProductImage
                        src={product.mainImageUrl}
                        alt={product.productName}
                      />
                    ) : (
                      <ProductImageText>상품 이미지</ProductImageText>
                    )}
                  </ProductImageBox>

                  <ProductInfoArea>
                    <ProductName>{product.productName}</ProductName>

                    <ProductReviewInfo>
                      <ReviewStar>★</ReviewStar>
                      {tempReview.rating} ({tempReview.count})
                    </ProductReviewInfo>

                    <ProductPrice>
                      {product.productPrice?.toLocaleString()}원
                    </ProductPrice>
                  </ProductInfoArea>
                </ProductCard>
              );
            })}
          </ProductGrid>
        )}
      </CardContent>
    </CardContainer>
  );
}

const CardContainer = styled.div`
  width: 100%;
  margin-top: 20px;
  background-color: #d9eddf; /* 회색빛 배경색 */
  border-radius: 16px;
  padding-top: 12px; /* 헤더 위치를 위한 여백 */
  position: relative;
  min-height: 150px;
`;

const CardTitle = styled.div`
  display: inline-block;
  background-color: #d9eddf;
  padding: 10px 24px;
  border-radius: 20px 20px 0 0;
  font-size: 22px;
  font-weight: bold;

  color: #333;
  position: absolute;
  top: -24px; /* 박스 위로 살짝 걸치게 */
`;

const CardContent = styled.div`
  background-color: white;
  margin: 12px 1px 0;
  margin-top: 24px; /* 헤더 아래쪽 공간 확보 */
  padding: 20px;
  min-height: 100px;
  font-size: 16px;
  line-height: 1.6;
  color: #444;
  word-break: break-all;
  white-space: pre-wrap; /* 줄바꿈 유지 */
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 34px 30px;
`;

const ProductCard = styled.article`
  position: relative;

  height: 276px;
  padding: 20px 18px 20px;

  display: flex;
  flex-direction: column;

  border-radius: 11px;
  background-color: var(--color-white);
  box-shadow: 0 2px 8px rgba(18, 45, 46, 0.08);

  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 18px rgba(18, 45, 46, 0.12);
  }

  &:hover img {
    transform: scale(1.045);
  }
`;

const WishButton = styled.button`
  position: absolute;
  right: 13px;
  top: 12px;
  z-index: 3;

  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 0;
  border-radius: 50%;
  background-color: transparent;
  color: ${({ $active }) => ($active ? "var(--color-main)" : "#151918")};

  font-size: ${({ $active }) => ($active ? "27px" : "29px")};
  font-weight: ${({ $active }) => ($active ? "800" : "300")};
  line-height: 1;
  cursor: pointer;

  transition:
    color 0.18s ease,
    transform 0.18s ease,
    background-color 0.18s ease;

  &:hover {
    color: var(--color-main);
    transform: scale(1.09);
    background-color: rgba(236, 253, 246, 0.72);
  }

  &:active {
    transform: scale(0.94);
  }

  &:disabled {
    opacity: 0.55;
    cursor: wait;
  }
`;

const ProductImageBox = styled.div`
  position: relative;

  width: 100%;
  height: 132px;
  margin-bottom: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: visible;
  border-radius: 0;
  background-color: transparent;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  padding: 0;
  object-fit: contain;

  transition: transform 0.2s ease;
`;

const ProductImageText = styled.span`
  color: var(--text-desc);
  font-size: 12px;
  font-weight: 600;
`;

const ProductInfoArea = styled.div`
  flex: 1;
  min-height: 0;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ProductName = styled.h3`
  min-height: 35px;
  margin: 0 0 6px;

  color: #202423;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.38;
  letter-spacing: -0.2px;

  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ProductReviewInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  margin-bottom: 9px;

  color: #555f5c;
  font-size: 11px;
  font-weight: 500;
`;

const ReviewStar = styled.span`
  color: #ffc400;
  font-size: 13px;
  line-height: 1;
`;

const ProductPrice = styled.p`
  margin: auto 0 0;

  color: #151918;
  font-size: 20px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.65px;
`;

const EmptyBox = styled.div`
  min-height: 300px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--text-sub);
  font-size: 14px;
  font-weight: 600;
`;
