import { useLocation } from "react-router-dom";
import Nav from "../../shared/layouts/nav/Nav";

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

export default function PetStoreGuestNav({ targetPetType, activeCategory }) {
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

  return <Nav leftMenus={leftMenus} rightMenus={[]} activeMenu={activeMenu} />;
}
