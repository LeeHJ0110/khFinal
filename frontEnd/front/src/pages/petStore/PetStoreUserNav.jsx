import Nav from "../../shared/layouts/nav/Nav";

/*
 * PetStoreNav(유저용)
 * 펫스토어 전용 메뉴 데이터를 공용 Nav에 전달하는 컴포넌트입니다.
 */
const leftMenus = [
  { label: "스토어홈", path: "/store" },
  { label: "강아지", path: "/store/dog" },
  { label: "고양이", path: "/store/cat" },
  { label: "사료", path: "/store/feed" },
  { label: "간식", path: "/store/snack" },
  { label: "영양제", path: "/store/supplement" },
  { label: "배변패드", path: "/store/pad" },
];

const rightMenus = [
  { label: "장바구니", path: "/store/product/xoxo" },
  { label: "관심상품", path: "/store/product/xxxx" },
];

export default function PetStoreUserNav() {
  return (
    <Nav
      leftMenus={leftMenus}
      rightMenus={rightMenus}
      activeMenu={"스토어홈"}
    />
  );
}
