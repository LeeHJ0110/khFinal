import "./Nav.css";
import NavItem from "./NavItem";
import { useLocation } from "react-router-dom";

/**
 * 공용 네비게이션
 *
 * 이 Nav는 각 페이지에서 도메인에 맞는 네브 아이템 적어서 직접 import해서 붙여야 합니다.
 *
 * 사용 방식:
 * 0. 모르겠으면 PetStoreNav참고!!
 * 1. 메뉴 배열을 만든다.
 * 2. <Nav leftMenus={...} rightMenus={...} /> 형태로 넣는다.
 *
 * activeMenu를 넘기면 label 기준으로 활성화됩니다.
 * activeMenu를 넘기지 않으면 현재 URL(menu.path)을 기준으로 자동 활성화됩니다.
 *
 * 메뉴 예시:
 * { label: "강아지", path: "/store/dog" }
 * { label: "장바구니", path: "/store/cart", count: 3 }
 *
 * 사용 예시:
 * <Nav leftMenus={leftMenus} rightMenus={rightMenus} />
 *
 * 직접 활성 메뉴를 지정하고 싶을 때:
 * <Nav leftMenus={leftMenus} rightMenus={rightMenus} activeMenu="강아지" />
 */
export default function Nav({
  leftMenus = [],
  rightMenus = [],
  activeMenu = "",
}) {
  const location = useLocation();

  const isMenuActive = (menu) => {
    // activeMenu가 있으면 label 기준으로 직접 활성화
    if (activeMenu) {
      return activeMenu === menu.label;
    }

    // path가 "/"인 경우 startsWith 처리를 하면 전부 active 될 수 있어서 따로 처리
    if (menu.path === "/") {
      return location.pathname === "/";
    }

    // 현재 URL이 menu.path와 같거나, 하위 경로이면 active 처리
    // 예: /store/dog, /store/dog/1 모두 강아지 메뉴 active
    return (
      location.pathname === menu.path ||
      location.pathname.startsWith(`${menu.path}/`)
    );
  };

  return (
    <nav className="common-nav">
      <div className="common-nav-inner">
        <ul className="common-nav-left">
          {leftMenus.map((menu) => (
            <NavItem
              key={menu.label}
              menu={menu}
              isActive={isMenuActive(menu)}
            />
          ))}
        </ul>

        {rightMenus.length > 0 && (
          <ul className="common-nav-right">
            {rightMenus.map((menu) => (
              <NavItem
                key={menu.label}
                menu={menu}
                isActive={isMenuActive(menu)}
              />
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}
