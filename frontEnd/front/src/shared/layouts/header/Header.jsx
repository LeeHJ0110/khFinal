import "./Header.css";
import logoImg from "../../../assets/images/bgrmlogo.png";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import HeaderSearch from "./HeaderSearch";
import GuestMenu from "./GuestMenu";
import UserMenu from "./UserMenu";
import AdminMenu from "./AdminMenu";

import { fetchMyInfo } from "../../../features/member/api/memberApi";

const mainMenus = [
  { label: "HOME", path: "/home" },
  { label: "건강관리", path: "/healthCare" },
  { label: "커뮤니티", path: "/community" },
  { label: "스토어", path: "/store" },
];

function decodeJwtPayload(token) {
  try {
    if (!token) {
      return null;
    }

    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => {
          return `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`;
        })
        .join(""),
    );

    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("토큰 디코딩 실패", error);
    return null;
  }
}

function getLoginMemberFromToken() {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return null;
  }

  const payload = decodeJwtPayload(token);

  if (!payload) {
    return null;
  }

  return {
    username: payload.username,
    nickname: payload.nickname,
    role: payload.role,
    profileImageUrl: "",
  };
}

function isAdminMember(loginMember) {
  return ["ADMIN", "DOCTOR", "STORE", "BOARD", "A", "D", "S", "B"].includes(
    loginMember?.role,
  );
}

export default function Header({ activeMenu = "" }) {
  const location = useLocation();

  const [loginMember, setLoginMember] = useState(() =>
    getLoginMemberFromToken(),
  );

  const currentPath = location.pathname + location.search + location.hash;

  useEffect(() => {
    async function loadLoginMember() {
      const tokenMember = getLoginMemberFromToken();

      if (!tokenMember) {
        setLoginMember(null);
        return;
      }

      try {
        const response = await fetchMyInfo();
        const myInfo = response.data ?? {};

        setLoginMember({
          ...tokenMember,
          nickname: myInfo.nickname ?? tokenMember.nickname,
          role: myInfo.role ?? tokenMember.role,
          profileImageUrl:
            myInfo.profileImageUrl ??
            myInfo.memberProfileImageUrl ??
            myInfo.profileImgUrl ??
            myInfo.imageUrl ??
            "",
        });
      } catch (error) {
        console.error(error);

        setLoginMember(null);
      }
    }

    loadLoginMember();
  }, [location.pathname]);

  useEffect(() => {
    async function loadLoginMember() {
      const tokenMember = getLoginMemberFromToken();

      if (!tokenMember) {
        setLoginMember(null);
        return;
      }

      try {
        const response = await fetchMyInfo();
        const myInfo = response.data ?? {};

        setLoginMember({
          ...tokenMember,
          nickname: myInfo.nickname ?? tokenMember.nickname,
          role: myInfo.role ?? tokenMember.role,
          profileImageUrl:
            myInfo.profileImageUrl ??
            myInfo.memberProfileImageUrl ??
            myInfo.profileImgUrl ??
            myInfo.imageUrl ??
            "",
        });
      } catch (error) {
        console.error("헤더 내 정보 조회 실패:", error);
        setLoginMember(tokenMember);
      }
    }

    function handleAuthChange() {
      loadLoginMember();
    }

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

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

    if (isAdminMember(loginMember)) {
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
