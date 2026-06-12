import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import usePetStoreWishList from "../../features/petStore/hooks/usePetStoreWishList";
import { insertCartProduct } from "../../features/petStore/api/petStoreOrderApi";
import PetStoreNavGate from "./PetStoreNavGate";

const categoryFilterList = [
  { label: "전체", value: "" },
  { label: "사료", value: "FOOD" },
  { label: "영양제", value: "SUPPLEMENT" },
  { label: "간식", value: "SNACK" },
  { label: "배변용품", value: "TOILET" },
];

function formatPrice(value) {
  return `${Number(value ?? 0).toLocaleString()}원`;
}

function getCategoryLabel(category) {
  const categoryMap = {
    FOOD: "사료",
    FEED: "사료",
    SNACK: "간식",
    SUPPLEMENT: "영양제",
    TOILET: "배변용품",
    PAD: "배변용품",
  };

  return categoryMap[category] ?? "상품";
}

const categoryThemeMap = {
  사료: {
    background: "#e8f8f0",
    color: "var(--color-main)",
    border: "#bfead8",
  },
  영양제: {
    background: "#f2edff",
    color: "#7b55d9",
    border: "#ddd0ff",
  },
  간식: {
    background: "#fff2e8",
    color: "#e27a36",
    border: "#ffd2ba",
  },
  배변용품: {
    background: "#eaf3ff",
    color: "#2f74d0",
    border: "#c8defc",
  },
};

function getCategoryTheme(categoryLabel) {
  return (
    categoryThemeMap[categoryLabel] || {
      background: "#e8f8f0",
      color: "var(--color-main)",
      border: "#bfead8",
    }
  );
}

