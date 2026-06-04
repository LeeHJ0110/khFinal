import "./Header.css";
import logoImg from "../../../assets/images/bgrmlogo.png";
import { Link, useLocation } from "react-router-dom";

import HeaderSearch from "./HeaderSearch";
import GuestMenu from "./GuestMenu";
import UserMenu from "./UserMenu";
import AdminMenu from "./AdminMenu";

const mainMenus = [
  { label: "HOME", path: "/home" },
  { label: "건강관리", path: "/health" },
  { label: "커뮤니티", path: "/community" },
  { label: "스토어", path: "/store" },
];

export default function Header({ activeMenu = "" }) {
  const location = useLocation();

  const loginMember = JSON.parse(localStorage.getItem("loginMember"));

  const currentPath = location.pathname + location.search + location.hash;

  function isMenuActive(menu) {
    if (activeMenu) {
      return activeMenu === menu.label;
    }

    return (
      location.pathname === menu.path ||
      location.pathname.startsWith(`${menu.path}/`)
    );
  }

  function renderHeaderActions() {
    if (!loginMember) {
      return <GuestMenu currentPath={currentPath} />;
    }

    if (loginMember.role === "ADMIN") {
      return <AdminMenu loginMember={loginMember} />;
    }

    return <UserMenu loginMember={loginMember} />;
  }

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/home" className="header-logo">
          <img src={logoImg} alt="PET & FOR 로고" />
        </Link>

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
