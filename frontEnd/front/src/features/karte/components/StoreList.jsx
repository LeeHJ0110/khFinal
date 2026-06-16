import styled from "styled-components";
import usePetStoreProductList from "../../petStore/hooks/usePetStoreProductList";
import usePetStoreWishToggle from "../../petStore/hooks/usePetStoreWishToggle";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useStoreForKarte from "../hooks/useStoreForKarte";
import usePetStoreBestProductList from "../../petStore/hooks/usePetStoreBestProductList";

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

  const limitedProductList = productList ? productList.slice(0, 5) : [];

  return (
    <CardContainer>
      <CardTitle>📦 맞춤 건강 추천 상품</CardTitle>
      <CardContent>
        {isLoading ? (
          <EmptyBox>상품 목록을 불러오는 중입니다...</EmptyBox>
        ) : limitedProductList.length === 0 ? (
          <EmptyBox>조건에 맞는 상품이 없습니다.</EmptyBox>
        ) : (
          <ProductGrid>
            {limitedProductList.map((product, index) => {
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
                      {product.averageRating.toFixed(1)} ({product.reviewCount})
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

/* 💡 의사소견 카드와 완벽한 통일감을 이루는 3번 미니멀 사이드바 스타일 */
const CardContainer = styled.div`
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #eef2f0;
  border-left: 6px solid #5ec8a7; /* 동일한 두께와 색상의 포인트 바 생성 */
  border-radius: 4px 16px 16px 4px;
  padding: 24px 28px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
  min-height: 150px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CardTitle = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: #222;
`;

const CardContent = styled.div`
  width: 100%;
`;

/* 한 줄에 딱 5개 정렬 */
const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 30px;
`;

const ProductCard = styled.article`
  position: relative;
  height: 276px;
  padding: 20px 18px;
  display: flex;
  flex-direction: column;
  border-radius: 11px;
  border: 1px solid #f2f2f2;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(94, 200, 167, 0.12);
    border-color: #5ec8a7;
  }
`;

const ProductImageBox = styled.div`
  width: 100%;
  height: 132px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const ProductImageText = styled.span`
  color: #aaa;
  font-size: 12px;
  font-weight: 600;
`;

const ProductInfoArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ProductName = styled.h3`
  min-height: 35px;
  margin: 0 0 6px;
  color: #222;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
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
  color: #666;
  font-size: 11px;
`;

const ReviewStar = styled.span`
  color: #ffc400;
  font-size: 13px;
`;

const ProductPrice = styled.p`
  margin: auto 0 0;
  color: #111;
  font-size: 18px;
  font-weight: 800;
`;

const EmptyBox = styled.div`
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
  font-weight: 600;
`;
