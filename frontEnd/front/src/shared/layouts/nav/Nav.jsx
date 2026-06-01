import "./Nav.css";
import NavItem from "./NavItem";
import { useLocation } from "react-router-dom";

/**
 * 공용 네비게이션
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

    // 도메인 루트 메뉴는 정확히 일치할 때만 active 처리
    if (menu.path === "/store") {
      return location.pathname === "/store";
    }

    if (menu.end) {
      return location.pathname === menu.path;
    }

    // 현재 URL이 menu.path와 같거나, 하위 경로이면 active 처리
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
