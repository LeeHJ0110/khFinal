import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../features/member/store/memberSlice";

export default function UserMenu({ loginMember }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const nickname = loginMember?.nickname || "회원";
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

  function handleGoMyPage() {
    setIsOpen(false);
    navigate("/mypage");
  }

  function handleGoMessageBox() {
    setIsOpen(false);
    navigate("/mypage/message");
  }

  return (
    <div className="user-menu" ref={menuRef}>
      <button type="button" className="header-alarm" aria-label="알림">
        <span className="header-alarm-icon">🔔</span>
        <span className="alarm-badge">5</span>
      </button>

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

        <span className={isOpen ? "user-arrow is-open" : "user-arrow"}>▼</span>
      </button>

      {isOpen && (
        <div className="header-dropdown">
          <button type="button" onClick={handleGoMyPage}>
            마이페이지
          </button>

          <button type="button" onClick={handleGoMessageBox}>
            쪽지함
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