export default function PetStoreWishListPage() {
  const navigate = useNavigate();

  const {
    wishList,
    totalElements,
    totalPages,
    page,
    category,
    isLoading,
    loadWishList,
    handleDeleteWish,
    handleChangePage,
    handleChangeCategory,
  } = usePetStoreWishList();

  const [selectedWishlistIds, setSelectedWishlistIds] = useState([]);
  const [cartSubmittingId, setCartSubmittingId] = useState(null);
  const [isSelectedCartSubmitting, setIsSelectedCartSubmitting] =
    useState(false);

  const isAllSelected = useMemo(() => {
    return (
      wishList.length > 0 && selectedWishlistIds.length === wishList.length
    );
  }, [wishList, selectedWishlistIds]);

  function handleToggleAll() {
    if (isAllSelected) {
      setSelectedWishlistIds([]);
      return;
    }

    setSelectedWishlistIds(wishList.map((item) => item.wishlistId));
  }

  function handleToggleItem(wishlistId) {
    setSelectedWishlistIds((prev) => {
      if (prev.includes(wishlistId)) {
        return prev.filter((id) => id !== wishlistId);
      }

      return [...prev, wishlistId];
    });
  }

  async function handleDeleteOne(wishlistId) {
    const ok = window.confirm("해당 상품을 관심상품에서 삭제할까요?");

    if (!ok) {
      return;
    }

    await handleDeleteWish(wishlistId);

    setSelectedWishlistIds((prev) => prev.filter((id) => id !== wishlistId));
  }

  async function handleDeleteSelected() {
    if (selectedWishlistIds.length === 0) {
      alert("삭제할 상품을 선택해주세요.");
      return;
    }

    const ok = window.confirm("선택한 상품을 관심상품에서 삭제할까요?");

    if (!ok) {
      return;
    }

    for (const wishlistId of selectedWishlistIds) {
      await handleDeleteWish(wishlistId);
    }

    setSelectedWishlistIds([]);
    await loadWishList();
  }

  async function handleAddCart(event, item) {
    event.stopPropagation();

    try {
      setCartSubmittingId(item.wishlistId);

      await insertCartProduct({
        productId: item.productId,
        qty: 1,
      });

      alert("장바구니에 상품이 담겼습니다.");
    } catch (error) {
      console.error("장바구니 담기 실패", error);
      alert("장바구니 담기에 실패했습니다.");
    } finally {
      setCartSubmittingId(null);
    }
  }

  async function handleAddSelectedCart() {
    if (selectedWishlistIds.length === 0) {
      alert("장바구니에 담을 상품을 선택해주세요.");
      return;
    }

    const selectedItems = wishList.filter((item) =>
      selectedWishlistIds.includes(item.wishlistId),
    );

    try {
      setIsSelectedCartSubmitting(true);

      for (const item of selectedItems) {
        await insertCartProduct({
          productId: item.productId,
          qty: 1,
        });
      }

      alert("선택한 상품이 장바구니에 담겼습니다.");
    } catch (error) {
      console.error("선택 상품 장바구니 담기 실패", error);
      alert("장바구니 담기에 실패했습니다.");
    } finally {
      setIsSelectedCartSubmitting(false);
    }
  }

  function handleGoProductDetail(productId) {
    navigate(`/store/product/${productId}`, {
      state: {
        from: "wish",
      },
    });
  }

  function handleClickCategory(nextCategory) {
    setSelectedWishlistIds([]);
    handleChangeCategory(nextCategory);
  }

  function handleClickPage(nextPage) {
    setSelectedWishlistIds([]);
    handleChangePage(nextPage);
  }

  const pageNumberList = Array.from(
    { length: Math.max(totalPages, 1) },
    (_, index) => index,
  );

  return (
    <Wrapper>
      <PetStoreNavGate />

      <Inner>
        <PageTitle>관심상품</PageTitle>

        <TotalText>
          총 <strong>{Number(totalElements ?? 0).toLocaleString()}개</strong>
        </TotalText>

        <CategoryFilterRow>
          {categoryFilterList.map((item) => (
            <CategoryButton
              key={item.label}
              type="button"
              $active={category === item.value}
              onClick={() => handleClickCategory(item.value)}
            >
              {item.label}
            </CategoryButton>
          ))}
        </CategoryFilterRow>

        <SelectActionBar>
          <SelectedInfo>
            <HeartIcon>♥</HeartIcon>
            <strong>{selectedWishlistIds.length}개</strong>
            <span>선택됨</span>
            <GuideText>
              장바구니 담기 버튼을 클릭하면 선택한 상품을 한번에 담을 수 있어요.
            </GuideText>
          </SelectedInfo>

          <ActionButtonGroup>
            <SubButton type="button" onClick={handleToggleAll}>
              {isAllSelected ? "전체해제" : "전체선택"}
            </SubButton>

            <SubButton type="button" onClick={handleDeleteSelected}>
              선택삭제
            </SubButton>

            <PrimaryButton
              type="button"
              onClick={handleAddSelectedCart}
              disabled={isSelectedCartSubmitting}
            >
              {isSelectedCartSubmitting ? "담는 중..." : "장바구니 담기"}
            </PrimaryButton>
          </ActionButtonGroup>
        </SelectActionBar>

        {isLoading ? (
          <LoadingBox>관심상품을 불러오는 중입니다.</LoadingBox>
        ) : wishList.length === 0 ? (
          <EmptyBox>
            <EmptyTitle>관심상품이 없습니다.</EmptyTitle>
            <EmptyDesc>마음에 드는 상품을 관심상품에 담아보세요.</EmptyDesc>
            <ShoppingButton type="button" onClick={() => navigate("/store")}>
              쇼핑하러 가기
            </ShoppingButton>
          </EmptyBox>
        ) : (
          <>
            <WishGrid>
              {wishList.map((item) => {
                const checked = selectedWishlistIds.includes(item.wishlistId);

                return (
                  <WishCard
                    key={item.wishlistId}
                    type="button"
                    $checked={checked}
                    onClick={() => handleToggleItem(item.wishlistId)}
                  >
                    <CheckButton
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleToggleItem(item.wishlistId);
                      }}
                      aria-label="상품 선택"
                    >
                      <CheckIcon $checked={checked}>✓</CheckIcon>
                    </CheckButton>

                    <ProductImageBox>
                      {item.mainImageUrl ? (
                        <ProductImage
                          src={item.mainImageUrl}
                          alt={item.productName}
                        />
                      ) : (
                        <NoImage>상품 이미지</NoImage>
                      )}
                    </ProductImageBox>

                    <ProductInfo>
                      <CategoryBadge
                        $categoryLabel={getCategoryLabel(item.productCategory)}
                      >
                        {getCategoryLabel(item.productCategory)}
                      </CategoryBadge>

                      <ProductNameButton
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleGoProductDetail(item.productId);
                        }}
                      >
                        {item.productName}
                      </ProductNameButton>

                      <ProductPrice>
                        {formatPrice(item.productPrice)}
                      </ProductPrice>

                      <CardActionRow>
                        <CartButton
                          type="button"
                          onClick={(event) => handleAddCart(event, item)}
                          disabled={cartSubmittingId === item.wishlistId}
                        >
                          {cartSubmittingId === item.wishlistId
                            ? "담는 중..."
                            : "장바구니 담기"}
                        </CartButton>

                        <HeartDeleteButton
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDeleteOne(item.wishlistId);
                          }}
                          aria-label="관심상품 삭제"
                        >
                          ♥
                        </HeartDeleteButton>
                      </CardActionRow>
                    </ProductInfo>
                  </WishCard>
                );
              })}
            </WishGrid>

            <Pagination>
              <PageArrowButton
                type="button"
                disabled={page <= 0}
                onClick={() => handleClickPage(page - 1)}
              >
                ‹
              </PageArrowButton>

              {pageNumberList.map((pageNumber) => (
                <PageButton
                  key={pageNumber}
                  type="button"
                  $active={pageNumber === page}
                  onClick={() => handleClickPage(pageNumber)}
                >
                  {pageNumber + 1}
                </PageButton>
              ))}

              <PageArrowButton
                type="button"
                disabled={page >= totalPages - 1}
                onClick={() => handleClickPage(page + 1)}
              >
                ›
              </PageArrowButton>
            </Pagination>
          </>
        )}
      </Inner>
    </Wrapper>
  );
}

