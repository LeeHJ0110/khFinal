import "./Header.css";
import logoImg from "../../../assets/images/bgrmlogo.png";

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

export default function Header({ activeMenu = "스토어" }) {
  /*
    지금은 임의로(변수도) localStorage에서 가져오는 방식입니다.
    나중에 팀에서 Context, Zustand, Redux 등을 쓰면 그 방식으로 바꿔야 해요.
  */
  const loginMember = JSON.parse(localStorage.getItem("loginMember"));

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
        <a href="/" className="header-logo">
          <img src={logoImg} alt="PET & FOR 로고" />
        </a>

        {/* 메인 메뉴 영역 */}
        <nav className="header-menu">
          {mainMenus.map((menu) => (
            <a
              key={menu.label}
              href={menu.path}
              className={activeMenu === menu.label ? "active" : ""}
            >
              {menu.label}
            </a>
          ))}
        </nav>

        {/* 우측 영역: 검색바는 공통, 그 옆만 상태별 분리 */}
        <div className="header-right">
          <HeaderSearch />

          <div className="header-action-area">{renderHeaderActions()}</div>
        </div>
      </div>
    </header>
  );
}
