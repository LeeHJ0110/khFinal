export default function UserMenu({ loginMember }) {
  const nickname = loginMember?.nickname || "회원";

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("loginMember");

    window.location.href = "/";
  }

  return (
    <div className="user-menu">
      <button type="button" className="header-alarm" aria-label="알림">
        🔔
      </button>

      <button type="button" className="header-user">
        <span className="header-profile-img" />
        <span className="header-user-name">{nickname}님</span>
        <span className="user-arrow">⌄</span>
      </button>

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
