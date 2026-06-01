import { useLocation } from "react-router-dom";
import Nav from "../../shared/layouts/nav/Nav";

/*
 * PetStoreUserNav
 * 사용자용 스토어 네비게이션입니다.
 *
 * /store
 * - 공통 스토어 홈
 * - 강아지 / 고양이만 노출
 *
 * /store/dog...
 * - 강아지 스토어 계열
 * - 강아지 / 고양이 / 사료 / 간식 / 영양제 / 배변용품 노출
 *
 * /store/cat...
 * - 고양이 스토어 계열
 * - 강아지 / 고양이 / 사료 / 간식 / 영양제 / 배변용품 노출
 *
 * /store/product/:productId
 * - 상품 상세 페이지
 * - 상품의 targetPetType, category를 받아서 강아지/고양이 계열 메뉴 노출
 */

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

const rightMenus = [
  { label: "장바구니", path: "/store/cart", count: 3 },
  { label: "관심상품", path: "/store/wish" },
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

  const isDogStore =
    pathname === "/store/dog" ||
    pathname.startsWith("/store/dog/") ||
    targetPetType === "D";

  const isCatStore =
    pathname === "/store/cat" ||
    pathname.startsWith("/store/cat/") ||
    targetPetType === "C";

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

  return (
    <Nav
      leftMenus={leftMenus}
      rightMenus={rightMenus}
      activeMenu={activeMenu}
    />
  );
}
