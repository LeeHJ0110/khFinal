import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  getRecentProducts,
  removeRecentProduct,
} from "../../features/petStore/hooks/useRecentProductStorage";

export default function PetStoreRecentAside() {
  const navigate = useNavigate();

  const [recentProducts, setRecentProducts] = useState([]);

  function loadRecentProducts() {
    const products = getRecentProducts();
    setRecentProducts(products);
  }

  useEffect(() => {
    loadRecentProducts();

    window.addEventListener(
      "petStoreRecentProductsChanged",
      loadRecentProducts,
    );

    window.addEventListener("storage", loadRecentProducts);

    return () => {
      window.removeEventListener(
        "petStoreRecentProductsChanged",
        loadRecentProducts,
      );

      window.removeEventListener("storage", loadRecentProducts);
    };
  }, []);

  function handleClickProduct(productId) {
    navigate(`/store/product/${productId}`);
  }

  function handleRemoveProduct(evt, productId) {
    evt.stopPropagation();
    removeRecentProduct(productId);
  }

  return (
    <Wrapper>
      <GlowTop />
      <GlowBottom />

      <RecentHeader>
        <TitleBox>
          <RecentTitle>최근 본 상품</RecentTitle>
          <RecentSubTitle>최근 조회한 상품이에요</RecentSubTitle>
        </TitleBox>

        <RecentCount>{recentProducts.length}/5</RecentCount>
      </RecentHeader>

      {recentProducts.length === 0 ? (
        <EmptyBox>
          <EmptyIcon>🐾</EmptyIcon>
          <EmptyText>최근 본 상품이 없습니다.</EmptyText>
        </EmptyBox>
      ) : (
        <RecentList>
          {recentProducts.map((product, index) => (
            <RecentItem
              key={product.productId}
              role="button"
              tabIndex={0}
              $index={index}
              onClick={() => handleClickProduct(product.productId)}
              onKeyDown={(evt) => {
                if (evt.key === "Enter") {
                  handleClickProduct(product.productId);
                }
              }}
            >
              <RecentThumb>
                {product.mainImageUrl ? (
                  <RecentImage
                    src={product.mainImageUrl}
                    alt={product.productName}
                  />
                ) : (
                  <RecentThumbText>이미지</RecentThumbText>
                )}
              </RecentThumb>

              <RecentInfo>
                <RecentName>{product.productName}</RecentName>

                {product.productPrice != null && (
                  <RecentPrice>
                    {Number(product.productPrice).toLocaleString()}원
                  </RecentPrice>
                )}
              </RecentInfo>

              <RemoveButton
                type="button"
                aria-label="최근 본 상품 삭제"
                onClick={(evt) => handleRemoveProduct(evt, product.productId)}
              >
                ×
              </RemoveButton>
            </RecentItem>
          ))}
        </RecentList>
      )}
    </Wrapper>
  );
}

const itemFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Wrapper = styled.aside`
  position: relative;

  width: 100%;
  height: 455px;
  padding: 18px 12px 14px;
  box-sizing: border-box;

  overflow: hidden;

  border: 1px solid rgba(0, 169, 123, 0.13);
  border-radius: 10px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.96) 0%,
    rgba(238, 250, 245, 0.98) 48%,
    rgba(229, 245, 238, 1) 100%
  );
  box-shadow:
    0 12px 26px rgba(18, 45, 46, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
`;

const GlowTop = styled.div`
  position: absolute;
  top: -62px;
  right: -58px;

  width: 136px;
  height: 136px;

  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(0, 169, 123, 0.22) 0%,
    rgba(0, 169, 123, 0.09) 42%,
    transparent 72%
  );

  pointer-events: none;
`;

const GlowBottom = styled.div`
  position: absolute;
  left: -46px;
  bottom: -56px;

  width: 118px;
  height: 118px;

  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 196, 0, 0.14) 0%,
    rgba(255, 196, 0, 0.06) 46%,
    transparent 72%
  );

  pointer-events: none;
`;

const RecentHeader = styled.div`
  position: relative;
  z-index: 1;

  height: 42px;

  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const TitleBox = styled.div`
  min-width: 0;
`;

const RecentTitle = styled.h3`
  margin: 0;

  color: #151918;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.35px;
