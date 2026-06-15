import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../features/member/store/memberSlice";

function getAdminHomePath(role) {
  const pathMap = {
    ADMIN: "/admin/member",
    DOCTOR: "/healthCare/doctor",
    STORE: "/store/product/admin",
    BOARD: "/community/admin",

    A: "/admin",
    D: "/healthCare/doctor",
    S: "/store/product/admin",
    B: "/community/admin",
  };

  return pathMap[role] ?? "/home";
}

function getRoleLabel(role) {
  const roleMap = {
    ADMIN: "관리자페이지",
    DOCTOR: "건강진단목록",
    STORE: "스토어관리",
    BOARD: "커뮤니티관리",

    A: "관리자페이지",
    D: "수의사페이지",
    S: "스토어관리",
    B: "커뮤니티관리",
  };

  return roleMap[role] ?? "관리자페이지";
}

export default function AdminMenu({ loginMember }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const nickname = loginMember?.nickname || "관리자";
  const role = loginMember?.role;
  const profileImageUrl = loginMember?.profileImageUrl;

  useEffect(() => {
    function handleClickOutside(event) {
      if (!menuRef.current) {
        return;
      }

      if (!menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("accessToken");

    dispatch(logout());

    window.dispatchEvent(new Event("auth-change"));

    navigate("/member/login", { replace: true });
  }

  function handleGoAdminHome() {
    setIsOpen(false);
    navigate(getAdminHomePath(role));
  }

  return (
    <div className="admin-menu" ref={menuRef}>
      <button
        type="button"
        className="header-user"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="header-profile-img">
          {profileImageUrl ? (
            <img src={profileImageUrl} alt={`${nickname} 프로필`} />
          ) : (
            <span className="header-profile-placeholder">🐾</span>
          )}
        </span>

        <span className="header-user-name">{nickname}님</span>

        <span className={isOpen ? "user-arrow is-open" : "user-arrow"}>⌄</span>
      </button>

      {isOpen && (
        <div className="header-dropdown admin-dropdown">
          <button type="button" onClick={handleGoAdminHome}>
            {getRoleLabel(role)}
          </button>

          <button type="button" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      )}

      <button
        type="button"
        className="header-logout-btn"
        onClick={handleLogout}
      >
        로그아웃
      </button>
    </div>
  );
}
