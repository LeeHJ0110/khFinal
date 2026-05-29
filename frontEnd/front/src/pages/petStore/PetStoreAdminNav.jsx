import { useLocation } from "react-router-dom";
import Nav from "../../shared/layouts/nav/Nav";

/*
 * PetStoreNav
 * 관리자용 스토어 네비게이션입니다.
 *
 * 왼쪽 메뉴는 사용자용 스토어 네비와 동일한 흐름을 사용합니다.
 *
 * /store
 * - 공통 스토어 홈
 * - 강아지 / 고양이만 노출
 *
 * /store/dog...
 * - 강아지 스토어 계열
 * - 강아지 / 고양이 / 사료 / 간식 / 영양제 / 배변패드 노출
 *
 * /store/cat...
 * - 고양이 스토어 계열
 * - 강아지 / 고양이 / 사료 / 간식 / 영양제 / 배변패드 노출
 *
 * 관리자용 차이점:
 * - 오른쪽 메뉴에 장바구니 / 관심상품 대신 상품관리만 노출
 */

const homeMenus = [
  { label: "강아지", path: "/store/dog" },
  { label: "고양이", path: "/store/cat" },
];

const categoryMenus = [
  { label: "사료", pathName: "food" },
  { label: "간식", pathName: "snack" },
  { label: "영양제", pathName: "supplement" },
  { label: "배변용품", pathName: "toilet" },
];

const adminRightMenus = [{ label: "상품관리", path: "/store/product/admin" }];

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

export default function PetStoreNav() {
  const { pathname } = useLocation();

  const isDogStore =
    pathname === "/store/dog" || pathname.startsWith("/store/dog/");

  const isCatStore =
    pathname === "/store/cat" || pathname.startsWith("/store/cat/");

  let leftMenus = homeMenus;

  if (isDogStore) {
    leftMenus = makeStoreMenus("/store/dog");
  }

  if (isCatStore) {
    leftMenus = makeStoreMenus("/store/cat");
  }

  return <Nav leftMenus={leftMenus} rightMenus={adminRightMenus} />;
}