`;

const RecentSubTitle = styled.p`
  margin: 4px 0 0;

  color: #7a8b85;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: -0.25px;
`;

const RecentCount = styled.span`
  min-width: 32px;
  height: 22px;
  padding: 0 7px;
  box-sizing: border-box;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border-radius: 999px;
  background-color: rgba(0, 169, 123, 0.13);
  color: var(--color-main);

  font-size: 10px;
  font-weight: 600;
`;

const RecentList = styled.div`
  position: relative;
  z-index: 1;

  height: calc(100% - 42px);
  padding-top: 10px;
  box-sizing: border-box;

  display: grid;
  grid-template-rows: repeat(5, 1fr);
  gap: 8px;
`;

const RecentItem = styled.div`
  position: relative;

  min-width: 0;
  padding: 8px 25px 8px 8px;
  box-sizing: border-box;

  display: flex;
  align-items: center;
  gap: 9px;

  overflow: hidden;

  border: 1px solid rgba(213, 226, 220, 0.82);
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.82);
  box-shadow:
    0 2px 8px rgba(18, 45, 46, 0.045),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);

  cursor: pointer;

  animation: ${itemFadeIn} 0.22s ease both;
  animation-delay: ${({ $index }) => `${$index * 0.035}s`};

  transition:
    transform 0.17s ease,
    box-shadow 0.17s ease,
    border-color 0.17s ease,
    background-color 0.17s ease;

  &:hover {
    transform: translateX(-2px);
    border-color: rgba(0, 169, 123, 0.36);
    background-color: rgba(255, 255, 255, 0.98);
    box-shadow: 0 8px 17px rgba(18, 45, 46, 0.095);
  }

  &:focus {
    outline: 2px solid rgba(0, 169, 123, 0.28);
    outline-offset: 2px;
  }
`;

const RecentThumb = styled.div`
  width: 40px;
  height: 40px;
  flex: 0 0 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  border-radius: 9px;
  background: linear-gradient(180deg, #ffffff 0%, #f5fbf8 100%);
  box-shadow:
    0 2px 7px rgba(18, 45, 46, 0.06),
    inset 0 0 0 1px rgba(0, 169, 123, 0.06);
`;

const RecentImage = styled.img`
  width: 100%;
  height: 100%;
  padding: 3px;
  box-sizing: border-box;
  object-fit: contain;

  transition: transform 0.18s ease;

  ${RecentItem}:hover & {
    transform: scale(1.06);
  }
`;

const RecentThumbText = styled.span`
  color: var(--text-desc);
  font-size: 9px;
  font-weight: 800;
`;

const RecentInfo = styled.div`
  min-width: 0;
  flex: 1;
`;

const RecentName = styled.p`
  min-width: 0;
  margin: 0;

  color: #202423;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.32;
  letter-spacing: -0.25px;

  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const RecentPrice = styled.p`
  margin: 5px 0 0;

  color: #111;
  font-size: 12px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.25px;
  white-space: nowrap;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 7px;
  right: 6px;

  width: 20px;
  height: 20px;
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 0;
  border-radius: 50%;
  background-color: rgba(236, 244, 240, 0.9);
  color: #7d8b86;

  font-size: 15px;
  font-weight: 900;
  line-height: 1;
  cursor: pointer;

  transition:
    color 0.16s ease,
    background-color 0.16s ease,
    transform 0.16s ease,
    box-shadow 0.16s ease;

  &:hover {
    color: #ffffff;
    background-color: #7d8b86;
    transform: rotate(90deg) scale(1.05);
    box-shadow: 0 3px 8px rgba(18, 45, 46, 0.14);
  }
`;

const EmptyBox = styled.div`
  position: relative;
  z-index: 1;

  height: calc(100% - 42px);
  padding-top: 10px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const EmptyIcon = styled.div`
  width: 48px;
  height: 48px;
  margin-bottom: 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  background-color: rgba(0, 169, 123, 0.1);
  box-shadow: inset 0 0 0 1px rgba(0, 169, 123, 0.09);

  font-size: 23px;
`;

const EmptyText = styled.p`
  margin: 0;

  color: #7d8b86;
  font-size: 12px;
  font-weight: 800;
  line-height: 1.45;
  text-align: center;
  letter-spacing: -0.25px;
`;
