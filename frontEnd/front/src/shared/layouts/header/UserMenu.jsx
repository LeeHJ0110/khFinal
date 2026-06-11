import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../features/member/store/memberSlice";
import useMessage from "../../../features/mypage/message/hooks/useMessage";

// 포인트 관련
import usePointEffect from "../../../features/point/hooks/usePointEffect";

export default function UserMenu({ loginMember }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { runDailyAttendancePoint } = usePointEffect();
  const { messageList, loading } = useMessage();

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

  async function handleDailyAttendance() {
    try {
      setIsOpen(false);
      await runDailyAttendancePoint();
    } catch (error) {
      console.error("출석체크 실패:", error);
    }
  }

  function messageCounter(msgList) {
    return msgList.filter((msg) => msg.readYn === "N").length;
  }

  const msgCount = messageCounter(messageList);

  return (
    <div className="user-menu" ref={menuRef}>
      {!loading && msgCount > 0 && (
        <button
          type="button"
          className="header-alarm"
          aria-label="알림"
          onClick={() => {
            navigate("/mypage/message");
          }}
        >
          <span className="header-alarm-icon">🔔</span>
          <span className="alarm-badge">{msgCount}</span>
        </button>
      )}

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

          <button type="button" onClick={handleDailyAttendance}>
            출석체크
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