/* ================================
   Layout
================================ */

const Wrapper = styled.main`
  width: 100%;
  min-height: 100vh;
  background-color: var(--color-white);
`;

const Inner = styled.div`
  width: 1532px;
  margin: 0 auto;
  padding: 24px 0 70px;
`;

const PageTitle = styled.h1`
  margin: 0 0 18px;

  color: var(--text-main);
  font-size: 34px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -1.2px;
`;

const TotalText = styled.p`
  margin: 0 0 18px;

  color: var(--text-main);
  font-size: 16px;
  font-weight: 600;

  strong {
    color: var(--color-main);
    font-weight: 800;
  }
`;

/* ================================
   Category Filter
================================ */

const CategoryFilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  margin-bottom: 18px;
`;

const CategoryButton = styled.button`
  width: 104px;
  height: 36px;

  border: 1px solid
    ${({ $active }) => ($active ? "var(--color-main)" : "#d8d8d8")};
  border-radius: 999px;
  background-color: ${({ $active }) =>
    $active ? "var(--color-main)" : "var(--color-white)"};

  color: ${({ $active }) =>
    $active ? "var(--color-white)" : "var(--text-main)"};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 800 : 600)};
  cursor: pointer;

  transition:
    background-color 0.18s ease,
    color 0.18s ease,
    border-color 0.18s ease,
    transform 0.18s ease;

  &:hover {
    border-color: var(--color-main);
    color: ${({ $active }) =>
      $active ? "var(--color-white)" : "var(--color-main)"};
    transform: translateY(-1px);
  }
`;

/* ================================
   Select Action Bar
================================ */

const SelectActionBar = styled.section`
  height: 50px;
  padding: 0 26px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  border: 1px solid #cde8df;
  border-radius: 4px;
  background-color: #e8f8f3;

  margin-bottom: 16px;
`;

const SelectedInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  color: var(--text-main);
  font-size: 14px;
  font-weight: 600;

  strong {
    color: var(--color-main);
    font-weight: 900;
  }
`;

const HeartIcon = styled.span`
  color: var(--color-main);
  font-size: 20px;
  line-height: 1;
`;

const GuideText = styled.span`
  margin-left: 28px;

  color: var(--text-sub);
  font-size: 12px;
  font-weight: 500;
`;

const ActionButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const SubButton = styled.button`
  width: 92px;
  height: 34px;

  border: 1px solid #d2dada;
  border-radius: 4px;
  background-color: var(--color-white);

  color: var(--text-main);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    border-color: var(--color-main);
    color: var(--color-main);
  }
`;

const PrimaryButton = styled.button`
  width: 140px;
  height: 34px;

  border: 0;
  border-radius: 4px;
  background-color: var(--color-main);

  color: var(--color-white);
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    background-color: var(--color-main-dark);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

/* ================================
   Wish Grid
================================ */

const WishGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 26px 30px;
`;

const WishCard = styled.article`
  position: relative;
  height: 292px;
  padding: 18px 20px 64px;

  display: flex;
  flex-direction: column;

  overflow: hidden;

  border: 1px solid
    ${({ $checked }) => ($checked ? "var(--color-main)" : "#dedede")};
  border-radius: 8px;
  background-color: var(--color-white);

  cursor: pointer;

  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease,
    background-color 0.18s ease;

  &:hover {
    transform: translateY(-3px);
    border-color: var(--color-main);
    box-shadow: 0 8px 20px rgba(18, 45, 46, 0.1);
  }

  &:hover img {
    transform: scale(1.035);
  }
`;

const CheckButton = styled.button`
  position: absolute;
  left: 18px;
  top: 15px;
  z-index: 3;

  padding: 0;
  border: 0;
  background-color: transparent;
  cursor: pointer;
`;

