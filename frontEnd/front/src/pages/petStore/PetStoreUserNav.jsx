import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Nav from "../../shared/layouts/nav/Nav";
import { fetchCartList } from "../../features/petStore/api/petStoreOrderApi";

const homeMenus = [
  { label: "강아지", path: "/store/dog" },
  { label: "고양이", path: "/store/cat" },
];

const categoryMenus = [
  { label: "사료", pathName: "food", category: "FOOD" },
  { label: "간식", pathName: "snack", category: "SNACK" },
  { label: "영양제", pathName: "supplement", category: "SUPPLEMENT" },
  { label: "배변용품", pathName: "toilet", category: "TOILET" },
];

function makeStoreMenus(basePath) {
  return [
    { label: "강아지", path: "/store/dog" },
    { label: "고양이", path: "/store/cat" },
    ...categoryMenus.map((menu) => ({
      label: menu.label,
      path: `${basePath}/${menu.pathName}`,
    })),
  ];
}

function getActiveCategoryLabel(activeCategory) {
  const found = categoryMenus.find((menu) => menu.category === activeCategory);

  return found ? found.label : "";
}

export default function PetStoreUserNav({ targetPetType, activeCategory }) {
  const { pathname } = useLocation();

  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    async function loadCartCount() {
      try {
        const response = await fetchCartList();
        setCartItemCount(response.data.cartItemCount ?? 0);
      } catch (error) {
        setCartItemCount(0);
      }
    }

    loadCartCount();
  }, [pathname]);

  const isDogStore =
    pathname === "/store/dog" ||
    pathname.startsWith("/store/dog/") ||
    targetPetType === "D";

  const isCatStore =
    pathname === "/store/cat" ||
    pathname.startsWith("/store/cat/") ||
    targetPetType === "C";

  const isCartPage =
    pathname === "/store/cart" || pathname === "/store/cart/list";

  let leftMenus = homeMenus;
  let activeMenu = "";

  if (isDogStore) {
    leftMenus = makeStoreMenus("/store/dog");
  }

  if (isCatStore) {
    leftMenus = makeStoreMenus("/store/cat");
  }

  if (activeCategory) {
    activeMenu = getActiveCategoryLabel(activeCategory);
  }

  if (isCartPage) {
    activeMenu = "장바구니";
  }

  const rightMenus = [
    { label: "리뷰내역", path: "/store/review/list" },
    { label: "장바구니", path: "/store/cart/list", count: cartItemCount },
    { label: "관심상품", path: "/store/wish/list" },
  ];

  return (
    <Nav
      leftMenus={leftMenus}
      rightMenus={rightMenus}
      activeMenu={activeMenu}
    />
  );
}
