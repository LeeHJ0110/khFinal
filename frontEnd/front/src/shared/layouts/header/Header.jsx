import "./Header.css";
import logoImg from "../../../assets/images/bgrmlogo.png";
import { Link, useLocation } from "react-router-dom";

import HeaderSearch from "./HeaderSearch";
import GuestMenu from "./GuestMenu";
import UserMenu from "./UserMenu";
import AdminMenu from "./AdminMenu";

const mainMenus = [
  { label: "HOME", path: "/" },
  { label: "건강관리", path: "/health" },
  { label: "커뮤니티", path: "/community" },
  { label: "스토어", path: "/store" },
];

export default function Header({ activeMenu = "" }) {
  const location = useLocation();

  /*
    지금은 임시로 localStorage에서 로그인 정보를 가져오는 방식입니다.
    나중에 팀에서 Context, Zustand, Redux 등을 쓰면 이 부분만 교체하면 됩니다.
  */
  const loginMember = JSON.parse(localStorage.getItem("loginMember"));

  function isMenuActive(menu) {
    if (activeMenu) {
      return activeMenu === menu.label;
    }

    if (menu.path === "/") {
      return location.pathname === "/";
    }

    return (
      location.pathname === menu.path ||
      location.pathname.startsWith(`${menu.path}/`)
    );
  }

  function renderHeaderActions() {
    if (!loginMember) {
      return <GuestMenu />;
    }

    if (loginMember.role === "ADMIN") {
      return <AdminMenu loginMember={loginMember} />;
    }

    return <UserMenu loginMember={loginMember} />;
  }

  return (
    <header className="header">
      <div className="header-inner">
        {/* 로고 영역 */}
        <Link to="/" className="header-logo">
          <img src={logoImg} alt="PET & FOR 로고" />
        </Link>

        {/* 메인 메뉴 영역 */}
        <nav className="header-menu">
          {mainMenus.map((menu) => (
            <Link
              key={menu.label}
              to={menu.path}
              className={isMenuActive(menu) ? "active" : ""}
            >
              {menu.label}
            </Link>
          ))}
        </nav>

        {/* 우측 영역: 검색은 공통, 그 옆은 로그인 상태별로 분리 */}
        <div
          className={
            loginMember ? "header-right is-login" : "header-right is-guest"
          }
        >
          <HeaderSearch />

          <div className="header-action-area">{renderHeaderActions()}</div>
        </div>
      </div>
    </header>
  );
}