const CheckIcon = styled.span`
  width: 17px;
  height: 17px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border: 1px solid
    ${({ $checked }) => ($checked ? "var(--color-main)" : "#cfcfcf")};
  border-radius: 2px;
  background-color: ${({ $checked }) =>
    $checked ? "var(--color-main)" : "var(--color-white)"};

  color: var(--color-white);
  font-size: 12px;
  font-weight: 900;
  line-height: 1;
`;

const ProductImageBox = styled.div`
  width: 100%;
  height: 108px;
  margin-bottom: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: visible;
  background-color: transparent;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;

  transition: transform 0.18s ease;
`;

const NoImage = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--text-desc);
  font-size: 12px;
  font-weight: 600;
`;

const ProductInfo = styled.div`
  flex: 1;
  min-height: 0;

  display: flex;
  flex-direction: column;
`;

const CategoryBadge = styled.span`
  width: fit-content;
  min-width: 42px;
  height: 21px;
  padding: 0 9px;
  margin-bottom: 8px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border: 1px solid
    ${({ $categoryLabel }) => getCategoryTheme($categoryLabel).border};
  border-radius: 999px;
  background-color: ${({ $categoryLabel }) =>
    getCategoryTheme($categoryLabel).background};
  color: ${({ $categoryLabel }) => getCategoryTheme($categoryLabel).color};

  font-size: 11px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.2px;
  white-space: nowrap;

  box-shadow: 0 2px 6px rgba(18, 45, 46, 0.06);
`;

const ProductNameButton = styled.button`
  height: 38px;
  margin: 0 0 8px;
  padding: 0;

  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  border: 0;
  background: transparent;

  color: var(--text-main);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.25px;
  text-align: left;

  cursor: pointer;

  &:hover {
    color: var(--color-main);
    text-decoration: underline;
    text-underline-offset: 4px;
  }
`;
const ProductPrice = styled.p`
  margin: 0;

  color: var(--text-main);
  font-size: 22px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.65px;
`;

const CardActionRow = styled.div`
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 18px;

  display: grid;
  grid-template-columns: minmax(0, 1fr) 34px;
  gap: 8px;
`;

const CartButton = styled.button`
  height: 34px;
  min-width: 0;

  border: 0;
  border-radius: 4px;
  background-color: var(--color-main);

  color: var(--color-white);
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    background-color: var(--color-main-dark);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const HeartDeleteButton = styled.button`
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #d8d8d8;
  border-radius: 4px;
  background-color: var(--color-white);

  color: var(--color-main);
  font-size: 17px;
  line-height: 1;
  cursor: pointer;

  &:hover {
    border-color: var(--color-main);
    background-color: var(--color-main-soft);
  }
`;

/* ================================
   Pagination
================================ */

const Pagination = styled.div`
  margin-top: 30px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
`;

const PageButton = styled.button`
  width: 24px;
  height: 24px;

  border: 0;
  border-radius: 4px;
  background-color: ${({ $active }) =>
    $active ? "var(--color-white)" : "transparent"};
  color: ${({ $active }) =>
    $active ? "var(--color-main)" : "var(--text-main)"};

  box-shadow: ${({ $active }) =>
    $active ? "0 4px 10px rgba(18, 45, 46, 0.14)" : "none"};

  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 900 : 500)};
  cursor: pointer;

  &:hover {
    color: var(--color-main);
  }
`;

const PageArrowButton = styled.button`
  width: 30px;
  height: 30px;

  border: 0;
  background-color: transparent;

  color: var(--text-main);
  font-size: 34px;
  font-weight: 200;
  line-height: 1;
  cursor: pointer;

  &:hover {
    color: var(--color-main);
  }

  &:disabled {
    color: #cccccc;
    cursor: not-allowed;
  }
`;

/* ================================
   Empty / Loading
================================ */

const LoadingBox = styled.div`
  height: 320px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #d8d8d8;
  border-radius: 8px;

  color: var(--text-sub);
  font-size: 15px;
  font-weight: 700;
`;

const EmptyBox = styled.div`
  height: 360px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  border: 1px solid #d8d8d8;
  border-radius: 8px;
`;

const EmptyTitle = styled.div`
  margin-bottom: 8px;

  color: var(--text-main);
  font-size: 24px;
  font-weight: 900;
`;

const EmptyDesc = styled.div`
  margin-bottom: 24px;

  color: var(--text-sub);
  font-size: 15px;
  font-weight: 500;
`;

const ShoppingButton = styled.button`
  width: 180px;
  height: 42px;

  border: 0;
  border-radius: 6px;
  background-color: var(--color-main);

  color: var(--color-white);
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    background-color: var(--color-main-dark);
  }
`;
